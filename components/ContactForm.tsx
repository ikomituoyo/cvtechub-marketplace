'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle');
  const [topic, setTopic] = useState('Customer');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);
    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        setStatus('ok');
        form.reset();
      } else {
        setStatus('err');
      }
    } catch {
      setStatus('err');
    }
  }

  const quickTopics = ['Customer support', 'Vendor onboarding', 'Report a device', 'Investor or partner', 'Press'];

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        {quickTopics.map((t) => (
          <button
            type="button"
            key={t}
            onClick={() => setTopic(t)}
            className="font-mono text-xs px-3 py-1.5 border border-line hover:border-verified hover:text-verified"
          >
            {t}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="field">
            <label>Name</label>
            <input name="name" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input name="email" type="email" required />
          </div>
        </div>
        <div className="field">
          <label>I&rsquo;m getting in touch as a&hellip;</label>
          <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option>Customer</option>
            <option>Vendor onboarding</option>
            <option>Technician / engineer</option>
            <option>Investor or partner</option>
            <option>Press</option>
            <option>Report a device</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label>Message</label>
          <textarea name="message" required rows={5} />
        </div>
        <button type="submit" disabled={status === 'sending'} className="btn-primary disabled:opacity-50">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'ok' && <p className="text-verified text-sm">Thanks — your message is on its way to the CVTECHUB team.</p>}
        {status === 'err' && (
          <p className="text-alert text-sm">
            Couldn&rsquo;t send that — this form needs a real Formspree ID set in ContactForm.tsx (currently a placeholder).
          </p>
        )}
        <p className="text-xs text-inktext/50">By sending this, you agree to CVTECHUB&rsquo;s privacy policy.</p>
      </form>
    </div>
  );
}
