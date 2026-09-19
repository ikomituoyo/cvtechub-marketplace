import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const DB_FILE = process.env.DATABASE_FILE || './data/cvtechub.db';
const dir = path.dirname(DB_FILE);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

declare global {
  // eslint-disable-next-line no-var
  var __cvtechubDb: DatabaseSync | undefined;
}

function createConnection() {
  const conn = new DatabaseSync(DB_FILE);
  conn.exec('PRAGMA journal_mode = WAL');
  conn.exec('PRAGMA foreign_keys = ON');
  conn.exec('PRAGMA busy_timeout = 5000');
  return conn;
}

export const db = global.__cvtechubDb || createConnection();
if (process.env.NODE_ENV !== 'production') global.__cvtechubDb = db;

// Next.js imports every route/page module during `next build` to collect page
// data. That happens across several parallel worker processes, each of which
// would otherwise try to create tables and seed data in the same fresh SQLite
// file at once — and lose the race with a "database is locked" error. Table
// creation and seeding should only ever happen when the app actually runs.
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';


function init() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('buyer','vendor','admin')) DEFAULT 'buyer',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS stores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      vendor_user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      location TEXT DEFAULT '',
      verified INTEGER NOT NULL DEFAULT 0,
      logo_emoji TEXT DEFAULT '🛍️',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      store_id INTEGER NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
      category_id INTEGER REFERENCES categories(id),
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT DEFAULT '',
      price_kobo INTEGER NOT NULL,
      condition TEXT NOT NULL DEFAULT 'brand_new',
      image_url TEXT DEFAULT '',
      stock_qty INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','draft')),
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS carts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cart_id INTEGER NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity INTEGER NOT NULL DEFAULT 1,
      UNIQUE(cart_id, product_id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES users(id),
      total_kobo INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','paid','failed')),
      paystack_reference TEXT UNIQUE,
      shipping_name TEXT,
      shipping_phone TEXT,
      shipping_address TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id INTEGER NOT NULL REFERENCES products(id),
      store_id INTEGER NOT NULL REFERENCES stores(id),
      name_snapshot TEXT NOT NULL,
      price_kobo_snapshot INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      fulfillment_status TEXT NOT NULL DEFAULT 'unpaid' CHECK(fulfillment_status IN ('unpaid','processing','shipped','delivered'))
    );
  `);
}
if (!isBuildPhase) init();

function seed() {
  const userCount = (db.prepare('SELECT COUNT(*) as c FROM users').get() as any).c;
  if (userCount > 0) return; // already seeded

  const insertUser = db.prepare(
    `INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)`
  );
  const hash = (pw: string) => bcrypt.hashSync(pw, 10);

  const buyerId = insertUser.run('Amaka Buyer', 'buyer@example.com', hash('password123'), 'buyer').lastInsertRowid as number;
  const vendor1Id = insertUser.run('Tunde Electronics', 'vendor1@example.com', hash('password123'), 'vendor').lastInsertRowid as number;
  const vendor2Id = insertUser.run('Chioma Gadgets', 'vendor2@example.com', hash('password123'), 'vendor').lastInsertRowid as number;
  insertUser.run('CVTECHUB Admin', 'admin@example.com', hash('password123'), 'admin');

  const insertStore = db.prepare(
    `INSERT INTO stores (vendor_user_id, name, slug, description, location, verified, logo_emoji) VALUES (?, ?, ?, ?, ?, ?, ?)`
  );
  const store1Id = insertStore.run(
    vendor1Id, 'Tunde Electronics', 'tunde-electronics',
    'Trusted dealer in new and UK-used phones, laptops and accessories since 2016.',
    'Otigba Street, Computer Village', 1, '📱'
  ).lastInsertRowid as number;
  const store2Id = insertStore.run(
    vendor2Id, 'Chioma Gadgets', 'chioma-gadgets',
    'Quality laptops, networking gear and computer accessories at fair prices.',
    'Ola Ayeni Street, Computer Village', 1, '💻'
  ).lastInsertRowid as number;

  const insertCat = db.prepare(`INSERT INTO categories (name, slug) VALUES (?, ?)`);
  const cats: Record<string, number> = {};
  for (const [name, slug] of [
    ['Mobile Phones', 'phones'],
    ['Laptops', 'laptops'],
    ['Tablets', 'tablets'],
    ['Accessories', 'accessories'],
    ['Networking', 'networking'],
    ['Storage', 'storage'],
  ]) {
    cats[slug] = insertCat.run(name, slug).lastInsertRowid as number;
  }

  const insertProduct = db.prepare(`
    INSERT INTO products (store_id, category_id, name, slug, description, price_kobo, condition, image_url, stock_qty, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
  `);

  const products: [number, string, string, string, string, number, string, string, number][] = [
    [store1Id, 'phones', 'iPhone 13 Pro, 256GB', 'iphone-13-pro-256gb', 'UK used, grade A. Battery health 88%+. Verified IMEI, comes with charger.', 45000000, 'uk_used', 'https://images.unsplash.com/photo-1592286927505-1def25115558?w=800&q=80&auto=format&fit=crop', 4],
    [store1Id, 'phones', 'Samsung Galaxy A54', 'samsung-galaxy-a54', 'Brand new, sealed. 128GB, dual SIM, 1 year vendor warranty.', 28000000, 'brand_new', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800&q=80&auto=format&fit=crop', 10],
    [store1Id, 'accessories', 'Fast Charger 20W USB-C', 'fast-charger-20w', 'Original-spec 20W USB-C power adapter, compatible with most phones.', 850000, 'brand_new', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80&auto=format&fit=crop', 40],
    [store1Id, 'phones', 'iPhone 11, 128GB', 'iphone-11-128gb', 'Nigerian used, very clean. Battery health 82%. No repairs.', 21000000, 'nigerian_used', 'https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80&auto=format&fit=crop', 3],
    [store2Id, 'laptops', 'Dell Latitude 7420, i7, 16GB', 'dell-latitude-7420-i7-16gb', 'UK used business laptop. 16GB RAM, 512GB SSD, backlit keyboard.', 52000000, 'uk_used', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80&auto=format&fit=crop', 5],
    [store2Id, 'laptops', 'HP Pavilion 15, Ryzen 5', 'hp-pavilion-15-ryzen-5', 'Brand new. 8GB RAM, 512GB SSD, full HD display.', 38500000, 'brand_new', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80&auto=format&fit=crop', 7],
    [store2Id, 'networking', 'TP-Link Archer AX10 Router', 'tp-link-archer-ax10', 'Wi-Fi 6 dual-band router, easy setup, great for small offices.', 4200000, 'brand_new', 'https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800&q=80&auto=format&fit=crop', 15],
    [store2Id, 'storage', '1TB External SSD', '1tb-external-ssd', 'USB-C portable SSD, transfer speeds up to 1050MB/s.', 6800000, 'brand_new', 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&q=80&auto=format&fit=crop', 12],
    [store2Id, 'tablets', 'iPad 9th Gen, 64GB Wi-Fi', 'ipad-9th-gen-64gb', 'UK used, screen and body in excellent condition.', 24500000, 'uk_used', 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80&auto=format&fit=crop', 6],
  ];
  for (const p of products) {
    const [storeId, catSlug, name, slug, desc, price, condition, img, stock] = p;
    insertProduct.run(storeId, cats[catSlug], name, slug, desc, price, condition, img, stock);
  }

  const cart = db.prepare(`INSERT INTO carts (user_id) VALUES (?)`);
  cart.run(buyerId);
}
if (!isBuildPhase) {
  try {
    seed();
  } catch (err) {
    // Another process seeded it concurrently, or the DB was briefly locked — either
    // way, safe to move on; the next request will find data already there.
    console.warn('Seed skipped:', (err as Error).message);
  }
}

export function getOrCreateCart(userId: number): number {
  const row = db.prepare('SELECT id FROM carts WHERE user_id = ?').get(userId) as any;
  if (row) return row.id;
  const res = db.prepare('INSERT INTO carts (user_id) VALUES (?)').run(userId);
  return res.lastInsertRowid as number;
}
