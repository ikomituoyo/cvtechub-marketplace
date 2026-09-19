import Image from 'next/image';
import Link from 'next/link';
import { EyebrowTag, HeroFigure, Sequence, Split } from '@/components/marketing';

export const metadata = { title: 'Services — CVTECHUB' };

export default function ServicesPage() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-6 pt-16 pb-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <EyebrowTag>Verified service marketplace</EyebrowTag>
          <h1 className="text-4xl md:text-5xl font-display font-medium mb-4">
            Verified technicians. Transparent quotes. No guesswork.
          </h1>
          <p className="text-inktext/70 max-w-lg mb-6">
            Describe the problem, attach photos or video, and compare quotations from verified engineers
            before you choose one. The service marketplace is part of the CVTECHUB roadmap &mdash; today,
            product listings and vendor storefronts are live at <Link href="/products" className="underline font-semibold">/products</Link>.
          </p>
          <Link href="/contact" className="btn-primary">Ask about a repair</Link>
        </div>
        <HeroFigure tag="In progress · repair">
          <div className="relative h-[340px]">
            <Image src="https://images.unsplash.com/photo-1588515603068-adb330f26e92?w=1200&q=80&auto=format&fit=crop" alt="Repair tools laid out beside a smartphone" fill className="object-cover" />
          </div>
        </HeroFigure>
      </section>

      <section className="bg-ink text-paper">
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-display font-semibold mb-6">Service categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 border border-linedark">
            {['Phone repair', 'Laptop repair', 'Computer engineering', 'TV repair', 'Home appliance engineering', 'Electronics repair', 'Network engineering', 'Other specialists'].map((c) => (
              <div key={c} className="p-4 border-r border-b border-linedark text-sm font-semibold">{c}</div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-display font-semibold mb-2">How a service request will work</h2>
        <p className="text-inktext/70 mb-6">Six steps from problem to a rated, completed job.</p>
        <Sequence
          steps={[
            { title: 'Describe the problem', body: "Pick a category and tell us what's wrong." },
            { title: 'Add photos or video', body: 'A clearer picture means a more accurate quote.' },
            { title: 'Choose location and time', body: 'Home visits are supported for many service types.' },
            { title: 'Compare quotations', body: 'Verified technicians bid on the job — you choose.' },
            { title: 'Confirm and track', body: 'Follow progress from confirmation to completion.' },
            { title: 'Rate the technician', body: 'Reviews only post once the service is complete.' },
          ]}
        />
      </section>

      <section className="bg-paper2">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <Split>
            <div>
              <EyebrowTag color="#1C8FC2">Verification</EyebrowTag>
              <h2 className="text-2xl font-display font-semibold mb-3">Who you&rsquo;re letting into your home &mdash; or your business.</h2>
              <p className="text-inktext/80">
                Engineers will be identity-checked, with professional certification verified where the
                service category requires it. In the meantime, every vendor on the live marketplace already
                carries the same verification standard &mdash; browse them at{' '}
                <Link href="/stores" className="underline font-semibold">/stores</Link>.
              </p>
            </div>
            <div className="relative border border-line p-2">
              <div className="relative h-[280px]">
                <Image src="https://images.unsplash.com/photo-1692689383052-9fbf3d1c0969?w=1200&q=80&auto=format&fit=crop" alt="A busy technology market" fill className="object-cover" />
              </div>
            </div>
          </Split>
        </div>
      </section>
    </div>
  );
}
