'use strict';
const router    = require('express').Router();
const bcrypt    = require('bcryptjs');
const db        = require('../db');
const auth      = require('../middleware/auth');
const adminOnly = require('../middleware/adminOnly');

const PUBLIC_FIELDS = `
  id, role, name, email, birth_date, tax_code, phone,
  address, cap, city, province, member_number, member_type,
  join_date, membership_expiry, insurance, insurance_type,
  insurance_expiry, insurance_number, level, km_year, km_month, rides_count, notes
`;

// GET /api/members — tutti (admin) o solo se stesso (member)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const { rows } = await db.query(
        `SELECT ${PUBLIC_FIELDS} FROM members WHERE role = 'member' ORDER BY name`
      );
      return res.json(rows);
    }
    const { rows } = await db.query(
      `SELECT ${PUBLIC_FIELDS} FROM members WHERE id = $1`, [req.user.id]
    );
    res.json(rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// GET /api/members/:id
router.get('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id != req.params.id)
    return res.status(403).json({ error: 'Accesso negato' });
  try {
    const { rows } = await db.query(
      `SELECT ${PUBLIC_FIELDS} FROM members WHERE id = $1`, [req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Socio non trovato' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/members — crea socio (admin)
router.post('/', auth, adminOnly, async (req, res) => {
  const {
    name, email, password, birth_date, tax_code, phone,
    address, cap, city, province, member_number, member_type,
    membership_expiry, insurance, insurance_type, insurance_expiry, insurance_number,
    level, notes
  } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: 'name, email e password obbligatori' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await db.query(`
      INSERT INTO members
        (name, email, password_hash, birth_date, tax_code, phone, address, cap, city, province,
         member_number, member_type, membership_expiry, insurance, insurance_type,
         insurance_expiry, insurance_number, level, notes)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
      RETURNING id, name, email, role, member_number, member_type, level
    `, [name, email, hash,
        birth_date || null, tax_code || null, phone || null,
        address || null, cap || null, city || null, province || null,
        member_number || null, member_type || 'ordinario', membership_expiry || null,
        insurance || false, insurance_type || null, insurance_expiry || null, insurance_number || null,
        level || 'beginner', notes || null]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'Email già registrata' });
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// PUT /api/members/:id
router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'admin' && req.user.id != req.params.id)
    return res.status(403).json({ error: 'Accesso negato' });

  const adminFields = [
    'name','email','birth_date','tax_code','phone','address','cap','city','province',
    'member_number','member_type','membership_expiry','insurance','insurance_type',
    'insurance_expiry','insurance_number','level','notes'
  ];
  const memberFields = ['phone','address','cap','city','province','notes'];
  const allowed = req.user.role === 'admin' ? adminFields : memberFields;

  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (req.body.password) {
    updates.password_hash = await bcrypt.hash(req.body.password, 10);
  }

  if (!Object.keys(updates).length)
    return res.status(400).json({ error: 'Nessun campo da aggiornare' });

  const keys  = Object.keys(updates);
  const vals  = Object.values(updates);
  const setCl = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');

  try {
    const { rows } = await db.query(
      `UPDATE members SET ${setCl}, updated_at = NOW() WHERE id = $${keys.length + 1}
       RETURNING id, name, email, role`,
      [...vals, req.params.id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Socio non trovato' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// DELETE /api/members/:id
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { rowCount } = await db.query(
      "DELETE FROM members WHERE id = $1 AND role != 'admin'", [req.params.id]
    );
    if (!rowCount) return res.status(404).json({ error: 'Socio non trovato' });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// POST /api/members/:id/renew
router.post('/:id/renew', auth, adminOnly, async (req, res) => {
  const { expiry } = req.body;
  if (!expiry) return res.status(400).json({ error: 'Campo expiry obbligatorio' });
  try {
    await db.query(
      'UPDATE members SET membership_expiry = $1, updated_at = NOW() WHERE id = $2',
      [expiry, req.params.id]
    );
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

// PUT /api/members/:id/insurance
router.put('/:id/insurance', auth, adminOnly, async (req, res) => {
  const { enabled, type, expiry, number } = req.body;
  try {
    await db.query(`
      UPDATE members SET
        insurance        = $1,
        insurance_type   = $2,
        insurance_expiry = $3,
        insurance_number = $4,
        updated_at       = NOW()
      WHERE id = $5
    `, [enabled, enabled ? type : null, enabled ? expiry : null, enabled ? number : null, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
