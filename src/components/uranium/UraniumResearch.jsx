import React from 'react';
import { Globe2, ArrowUpRight, Zap } from 'lucide-react';
import { sources } from '@/components/uranium/marketContent';

export default function UraniumResearch({ copy }) {
  return (
    <>
      <section className="space-y-6">
        <div><p className="mb-3 text-xs font-semibold tracking-widest text-desk-navy">{copy.coverageLabel}</p><h2 className="text-2xl font-semibold">{copy.regionsTitle}</h2><p className="mt-3 text-sm text-muted-foreground">{copy.regionsSub}</p></div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{copy.regions.map(([name, focus, body]) => <article key={name} className="rounded-xl border border-border bg-card p-6"><Globe2 className="mb-5 h-6 w-6 text-desk-gold" /><h3 className="text-lg font-semibold">{name}</h3><p className="mt-1 text-xs font-semibold text-desk-navy">{focus}</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p></article>)}</div>
        <a href={sources.production} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground underline">{copy.source}: World Nuclear Association<ArrowUpRight className="h-3 w-3" /></a>
      </section>
      <section className="grid gap-8 rounded-2xl bg-desk-navy p-7 text-desk-silver md:p-10 lg:grid-cols-2">
        <div><Zap className="mb-5 h-7 w-7 text-desk-gold" /><h2 className="text-3xl font-semibold">{copy.demandTitle}</h2><p className="mt-4 text-sm text-desk-silver/70">{copy.energyLabel}</p></div>
        <ul className="space-y-4">{copy.demand.map(item => <li key={item} className="border-b border-desk-silver/20 pb-4 text-sm leading-relaxed">{item}</li>)}</ul>
      </section>
      <section><h2 className="text-2xl font-semibold">{copy.resourcesTitle}</h2><p className="mt-3 text-sm text-muted-foreground">{copy.resourcesSub}</p><div className="mt-6 grid gap-4 md:grid-cols-3">{[sources.prices, sources.production, sources.research].map((href, i) => <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between gap-4 rounded-xl border border-border p-5 text-sm font-medium hover:bg-muted">{copy.resources[i]}<ArrowUpRight className="h-4 w-4 shrink-0 text-desk-navy" /></a>)}</div></section>
    </>
  );
}