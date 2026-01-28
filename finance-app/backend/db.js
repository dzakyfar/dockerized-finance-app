const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || '',
  host: process.env.DB_HOST || '',
  database: process.env.DB_NAME || '',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT || 5432,
});

// Test koneksi
pool.on('connect', () => {
  console.log('✅ Terhubung ke database PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error koneksi database:', err);
});

module.exports = pool;
