import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getSession } from '@/lib/auth';
import { verifyPaystackTransaction } from '@/lib/paystack';

export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

  const { reference } = await req.json().catch(() => ({ reference: null }));
  if (!reference) return NextResponse.json({ error: 'Missing reference.' }, { status: 400 });

  const order = db.prepare('SELECT * FROM orders WHERE paystack_reference = ? AND user_id = ?')
    .get(reference, session.id) as any;
  if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

  if (order.status === 'paid') {
    return NextResponse.json({ ok: true, orderId: order.id, alreadyPaid: true });
  }

  try {
    const result = await verifyPaystackTransaction(reference);
    const paid = result.status && result.data.status === 'success' && result.data.amount === order.total_kobo;

    if (!paid) {
      db.prepare(`UPDATE orders SET status = 'failed' WHERE id = ?`).run(order.id);
      return NextResponse.json({ error: 'Payment could not be verified.' }, { status: 402 });
    }

    db.prepare(`UPDATE orders SET status = 'paid' WHERE id = ?`).run(order.id);
    db.prepare(`UPDATE order_items SET fulfillment_status = 'processing' WHERE order_id = ?`).run(order.id);

    // Decrement stock and clear the cart of purchased items.
    const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(order.id) as any[];
    const cartId = (db.prepare('SELECT id FROM carts WHERE user_id = ?').get(session.id) as any)?.id;
    for (const item of items) {
      db.prepare('UPDATE products SET stock_qty = MAX(0, stock_qty - ?) WHERE id = ?').run(item.quantity, item.product_id);
      if (cartId) db.prepare('DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?').run(cartId, item.product_id);
    }

    return NextResponse.json({ ok: true, orderId: order.id });
  } catch (err) {
    // In local/demo environments without a real PAYSTACK_SECRET_KEY, verification will fail here.
    return NextResponse.json(
      { error: 'Could not reach Paystack to verify this payment. Check your PAYSTACK_SECRET_KEY.' },
      { status: 502 }
    );
  }
}
