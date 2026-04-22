const router = require('express').Router();
const pool   = require('../config/db');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { platform, status, search } = req.query;
    let q = `SELECT l.*, i.product_name FROM listings l
      LEFT JOIN inventory i ON l.sku=i.sku WHERE l.is_deleted=false`;
    const p = []; let n = 1;
    if (platform) { q += ` AND l.platform=$${n++}`; p.push(platform); }
    if (status)   { q += ` AND l.status=$${n++}`;   p.push(status); }
    if (search)   { q += ` AND (l.title ILIKE $${n} OR l.sku ILIKE $${n})`; p.push(`%${search}%`); }
    q += ' ORDER BY l.created_at DESC';
    const { rows } = await pool.query(q, p);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/deleted', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM listings WHERE is_deleted=true');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `INSERT INTO listings(sku,platform,title,category,status,price,cost_price,quantity_available,listing_url,keywords)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [f.sku,f.platform,f.title,f.category,f.status||'Draft',f.price,f.cost_price,f.quantity_available,f.listing_url,f.keywords]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `UPDATE listings SET title=$1,category=$2,status=$3,price=$4,cost_price=$5,
        quantity_available=$6,keywords=$7 WHERE id=$8 AND is_deleted=false RETURNING *`,
      [f.title,f.category,f.status,f.price,f.cost_price,f.quantity_available,f.keywords,req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE listings SET is_deleted=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Moved to recycle bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/restore', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE listings SET is_deleted=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
