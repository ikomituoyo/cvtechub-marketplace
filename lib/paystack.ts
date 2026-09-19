/** Server-side helper to verify a Paystack transaction after client-side charge. */
export async function verifyPaystackTransaction(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) throw new Error('PAYSTACK_SECRET_KEY is not set');

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Paystack verify request failed: ${res.status}`);
  const json = await res.json();
  return json as {
    status: boolean;
    data: { status: string; reference: string; amount: number; customer: { email: string } };
  };
}
