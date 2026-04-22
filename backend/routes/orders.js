const router = require('express').Router();
const pool   = require('../config/db');
const { auth, role } = require('../middleware/auth');

// GET all
router.get('/', auth, async (req, res) => {
  try {
    const { status, platform, search } = req.query;
    let q = `SELECT o.*,
        ROUND((o.total_amount - o.platform_fee - o.shipping_cost
          - (COALESCE(i.cost_per_unit,0) * o.quantity))::numeric, 2) AS profit
      FROM orders o LEFT JOIN inventory i ON o.sku=i.sku
      WHERE o.is_deleted=false`;
    const p = []; let n = 1;
    if (status)   { q += ` AND o.order_status=$${n++}`;  p.push(status); }
    if (platform) { q += ` AND o.platform=$${n++}`;      p.push(platform); }
    if (search)   { q += ` AND (o.order_id ILIKE $${n} OR o.buyer_name ILIKE $${n} OR o.sku ILIKE $${n})`; p.push(`%${search}%`); }
    q += ' ORDER BY o.created_at DESC';
    const { rows } = await pool.query(q, p);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// GET deleted (recycle bin)
router.get('/deleted', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM orders WHERE is_deleted=true ORDER BY updated_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// POST create
router.post('/', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `INSERT INTO orders(order_id,platform,order_date,buyer_name,buyer_username,sku,quantity,
        price_per_unit,total_amount,platform_fee,shipping_cost,payment_status,order_status,
        tracking_number,dispatch_deadline,delivery_date)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`,
      [f.order_id,f.platform,f.order_date,f.buyer_name,f.buyer_username,f.sku,f.quantity,
       f.price_per_unit,f.total_amount,f.platform_fee,f.shipping_cost,f.payment_status,
       f.order_status,f.tracking_number,f.dispatch_deadline,f.delivery_date]
    );
    await pool.query('INSERT INTO activity_logs(user_id,action,module) VALUES($1,$2,$3)',
      [req.user.id, `Created order ${f.order_id}`, 'Orders']);
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code==='23505') return res.status(400).json({ error: 'Order ID already exists' });
    res.status(500).json({ error: e.message });
  }
});

// PUT update
router.put('/:id', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `UPDATE orders SET order_status=$1,payment_status=$2,tracking_number=$3,
        shipping_cost=$4,platform_fee=$5,delivery_date=$6,updated_at=NOW()
       WHERE id=$7 AND is_deleted=false RETURNING *`,
      [f.order_status,f.payment_status,f.tracking_number,f.shipping_cost,f.platform_fee,f.delivery_date,req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE soft
router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE orders SET is_deleted=true,updated_at=NOW() WHERE id=$1', [req.params.id]);
    res.json({ message: 'Moved to recycle bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// PUT restore
router.put('/:id/restore', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE orders SET is_deleted=false,updated_at=NOW() WHERE id=$1', [req.params.id]);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// DELETE permanent
router.delete('/:id/permanent', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('DELETE FROM orders WHERE id=$1', [req.params.id]);
    res.json({ message: 'Permanently deleted' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
