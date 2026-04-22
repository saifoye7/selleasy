const router  = require('express').Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const pool    = require('../config/db');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query(
      'SELECT * FROM users WHERE email=$1 AND is_active=true', [email]
    );
    if (!rows.length) return res.status(400).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, rows[0].password);
    if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role },
      process.env.JWT_SECRET, { expiresIn: '7d' }
    );
    res.json({ token, user: { id: rows[0].id, name: rows[0].name, email: rows[0].email, role: rows[0].role } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST /api/auth/register  (admin only in production)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, hash, role || 'viewer']
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
