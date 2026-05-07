'use strict';
const { Pool } = require('pg');

const pool = new Pool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME     || 'muli_stracchi',
  user:     process.env.DB_USER     || 'muli',
  password: process.env.DB_PASSWORD || 'muli2024',
});

pool.on('error', (err) => console.error('DB pool error:', err));

module.exports = pool;
