'use strict';
const router     = require('express').Router();
const db         = require('../db');
const { sendEmail } = require('../lib/email');

// Bearer token per proteggere l'endpoint
function cronAuth(req, res, next) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return next(); // nessun secret = endpoint libero (dev)
  const auth = req.headers.authorization || '';
  if (auth !== `Bearer ${secret}`)
    return res.status(401).json({ error: 'Non autorizzato' });
  next();
}

async function runReminders() {
  const { rows: members } = await db.query(`
    SELECT id, name, email, membership_expiry, insurance, insurance_expiry
    FROM members WHERE role = 'member'
  `);
  const { rows: [settings] } = await db.query('SELECT remind_days FROM email_settings WHERE id=1');
  const remindDays = (settings?.remind_days || [30, 15, 7]).map(Number);

  const today = new Date();
  const results = [];

  for (const m of members) {
    // tessera
    if (m.membership_expiry) {
      const diff = Math.floor((new Date(m.membership_expiry) - today) / 86400000);
      const expiryStr = new Date(m.membership_expiry).toLocaleDateString('it-IT');
      if (diff < 0) {
        const r = await sendEmail({ memberId: m.id, to: m.email, template: 'tessera_expired',
          data: { name: m.name, expiry_date: expiryStr } });
        results.push({ member: m.name, template: 'tessera_expired', ...r });
      } else if (remindDays.includes(diff)) {
        const r = await sendEmail({ memberId: m.id, to: m.email, template: 'tessera_expiring',
          data: { name: m.name, days: diff, expiry_date: expiryStr } });
        results.push({ member: m.name, template: 'tessera_expiring', days: diff, ...r });
      }
    }

    // assicurazione
    if (!m.insurance) {
      const r = await sendEmail({ memberId: m.id, to: m.email, template: 'insurance_missing',
        data: { name: m.name } });
      results.push({ member: m.name, template: 'insurance_missing', ...r });
    } else if (m.insurance_expiry) {
      const diff = Math.floor((new Date(m.insurance_expiry) - today) / 86400000);
      const expiryStr = new Date(m.insurance_expiry).toLocaleDateString('it-IT');
      if (diff < 0) {
        const r = await sendEmail({ memberId: m.id, to: m.email, template: 'insurance_expired',
          data: { name: m.name, expiry_date: expiryStr } });
        results.push({ member: m.name, template: 'insurance_expired', ...r });
      } else if (remindDays.includes(diff)) {
        const r = await sendEmail({ memberId: m.id, to: m.email, template: 'insurance_expiring',
          data: { name: m.name, days: diff, expiry_date: expiryStr } });
        results.push({ member: m.name, template: 'insurance_expiring', days: diff, ...r });
      }
    }
  }

  return results;
}

// POST /api/cron/reminders
router.post('/reminders', cronAuth, async (req, res) => {
  try {
    const results = await runReminders();
    const sent    = results.filter(r => r.ok).length;
    const skipped = results.filter(r => !r.ok && r.reason === 'duplicate').length;
    const failed  = results.filter(r => !r.ok && r.reason !== 'duplicate').length;
    res.json({ sent, skipped, failed, detail: results });
  } catch (err) {
    console.error('[cron] errore:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = { router, runReminders };
