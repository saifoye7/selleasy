
import { useState, useEffect, useMemo } from "react";

// ============================================================
// MOCK DATA
// ============================================================
const MOCK_USERS = [
  { id: 1, name: "Ahmed Khan", email: "ahmed@store.com", role: "admin", created_at: "2024-01-10" },
  { id: 2, name: "Sara Ali", email: "sara@store.com", role: "manager", created_at: "2024-02-15" },
  { id: 3, name: "Bilal Hassan", email: "bilal@store.com", role: "viewer", created_at: "2024-03-20" },
];

const MOCK_INVENTORY = [
  { sku: "SKU-001", product_name: "Vintage Leather Wallet", total_stock: 45, reserved_stock: 8, cost_per_unit: 12.5, supplier_name: "LeatherCo", restock_level: 10, last_restocked: "2024-11-01" },
  { sku: "SKU-002", product_name: "Handmade Ceramic Mug", total_stock: 7, reserved_stock: 3, cost_per_unit: 8.0, supplier_name: "CeramicArts", restock_level: 15, last_restocked: "2024-10-20" },
  { sku: "SKU-003", product_name: "Brass Compass Keychain", total_stock: 120, reserved_stock: 15, cost_per_unit: 4.25, supplier_name: "MetalWorks", restock_level: 20, last_restocked: "2024-11-05" },
  { sku: "SKU-004", product_name: "Hand-painted Scarf", total_stock: 5, reserved_stock: 2, cost_per_unit: 18.0, supplier_name: "SilkRoute", restock_level: 10, last_restocked: "2024-09-15" },
  { sku: "SKU-005", product_name: "Wooden Photo Frame", total_stock: 60, reserved_stock: 10, cost_per_unit: 9.0, supplier_name: "WoodCraft", restock_level: 15, last_restocked: "2024-11-10" },
];

const MOCK_LISTINGS = [
  { id: 1, sku: "SKU-001", platform: "eBay", title: "Vintage Brown Leather Wallet | Handcrafted", category: "Accessories", status: "Active", price: 34.99, cost_price: 12.5, quantity_available: 37, listing_url: "#", keywords: "wallet, leather, vintage", created_at: "2024-10-01" },
  { id: 2, sku: "SKU-001", platform: "Etsy", title: "Rustic Leather Bifold Wallet", category: "Accessories", status: "Active", price: 39.99, cost_price: 12.5, quantity_available: 37, listing_url: "#", keywords: "handmade, leather, wallet", created_at: "2024-10-05" },
  { id: 3, sku: "SKU-002", platform: "eBay", title: "Handmade Ceramic Coffee Mug", category: "Home & Garden", status: "Active", price: 22.0, cost_price: 8.0, quantity_available: 4, listing_url: "#", keywords: "ceramic, mug, handmade", created_at: "2024-10-10" },
  { id: 4, sku: "SKU-003", platform: "Etsy", title: "Brass Vintage Compass Keychain", category: "Jewelry", status: "Inactive", price: 14.99, cost_price: 4.25, quantity_available: 105, listing_url: "#", keywords: "brass, compass, keychain", created_at: "2024-09-20" },
  { id: 5, sku: "SKU-004", platform: "Etsy", title: "Hand-painted Silk Scarf | Floral", category: "Clothing", status: "Draft", price: 55.0, cost_price: 18.0, quantity_available: 3, listing_url: "#", keywords: "scarf, silk, handpainted", created_at: "2024-11-01" },
];

const MOCK_ORDERS = [
  { id: 1, order_id: "EB-29481", platform: "eBay", order_date: "2024-11-15", buyer_name: "John Smith", buyer_username: "jsmith99", sku: "SKU-001", quantity: 2, price_per_unit: 34.99, total_amount: 69.98, platform_fee: 7.0, shipping_cost: 5.5, payment_status: "Paid", order_status: "Shipped", tracking_number: "1Z999AA10123456784", dispatch_deadline: "2024-11-17", delivery_date: "2024-11-20", created_at: "2024-11-15" },
  { id: 2, order_id: "ET-10293", platform: "Etsy", order_date: "2024-11-16", buyer_name: "Emily Rose", buyer_username: "emilyrose_crafts", sku: "SKU-002", quantity: 1, price_per_unit: 22.0, total_amount: 22.0, platform_fee: 2.2, shipping_cost: 4.0, payment_status: "Paid", order_status: "Processing", tracking_number: "", dispatch_deadline: "2024-11-18", delivery_date: "", created_at: "2024-11-16" },
  { id: 3, order_id: "EB-29502", platform: "eBay", order_date: "2024-11-14", buyer_name: "Mike Johnson", buyer_username: "mike_j", sku: "SKU-003", quantity: 3, price_per_unit: 14.99, total_amount: 44.97, platform_fee: 4.5, shipping_cost: 6.0, payment_status: "Paid", order_status: "Delivered", tracking_number: "1Z999AA10123456785", dispatch_deadline: "2024-11-16", delivery_date: "2024-11-19", created_at: "2024-11-14" },
  { id: 4, order_id: "ET-10310", platform: "Etsy", order_date: "2024-11-17", buyer_name: "Sophie Turner", buyer_username: "sophiet_art", sku: "SKU-004", quantity: 1, price_per_unit: 55.0, total_amount: 55.0, platform_fee: 5.5, shipping_cost: 8.0, payment_status: "Pending", order_status: "Pending", tracking_number: "", dispatch_deadline: "2024-11-19", delivery_date: "", created_at: "2024-11-17" },
  { id: 5, order_id: "EB-29520", platform: "eBay", order_date: "2024-11-13", buyer_name: "David Lee", buyer_username: "dlee_buy", sku: "SKU-005", quantity: 2, price_per_unit: 19.99, total_amount: 39.98, platform_fee: 4.0, shipping_cost: 5.0, payment_status: "Paid", order_status: "Shipped", tracking_number: "1Z999AA10123456786", dispatch_deadline: "2024-11-15", delivery_date: "", created_at: "2024-11-13" },
  { id: 6, order_id: "ET-10328", platform: "Etsy", order_date: "2024-11-12", buyer_name: "Anna White", buyer_username: "anna_w", sku: "SKU-001", quantity: 1, price_per_unit: 39.99, total_amount: 39.99, platform_fee: 4.0, shipping_cost: 5.5, payment_status: "Refunded", order_status: "Cancelled", tracking_number: "", dispatch_deadline: "2024-11-14", delivery_date: "", created_at: "2024-11-12" },
];

const MOCK_RETURNS = [
  { id: 1, order_id: "ET-10328", sku: "SKU-001", reason: "Item not as described", status: "Approved", refund_amount: 39.99, received_date: "2024-11-16", notes: "Buyer said color was different" },
  { id: 2, order_id: "EB-29481", sku: "SKU-001", reason: "Defective product", status: "Pending", refund_amount: 34.99, received_date: "2024-11-18", notes: "Waiting for item return" },
  { id: 3, order_id: "EB-29502", sku: "SKU-003", reason: "Wrong item sent", status: "Rejected", refund_amount: 0, received_date: "2024-11-17", notes: "Buyer confirmed correct item received after review" },
];

const MOCK_LOGS = [
  { id: 1, user_id: 1, action: "Created order EB-29481", module: "Orders", timestamp: "2024-11-15 10:23:14" },
  { id: 2, user_id: 2, action: "Updated inventory SKU-002", module: "Inventory", timestamp: "2024-11-15 11:05:30" },
  { id: 3, user_id: 1, action: "Added listing for SKU-003", module: "Listings", timestamp: "2024-11-14 09:15:00" },
  { id: 4, user_id: 2, action: "Approved return for ET-10328", module: "Returns", timestamp: "2024-11-16 14:20:10" },
];

// ============================================================
// UTILS
// ============================================================
const calcProfit = (order, inventory) => {
  const inv = inventory.find(i => i.sku === order.sku);
  const cost = inv ? inv.cost_per_unit * order.quantity : 0;
  return order.total_amount - order.platform_fee - order.shipping_cost - cost;
};

