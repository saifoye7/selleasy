const router = require('express').Router();
const pool   = require('../config/db');
const { auth, role } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inventory WHERE is_deleted=false ORDER BY product_name'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/low-stock', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM inventory WHERE (total_stock-reserved_stock)<=restock_level AND is_deleted=false'
    );
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.get('/deleted', auth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM inventory WHERE is_deleted=true');
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.post('/', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `INSERT INTO inventory(sku,product_name,total_stock,reserved_stock,cost_per_unit,supplier_name,restock_level,last_restocked)
       VALUES($1,$2,$3,$4,$5,$6,$7,NOW()) RETURNING *`,
      [f.sku,f.product_name,f.total_stock||0,f.reserved_stock||0,f.cost_per_unit||0,f.supplier_name,f.restock_level||10]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    if (e.code==='23505') return res.status(400).json({ error: 'SKU already exists' });
    res.status(500).json({ error: e.message });
  }
});

router.put('/:sku', auth, role('admin','manager'), async (req, res) => {
  try {
    const f = req.body;
    const { rows } = await pool.query(
      `UPDATE inventory SET product_name=$1,total_stock=$2,reserved_stock=$3,
        cost_per_unit=$4,supplier_name=$5,restock_level=$6,last_restocked=NOW()
       WHERE sku=$7 AND is_deleted=false RETURNING *`,
      [f.product_name,f.total_stock,f.reserved_stock,f.cost_per_unit,f.supplier_name,f.restock_level,req.params.sku]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.delete('/:sku', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE inventory SET is_deleted=true WHERE sku=$1', [req.params.sku]);
    res.json({ message: 'Moved to recycle bin' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

router.put('/:sku/restore', auth, role('admin'), async (req, res) => {
  try {
    await pool.query('UPDATE inventory SET is_deleted=false WHERE sku=$1', [req.params.sku]);
    res.json({ message: 'Restored' });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
