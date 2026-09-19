import Link from 'next/link';
import ContactForm from '@/components/ContactForm';
import { EyebrowTag, Ledger, LedgerRow } from '@/components/marketing';

export const metadata = { title: 'Contact — CVTECHUB' };

export default function ContactPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-4">
        <EyebrowTag>Help &amp; support</EyebrowTag>
        <h1 className="text-4xl font-display font-medium max-w-lg mb-3">Talk to the CVTECHUB team.</h1>
        <p className="text-inktext/70 max-w-lg">Customers, vendors, technicians, investors and partners &mdash; one form reaches the right people.</p>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-start">
        <div>
          <h3 className="font-display font-semibold text-lg mb-4">Before you write in</h3>
          <Ledger>
            <LedgerRow title="Order or service issue">
              Log in and check <Link href="/orders" className="underline font-semibold">My orders</Link> first — most questions are answered there.
            </LedgerRow>
            <LedgerRow title="Report a stolen or lost device">Use the form and mark the topic as &ldquo;Report a device.&rdquo;</LedgerRow>
            <LedgerRow title="Vendor or technician onboarding">
              You can also just <Link href="/register?role=vendor" className="underline font-semibold">create a vendor account</Link> directly.
            </LedgerRow>
            <LedgerRow title="Investment or partnership">Select &ldquo;Investor or partner&rdquo; &mdash; this goes straight to the founding team.</LedgerRow>
          </Ledger>
        </div>
        <div className="panel bg-white">
          <ContactForm />
        </div>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <h2 className="text-2xl font-display font-semibold mb-6">Prefer to browse first?</h2>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/products" className="btn-outline">Marketplace</Link>
            <Link href="/services" className="btn-outline">Services</Link>
            <Link href="/sell" className="btn-outline">Become a vendor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