const formatCurrency = (val) => `$${parseFloat(val || 0).toFixed(2)}`;
const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const STATUS_COLORS = {
  Active: "#22c55e", Inactive: "#f59e0b", Draft: "#94a3b8",
  Pending: "#f59e0b", Processing: "#3b82f6", Shipped: "#8b5cf6",
  Delivered: "#22c55e", Cancelled: "#ef4444",
  Paid: "#22c55e", Refunded: "#f59e0b", Approved: "#22c55e",
  Rejected: "#ef4444",
};

// ============================================================
// ICONS (inline SVG as components)
// ============================================================
const Icon = ({ d, size = 18, color = "currentColor", strokeWidth = 1.8 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z M9 22V12h6v10",
  orders: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  listings: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
  inventory: "M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z M3.27 6.96L12 12.01l8.73-5.05 M12 22.08V12",
  returns: "M1 4v6h6 M23 20v-6h-6 M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15",
  analytics: "M18 20V10 M12 20V4 M6 20v-6",
  users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  bin: "M3 6h18 M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2",
  logs: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z M14 2v6h6 M12 18v-6 M9 15l3 3 3-3",
  search: "M11 17a6 6 0 100-12 6 6 0 000 12z M21 21l-4.35-4.35",
  plus: "M12 5v14 M5 12h14",
  edit: "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  trash: "M3 6h18 M8 6V4h8v2 M19 6l-1 14H6L5 6",
  restore: "M1 4v6h6 M3.51 15a9 9 0 1017-2.47",
  close: "M18 6L6 18 M6 6l12 12",
  check: "M20 6L9 17l-5-5",
  alert: "M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z M12 9v4 M12 17h.01",
  drive: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
  export: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  import: "M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4 M17 8l-5-5-5 5 M12 3v12",
  bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  menu: "M3 12h18 M3 6h18 M3 18h18",
  ebay: "M5 12h14 M12 5l7 7-7 7",
  etsy: "M12 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z M8 12h8 M12 8v8",
  profit: "M12 2v20 M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6",
  stock: "M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z M7 7h.01",
};

// ============================================================
// STYLES
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0c10;
    --bg2: #0f1117;
    --bg3: #161a22;
    --bg4: #1c2130;
    --border: #252d3d;
    --border2: #2e3a50;
    --text: #e8ecf2;
    --text2: #8896b3;
    --text3: #5a6a85;
    --accent: #4f8ef7;
    --accent2: #7c3aed;
    --green: #22c55e;
    --yellow: #f59e0b;
    --red: #ef4444;
    --ebay: #e53238;
    --etsy: #f56400;
    --radius: 12px;
    --radius-sm: 8px;
    --shadow: 0 4px 24px rgba(0,0,0,0.4);
    --glow: 0 0 20px rgba(79,142,247,0.15);
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); min-height: 100vh; }
  h1, h2, h3, h4, h5 { font-family: 'Syne', sans-serif; }

  .app { display: flex; min-height: 100vh; }

  /* SIDEBAR */
  .sidebar {
    width: 240px; min-height: 100vh; background: var(--bg2);
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    position: fixed; left: 0; top: 0; z-index: 100; transition: transform 0.3s;
  }
  .sidebar.collapsed { transform: translateX(-240px); }
  .sidebar-logo {
    padding: 24px 20px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 36px; height: 36px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 10px; display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px; color: white;
  }
  .logo-text { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
  .logo-sub { font-size: 10px; color: var(--text3); font-weight: 400; letter-spacing: 0.5px; }

  .nav { padding: 16px 12px; flex: 1; overflow-y: auto; }
  .nav-section { margin-bottom: 20px; }
  .nav-label { font-size: 10px; font-weight: 600; color: var(--text3); letter-spacing: 1.2px; text-transform: uppercase; padding: 0 8px; margin-bottom: 6px; }
  .nav-item {
    display: flex; align-items: center; gap: 10px; padding: 9px 10px; border-radius: var(--radius-sm);
    cursor: pointer; transition: all 0.15s; color: var(--text2); font-size: 13.5px; font-weight: 500;
    position: relative; margin-bottom: 2px;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(79,142,247,0.12); color: var(--accent); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; background: var(--accent); border-radius: 0 3px 3px 0;
  }
  .nav-badge {
    margin-left: auto; background: var(--red); color: white;
    font-size: 10px; font-weight: 700; padding: 2px 6px; border-radius: 20px; line-height: 1.4;
  }

  .sidebar-footer { padding: 16px; border-top: 1px solid var(--border); }
  .user-card {
    display: flex; align-items: center; gap: 10px; padding: 8px;
    background: var(--bg3); border-radius: var(--radius-sm); cursor: pointer;
  }
  .user-avatar {
    width: 32px; height: 32px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 12px; flex-shrink: 0;
  }
  .user-name { font-size: 13px; font-weight: 600; }
  .user-role { font-size: 11px; color: var(--text3); text-transform: capitalize; }

  /* MAIN */
  .main { margin-left: 240px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; transition: margin-left 0.3s; }
  .main.expanded { margin-left: 0; }

  .topbar {
    height: 60px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 24px; gap: 16px; position: sticky; top: 0; z-index: 50;
  }
  .menu-btn { background: none; border: none; cursor: pointer; color: var(--text2); display: flex; }
  .topbar-title { font-family: 'Syne', sans-serif; font-weight: 600; font-size: 17px; }
  .topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .icon-btn {
    width: 36px; height: 36px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: var(--text2); transition: all 0.15s; position: relative;
  }
  .icon-btn:hover { background: var(--bg4); color: var(--text); }
  .notif-dot {
    position: absolute; top: 6px; right: 6px; width: 7px; height: 7px;
    background: var(--red); border-radius: 50%; border: 1.5px solid var(--bg2);
  }

  .search-bar {
    display: flex; align-items: center; gap: 8px; background: var(--bg3);
    border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 7px 12px;
    width: 240px; transition: all 0.2s;
  }
  .search-bar:focus-within { border-color: var(--accent); box-shadow: var(--glow); width: 300px; }
  .search-bar input { background: none; border: none; outline: none; color: var(--text); font-size: 13px; width: 100%; font-family: 'DM Sans', sans-serif; }
  .search-bar input::placeholder { color: var(--text3); }

  .content { padding: 24px; flex: 1; }

  /* ALERTS BANNER */
  .alerts-banner {
    display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 20px;
  }
  .alert-chip {
    display: flex; align-items: center; gap: 6px; padding: 6px 12px;
    border-radius: 20px; font-size: 12px; font-weight: 500;
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5;
  }
  .alert-chip.warn { background: rgba(245,158,11,0.1); border-color: rgba(245,158,11,0.3); color: #fcd34d; }

  /* CARDS */
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    padding: 20px; position: relative; overflow: hidden; transition: all 0.2s;
  }
  .stat-card:hover { border-color: var(--border2); box-shadow: var(--shadow); transform: translateY(-2px); }
  .stat-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .stat-card.blue::before { background: linear-gradient(90deg, var(--accent), #60a5fa); }
  .stat-card.green::before { background: linear-gradient(90deg, var(--green), #86efac); }
  .stat-card.purple::before { background: linear-gradient(90deg, var(--accent2), #a78bfa); }
  .stat-card.yellow::before { background: linear-gradient(90deg, var(--yellow), #fcd34d); }
  .stat-label { font-size: 12px; color: var(--text3); font-weight: 500; letter-spacing: 0.3px; margin-bottom: 10px; }
  .stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; }
  .stat-change { font-size: 12px; color: var(--green); margin-top: 6px; }
  .stat-change.neg { color: var(--red); }
  .stat-icon {
    position: absolute; top: 16px; right: 16px; width: 36px; height: 36px;
    background: var(--bg3); border-radius: 8px; display: flex; align-items: center; justify-content: center;
    color: var(--text3);
  }

  /* CHARTS */
  .charts-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; margin-bottom: 24px; }
  .chart-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px;
  }
  .chart-title { font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .chart-area { position: relative; height: 180px; }

  /* SIMPLE BAR CHART */
  .bar-chart { display: flex; align-items: flex-end; gap: 8px; height: 160px; padding-top: 10px; }
  .bar-group { display: flex; flex-direction: column; align-items: center; gap: 4px; flex: 1; }
  .bar {
    width: 100%; border-radius: 4px 4px 0 0; transition: opacity 0.2s;
    position: relative; cursor: pointer;
  }
  .bar:hover { opacity: 0.8; }
  .bar-label { font-size: 10px; color: var(--text3); white-space: nowrap; }

  /* DONUT */
  .donut-wrap { display: flex; flex-direction: column; align-items: center; }
  .donut-legend { display: flex; flex-direction: column; gap: 8px; width: 100%; margin-top: 16px; }
  .legend-item { display: flex; align-items: center; justify-content: space-between; font-size: 12px; }
  .legend-dot { width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; flex-shrink: 0; }
  .legend-name { display: flex; align-items: center; color: var(--text2); }
  .legend-val { color: var(--text); font-weight: 600; }

  /* TABLES */
  .table-card {
    background: var(--bg2); border: 1px solid var(--border); border-radius: var(--radius);
    overflow: hidden;
  }
  .table-header {
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  }
  .table-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 600; }
  .table-actions { margin-left: auto; display: flex; gap: 8px; }

  table { width: 100%; border-collapse: collapse; }
  thead th {
    padding: 11px 16px; text-align: left; font-size: 11px; font-weight: 600;
    color: var(--text3); letter-spacing: 0.8px; text-transform: uppercase;
    background: var(--bg3); border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  tbody tr { border-bottom: 1px solid var(--border); transition: background 0.1s; }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--bg3); }
  tbody td { padding: 12px 16px; font-size: 13px; vertical-align: middle; }
  .td-mono { font-family: monospace; font-size: 12px; color: var(--text2); }

  /* BADGES */
  .badge {
    display: inline-flex; align-items: center; padding: 3px 8px; border-radius: 20px;
    font-size: 11px; font-weight: 600; letter-spacing: 0.3px;
  }
  .platform-badge {
    display: inline-flex; align-items: center; gap: 5px; padding: 3px 8px;
    border-radius: 6px; font-size: 11px; font-weight: 600;
  }
  .platform-ebay { background: rgba(229,50,56,0.12); color: #fca5a5; }
  .platform-etsy { background: rgba(245,100,0,0.12); color: #fdba74; }

  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;
    border-radius: var(--radius-sm); font-size: 13px; font-weight: 500; cursor: pointer;
    transition: all 0.15s; border: none; font-family: 'DM Sans', sans-serif;
  }
  .btn-primary { background: var(--accent); color: white; }
  .btn-primary:hover { background: #3a7de8; }
  .btn-secondary { background: var(--bg3); border: 1px solid var(--border); color: var(--text2); }
  .btn-secondary:hover { background: var(--bg4); color: var(--text); }
  .btn-danger { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3); color: #fca5a5; }
  .btn-danger:hover { background: rgba(239,68,68,0.2); }
  .btn-success { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.3); color: #86efac; }
  .btn-sm { padding: 5px 10px; font-size: 12px; }

  /* FILTERS */
  .filter-bar { display: flex; gap: 8px; flex-wrap: wrap; }
  .filter-select {
    background: var(--bg3); border: 1px solid var(--border); color: var(--text); font-size: 13px;
    padding: 7px 12px; border-radius: var(--radius-sm); cursor: pointer; font-family: 'DM Sans', sans-serif;
    outline: none;
  }
  .filter-select:focus { border-color: var(--accent); }

  /* MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7); z-index: 200;
    display: flex; align-items: center; justify-content: center; padding: 20px;
    backdrop-filter: blur(4px);
  }
  .modal {
    background: var(--bg2); border: 1px solid var(--border2); border-radius: 16px;
    padding: 28px; width: 100%; max-width: 560px; max-height: 90vh; overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6);
  }
  .modal-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
  .modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); }

  /* FORM */
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-label { font-size: 12px; font-weight: 500; color: var(--text2); }
  .form-input {
    background: var(--bg3); border: 1px solid var(--border); color: var(--text);
    padding: 9px 12px; border-radius: var(--radius-sm); font-size: 13px; outline: none;
    font-family: 'DM Sans', sans-serif; transition: border-color 0.15s;
  }
  .form-input:focus { border-color: var(--accent); }
  .form-input.full { grid-column: 1 / -1; }

  /* LOW STOCK */
  .low-stock { color: var(--red); font-weight: 600; }
  .ok-stock { color: var(--green); }

  /* PROFIT PILL */
  .profit-pos { color: var(--green); font-weight: 600; }
  .profit-neg { color: var(--red); font-weight: 600; }

  /* RECYCLE BIN */
  .deleted-row { opacity: 0.6; }

  /* PAGE HEADER */
  .page-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .page-title { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 700; }
  .page-subtitle { font-size: 13px; color: var(--text3); margin-top: 2px; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .charts-grid { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .sidebar { transform: translateX(-240px); }
    .sidebar.mobile-open { transform: translateX(0); }
    .main { margin-left: 0; }
    .stats-grid { grid-template-columns: repeat(2, 1fr); }
    .search-bar { width: 160px; }
    .search-bar:focus-within { width: 200px; }
  }
  @media (max-width: 480px) {
    .stats-grid { grid-template-columns: 1fr; }
    .content { padding: 16px; }
    .modal-grid { grid-template-columns: 1fr; }
  }

  .empty-state {
    text-align: center; padding: 48px 24px; color: var(--text3);
  }
  .empty-state svg { margin: 0 auto 12px; opacity: 0.3; }
  .empty-state p { font-size: 14px; }

  .tabs { display: flex; gap: 4px; padding: 4px; background: var(--bg3); border-radius: var(--radius-sm); }
  .tab {
    padding: 6px 14px; border-radius: 6px; font-size: 13px; font-weight: 500;
    cursor: pointer; transition: all 0.15s; color: var(--text3);
  }
  .tab.active { background: var(--bg2); color: var(--text); box-shadow: var(--shadow); }

  .inventory-bar-wrap { display: flex; align-items: center; gap: 8px; }
  .inventory-bar {
    flex: 1; height: 6px; background: var(--bg4); border-radius: 3px; overflow: hidden;
  }
  .inventory-bar-fill { height: 100%; border-radius: 3px; transition: width 0.3s; }

  .drive-card {
    background: linear-gradient(135deg, rgba(79,142,247,0.08), rgba(124,58,237,0.08));
    border: 1px solid rgba(79,142,247,0.2); border-radius: var(--radius); padding: 20px;
    display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.2s;
  }
  .drive-card:hover { border-color: rgba(79,142,247,0.4); }
  .drive-icon {
    width: 48px; height: 48px; background: linear-gradient(135deg, var(--accent), var(--accent2));
    border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }

  .inline-edit { display: flex; gap: 4px; align-items: center; }
  .inline-edit input {
    width: 80px; padding: 4px 8px; font-size: 12px;
    background: var(--bg4); border: 1px solid var(--border2); color: var(--text);
    border-radius: 6px; outline: none; font-family: 'DM Sans', sans-serif;
  }
`;

// ============================================================
// COMPONENTS
// ============================================================

function StatusBadge({ status }) {
  const color = STATUS_COLORS[status] || "#8896b3";
  return (
    <span className="badge" style={{ background: color + "22", color, border: `1px solid ${color}44` }}>
      {status}
    </span>
  );
}

function PlatformBadge({ platform }) {
  return (
    <span className={`platform-badge platform-${platform.toLowerCase()}`}>
      {platform}
    </span>
  );
}

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {title}
          <button className="icon-btn" onClick={onClose} style={{ width: 28, height: 28 }}>
            <Icon d={Icons.close} size={14} />
          </button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================
function DashboardPage({ orders, inventory, listings }) {
  const totalRevenue = orders.filter(o => o.payment_status === "Paid").reduce((s, o) => s + o.total_amount, 0);
  const totalProfit = orders.filter(o => o.payment_status === "Paid").reduce((s, o) => s + calcProfit(o, inventory), 0);
  const pending = orders.filter(o => o.order_status === "Pending" || o.order_status === "Processing").length;
  const lowStock = inventory.filter(i => (i.total_stock - i.reserved_stock) <= i.restock_level);

  const salesByMonth = {};
  orders.forEach(o => {
    const m = o.order_date?.slice(0, 7);
    if (m) salesByMonth[m] = (salesByMonth[m] || 0) + o.total_amount;
  });
  const months = Object.keys(salesByMonth).sort().slice(-6);
  const maxSale = Math.max(...months.map(m => salesByMonth[m]), 1);

  const platformCounts = { eBay: 0, Etsy: 0 };
  orders.forEach(o => { platformCounts[o.platform] = (platformCounts[o.platform] || 0) + 1; });

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Dashboard</div>
          <div className="page-subtitle">Overview of your eBay & Etsy stores</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><Icon d={Icons.export} size={14} /> Export</button>
          <button className="btn btn-primary btn-sm"><Icon d={Icons.drive} size={14} /> Sync Drive</button>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="alerts-banner">
          {lowStock.map(i => (
            <div key={i.sku} className="alert-chip">
              <Icon d={Icons.alert} size={12} />
              Low Stock: {i.product_name} ({i.total_stock - i.reserved_stock} left)
            </div>
          ))}
          {orders.some(o => o.order_status === "Processing" && new Date(o.dispatch_deadline) < new Date()) && (
            <div className="alert-chip warn">
              <Icon d={Icons.alert} size={12} />
              Late Dispatch Alert — Orders overdue!
            </div>
          )}
        </div>
      )}

      <div className="stats-grid">
        {[
          { label: "Total Orders", value: orders.length, color: "blue", icon: Icons.orders, change: "+12% this month" },
          { label: "Total Revenue", value: formatCurrency(totalRevenue), color: "green", icon: Icons.profit, change: "+8.3% this month" },
          { label: "Total Profit", value: formatCurrency(totalProfit), color: "purple", icon: Icons.analytics, change: "+5.1% this month" },
          { label: "Pending Orders", value: pending, color: "yellow", icon: Icons.bell, change: `${lowStock.length} low stock` },
        ].map(c => (
          <div key={c.label} className={`stat-card ${c.color}`}>
            <div className="stat-icon"><Icon d={c.icon} size={16} /></div>
            <div className="stat-label">{c.label}</div>
            <div className="stat-value">{c.value}</div>
            <div className={`stat-change ${c.label === "Pending Orders" ? "" : ""}`}>{c.change}</div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-title">
            <span>Sales Revenue</span>
            <span style={{ fontSize: 12, color: "var(--text3)", fontWeight: 400 }}>Last 6 months</span>
          </div>
          <div className="bar-chart">
            {months.map(m => (
              <div key={m} className="bar-group">
                <div
                  className="bar"
                  style={{
                    height: `${(salesByMonth[m] / maxSale) * 140}px`,
                    background: "linear-gradient(180deg, var(--accent), rgba(79,142,247,0.4))",
                    minHeight: 4,
                  }}
                  title={`${m}: ${formatCurrency(salesByMonth[m])}`}
                />
                <div className="bar-label">{m.slice(5)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-title">Platform Split</div>
          <div className="donut-wrap">
            <svg width={120} height={120} viewBox="0 0 42 42">
              {(() => {
                const total = orders.length || 1;
                const ebayPct = (platformCounts.eBay / total) * 100;
                const etsyPct = (platformCounts.Etsy / total) * 100;
                const r = 15.91549430918954;
                const circ = 2 * Math.PI * r;
                return (
                  <>
                    <circle cx="21" cy="21" r={r} fill="transparent" stroke="#e53238" strokeWidth="6"
                      strokeDasharray={`${ebayPct / 100 * circ} ${circ}`}
                      strokeDashoffset={circ * 0.25} />
                    <circle cx="21" cy="21" r={r} fill="transparent" stroke="#f56400" strokeWidth="6"
                      strokeDasharray={`${etsyPct / 100 * circ} ${circ}`}
                      strokeDashoffset={circ * 0.25 - ebayPct / 100 * circ} />
                    <circle cx="21" cy="21" r="10" fill="var(--bg2)" />
                    <text x="21" y="22" textAnchor="middle" fill="var(--text)" fontSize="5" fontFamily="Syne">{orders.length}</text>
                    <text x="21" y="27" textAnchor="middle" fill="var(--text3)" fontSize="3">orders</text>
                  </>
                );
              })()}
            </svg>
            <div className="donut-legend">
              {[
                { name: "eBay", color: "#e53238", count: platformCounts.eBay },
                { name: "Etsy", color: "#f56400", count: platformCounts.Etsy },
              ].map(p => (
                <div key={p.name} className="legend-item">
                  <div className="legend-name"><div className="legend-dot" style={{ background: p.color }} />{p.name}</div>
                  <div className="legend-val">{p.count} orders</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="table-title">Recent Orders</div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Order ID</th><th>Platform</th><th>Buyer</th><th>SKU</th>
              <th>Amount</th><th>Profit</th><th>Status</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map(o => {
              const profit = calcProfit(o, inventory);
              return (
                <tr key={o.id}>
                  <td className="td-mono">{o.order_id}</td>
                  <td><PlatformBadge platform={o.platform} /></td>
                  <td>{o.buyer_name}</td>
                  <td className="td-mono">{o.sku}</td>
                  <td>{formatCurrency(o.total_amount)}</td>
                  <td className={profit >= 0 ? "profit-pos" : "profit-neg"}>{formatCurrency(profit)}</td>
                  <td><StatusBadge status={o.order_status} /></td>
                  <td style={{ color: "var(--text3)", fontSize: 12 }}>{formatDate(o.order_date)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// ORDERS PAGE
// ============================================================
function OrdersPage({ orders, setOrders, inventory, deletedOrders, setDeletedOrders }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [editOrder, setEditOrder] = useState(null);

  const filtered = useMemo(() => orders.filter(o => {
    const matchSearch = !search || o.order_id.toLowerCase().includes(search.toLowerCase()) ||
      o.buyer_name.toLowerCase().includes(search.toLowerCase()) || o.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || o.order_status === statusFilter;
    const matchPlatform = platformFilter === "All" || o.platform === platformFilter;
    return matchSearch && matchStatus && matchPlatform;
  }), [orders, search, statusFilter, platformFilter]);

  const handleDelete = (id) => {
    const order = orders.find(o => o.id === id);
    setDeletedOrders(prev => [...prev, { ...order, deleted_at: new Date().toISOString() }]);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const handleSave = (updated) => {
    if (updated.id) {
      setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    } else {
      setOrders(prev => [...prev, { ...updated, id: Date.now(), created_at: new Date().toISOString() }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Orders</div>
          <div className="page-subtitle">{filtered.length} orders found</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><Icon d={Icons.export} size={14} /> CSV</button>
          <button className="btn btn-primary" onClick={() => { setEditOrder({}); setModal("edit"); }}>
            <Icon d={Icons.plus} size={14} /> Add Order
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="filter-bar">
            <div className="search-bar" style={{ width: 200 }}>
              <Icon d={Icons.search} size={14} color="var(--text3)" />
              <input placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All</option>
              {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="filter-select" value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
              <option>All</option><option>eBay</option><option>Etsy</option>
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Order ID</th><th>Platform</th><th>Buyer</th><th>SKU</th>
                <th>Qty</th><th>Total</th><th>Profit</th><th>Status</th>
                <th>Payment</th><th>Dispatch By</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={11}>
                  <div className="empty-state"><Icon d={Icons.orders} size={32} /><p>No orders found</p></div>
                </td></tr>
              ) : filtered.map(o => {
                const profit = calcProfit(o, inventory);
                const overdue = o.dispatch_deadline && !o.tracking_number && new Date(o.dispatch_deadline) < new Date();
                return (
                  <tr key={o.id} style={overdue ? { background: "rgba(239,68,68,0.04)" } : {}}>
                    <td className="td-mono" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {overdue && <Icon d={Icons.alert} size={12} color="var(--red)" />}
                      {o.order_id}
                    </td>
                    <td><PlatformBadge platform={o.platform} /></td>
                    <td>{o.buyer_name}</td>
                    <td className="td-mono">{o.sku}</td>
                    <td>{o.quantity}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(o.total_amount)}</td>
                    <td className={profit >= 0 ? "profit-pos" : "profit-neg"}>{formatCurrency(profit)}</td>
                    <td><StatusBadge status={o.order_status} /></td>
                    <td><StatusBadge status={o.payment_status} /></td>
                    <td style={{ fontSize: 12, color: overdue ? "var(--red)" : "var(--text3)" }}>{formatDate(o.dispatch_deadline)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditOrder(o); setModal("edit"); }}>
                          <Icon d={Icons.edit} size={12} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}>
                          <Icon d={Icons.trash} size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "edit" && (
        <OrderModal order={editOrder} onClose={() => setModal(null)} onSave={handleSave} inventory={inventory} />
      )}
    </div>
  );
}

function OrderModal({ order, onClose, onSave, inventory }) {
  const [form, setForm] = useState({
    order_id: "", platform: "eBay", order_date: "", buyer_name: "", buyer_username: "",
    sku: "", quantity: 1, price_per_unit: 0, total_amount: 0, platform_fee: 0,
    shipping_cost: 0, payment_status: "Pending", order_status: "Pending",
    tracking_number: "", dispatch_deadline: "", delivery_date: "", ...order
  });

  const set = (k, v) => setForm(p => {
    const next = { ...p, [k]: v };
    if (k === "quantity" || k === "price_per_unit") {
      next.total_amount = (parseFloat(next.quantity) || 0) * (parseFloat(next.price_per_unit) || 0);
    }
    return next;
  });

  return (
    <Modal title={form.id ? "Edit Order" : "New Order"} onClose={onClose}
      footer={<>
        <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        <button className="btn btn-primary" onClick={() => onSave(form)}>Save Order</button>
      </>}>
      <div className="modal-grid">
        <div className="form-group"><label className="form-label">Order ID</label><input className="form-input" value={form.order_id} onChange={e => set("order_id", e.target.value)} placeholder="EB-00001" /></div>
        <div className="form-group"><label className="form-label">Platform</label>
          <select className="form-input" value={form.platform} onChange={e => set("platform", e.target.value)}>
            <option>eBay</option><option>Etsy</option>
          </select>
        </div>
        <div className="form-group"><label className="form-label">Buyer Name</label><input className="form-input" value={form.buyer_name} onChange={e => set("buyer_name", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">SKU</label>
          <select className="form-input" value={form.sku} onChange={e => set("sku", e.target.value)}>
            <option value="">Select SKU</option>
            {inventory.map(i => <option key={i.sku} value={i.sku}>{i.sku} — {i.product_name}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Quantity</label><input className="form-input" type="number" value={form.quantity} onChange={e => set("quantity", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Price/Unit</label><input className="form-input" type="number" step="0.01" value={form.price_per_unit} onChange={e => set("price_per_unit", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Total Amount (auto)</label><input className="form-input" value={formatCurrency(form.total_amount)} readOnly style={{ opacity: 0.7 }} /></div>
        <div className="form-group"><label className="form-label">Platform Fee</label><input className="form-input" type="number" step="0.01" value={form.platform_fee} onChange={e => set("platform_fee", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Shipping Cost</label><input className="form-input" type="number" step="0.01" value={form.shipping_cost} onChange={e => set("shipping_cost", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Payment Status</label>
          <select className="form-input" value={form.payment_status} onChange={e => set("payment_status", e.target.value)}>
            {["Pending", "Paid", "Refunded"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Order Status</label>
          <select className="form-input" value={form.order_status} onChange={e => set("order_status", e.target.value)}>
            {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="form-group"><label className="form-label">Order Date</label><input className="form-input" type="date" value={form.order_date} onChange={e => set("order_date", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Dispatch Deadline</label><input className="form-input" type="date" value={form.dispatch_deadline} onChange={e => set("dispatch_deadline", e.target.value)} /></div>
        <div className="form-group"><label className="form-label">Tracking Number</label><input className="form-input" value={form.tracking_number} onChange={e => set("tracking_number", e.target.value)} /></div>
      </div>
      <div style={{ marginTop: 14, padding: "10px 14px", background: "var(--bg3)", borderRadius: 8, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
        <span style={{ color: "var(--text3)" }}>Calculated Profit:</span>
        <span className={calcProfit(form, [{ sku: form.sku, cost_per_unit: 0 }]) >= 0 ? "profit-pos" : "profit-neg"} style={{ fontWeight: 700 }}>
          {formatCurrency(form.total_amount - (form.platform_fee || 0) - (form.shipping_cost || 0))}
        </span>
      </div>
    </Modal>
  );
}

// ============================================================
// LISTINGS PAGE
// ============================================================
function ListingsPage({ listings, setListings, inventory, deletedListings, setDeletedListings }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [platformFilter, setPlatformFilter] = useState("All");
  const [modal, setModal] = useState(null);
  const [editListing, setEditListing] = useState(null);

  const filtered = useMemo(() => listings.filter(l => {
    const matchSearch = !search || l.title.toLowerCase().includes(search.toLowerCase()) || l.sku.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || l.status === statusFilter;
    const matchPlatform = platformFilter === "All" || l.platform === platformFilter;
    return matchSearch && matchStatus && matchPlatform;
  }), [listings, search, statusFilter, platformFilter]);

  const toggleStatus = (id) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, status: l.status === "Active" ? "Inactive" : "Active" } : l));
  };

  const handleDelete = (id) => {
    const listing = listings.find(l => l.id === id);
    setDeletedListings(prev => [...prev, { ...listing, deleted_at: new Date().toISOString() }]);
    setListings(prev => prev.filter(l => l.id !== id));
  };

  const handleSave = (updated) => {
    if (updated.id) {
      setListings(prev => prev.map(l => l.id === updated.id ? updated : l));
    } else {
      setListings(prev => [...prev, { ...updated, id: Date.now(), created_at: new Date().toISOString() }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Listings</div>
          <div className="page-subtitle">{filtered.length} listings</div>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditListing({}); setModal("edit"); }}>
          <Icon d={Icons.plus} size={14} /> New Listing
        </button>
      </div>
      <div className="table-card">
        <div className="table-header">
          <div className="filter-bar">
            <div className="search-bar" style={{ width: 200 }}>
              <Icon d={Icons.search} size={14} color="var(--text3)" />
              <input placeholder="Search listings..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={platformFilter} onChange={e => setPlatformFilter(e.target.value)}>
              <option>All</option><option>eBay</option><option>Etsy</option>
            </select>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option>All</option>
              {["Active", "Inactive", "Draft"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Title</th><th>Platform</th><th>Category</th>
                <th>Price</th><th>Cost</th><th>Margin</th><th>Qty</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => {
                const margin = l.price > 0 ? ((l.price - l.cost_price) / l.price * 100).toFixed(1) : 0;
                return (
                  <tr key={l.id}>
                    <td className="td-mono">{l.sku}</td>
                    <td style={{ maxWidth: 200 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{l.title}</div>
                    </td>
                    <td><PlatformBadge platform={l.platform} /></td>
                    <td style={{ color: "var(--text2)", fontSize: 12 }}>{l.category}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(l.price)}</td>
                    <td style={{ color: "var(--text3)" }}>{formatCurrency(l.cost_price)}</td>
                    <td className={margin >= 30 ? "profit-pos" : "profit-neg"}>{margin}%</td>
                    <td>{l.quantity_available}</td>
                    <td>
                      <span onClick={() => toggleStatus(l.id)} style={{ cursor: "pointer" }}>
                        <StatusBadge status={l.status} />
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditListing(l); setModal("edit"); }}><Icon d={Icons.edit} size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l.id)}><Icon d={Icons.trash} size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "edit" && (
        <Modal title={editListing?.id ? "Edit Listing" : "New Listing"} onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleSave(editListing)}>Save</button>
          </>}>
          <div className="modal-grid">
            {[
              ["SKU", "sku"], ["Platform", "platform"], ["Title", "title", true], ["Category", "category"],
              ["Price", "price"], ["Cost Price", "cost_price"], ["Qty Available", "quantity_available"], ["Status", "status"],
            ].map(([label, key, full]) => (
              <div key={key} className={`form-group${full ? " form-input full" : ""}`} style={full ? { gridColumn: "1/-1" } : {}}>
                <label className="form-label">{label}</label>
                {["platform", "status"].includes(key) ? (
                  <select className="form-input" value={editListing?.[key] || ""} onChange={e => setEditListing(p => ({ ...p, [key]: e.target.value }))}>
                    {key === "platform" ? ["eBay", "Etsy"].map(v => <option key={v}>{v}</option>) :
                      ["Active", "Inactive", "Draft"].map(v => <option key={v}>{v}</option>)}
                  </select>
                ) : (
                  <input className="form-input" value={editListing?.[key] || ""} onChange={e => setEditListing(p => ({ ...p, [key]: e.target.value }))} />
                )}
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// INVENTORY PAGE
// ============================================================
function InventoryPage({ inventory, setInventory, deletedInventory, setDeletedInventory }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const filtered = inventory.filter(i =>
    !search || i.sku.toLowerCase().includes(search.toLowerCase()) ||
    i.product_name.toLowerCase().includes(search.toLowerCase()) ||
    i.supplier_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (sku) => {
    const item = inventory.find(i => i.sku === sku);
    setDeletedInventory(prev => [...prev, { ...item, deleted_at: new Date().toISOString() }]);
    setInventory(prev => prev.filter(i => i.sku !== sku));
  };

  const handleSave = (updated) => {
    if (inventory.find(i => i.sku === updated.sku)) {
      setInventory(prev => prev.map(i => i.sku === updated.sku ? updated : i));
    } else {
      setInventory(prev => [...prev, { ...updated, last_restocked: new Date().toISOString().slice(0, 10) }]);
    }
    setModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Inventory</div>
          <div className="page-subtitle">{inventory.filter(i => (i.total_stock - i.reserved_stock) <= i.restock_level).length} items need restocking</div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-secondary btn-sm"><Icon d={Icons.import} size={14} /> Import CSV</button>
          <button className="btn btn-primary" onClick={() => { setEditItem({}); setModal("edit"); }}>
            <Icon d={Icons.plus} size={14} /> Add Product
          </button>
        </div>
      </div>

      <div className="table-card">
        <div className="table-header">
          <div className="search-bar" style={{ width: 240 }}>
            <Icon d={Icons.search} size={14} color="var(--text3)" />
            <input placeholder="Search inventory..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>SKU</th><th>Product</th><th>Total Stock</th><th>Reserved</th>
                <th>Available</th><th>Stock Level</th><th>Cost/Unit</th><th>Supplier</th>
                <th>Restock At</th><th>Last Restocked</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(i => {
                const avail = i.total_stock - i.reserved_stock;
                const isLow = avail <= i.restock_level;
                const pct = Math.min((avail / Math.max(i.total_stock, 1)) * 100, 100);
                return (
                  <tr key={i.sku}>
                    <td className="td-mono">{i.sku}</td>
                    <td style={{ fontWeight: 500 }}>{i.product_name}</td>
                    <td>{i.total_stock}</td>
                    <td style={{ color: "var(--yellow)" }}>{i.reserved_stock}</td>
                    <td className={isLow ? "low-stock" : "ok-stock"}>{avail}</td>
                    <td style={{ minWidth: 120 }}>
                      <div className="inventory-bar-wrap">
                        <div className="inventory-bar">
                          <div className="inventory-bar-fill" style={{
                            width: `${pct}%`,
                            background: isLow ? "var(--red)" : pct > 60 ? "var(--green)" : "var(--yellow)"
                          }} />
                        </div>
                        <span style={{ fontSize: 11, color: "var(--text3)", whiteSpace: "nowrap" }}>{pct.toFixed(0)}%</span>
                      </div>
                    </td>
                    <td>{formatCurrency(i.cost_per_unit)}</td>
                    <td style={{ color: "var(--text2)" }}>{i.supplier_name}</td>
                    <td className={isLow ? "low-stock" : ""}>{i.restock_level}</td>
                    <td style={{ fontSize: 12, color: "var(--text3)" }}>{formatDate(i.last_restocked)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <button className="btn btn-secondary btn-sm" onClick={() => { setEditItem(i); setModal("edit"); }}><Icon d={Icons.edit} size={12} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(i.sku)}><Icon d={Icons.trash} size={12} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modal === "edit" && (
        <Modal title={editItem?.sku ? "Edit Inventory" : "Add Product"} onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleSave(editItem)}>Save</button>
          </>}>
          <div className="modal-grid">
            {[
              ["SKU", "sku"], ["Product Name", "product_name", true], ["Total Stock", "total_stock"],
              ["Reserved Stock", "reserved_stock"], ["Cost Per Unit", "cost_per_unit"], ["Supplier", "supplier_name"],
              ["Restock Level", "restock_level"],
            ].map(([label, key, full]) => (
              <div key={key} className="form-group" style={full ? { gridColumn: "1/-1" } : {}}>
                <label className="form-label">{label}</label>
                <input className="form-input" value={editItem?.[key] || ""} onChange={e => setEditItem(p => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// RETURNS PAGE
// ============================================================
function ReturnsPage({ returns, setReturns, deletedReturns, setDeletedReturns }) {
  const [modal, setModal] = useState(null);
  const [editReturn, setEditReturn] = useState(null);

  const handleSave = (updated) => {
    if (updated.id) {
      setReturns(prev => prev.map(r => r.id === updated.id ? updated : r));
    } else {
      setReturns(prev => [...prev, { ...updated, id: Date.now() }]);
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    const item = returns.find(r => r.id === id);
    setDeletedReturns(prev => [...prev, { ...item, deleted_at: new Date().toISOString() }]);
    setReturns(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Returns</div><div className="page-subtitle">{returns.length} returns</div></div>
        <button className="btn btn-primary" onClick={() => { setEditReturn({}); setModal("edit"); }}>
          <Icon d={Icons.plus} size={14} /> Add Return
        </button>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Return ID</th><th>Order ID</th><th>SKU</th><th>Reason</th>
              <th>Refund</th><th>Status</th><th>Received</th><th>Notes</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map(r => (
              <tr key={r.id}>
                <td className="td-mono">RET-{String(r.id).padStart(4, "0")}</td>
                <td className="td-mono">{r.order_id}</td>
                <td className="td-mono">{r.sku}</td>
                <td style={{ maxWidth: 160, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.reason}</td>
                <td className={r.status === "Approved" ? "profit-pos" : ""}>{r.refund_amount > 0 ? formatCurrency(r.refund_amount) : "—"}</td>
                <td><StatusBadge status={r.status} /></td>
                <td style={{ fontSize: 12, color: "var(--text3)" }}>{formatDate(r.received_date)}</td>
                <td style={{ fontSize: 12, color: "var(--text2)", maxWidth: 160 }}>{r.notes}</td>
                <td>
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setEditReturn(r); setModal("edit"); }}><Icon d={Icons.edit} size={12} /></button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(r.id)}><Icon d={Icons.trash} size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "edit" && (
        <Modal title="Return Details" onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleSave(editReturn)}>Save</button>
          </>}>
          <div className="modal-grid">
            {[["Order ID", "order_id"], ["SKU", "sku"], ["Reason", "reason", true], ["Refund Amount", "refund_amount"], ["Received Date", "received_date"], ["Notes", "notes", true]].map(([label, key, full]) => (
              <div key={key} className="form-group" style={full ? { gridColumn: "1/-1" } : {}}>
                <label className="form-label">{label}</label>
                <input className="form-input" value={editReturn?.[key] || ""} onChange={e => setEditReturn(p => ({ ...p, [key]: e.target.value }))} type={key === "received_date" ? "date" : "text"} />
              </div>
            ))}
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-input" value={editReturn?.status || "Pending"} onChange={e => setEditReturn(p => ({ ...p, status: e.target.value }))}>
                {["Pending", "Approved", "Rejected"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// USERS PAGE
// ============================================================
function UsersPage({ users, setUsers }) {
  const [modal, setModal] = useState(null);
  const [editUser, setEditUser] = useState(null);

  const handleSave = (updated) => {
    if (updated.id) {
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    } else {
      setUsers(prev => [...prev, { ...updated, id: Date.now(), created_at: new Date().toISOString().slice(0, 10) }]);
    }
    setModal(null);
  };

  const ROLE_COLORS = { admin: "#4f8ef7", manager: "#22c55e", viewer: "#94a3b8" };

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Users</div><div className="page-subtitle">Role-based access control</div></div>
        <button className="btn btn-primary" onClick={() => { setEditUser({}); setModal("edit"); }}>
          <Icon d={Icons.plus} size={14} /> Add User
        </button>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div className="user-avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ color: "var(--text2)" }}>{u.email}</td>
                <td>
                  <span className="badge" style={{ background: ROLE_COLORS[u.role] + "22", color: ROLE_COLORS[u.role], border: `1px solid ${ROLE_COLORS[u.role]}44`, textTransform: "capitalize" }}>
                    {u.role}
                  </span>
                </td>
                <td style={{ fontSize: 12, color: "var(--text3)" }}>{formatDate(u.created_at)}</td>
                <td>
                  <button className="btn btn-secondary btn-sm" onClick={() => { setEditUser(u); setModal("edit"); }}><Icon d={Icons.edit} size={12} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modal === "edit" && (
        <Modal title={editUser?.id ? "Edit User" : "Add User"} onClose={() => setModal(null)}
          footer={<>
            <button className="btn btn-secondary" onClick={() => setModal(null)}>Cancel</button>
            <button className="btn btn-primary" onClick={() => handleSave(editUser)}>Save</button>
          </>}>
          <div className="modal-grid">
            <div className="form-group"><label className="form-label">Name</label><input className="form-input" value={editUser?.name || ""} onChange={e => setEditUser(p => ({ ...p, name: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" value={editUser?.email || ""} onChange={e => setEditUser(p => ({ ...p, email: e.target.value }))} /></div>
            <div className="form-group"><label className="form-label">Role</label>
              <select className="form-input" value={editUser?.role || "viewer"} onChange={e => setEditUser(p => ({ ...p, role: e.target.value }))}>
                {["admin", "manager", "viewer"].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="••••••••" /></div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ============================================================
// RECYCLE BIN
// ============================================================
function RecycleBinPage({ deletedOrders, setDeletedOrders, setOrders, deletedListings, setDeletedListings, setListings, deletedInventory, setDeletedInventory, setInventory, deletedReturns, setDeletedReturns, setReturns }) {
  const [tab, setTab] = useState("orders");

  const allDeleted = {
    orders: deletedOrders,
    listings: deletedListings,
    inventory: deletedInventory,
    returns: deletedReturns,
  };

  const restoreFns = {
    orders: (item) => { setOrders(p => [...p, item]); setDeletedOrders(p => p.filter(i => i.id !== item.id)); },
    listings: (item) => { setListings(p => [...p, item]); setDeletedListings(p => p.filter(i => i.id !== item.id)); },
    inventory: (item) => { setInventory(p => [...p, item]); setDeletedInventory(p => p.filter(i => i.sku !== item.sku)); },
    returns: (item) => { setReturns(p => [...p, item]); setDeletedReturns(p => p.filter(i => i.id !== item.id)); },
  };

  const deleteFns = {
    orders: (item) => setDeletedOrders(p => p.filter(i => i.id !== item.id)),
    listings: (item) => setDeletedListings(p => p.filter(i => i.id !== item.id)),
    inventory: (item) => setDeletedInventory(p => p.filter(i => i.sku !== item.sku)),
    returns: (item) => setDeletedReturns(p => p.filter(i => i.id !== item.id)),
  };

  const current = allDeleted[tab];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Recycle Bin</div><div className="page-subtitle">Soft-deleted items — restore or permanently delete</div></div>
      </div>
      <div className="tabs" style={{ marginBottom: 16, display: "inline-flex" }}>
        {["orders", "listings", "inventory", "returns"].map(t => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {allDeleted[t].length > 0 && <span className="nav-badge" style={{ position: "static" }}>{allDeleted[t].length}</span>}
          </div>
        ))}
      </div>

      <div className="table-card">
        {current.length === 0 ? (
          <div className="empty-state">
            <Icon d={Icons.bin} size={40} />
            <p>No deleted {tab}</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID / SKU</th><th>Name / Title</th><th>Deleted At</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {current.map((item, idx) => (
                <tr key={idx} className="deleted-row">
                  <td className="td-mono">{item.id || item.sku || item.order_id}</td>
                  <td>{item.product_name || item.title || item.buyer_name || item.reason || "—"}</td>
                  <td style={{ fontSize: 12, color: "var(--text3)" }}>{item.deleted_at ? new Date(item.deleted_at).toLocaleString() : "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-success btn-sm" onClick={() => restoreFns[tab](item)}>
                        <Icon d={Icons.restore} size={12} /> Restore
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteFns[tab](item)}>
                        <Icon d={Icons.trash} size={12} /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// ============================================================
// GOOGLE DRIVE PAGE
// ============================================================
function DrivePage() {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("");

  const handleConnect = () => {
    setStatus("Connecting to Google Drive...");
    setTimeout(() => {
      setConnected(true);
      setStatus("✓ Connected to Google Drive");
    }, 1500);
  };

  const actions = [
    { icon: Icons.export, label: "Export Orders Report", desc: "Export all orders as CSV to Drive", color: "#4f8ef7" },
    { icon: Icons.export, label: "Export Inventory Report", desc: "Backup inventory data to Drive", color: "#22c55e" },
    { icon: Icons.import, label: "Upload Invoice", desc: "Upload invoice PDFs to Drive", color: "#f59e0b" },
    { icon: Icons.drive, label: "Full Database Backup", desc: "Create complete backup in Drive", color: "#7c3aed" },
  ];

  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Google Drive</div><div className="page-subtitle">Backup & file management</div></div>
      </div>

      <div className="drive-card" style={{ marginBottom: 20 }} onClick={!connected ? handleConnect : undefined}>
        <div className="drive-icon">
          <Icon d={Icons.drive} size={24} color="white" />
        </div>
        <div>
          <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 15 }}>
            {connected ? "Google Drive Connected" : "Connect Google Drive"}
          </div>
          <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 4 }}>
            {status || "Click to authenticate and connect your Google Drive account"}
          </div>
        </div>
        {!connected && (
          <button className="btn btn-primary" style={{ marginLeft: "auto" }}>Connect</button>
        )}
        {connected && (
          <span className="badge" style={{ marginLeft: "auto", background: "rgba(34,197,94,0.1)", color: "var(--green)", border: "1px solid rgba(34,197,94,0.3)" }}>
            Connected
          </span>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
        {actions.map((a, i) => (
          <div key={i} className="table-card" style={{ padding: 20, cursor: "pointer", transition: "all 0.2s" }}
            onClick={() => !connected ? alert("Please connect Google Drive first") : setStatus(`${a.label} — Done!`)}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: a.color + "22", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon d={a.icon} size={18} color={a.color} />
            </div>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: "var(--text3)" }}>{a.desc}</div>
          </div>
        ))}
      </div>

      {status && connected && (
        <div style={{ marginTop: 16, padding: "10px 16px", background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8, fontSize: 13, color: "#86efac" }}>
          {status}
        </div>
      )}
    </div>
  );
}

// ============================================================
// ACTIVITY LOGS PAGE
// ============================================================
function LogsPage({ logs }) {
  return (
    <div>
      <div className="page-header">
        <div><div className="page-title">Activity Logs</div><div className="page-subtitle">All system actions</div></div>
      </div>
      <div className="table-card">
        <table>
          <thead>
            <tr><th>User</th><th>Action</th><th>Module</th><th>Timestamp</th></tr>
          </thead>
          <tbody>
            {logs.map(l => (
              <tr key={l.id}>
                <td>User #{l.user_id}</td>
                <td>{l.action}</td>
                <td><span className="badge" style={{ background: "var(--bg4)", color: "var(--text2)", border: "1px solid var(--border2)" }}>{l.module}</span></td>
                <td style={{ fontSize: 12, color: "var(--text3)" }}>{l.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [listings, setListings] = useState(MOCK_LISTINGS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [returns, setReturns] = useState(MOCK_RETURNS);
  const [users, setUsers] = useState(MOCK_USERS);
  const [logs] = useState(MOCK_LOGS);

  const [deletedOrders, setDeletedOrders] = useState([]);
  const [deletedListings, setDeletedListings] = useState([]);
  const [deletedInventory, setDeletedInventory] = useState([]);
  const [deletedReturns, setDeletedReturns] = useState([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  const totalDeleted = deletedOrders.length + deletedListings.length + deletedInventory.length + deletedReturns.length;
  const pendingOrders = orders.filter(o => o.order_status === "Pending" || o.order_status === "Processing").length;

  const NAV = [
    { id: "dashboard", label: "Dashboard", icon: Icons.dashboard },
    { id: "orders", label: "Orders", icon: Icons.orders, badge: pendingOrders || null },
    { id: "listings", label: "Listings", icon: Icons.listings },
    { id: "inventory", label: "Inventory", icon: Icons.inventory },
    { id: "returns", label: "Returns", icon: Icons.returns },
  ];
  const NAV2 = [
    { id: "analytics", label: "Analytics", icon: Icons.analytics },
    { id: "users", label: "Users", icon: Icons.users },
    { id: "drive", label: "Google Drive", icon: Icons.drive },
    { id: "logs", label: "Activity Logs", icon: Icons.logs },
    { id: "bin", label: "Recycle Bin", icon: Icons.bin, badge: totalDeleted || null },
  ];

  const PAGE_TITLES = { dashboard: "Dashboard", orders: "Orders", listings: "Listings", inventory: "Inventory", returns: "Returns", analytics: "Analytics", users: "Users", drive: "Google Drive", logs: "Activity Logs", bin: "Recycle Bin" };

  const currentUser = users[0];

  const renderPage = () => {
    const props = { orders, setOrders, listings, setListings, inventory, setInventory, returns, setReturns, users, setUsers, logs, deletedOrders, setDeletedOrders, deletedListings, setDeletedListings, deletedInventory, setDeletedInventory, deletedReturns, setDeletedReturns, setListings, setInventory, setReturns };
    switch (page) {
      case "dashboard": return <DashboardPage orders={orders} inventory={inventory} listings={listings} />;
      case "orders": return <OrdersPage orders={orders} setOrders={setOrders} inventory={inventory} deletedOrders={deletedOrders} setDeletedOrders={setDeletedOrders} />;
      case "listings": return <ListingsPage listings={listings} setListings={setListings} inventory={inventory} deletedListings={deletedListings} setDeletedListings={setDeletedListings} />;
      case "inventory": return <InventoryPage inventory={inventory} setInventory={setInventory} deletedInventory={deletedInventory} setDeletedInventory={setDeletedInventory} />;
      case "returns": return <ReturnsPage returns={returns} setReturns={setReturns} deletedReturns={deletedReturns} setDeletedReturns={setDeletedReturns} />;
      case "users": return <UsersPage users={users} setUsers={setUsers} />;
      case "bin": return <RecycleBinPage deletedOrders={deletedOrders} setDeletedOrders={setDeletedOrders} setOrders={setOrders} deletedListings={deletedListings} setDeletedListings={setDeletedListings} setListings={setListings} deletedInventory={deletedInventory} setDeletedInventory={setDeletedInventory} setInventory={setInventory} deletedReturns={deletedReturns} setDeletedReturns={setDeletedReturns} setReturns={setReturns} />;
      case "drive": return <DrivePage />;
      case "logs": return <LogsPage logs={logs} />;
      case "analytics": return (
        <div>
          <div className="page-header"><div className="page-title">Analytics</div></div>
          <div className="stats-grid">
            {[
              { label: "Total Revenue", value: formatCurrency(orders.filter(o => o.payment_status === "Paid").reduce((s, o) => s + o.total_amount, 0)), color: "green" },
              { label: "Total Profit", value: formatCurrency(orders.reduce((s, o) => s + calcProfit(o, inventory), 0)), color: "blue" },
              { label: "Avg Order Value", value: formatCurrency(orders.length ? orders.reduce((s, o) => s + o.total_amount, 0) / orders.length : 0), color: "purple" },
              { label: "Return Rate", value: `${orders.length ? ((returns.length / orders.length) * 100).toFixed(1) : 0}%`, color: "yellow" },
            ].map(c => (
              <div key={c.label} className={`stat-card ${c.color}`}>
                <div className="stat-label">{c.label}</div>
                <div className="stat-value">{c.value}</div>
              </div>
            ))}
          </div>
          <div className="table-card" style={{ padding: 24 }}>
            <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 600, marginBottom: 16 }}>Profit by Order</div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {orders.map(o => {
                const p = calcProfit(o, inventory);
                return (
                  <div key={o.id} style={{ background: "var(--bg3)", borderRadius: 8, padding: "10px 14px", minWidth: 140, border: `1px solid ${p >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}` }}>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 4 }}>{o.order_id}</div>
                    <div style={{ fontWeight: 700, color: p >= 0 ? "var(--green)" : "var(--red)", fontSize: 16 }}>{formatCurrency(p)}</div>
                    <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>{o.sku}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        {isMobile && sidebarOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 99 }} onClick={() => setSidebarOpen(false)} />
        )}

        <nav className={`sidebar ${!sidebarOpen ? "collapsed" : ""} ${isMobile && sidebarOpen ? "mobile-open" : ""}`} style={isMobile ? { transform: sidebarOpen ? "translateX(0)" : "translateX(-240px)" } : {}}>
          <div className="sidebar-logo">
            <div className="logo-icon">SE</div>
            <div>
              <div className="logo-text">SellEasy</div>
              <div className="logo-sub">eBay • Etsy Manager</div>
            </div>
          </div>

          <div className="nav">
            <div className="nav-section">
              <div className="nav-label">Main</div>
              {NAV.map(n => (
                <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); if (isMobile) setSidebarOpen(false); }}>
                  <Icon d={n.icon} size={16} />
                  {n.label}
                  {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
                </div>
              ))}
            </div>
            <div className="nav-section">
              <div className="nav-label">Management</div>
              {NAV2.map(n => (
                <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => { setPage(n.id); if (isMobile) setSidebarOpen(false); }}>
                  <Icon d={n.icon} size={16} />
                  {n.label}
                  {n.badge ? <span className="nav-badge">{n.badge}</span> : null}
                </div>
              ))}
            </div>
          </div>

          <div className="sidebar-footer">
            <div className="user-card">
              <div className="user-avatar">{currentUser.name.split(" ").map(n => n[0]).join("").slice(0, 2)}</div>
              <div>
                <div className="user-name">{currentUser.name}</div>
                <div className="user-role">{currentUser.role}</div>
              </div>
            </div>
          </div>
        </nav>

        <main className={`main ${!sidebarOpen && !isMobile ? "expanded" : ""}`}>
          <div className="topbar">
            <button className="menu-btn" onClick={() => setSidebarOpen(p => !p)}>
              <Icon d={Icons.menu} size={20} />
            </button>
            <div className="topbar-title">{PAGE_TITLES[page]}</div>
            <div className="topbar-right">
              <div className="search-bar">
                <Icon d={Icons.search} size={14} color="var(--text3)" />
                <input placeholder="Global search..." value={globalSearch} onChange={e => setGlobalSearch(e.target.value)} />
              </div>
              <div className="icon-btn" onClick={() => setPage("bin")}>
                <Icon d={Icons.bell} size={16} />
                {(pendingOrders > 0 || inventory.some(i => (i.total_stock - i.reserved_stock) <= i.restock_level)) && <div className="notif-dot" />}
              </div>
              <div className="icon-btn" onClick={() => setPage("drive")}>
                <Icon d={Icons.drive} size={16} />
              </div>
            </div>
          </div>

          <div className="content">
            {renderPage()}
          </div>
        </main>
      </div>
    </>
  );
}
