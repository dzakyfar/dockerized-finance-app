const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());

// Middleware untuk autentikasi
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, full_name, email } = req.body;

    // Validasi input
    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password wajib diisi' });
    }

    // Cek apakah username sudah ada
    const userExists = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'Username sudah digunakan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    const result = await pool.query(
      'INSERT INTO users (username, password, full_name, email) VALUES ($1, $2, $3, $4) RETURNING id, username, full_name, email',
      [username, hashedPassword, full_name, email]
    );

    res.status(201).json({
      message: 'Registrasi berhasil',
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Error register:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    const user = result.rows[0];

    // Verifikasi password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Username atau password salah' });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ==================== CATEGORIES ROUTES ====================

// Get semua kategori
app.get('/api/categories', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error get categories:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ==================== EXPENSES ROUTES ====================

// Get pengeluaran user dengan filter bulan/tahun
app.get('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT e.*, c.name as category_name, c.icon, c.color
      FROM expenses e
      JOIN categories c ON e.category_id = c.id
      WHERE e.user_id = $1
    `;
    const params = [userId];

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM e.date) = $2 AND EXTRACT(YEAR FROM e.date) = $3`;
      params.push(month, year);
    } else if (year) {
      query += ` AND EXTRACT(YEAR FROM e.date) = $2`;
      params.push(year);
    }

    query += ' ORDER BY e.date DESC, e.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error get expenses:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Tambah pengeluaran
app.post('/api/expenses', authenticateToken, async (req, res) => {
  try {
    const { category_id, amount, description, date } = req.body;
    const userId = req.user.id;

    if (!category_id || !amount || !date) {
      return res.status(400).json({ error: 'Kategori, jumlah, dan tanggal wajib diisi' });
    }

    const result = await pool.query(
      'INSERT INTO expenses (user_id, category_id, amount, description, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, category_id, amount, description, date]
    );

    res.status(201).json({
      message: 'Pengeluaran berhasil ditambahkan',
      expense: result.rows[0],
    });
  } catch (error) {
    console.error('Error add expense:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Update pengeluaran
app.put('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, amount, description, date } = req.body;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE expenses SET category_id = $1, amount = $2, description = $3, date = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [category_id, amount, description, date, id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });
    }

    res.json({
      message: 'Pengeluaran berhasil diupdate',
      expense: result.rows[0],
    });
  } catch (error) {
    console.error('Error update expense:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Hapus pengeluaran
app.delete('/api/expenses/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Pengeluaran tidak ditemukan' });
    }

    res.json({ message: 'Pengeluaran berhasil dihapus' });
  } catch (error) {
    console.error('Error delete expense:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ==================== STATISTICS ROUTES ====================

// Get statistik pengeluaran per kategori
app.get('/api/statistics/by-category', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.color,
        COALESCE(SUM(e.amount), 0) as total
      FROM categories c
      LEFT JOIN expenses e ON c.id = e.category_id AND e.user_id = $1
    `;
    const params = [userId];

    if (month && year) {
      query += ` AND EXTRACT(MONTH FROM e.date) = $2 AND EXTRACT(YEAR FROM e.date) = $3`;
      params.push(month, year);
    } else if (year) {
      query += ` AND EXTRACT(YEAR FROM e.date) = $2`;
      params.push(year);
    }

    query += ' GROUP BY c.id, c.name, c.icon, c.color ORDER BY c.id';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error get statistics:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// Get total pengeluaran
app.get('/api/statistics/total', authenticateToken, async (req, res) => {
  try {
    const { month, year } = req.query;
    const userId = req.user.id;

    let query = 'SELECT COALESCE(SUM(amount), 0) as total FROM expenses WHERE user_id = $1';
    const params = [userId];

    if (month && year) {
      query += ' AND EXTRACT(MONTH FROM date) = $2 AND EXTRACT(YEAR FROM date) = $3';
      params.push(month, year);
    } else if (year) {
      query += ' AND EXTRACT(YEAR FROM date) = $2';
      params.push(year);
    }

    const result = await pool.query(query, params);
    res.json({ total: parseFloat(result.rows[0].total) });
  } catch (error) {
    console.error('Error get total:', error);
    res.status(500).json({ error: 'Terjadi kesalahan server' });
  }
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di port ${PORT}`);
});
