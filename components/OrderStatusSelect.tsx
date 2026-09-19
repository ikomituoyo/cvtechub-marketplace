'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const STATUSES = ['unpaid', 'processing', 'shipped', 'delivered'];

export default function OrderStatusSelect({ itemId, status }: { itemId: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function update(newStatus: string) {
    setBusy(true);
    await fetch(`/api/vendor/orders/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    router.refresh();
    setBusy(false);
  }

  return (
    <select
      disabled={busy}
      value={status}
      onChange={(e) => update(e.target.value)}
      className="px-3 py-2 border border-line font-mono text-xs"
    >
      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
