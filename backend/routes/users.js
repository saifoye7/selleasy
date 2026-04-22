const router = require('express').Router();
const pool   = require('../config/db');
const bcrypt = require('bcryptjs');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, role('admin'), async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT id,name,email,role,is_active,created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, role('admin'), async (req, res) => {
  try {
    const { name, email, password, role: r } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO users(name,email,password,role) VALUES($1,$2,$3,$4) RETURNING id,name,email,role',
      [name, email, hash, r||'viewer']
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code==='23505') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: e.message });
  }
});

router.put('/:id', auth, role('admin'), async (req, res) => {
  try {
    const { name, role: r, is_active } = req.body;
    const { rows } = await pool.query(
      'UPDATE users SET name=$1,role=$2,is_active=$3 WHERE id=$4 RETURNING id,name,email,role,is_active',
      [name, r, is_active, req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
