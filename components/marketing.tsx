import { ReactNode } from 'react';

export function EyebrowTag({ children, color = 'inherit' }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-block font-mono text-xs px-2.5 py-1 border mb-4" style={{ borderColor: color, color }}>
      {children}
    </span>
  );
}

export function LedgerRow({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-[2rem_1fr] gap-4 py-4 border-b border-line last:border-b-0">
      <svg viewBox="0 0 24 24" className="w-6 h-6 mt-0.5">
        <path d="M12 2 L21 6.5 V16.5 L12 22 L3 16.5 V6.5 Z" fill="none" stroke="#1C8FC2" strokeWidth="1.6" />
        <path d="M7.5 12.2 L10.5 15.5 L16.5 8.5" fill="none" stroke="#229966" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div>
        <h4 className="font-semibold text-[1.02rem] mb-1">{title}</h4>
        <p className="text-sm max-w-[56ch]">{children}</p>
      </div>
    </div>
  );
}

export function Ledger({ children }: { children: ReactNode }) {
  return <div className="border-t border-line">{children}</div>;
}

export function Sequence({ steps }: { steps: { title: string; body: string }[] }) {
  return (
    <ol className="border-t border-line">
      {steps.map((s, i) => (
        <li key={i} className="relative pl-14 pr-0 py-5 border-b border-line">
          <span className="absolute left-0 top-5 font-mono text-sm" style={{ color: '#1C8FC2' }}>
            {String(i + 1).padStart(2, '0')}
          </span>
          <h4 className="font-semibold mb-1">{s.title}</h4>
          <p className="text-sm">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function Chip({ children, dot }: { children: ReactNode; dot?: 'verified' | 'alert' | 'muted' }) {
  const dotColor = dot === 'verified' ? '#229966' : dot === 'alert' ? '#AD4430' : '#9A9284';
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 border border-line font-mono text-xs">
      {dot && <span className="w-2 h-2 rounded-full flex-none" style={{ background: dotColor }} />}
      {children}
    </span>
  );
}

export function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border p-6" style={{ borderColor: '#1C8FC2' }}>
      <EyebrowTag color="#1C8FC2">{title}</EyebrowTag>
      <p className="max-w-[70ch]">{children}</p>
    </div>
  );
}

export function HeroFigure({ tag, children }: { tag: string; children: ReactNode }) {
  return (
    <div className="relative border border-line p-2">
      <span className="absolute top-0 left-5 -translate-y-1/2 bg-ink text-paper font-mono text-xs px-2.5 py-1 border border-linedark">
        {tag}
      </span>
      {children}
    </div>
  );
}

export function Split({ reverse, children }: { reverse?: boolean; children: [ReactNode, ReactNode] }) {
  return (
    <div className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? 'md:[&>*:first-child]:order-2' : ''}`}>
      {children}
    </div>
  );
}
