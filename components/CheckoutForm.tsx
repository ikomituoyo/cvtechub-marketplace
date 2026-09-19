'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';

declare global {
  interface Window {
    PaystackPop?: any;
  }
}

export default function CheckoutForm({ email, publicKeyMissing }: { email: string; publicKeyMissing: boolean }) {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [status, setStatus] = useState<'idle' | 'initializing' | 'paying' | 'verifying' | 'error'>('idle');
  const [error, setError] = useState('');

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setStatus('initializing');

    const initRes = await fetch('/api/checkout/init', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shippingName: name, shippingPhone: phone, shippingAddress: address }),
    });
    const initData = await initRes.json();
    if (!initRes.ok) {
      setError(initData.error || 'Could not start checkout.');
      setStatus('error');
      return;
    }

    if (!initData.publicKey || !window.PaystackPop) {
      setError(
        'Paystack is not configured yet — set NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY and PAYSTACK_SECRET_KEY in .env.local to enable live payment.'
      );
      setStatus('error');
      return;
    }

    setStatus('paying');
    const handler = window.PaystackPop.setup({
      key: initData.publicKey,
      email: initData.email,
      amount: initData.amountKobo, // Paystack expects the smallest currency unit (kobo)
      ref: initData.reference,
      currency: 'NGN',
      callback: (response: any) => {
        setStatus('verifying');
        fetch('/api/checkout/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reference: response.reference }),
        })
          .then((r) => r.json().then((data) => ({ ok: r.ok, data })))
          .then(({ ok, data }) => {
            if (ok) {
              router.push(`/checkout/success?order=${data.orderId}`);
            } else {
              setError(data.error || 'Payment verification failed.');
              setStatus('error');
            }
          });
      },
      onClose: () => setStatus('idle'),
    });
    handler.openIframe();
  }

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" strategy="afterInteractive" />
      <form onSubmit={handlePay} className="space-y-4">
        <div className="field">
          <label>Full name</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="field">
          <label>Phone number</label>
          <input required value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div className="field">
          <label>Delivery address</label>
          <textarea required value={address} onChange={(e) => setAddress(e.target.value)} rows={3} />
        </div>
        <button type="submit" disabled={status === 'initializing' || status === 'paying' || status === 'verifying'} className="btn-brand w-full justify-center disabled:opacity-50">
          {status === 'initializing' && 'Preparing order…'}
          {status === 'paying' && 'Waiting for payment…'}
          {status === 'verifying' && 'Confirming payment…'}
          {(status === 'idle' || status === 'error') && 'Pay with Paystack'}
        </button>
        {error && <p className="text-alert text-sm">{error}</p>}
        {publicKeyMissing && (
          <p className="text-xs font-mono text-inktext/50">
            Demo mode: add your Paystack keys to .env.local to process a real payment.
          </p>
        )}
      </form>
    </>
  );
}
