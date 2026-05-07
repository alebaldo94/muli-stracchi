'use strict';
const router    = require('express').Router();
const db        = require('../db');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const TYPE_LABELS = {
  tessera_expiring:   'Scadenza tessera imminente',
  tessera_expired:    'Tessera scaduta — rinnovo urgente',
  insurance_missing:  'Nessuna assicurazione registrata',
  insurance_expiring: 'Scadenza assicurazione imminente',
  insurance_expired:  'Assicurazione scaduta',
};

// GET /api/notifications
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM notifications ORDER BY sent_at DESC LIMIT 200'
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// GET /api/notifications/pending — soci con pendenze (non invia, calcola)
router.get('/pending', auth, adminOnly, async (req, res) => {
  try {
    const { rows: members } = await db.query(`
      SELECT id, name, email, membership_expiry, insurance, insurance_expiry
      FROM members WHERE role = 'member'
    `);
    const today = new Date();
    const pending = [];

    for (const m of members) {
      if (m.membership_expiry) {
        const diff = Math.floor((new Date(m.membership_expiry) - today) / 86400000);
        if (diff < 0)
          pending.push({ member_id: m.id, name: m.name, email: m.email, type: 'tessera_expired',  label: TYPE_LABELS.tessera_expired,  urgent: true,       days: diff });
        else if (diff <= 30)
          pending.push({ member_id: m.id, name: m.name, email: m.email, type: 'tessera_expiring', label: TYPE_LABELS.tessera_expiring, urgent: diff <= 15, days: diff });
      }
      if (!m.insurance) {
        pending.push({ member_id: m.id, name: m.name, email: m.email, type: 'insurance_missing', label: TYPE_LABELS.insurance_missing, urgent: true, days: null });
      } else if (m.insurance_expiry) {
        const diff = Math.floor((new Date(m.insurance_expiry) - today) / 86400000);
        if (diff < 0)
          pending.push({ member_id: m.id, name: m.name, email: m.email, type: 'insurance_expired',  label: TYPE_LABELS.insurance_expired,  urgent: true,       days: diff });
        else if (diff <= 30)
          pending.push({ member_id: m.id, name: m.name, email: m.email, type: 'insurance_expiring', label: TYPE_LABELS.insurance_expiring, urgent: diff <= 15, days: diff });
      }
    }

    pending.sort((a, b) => (b.urgent ? 1 : 0) - (a.urgent ? 1 : 0));
    res.json(pending);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/notifications/send — singolo promemoria
router.post('/send', auth, adminOnly, async (req, res) => {
  const { member_id, type } = req.body;
  if (!member_id || !type)
    return res.status(400).json({ error: 'member_id e type obbligatori' });

  try {
    const { rows: [member] } = await db.query(
      'SELECT id, name, email FROM members WHERE id = $1', [member_id]
    );
    if (!member) return res.status(404).json({ error: 'Socio non trovato' });

    // TODO: integrazione SMTP reale (nodemailer / SendGrid)

    const { rows } = await db.query(`
      INSERT INTO notifications (member_id, member_name, email, type, type_label)
      VALUES ($1,$2,$3,$4,$5) RETURNING *
    `, [member.id, member.name, member.email, type, TYPE_LABELS[type] || type]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/notifications/send-all — invia a tutti i soci con pendenze
router.post('/send-all', auth, adminOnly, async (req, res) => {
  try {
    const { rows: members } = await db.query(`
      SELECT id, name, email, membership_expiry, insurance, insurance_expiry
      FROM members WHERE role = 'member'
    `);
    const today = new Date();
    const sent = [];

    for (const m of members) {
      const types = [];
      if (m.membership_expiry) {
        const diff = Math.floor((new Date(m.membership_expiry) - today) / 86400000);
        if (diff < 0)       types.push('tessera_expired');
        else if (diff <= 30) types.push('tessera_expiring');
      }
      if (!m.insurance) {
        types.push('insurance_missing');
      } else if (m.insurance_expiry) {
        const diff = Math.floor((new Date(m.insurance_expiry) - today) / 86400000);
        if (diff < 0)       types.push('insurance_expired');
        else if (diff <= 30) types.push('insurance_expiring');
      }

      for (const type of types) {
        await db.query(
          'INSERT INTO notifications (member_id, member_name, email, type, type_label) VALUES ($1,$2,$3,$4,$5)',
          [m.id, m.name, m.email, type, TYPE_LABELS[type]]
        );
        sent.push({ member: m.name, type });
      }
    }

    res.json({ sent: sent.length, detail: sent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// GET /api/notifications/settings
router.get('/settings', auth, adminOnly, async (req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM email_settings WHERE id = 1');
    res.json(rows[0] || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// PUT /api/notifications/settings
router.put('/settings', auth, adminOnly, async (req, res) => {
  const { sender_name, sender_email, remind_days, auto_send } = req.body;
  try {
    const { rows } = await db.query(`
      UPDATE email_settings SET
        sender_name  = COALESCE($1, sender_name),
        sender_email = COALESCE($2, sender_email),
        remind_days  = COALESCE($3, remind_days),
        auto_send    = COALESCE($4, auto_send),
        updated_at   = NOW()
      WHERE id = 1 RETURNING *
    `, [sender_name || null, sender_email || null, remind_days || null, auto_send ?? null]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// DELETE /api/notifications
router.delete('/', auth, adminOnly, async (req, res) => {
  try {
    await db.query('DELETE FROM notifications');
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
