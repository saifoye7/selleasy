const router = require('express').Router();
const pool   = require('../config/db');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM returns WHERE is_deleted=false ORDER BY created_at DESC');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/deleted', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM returns WHERE is_deleted=true');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      'INSERT INTO returns(order_id,sku,reason,status,refund_amount,received_date,notes) VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *',
      [f.order_id,f.sku,f.reason,f.status||'Pending',f.refund_amount||0,f.received_date,f.notes]
    );
    res.status(201).json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      'UPDATE returns SET status=$1,refund_amount=$2,notes=$3 WHERE id=$4 AND is_deleted=false RETURNING *',
      [f.status,f.refund_amount,f.notes,req.params.id]
    );
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:id', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE returns SET is_deleted=true WHERE id=$1', [req.params.id]);
    res.json({ message: 'Moved to recycle bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:id/restore', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE returns SET is_deleted=false WHERE id=$1', [req.params.id]);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
