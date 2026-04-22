const router = require('express').Router();
const pool   = require('../config/db');
const { auth } = require('../middleware/auth');

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]).join(',');
  const lines = rows.map(r =>
    Object.values(r).map(v => `"${String(v ?? '').replace(/"/g,'""')}"`).join(',')
  );
  return [headers, ...lines].join('\n');
}

router.get('/orders', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE is_deleted=false ORDER BY created_at DESC');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="orders.csv"');
    res.send(toCSV(rows));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/inventory', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE is_deleted=false ORDER BY product_name');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="inventory.csv"');
    res.send(toCSV(rows));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/listings', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM listings WHERE is_deleted=false ORDER BY created_at DESC');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="listings.csv"');
    res.send(toCSV(rows));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
