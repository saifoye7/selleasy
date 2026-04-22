const router = require('express').Router();
const pool   = require('../config/db');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, role('admin','manager'), async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT l.*, u.name AS user_name
      FROM activity_logs l
      LEFT JOIN users u ON l.user_id=u.id
      ORDER BY l.timestamp DESC LIMIT 200
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
