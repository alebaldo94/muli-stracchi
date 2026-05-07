'use strict';
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../db');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'email e password obbligatori' });

  try {
    const { rows } = await db.query('SELECT * FROM members WHERE email = $1', [email]);
    const member = rows[0];
    if (!member || !(await bcrypt.compare(password, member.password_hash)))
      return res.status(401).json({ error: 'Credenziali non valide' });

    const token = jwt.sign(
      { id: member.id, email: member.email, role: member.role, name: member.name },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: member.id, name: member.name, email: member.email, role: member.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore del server' });
  }
});

module.exports = router;
