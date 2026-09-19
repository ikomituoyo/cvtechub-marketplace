export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession, getStoreForVendor } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import StoreForm from '@/components/StoreForm';

export default async function VendorHomePage() {
  const session = (await getSession())!;
  const store = getStoreForVendor(session.id);

  if (!store) {
    return (
      <div className="max-w-md mx-auto px-6 py-16">
        <h1 className="text-2xl font-display font-medium mb-2">Set up your store</h1>
        <p className="text-inktext/70 mb-6 text-sm">You need a store before you can list products.</p>
        <StoreForm />
      </div>
    );
  }

  const productCount = (db.prepare('SELECT COUNT(*) c FROM products WHERE store_id = ?').get(store.id) as any).c;
  const orderItems = db.prepare(`
    SELECT oi.*, o.status as order_status, o.created_at FROM order_items oi
    JOIN orders o ON o.id = oi.order_id WHERE oi.store_id = ? AND o.status = 'paid'
  `).all(store.id) as any[];
  const revenue = orderItems.reduce((sum, i) => sum + i.price_kobo_snapshot * i.quantity, 0);
  const pendingFulfillment = orderItems.filter((i) => i.fulfillment_status !== 'delivered').length;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-display font-medium">{store.name}</h1>
          <p className="text-inktext/60 text-sm">{store.verified ? 'Verified vendor' : 'Pending verification'}</p>
        </div>
        <Link href="/vendor/store" className="btn-outline-ink">Edit store</Link>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="panel bg-white">
          <p className="text-xs font-mono text-inktext/50 mb-1">Products</p>
          <p className="text-3xl font-display font-semibold">{productCount}</p>
        </div>
        <div className="panel bg-white">
          <p className="text-xs font-mono text-inktext/50 mb-1">Paid revenue</p>
          <p className="text-3xl font-display font-semibold">{formatNaira(revenue)}</p>
        </div>
        <div className="panel bg-white">
          <p className="text-xs font-mono text-inktext/50 mb-1">Awaiting fulfillment</p>
          <p className="text-3xl font-display font-semibold">{pendingFulfillment}</p>
        </div>
      </div>

      <div className="flex gap-3">
        <Link href="/vendor/products" className="btn-primary">Manage products</Link>
        <Link href="/vendor/orders" className="btn-outline-ink">View orders</Link>
      </div>
    </div>
  );
}
