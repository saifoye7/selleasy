require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

// ── Middleware ──────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/inventory', require('./routes/inventory'));
app.use('/api/listings',  require('./routes/listings'));
app.use('/api/returns',   require('./routes/returns'));
app.use('/api/users',     require('./routes/users'));
app.use('/api/analytics', require('./routes/analytics'));
app.use('/api/export',    require('./routes/export'));
app.use('/api/logs',      require('./routes/logs'));

// ── Health check ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ 
    status: '✅ SellEasy API Running',
    platform: 'Railway + Supabase',
    time: new Date().toISOString()
  });
});

// ── Railway uses dynamic PORT env variable ──────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 SellEasy running on port ${PORT}`);
});
