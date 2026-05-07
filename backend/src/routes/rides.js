'use strict';
const router = require('express').Router();
const db     = require('../db');
const auth   = require('../middleware/auth');

// GET /api/rides
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = req.user.role === 'admin'
      ? await db.query(`
          SELECT r.*, m.name AS member_name
          FROM rides r JOIN members m ON m.id = r.user_id
          ORDER BY r.date DESC
        `)
      : await db.query(
          'SELECT * FROM rides WHERE user_id = $1 ORDER BY date DESC',
          [req.user.id]
        );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/rides
router.post('/', auth, async (req, res) => {
  const { title, date, km, duration, elevation, note, source } = req.body;
  if (!title || !date || !km)
    return res.status(400).json({ error: 'title, date e km obbligatori' });

  try {
    const { rows } = await db.query(`
      INSERT INTO rides (user_id, title, date, km, duration, elevation, note, source)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *
    `, [req.user.id, title, date, km,
        duration || null, elevation || 0, note || null, source || 'manual']);

    const firstOfMonth = new Date();
    firstOfMonth.setDate(1);
    const fom = firstOfMonth.toISOString().split('T')[0];

    await db.query(`
      UPDATE members SET
        km_month    = (SELECT COALESCE(SUM(km),0) FROM rides WHERE user_id=$1 AND date >= $2::date),
        km_year     = (SELECT COALESCE(SUM(km),0) FROM rides WHERE user_id=$1 AND date >= date_trunc('year', CURRENT_DATE)),
        rides_count = (SELECT COUNT(*) FROM rides WHERE user_id=$1),
        updated_at  = NOW()
      WHERE id = $1
    `, [req.user.id, fom]);

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
