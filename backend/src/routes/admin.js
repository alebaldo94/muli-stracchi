'use strict';
const router    = require('express').Router();
const db        = require('../db');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

// GET /api/admin/stats
router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const [members, events, rides, kmMonth, expiring, expired, uninsured] = await Promise.all([
      db.query("SELECT COUNT(*) FROM members WHERE role='member'"),
      db.query('SELECT COUNT(*) FROM events WHERE date >= $1', [today]),
      db.query('SELECT COUNT(*) FROM rides'),
      db.query("SELECT COALESCE(SUM(km),0) AS total FROM rides WHERE date >= date_trunc('month', CURRENT_DATE)"),
      db.query("SELECT COUNT(*) FROM members WHERE role='member' AND membership_expiry BETWEEN CURRENT_DATE AND CURRENT_DATE + interval '30 days'"),
      db.query("SELECT COUNT(*) FROM members WHERE role='member' AND membership_expiry < CURRENT_DATE"),
      db.query("SELECT COUNT(*) FROM members WHERE role='member' AND (insurance = false OR insurance_expiry < CURRENT_DATE)"),
    ]);
    res.json({
      members:   parseInt(members.rows[0].count),
      events:    parseInt(events.rows[0].count),
      rides:     parseInt(rides.rows[0].count),
      km_month:  parseFloat(kmMonth.rows[0].total),
      expiring:  parseInt(expiring.rows[0].count),
      expired:   parseInt(expired.rows[0].count),
      uninsured: parseInt(uninsured.rows[0].count),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// GET /api/admin/leaderboard
router.get('/leaderboard', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        m.id, m.name, m.city, m.level,
        COALESCE(SUM(r.km) FILTER (WHERE r.date >= date_trunc('month', CURRENT_DATE)),0)::int AS km_month,
        COALESCE(SUM(r.km) FILTER (WHERE r.date >= date_trunc('year',  CURRENT_DATE)),0)::int AS km_year,
        COUNT(r.id)::int AS rides_count
      FROM members m
      LEFT JOIN rides r ON r.user_id = m.id
      WHERE m.role = 'member'
      GROUP BY m.id
      ORDER BY km_month DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
