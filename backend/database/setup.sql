-- ============================================================
-- SellEasy — Complete Database Setup
-- Run this ONCE on your PostgreSQL database
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) UNIQUE NOT NULL,
  password   VARCHAR(255) NOT NULL,
  role       VARCHAR(20)  DEFAULT 'viewer' CHECK (role IN ('admin','manager','viewer')),
  is_active  BOOLEAN      DEFAULT true,
  created_at TIMESTAMP    DEFAULT NOW()
);

-- INVENTORY
CREATE TABLE IF NOT EXISTS inventory (
  sku             VARCHAR(50) PRIMARY KEY,
  product_name    VARCHAR(200) NOT NULL,
  total_stock     INTEGER      DEFAULT 0,
  reserved_stock  INTEGER      DEFAULT 0,
  cost_per_unit   NUMERIC(10,2) DEFAULT 0,
  supplier_name   VARCHAR(100),
  restock_level   INTEGER      DEFAULT 10,
  last_restocked  DATE,
  is_deleted      BOOLEAN      DEFAULT false,
  created_at      TIMESTAMP    DEFAULT NOW()
);

-- LISTINGS
CREATE TABLE IF NOT EXISTS listings (
  id                 SERIAL PRIMARY KEY,
  sku                VARCHAR(50) REFERENCES inventory(sku) ON DELETE SET NULL,
  platform           VARCHAR(20) CHECK (platform IN ('eBay','Etsy')),
  title              VARCHAR(300) NOT NULL,
  category           VARCHAR(100),
  status             VARCHAR(20) DEFAULT 'Draft' CHECK (status IN ('Active','Inactive','Draft')),
  price              NUMERIC(10,2),
  cost_price         NUMERIC(10,2),
  quantity_available INTEGER DEFAULT 0,
  listing_url        TEXT,
  keywords           TEXT,
  is_deleted         BOOLEAN   DEFAULT false,
  created_at         TIMESTAMP DEFAULT NOW()
);

-- ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  order_id          VARCHAR(50) UNIQUE NOT NULL,
  platform          VARCHAR(20) CHECK (platform IN ('eBay','Etsy')),
  order_date        DATE,
  buyer_name        VARCHAR(100),
  buyer_username    VARCHAR(100),
  sku               VARCHAR(50) REFERENCES inventory(sku) ON DELETE SET NULL,
  quantity          INTEGER      DEFAULT 1,
  price_per_unit    NUMERIC(10,2),
  total_amount      NUMERIC(10,2),
  platform_fee      NUMERIC(10,2) DEFAULT 0,
  shipping_cost     NUMERIC(10,2) DEFAULT 0,
  payment_status    VARCHAR(20) DEFAULT 'Pending' CHECK (payment_status IN ('Pending','Paid','Refunded')),
  order_status      VARCHAR(20) DEFAULT 'Pending' CHECK (order_status IN ('Pending','Processing','Shipped','Delivered','Cancelled')),
  tracking_number   VARCHAR(100),
  dispatch_deadline DATE,
  delivery_date     DATE,
  is_deleted        BOOLEAN   DEFAULT false,
  updated_at        TIMESTAMP DEFAULT NOW(),
  created_at        TIMESTAMP DEFAULT NOW()
);

-- RETURNS
CREATE TABLE IF NOT EXISTS returns (
  id            SERIAL PRIMARY KEY,
  order_id      VARCHAR(50),
  sku           VARCHAR(50),
  reason        TEXT,
  status        VARCHAR(20) DEFAULT 'Pending' CHECK (status IN ('Pending','Approved','Rejected')),
  refund_amount NUMERIC(10,2) DEFAULT 0,
  received_date DATE,
  notes         TEXT,
  is_deleted    BOOLEAN   DEFAULT false,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id        SERIAL PRIMARY KEY,
  user_id   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  action    TEXT NOT NULL,
  module    VARCHAR(50),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- ============================================================
-- TRIGGERS — Business Logic
-- ============================================================

-- 1) New Order → reserved_stock += quantity
CREATE OR REPLACE FUNCTION fn_order_created() RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory SET reserved_stock = reserved_stock + NEW.quantity WHERE sku = NEW.sku;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_created ON orders;
CREATE TRIGGER trg_order_created
  AFTER INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION fn_order_created();

-- 2) Order → Shipped: reserved_stock -= qty, total_stock -= qty
CREATE OR REPLACE FUNCTION fn_order_shipped() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_status = 'Shipped' AND OLD.order_status <> 'Shipped' THEN
    UPDATE inventory
      SET reserved_stock = reserved_stock - NEW.quantity,
          total_stock    = total_stock    - NEW.quantity
      WHERE sku = NEW.sku;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_order_shipped ON orders;
CREATE TRIGGER trg_order_shipped
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION fn_order_shipped();

