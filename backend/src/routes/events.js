'use strict';
const router    = require('express').Router();
const db        = require('../db');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const WITH_PARTICIPANTS = `
  SELECT e.*,
    COALESCE(json_agg(ep.member_id) FILTER (WHERE ep.member_id IS NOT NULL), '[]') AS participants
  FROM events e
  LEFT JOIN event_participants ep ON ep.event_id = e.id
  GROUP BY e.id
`;

// GET /api/events
router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await db.query(`${WITH_PARTICIPANTS} ORDER BY e.date`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// GET /api/events/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const { rows } = await db.query(
      `${WITH_PARTICIPANTS} HAVING e.id = $1`, [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Evento non trovato' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/events
router.post('/', auth, adminOnly, async (req, res) => {
  const { title, date, location, distance, elevation, category, level, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title e date obbligatori' });
  try {
    const { rows } = await db.query(`
      INSERT INTO events (title, date, location, distance, elevation, category, level, description, created_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *
    `, [title, date, location || null, distance || null, elevation || null,
        category || 'strada', level || 'intermediate', description || null, req.user.id]);
    res.status(201).json({ ...rows[0], participants: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// PUT /api/events/:id
router.put('/:id', auth, adminOnly, async (req, res) => {
  const { title, date, location, distance, elevation, category, level, description } = req.body;
  if (!title || !date) return res.status(400).json({ error: 'title e date obbligatori' });
  try {
    const { rows } = await db.query(`
      UPDATE events
      SET title=$1, date=$2, location=$3, distance=$4, elevation=$5, category=$6, level=$7, description=$8
      WHERE id=$9 RETURNING *
    `, [title, date, location || null, distance || null, elevation || null,
        category || 'strada', level || 'intermediate', description || null, req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Evento non trovato' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// DELETE /api/events/:id
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM events WHERE id = $1', [req.params.id]);
    if (!rowCount) return res.status(404).json({ error: 'Evento non trovato' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/events/:id/join
router.post('/:id/join', auth, async (req, res) => {
  try {
    await db.query(
      'INSERT INTO event_participants (event_id, member_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
      [req.params.id, req.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/events/:id/leave
router.post('/:id/leave', auth, async (req, res) => {
  try {
    await db.query(
      'DELETE FROM event_participants WHERE event_id = $1 AND member_id = $2',
      [req.params.id, req.user.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
