import React from 'react';
import { Layers3, ShieldCheck, ExternalLink } from 'lucide-react';
import { sources } from '@/components/uranium/marketContent';

export default function NuclearFuelOverview({ copy }) {
  return (
    <section id="fuel-cycle" className="scroll-mt-6 space-y-6">
      <div><Layers3 className="mb-4 h-7 w-7 text-desk-gold" /><h2 className="text-2xl font-semibold">{copy.cycleTitle}</h2><p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{copy.cycleIntro}</p></div>
      <ol className="grid gap-4 md:grid-cols-4">{copy.cycle.map(([step, title, text]) => <li key={step} className="rounded-xl border border-border bg-muted/40 p-5"><span className="text-3xl font-light text-desk-gold">{step}</span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></li>)}</ol>
      <div className="grid gap-6 md:grid-cols-3">{copy.concepts.map(([title, text]) => <article key={title}><h3 className="font-semibold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article>)}</div>
      <a href={sources.cycle} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-xs text-muted-foreground underline">{copy.source}: World Nuclear Association<ExternalLink className="h-3 w-3" /></a>
      <aside className="flex gap-4 rounded-xl border border-border bg-muted/50 p-6"><ShieldCheck className="h-6 w-6 shrink-0 text-desk-navy" /><div><h3 className="font-semibold">{copy.governance}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{copy.disclaimer}</p></div></aside>
    </section>
  );
}