'use strict';
const db        = require('../db');
const { resend, fromEmail } = require('./resend');
const TEMPLATES = require('../emails');

const isSandbox = (
  !process.env.RESEND_API_KEY ||
  process.env.RESEND_API_KEY === 'sandbox' ||
  process.env.NODE_ENV !== 'production'
);

/**
 * Controlla se è già stata inviata una email dello stesso tipo
 * allo stesso socio negli ultimi `withinDays` giorni.
 */
async function isDuplicate(memberId, template, withinDays = 7) {
  const { rows } = await db.query(`
    SELECT id FROM email_log
    WHERE member_id = $1
      AND template  = $2
      AND status    = 'sent'
      AND sent_at   > NOW() - INTERVAL '${withinDays} days'
    LIMIT 1
  `, [memberId, template]);
  return rows.length > 0;
}

/**
 * Invia una email transazionale e ne registra l'esito in email_log.
 * Non lancia mai eccezioni — restituisce { ok, logId, resendId? }.
 *
 * @param {object} opts
 * @param {number} opts.memberId
 * @param {string} opts.to          indirizzo destinatario
 * @param {string} opts.template    chiave in TEMPLATES
 * @param {object} opts.data        variabili da passare ai template
 * @param {boolean} [opts.force]    bypass idempotency check
 */
async function sendEmail({ memberId, to, template, data, force = false }) {
  const tpl = TEMPLATES[template];
  if (!tpl) {
    console.error(`[email] template sconosciuto: ${template}`);
    return { ok: false };
  }

  if (!force && await isDuplicate(memberId, template)) {
    console.log(`[email] skip duplicato: ${template} → ${to}`);
    return { ok: false, reason: 'duplicate' };
  }

  // Inserisce il log in stato 'queued'
  const { rows: [log] } = await db.query(`
    INSERT INTO email_log (member_id, email, template, status)
    VALUES ($1, $2, $3, 'queued') RETURNING id
  `, [memberId, to, template]);
  const logId = log.id;

  const subject = tpl.subject(data);

  if (isSandbox) {
    console.log(`[email:sandbox] to=${to} template=${template} subject="${subject}"`);
    await db.query(
      `UPDATE email_log SET status='sent', resend_id='dev-sandbox', sent_at=NOW() WHERE id=$1`,
      [logId]
    );
    return { ok: true, logId, resendId: 'dev-sandbox' };
  }

  try {
    const settings = await getSettings();
    const senderName  = settings.sender_name  || 'I Muli Stracchi ASD';
    const senderEmail = settings.sender_email || fromEmail;

    const { data: resendData, error } = await resend.emails.send({
      from:    `${senderName} <${senderEmail}>`,
      to:      [to],
      subject,
      html:    tpl.html(data),
      text:    tpl.text(data),
    });

    if (error) throw new Error(error.message || JSON.stringify(error));

    await db.query(
      `UPDATE email_log SET status='sent', resend_id=$1, sent_at=NOW() WHERE id=$2`,
      [resendData.id, logId]
    );
    return { ok: true, logId, resendId: resendData.id };

  } catch (err) {
    console.error(`[email] errore invio ${template} → ${to}:`, err.message);
    await db.query(
      `UPDATE email_log SET status='failed', error_msg=$1 WHERE id=$2`,
      [err.message, logId]
    );
    return { ok: false, logId, error: err.message };
  }
}

async function getSettings() {
  const { rows } = await db.query('SELECT * FROM email_settings WHERE id = 1');
  return rows[0] || {};
}

module.exports = { sendEmail };
