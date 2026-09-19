export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { formatNaira } from '@/lib/format';
import { notFound } from 'next/navigation';

export default async function CheckoutSuccessPage({ searchParams }: { searchParams: { order?: string } }) {
  const session = (await getSession())!;
  const orderId = Number(searchParams.order);
  const order = db.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').get(orderId, session.id) as any;
  if (!order) notFound();

  const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id) as any[];

  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <span className="chip text-verified border-verified mb-4">Order #{order.id} &middot; {order.status}</span>
      <h1 className="text-3xl font-display font-medium mb-3">Thank you — your order is confirmed.</h1>
      <p className="text-inktext/70 mb-8">A receipt has been recorded. Vendors have been notified to prepare your items.</p>
      <div className="border border-line divide-y divide-line bg-white text-left mb-6">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between p-3 text-sm">
            <span>{i.name_snapshot} &times; {i.quantity}</span>
            <span className="font-mono">{formatNaira(i.price_kobo_snapshot * i.quantity)}</span>
          </div>
        ))}
      </div>
      <p className="font-display text-xl font-semibold mb-8">Total paid: {formatNaira(order.total_kobo)}</p>
      <Link href="/orders" className="btn-primary">View my orders</Link>
    </div>
  );
}
