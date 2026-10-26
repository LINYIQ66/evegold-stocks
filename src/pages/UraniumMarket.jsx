import React from 'react';
import { ArrowDown, Atom } from 'lucide-react';
import DeskShell from '@/components/uranium/DeskShell';
import UraniumPriceHistory from '@/components/uranium/UraniumPriceHistory';
import UraniumResearch from '@/components/uranium/UraniumResearch';
import NuclearFuelOverview from '@/components/uranium/NuclearFuelOverview';
import useDeskLanguage from '@/components/uranium/useDeskLanguage';
import { marketContent } from '@/components/uranium/marketContent';

export default function UraniumMarket() {
  const [language, setLanguage] = useDeskLanguage();
  const copy = marketContent[language];
  return (
    <DeskShell language={language} setLanguage={setLanguage}>
      <section className="bg-desk-navy px-5 py-14 text-desk-silver md:px-10 md:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-semibold tracking-widest text-desk-gold">{copy.eyebrow}</p>
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-3"><div className="lg:col-span-2"><h1 className="text-4xl font-semibold leading-tight md:text-6xl">{copy.title}</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-desk-silver/80">{copy.intro}</p></div><div className="hidden justify-center lg:flex"><div className="flex h-48 w-48 flex-col items-center justify-center rounded-full border border-desk-gold/40"><Atom className="h-16 w-16 text-desk-gold" /><span className="mt-4 text-2xl font-light tracking-widest">U₃O₈</span></div></div></div>
          <div className="mt-8 flex flex-wrap gap-4"><a href="#market-research" className="inline-flex items-center gap-2 rounded-lg bg-desk-gold px-5 py-3 text-sm font-semibold text-desk-navy">{copy.research}<ArrowDown className="h-4 w-4" /></a><a href="#fuel-cycle" className="rounded-lg border border-desk-silver/40 px-5 py-3 text-sm font-medium">{copy.cycleLink}</a></div>
        </div>
      </section>
      <main className="mx-auto max-w-6xl space-y-14 px-5 py-12 md:px-10">
        <UraniumPriceHistory copy={copy} />
        <UraniumResearch copy={copy} />
        <NuclearFuelOverview copy={copy} />
      </main>
    </DeskShell>
  );
}