-- 3) Return → Approved: total_stock += 1
CREATE OR REPLACE FUNCTION fn_return_approved() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'Approved' AND OLD.status <> 'Approved' THEN
    UPDATE inventory SET total_stock = total_stock + 1 WHERE sku = NEW.sku;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_return_approved ON returns;
CREATE TRIGGER trg_return_approved
  AFTER UPDATE ON returns
  FOR EACH ROW EXECUTE FUNCTION fn_return_approved();

-- ============================================================
-- SEED DATA
-- ============================================================

-- Admin user  (password = admin123)
INSERT INTO users (name, email, password, role) VALUES
  ('Admin User', 'admin@selleasy.com',
   '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Inventory
INSERT INTO inventory (sku, product_name, total_stock, reserved_stock, cost_per_unit, supplier_name, restock_level, last_restocked) VALUES
  ('SKU-001', 'Vintage Leather Wallet',  45, 8,  12.50, 'LeatherCo',   10, NOW()),
  ('SKU-002', 'Handmade Ceramic Mug',     7, 3,   8.00, 'CeramicArts', 15, NOW()),
  ('SKU-003', 'Brass Compass Keychain', 120, 15,  4.25, 'MetalWorks',  20, NOW()),
  ('SKU-004', 'Hand-painted Scarf',       5, 2,  18.00, 'SilkRoute',   10, NOW()),
  ('SKU-005', 'Wooden Photo Frame',      60, 10,  9.00, 'WoodCraft',   15, NOW())
ON CONFLICT (sku) DO NOTHING;

-- Listings
INSERT INTO listings (sku, platform, title, category, status, price, cost_price, quantity_available) VALUES
  ('SKU-001', 'eBay',  'Vintage Brown Leather Wallet | Handcrafted', 'Accessories',  'Active',   34.99, 12.50, 37),
  ('SKU-001', 'Etsy',  'Rustic Leather Bifold Wallet',               'Accessories',  'Active',   39.99, 12.50, 37),
  ('SKU-002', 'eBay',  'Handmade Ceramic Coffee Mug',                'Home & Garden','Active',   22.00,  8.00,  4),
  ('SKU-003', 'Etsy',  'Brass Vintage Compass Keychain',             'Jewelry',      'Inactive', 14.99,  4.25,105),
  ('SKU-004', 'Etsy',  'Hand-painted Silk Scarf | Floral',           'Clothing',     'Draft',    55.00, 18.00,  3)
ON CONFLICT DO NOTHING;

-- Orders
INSERT INTO orders (order_id,platform,order_date,buyer_name,buyer_username,sku,quantity,price_per_unit,total_amount,platform_fee,shipping_cost,payment_status,order_status,tracking_number,dispatch_deadline,delivery_date) VALUES
  ('EB-29481','eBay','2024-11-15','John Smith',   'jsmith99',        'SKU-001',2,34.99,69.98,7.00,5.50,'Paid',    'Shipped',  '1Z999AA101',   '2024-11-17','2024-11-20'),
  ('ET-10293','Etsy','2024-11-16','Emily Rose',   'emilyrose_crafts','SKU-002',1,22.00,22.00,2.20,4.00,'Paid',    'Processing','',             '2024-11-18',NULL),
  ('EB-29502','eBay','2024-11-14','Mike Johnson', 'mike_j',          'SKU-003',3,14.99,44.97,4.50,6.00,'Paid',    'Delivered','1Z999AA102',   '2024-11-16','2024-11-19'),
  ('ET-10310','Etsy','2024-11-17','Sophie Turner','sophiet_art',     'SKU-004',1,55.00,55.00,5.50,8.00,'Pending', 'Pending',  '',             '2024-11-19',NULL),
  ('EB-29520','eBay','2024-11-13','David Lee',    'dlee_buy',        'SKU-005',2,19.99,39.98,4.00,5.00,'Paid',    'Shipped',  '1Z999AA103',   '2024-11-15',NULL),
  ('ET-10328','Etsy','2024-11-12','Anna White',   'anna_w',          'SKU-001',1,39.99,39.99,4.00,5.50,'Refunded','Cancelled','',             '2024-11-14',NULL)
ON CONFLICT (order_id) DO NOTHING;

-- Returns
INSERT INTO returns (order_id, sku, reason, status, refund_amount, received_date, notes) VALUES
  ('ET-10328','SKU-001','Item not as described','Approved', 39.99,'2024-11-16','Buyer said color was different'),
  ('EB-29481','SKU-001','Defective product',    'Pending',  34.99,'2024-11-18','Waiting for item return'),
  ('EB-29502','SKU-003','Wrong item sent',       'Rejected',  0.00,'2024-11-17','Buyer confirmed correct item')
ON CONFLICT DO NOTHING;

SELECT 'SellEasy database ready! ✅' AS status;
