import Image from 'next/image';
import Link from 'next/link';
import { EyebrowTag, HeroFigure, Sequence, Split } from '@/components/marketing';

export const metadata = { title: 'Sell on CVTECHUB' };

export default function SellPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <EyebrowTag color="#1C8FC2">Vendors</EyebrowTag>
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
            Take your technology business digital.
          </h1>
          <p className="text-inktext/70 max-w-lg mb-6">
            A verified storefront, live product listings, order management and buyer messaging &mdash; all
            live today. Create your account and your store is set up in the same step.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?role=vendor" className="btn-brand">Become a CVTECHUB vendor</Link>
            <Link href="/login" className="btn-outline-ink">Already a vendor? Log in</Link>
          </div>
        </div>
        <HeroFigure tag="Verified vendor">
          <div className="relative h-[340px]">
            <Image src="https://images.unsplash.com/photo-1687293233211-6b0cc3beba70?w=1200&q=80&auto=format&fit=crop" alt="A vendor standing at her shop counter" fill className="object-cover" />
          </div>
        </HeroFigure>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-display font-semibold mb-6">Everything a storefront needs</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-linedark p-6">
              <h4 className="font-semibold mb-2">List and sell</h4>
              <p className="text-sm text-paper/70">Create a storefront, upload products, and receive orders directly — no approval wait.</p>
            </div>
            <div className="border border-linedark p-6">
              <h4 className="font-semibold mb-2">Manage every order</h4>
              <p className="text-sm text-paper/70">A dashboard for tracking paid orders and updating fulfillment status, item by item.</p>
            </div>
            <div className="border border-linedark p-6">
              <h4 className="font-semibold mb-2">Get paid securely</h4>
              <p className="text-sm text-paper/70">Checkout runs on Paystack, so buyers pay with confidence and you get a clean record of every sale.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold mb-2">Getting your verified badge</h2>
        <Sequence
          steps={[
            { title: 'Register', body: 'Business name, owner details and contact information — takes under a minute.' },
            { title: 'Your store goes live', body: 'A storefront is created automatically, ready for your first listing.' },
            { title: 'List your products', body: 'Add photos, price, condition and stock from your vendor dashboard.' },
            { title: 'Fulfil orders', body: 'Paid orders appear in your dashboard, split correctly if a buyer orders from multiple vendors.' },
            { title: 'Build your rating', body: 'Reviews and fulfillment history build your store\u2019s standing over time.' },
          ]}
        />
      </section>

      <section className="bg-paper2">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Split>
            <div>
              <EyebrowTag>CVDA / community</EyebrowTag>
              <h2 className="text-2xl font-display font-semibold mb-3">Connect. Belong. Grow.</h2>
              <p className="text-inktext/80">
                CVDA is the digital infrastructure for a connected technology-business community &mdash; a
                verified digital identity, marketplace tools and a place in the wider Computer Village
                ecosystem.
              </p>
            </div>
            <div className="relative border border-line p-2">
              <div className="relative h-[280px]">
                <Image src="https://images.unsplash.com/photo-1633431302384-94c9ea026f9d?w=1200&q=80&auto=format&fit=crop" alt="Business professionals collaborating around a table" fill className="object-cover" />
              </div>
            </div>
          </Split>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-16 text-center">
        <h2 className="text-2xl font-display font-semibold mb-6">Ready to go digital?</h2>
        <Link href="/register?role=vendor" className="btn-brand">Become a CVTECHUB vendor</Link>
      </section>
    </div>
  );
}
