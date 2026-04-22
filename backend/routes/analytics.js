const router = require('express').Router();
const pool   = require('../config/db');
const { auth } = require('../middleware/auth');

// Dashboard stats cards
router.get('/dashboard', auth, async (req, res) => {
  try {
    const [orders, revenue, profit, pending, lowStock] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM orders WHERE is_deleted=false"),
      pool.query("SELECT COALESCE(SUM(total_amount),0) AS v FROM orders WHERE payment_status='Paid' AND is_deleted=false"),
      pool.query(`SELECT COALESCE(SUM(o.total_amount-o.platform_fee-o.shipping_cost-(COALESCE(i.cost_per_unit,0)*o.quantity)),0) AS v
        FROM orders o LEFT JOIN inventory i ON o.sku=i.sku WHERE o.payment_status='Paid' AND o.is_deleted=false`),
      pool.query("SELECT COUNT(*) FROM orders WHERE order_status IN ('Pending','Processing') AND is_deleted=false"),
      pool.query("SELECT COUNT(*) FROM inventory WHERE (total_stock-reserved_stock)<=restock_level AND is_deleted=false"),
    ]);
    res.json({
      total_orders:   parseInt(orders.rows[0].count),
      total_revenue:  parseFloat(revenue.rows[0].v),
      total_profit:   parseFloat(profit.rows[0].v),
      pending_orders: parseInt(pending.rows[0].count),
      low_stock:      parseInt(lowStock.rows[0].count),
    });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Sales by month (last 12 months)
router.get('/sales-by-month', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT TO_CHAR(order_date,'YYYY-MM') AS month,
             SUM(total_amount)::numeric(10,2) AS revenue,
             COUNT(*) AS orders
      FROM orders WHERE is_deleted=false AND payment_status='Paid'
      GROUP BY month ORDER BY month DESC LIMIT 12
    `);
    res.json(rows.reverse());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Platform split
router.get('/platform-split', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT platform, COUNT(*) AS orders, SUM(total_amount)::numeric(10,2) AS revenue
      FROM orders WHERE is_deleted=false GROUP BY platform
    `);
    res.json(rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

module.exports = router;
