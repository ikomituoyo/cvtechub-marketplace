import Image from 'next/image';
import Link from 'next/link';
import { EyebrowTag, HeroFigure, Ledger, LedgerRow, Chip, Disclosure } from '@/components/marketing';

export const metadata = { title: 'Verify / TrustID — CVTECHUB' };

export default function VerifyPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <EyebrowTag>Verify / TrustID</EyebrowTag>
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
            Know what you&rsquo;re buying before you buy it.
          </h1>
          <p className="text-inktext/70 max-w-lg mb-6">
            TrustID is a trust certificate attached to a product, vendor, service provider or transaction
            &mdash; showing what&rsquo;s been checked, and by whom. Every vendor on the live marketplace already
            carries a verified badge, checked at registration.
          </p>
          <Link href="/products" className="btn-primary">See it in the marketplace</Link>
        </div>
        <HeroFigure tag="TrustID · sample">
          <div className="relative h-[340px]">
            <Image src="https://images.unsplash.com/photo-1675602488453-c3897a475af5?w=1200&q=80&auto=format&fit=crop" alt="Macro photograph of a circuit board" fill className="object-cover" />
          </div>
        </HeroFigure>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-display font-semibold mb-6">What TrustID can show</h2>
          <Ledger>
            <LedgerRow title="Device and model information">What the device is, and how its details compare to what&rsquo;s listed.</LedgerRow>
            <LedgerRow title="Authenticity evidence">Signals that support whether a device or product is genuine.</LedgerRow>
            <LedgerRow title="IMEI verification, where an authorized source permits it">Checked against legitimate data sources, never an independently owned database.</LedgerRow>
            <LedgerRow title="Reported, stolen or blacklisted status, where legally accessible">Surfaced from authorized sources — never claimed beyond what&rsquo;s actually known.</LedgerRow>
            <LedgerRow title="Seller, purchase and warranty history">Where available, so a decision doesn&rsquo;t rest on the listing photo alone.</LedgerRow>
          </Ledger>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold mb-2">Device status, at a glance</h2>
        <p className="text-inktext/70 mb-6">A consistent legend across every listing and report.</p>
        <div className="flex flex-wrap gap-3">
          <Chip dot="verified">Verified</Chip>
          <Chip dot="alert">Stolen</Chip>
          <Chip dot="alert">Lost</Chip>
          <Chip dot="alert">Blacklisted</Chip>
          <Chip dot="muted">Disputed</Chip>
          <Chip dot="muted">Unknown</Chip>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <Disclosure title="Scope of verification">
          CVTECHUB is not built to replace the Nigerian Communications Commission&rsquo;s national Device
          Management System, and does not own or claim unrestricted access to a national IMEI database.
          Every verification result identifies its source and method, using authorized APIs, manufacturer
          information and permitted evidence &mdash; nothing more than that.
        </Disclosure>
      </section>

      <section className="bg-paper2">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-display font-semibold mb-6">See verification on a real listing.</h2>
          <Link href="/products" className="btn-primary">Browse the marketplace</Link>
        </div>
      </section>
    </div>
  );
}
