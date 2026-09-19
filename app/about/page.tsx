export const dynamic = 'force-dynamic';

import Image from 'next/image';
import Link from 'next/link';
import { db } from '@/lib/db';
import { EyebrowTag, Split, HeroFigure, Sequence } from '@/components/marketing';

export const metadata = { title: 'About & Investors — CVTECHUB' };

export default function AboutPage() {
  const storeCount = (db.prepare('SELECT COUNT(*) c FROM stores').get() as any).c;
  const productCount = (db.prepare("SELECT COUNT(*) c FROM products WHERE status='active'").get() as any).c;

  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <EyebrowTag>About &amp; investors</EyebrowTag>
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
            The trusted infrastructure for Africa&rsquo;s largest tech market.
          </h1>
          <p className="text-inktext/70 max-w-lg mb-6">
            CVTECHUB is a trusted digital marketplace and technology services ecosystem, powered by
            Veridon&rsquo;s AI-driven intelligence, verification and trust infrastructure. Right now it&rsquo;s
            running with {storeCount} verified stores and {productCount} live products &mdash; browse them at{' '}
            <Link href="/products" className="underline font-semibold">/products</Link>.
          </p>
          <Link href="/contact" className="btn-primary">Investment &amp; partnership inquiries</Link>
        </div>
        <HeroFigure tag="Lagos, Nigeria">
          <div className="relative h-[340px]">
            <Image src="https://images.unsplash.com/photo-1728597476224-1843cf5384f2?w=1200&q=80&auto=format&fit=crop" alt="Cityscape of Victoria Island, Lagos, Nigeria" fill className="object-cover" />
          </div>
        </HeroFigure>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-5">
          <p className="text-lg text-paper/85">
            Nigeria&rsquo;s technology trade already moves through one place more than any other: a dense,
            unplanned market of thousands of independent vendors, spread across seven streets in Lagos,
            doing several billion naira in business a day.
          </p>
          <p className="text-lg text-paper/85">
            Almost none of it is verified. A used phone&rsquo;s history is a guess. A vendor&rsquo;s reliability is
            word of mouth. A repair technician&rsquo;s credentials are whatever they tell you. The trade works
            &mdash; it has for two decades &mdash; but it works despite the absence of trust infrastructure, not
            because of it.
          </p>
          <p className="text-lg text-paper/85">
            CVTECHUB is built to close that gap: a digital marketplace and services ecosystem layered
            directly onto the existing trade, where verification, transaction intelligence and customer
            protection are part of the buying experience itself &mdash; not an afterthought bolted on top.
          </p>
          <p className="text-lg font-semibold">The layer that makes this possible is Veridon.</p>
        </div>
      </section>

      <section id="veridon" className="max-w-6xl mx-auto px-6 py-16">
        <Split reverse>
          <div>
            <EyebrowTag>Veridon</EyebrowTag>
            <h2 className="text-2xl font-display font-semibold mb-3">
              The intelligence and trust layer behind CVTECHUB.
            </h2>
            <p className="text-inktext/80">
              Veridon supplies the AI-driven product intelligence, verification, risk assessment, fraud
              detection, TrustID, recommendations and automation that CVTECHUB runs on. CVTECHUB owns the
              marketplace and ecosystem experience; Veridon supplies the layer that makes it trustworthy
              at scale.
            </p>
          </div>
          <div className="relative border border-line p-2">
            <div className="relative h-[280px]">
              <Image src="https://images.unsplash.com/photo-1675602488453-c3897a475af5?w=1200&q=80&auto=format&fit=crop" alt="Macro photograph of a circuit board" fill className="object-cover" />
            </div>
          </div>
        </Split>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-display font-semibold mb-6">One ecosystem, several interlocking parts</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              ['Marketplace', 'Multi-vendor commerce for phones, computers, electronics and accessories — live now.'],
              ['Service marketplace', 'Verified repairers, engineers and technical specialists, on request.'],
              ['Verification & TrustID', 'Product, vendor and transaction-level trust, sourced and disclosed honestly.'],
              ['CVDA', 'A digital community and association layer for the wider ecosystem.'],
              ['CVT Wallet', 'A future-ready wallet and account layer for eligible users and SMEs.'],
              ['Veridon intelligence', 'The AI layer underneath all of the above.'],
            ].map(([t, d]) => (
              <div key={t} className="border border-linedark p-6">
                <h4 className="font-semibold mb-2">{t}</h4>
                <p className="text-sm text-paper/70">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold mb-6">Where this goes next</h2>
        <Sequence
          steps={[
            { title: 'Now — the foundation', body: 'A responsive marketplace and vendor dashboard, verification badges, Paystack-backed payments — live across Nigeria.' },
            { title: 'Next — deeper trust and intelligence', body: 'Authorized verification APIs, an AI shopping assistant, advanced fraud detection, CVDA membership and the CVT Wallet.' },
            { title: 'Later — ecosystem scale', body: 'Broader provenance and warranty coverage, financing partnerships, mobile apps, and expansion into other African markets.' },
          ]}
        />
      </section>

      <section className="bg-paper2">
        <div className="max-w-3xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl font-display font-semibold mb-3">Building the trust layer for Africa&rsquo;s technology trade.</h2>
          <p className="text-inktext/70 mb-6">For investment, partnership or enterprise inquiries, reach the CVTECHUB and Veridon team directly.</p>
          <Link href="/contact" className="btn-primary">Get in touch</Link>
        </div>
      </section>
    </div>
  );
}
