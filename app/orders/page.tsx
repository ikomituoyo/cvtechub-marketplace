export const dynamic = 'force-dynamic';

import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import Link from 'next/link';

export default async function OrdersPage() {
  const session = (await getSession())!;
  const orders = db.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC').all(session.id) as any[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display font-medium mb-8">My orders</h1>
      {orders.length === 0 ? (
        <div className="panel bg-white text-center py-16">
          <p className="text-inktext/70 mb-4">No orders yet.</p>
          <Link href="/products" className="btn-primary">Browse products</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => {
            const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(o.id) as any[];
            const statusColor = o.status === 'paid' ? 'text-verified border-verified' : o.status === 'failed' ? 'text-alert border-alert' : '';
            return (
              <div key={o.id} className="panel bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">Order #{o.id}</p>
                    <p className="text-xs text-inktext/50 font-mono">{o.created_at}</p>
                  </div>
                  <span className={`chip ${statusColor}`}>{o.status}</span>
                </div>
                <div className="divide-y divide-line border-t border-line">
                  {items.map((i) => (
                    <div key={i.id} className="flex justify-between py-2 text-sm">
                      <span>{i.name_snapshot} &times; {i.quantity} <span className="text-inktext/50 font-mono">({i.fulfillment_status})</span></span>
                      <span className="font-mono">{formatNaira(i.price_kobo_snapshot * i.quantity)}</span>
                    </div>
                  ))}
                </div>
                <p className="text-right font-display font-semibold mt-3">{formatNaira(o.total_kobo)}</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
