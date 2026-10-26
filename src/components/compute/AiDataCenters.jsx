import React from 'react';
import { ExternalLink, Server } from 'lucide-react';
import { dataCenters } from '@/components/compute/computeCatalog';

export default function AiDataCenters({ copy, language }) {
  return (
    <section id="ai-data-centers" className="scroll-mt-6">
      <h3 className="text-xl font-semibold">{copy.dataCenter}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.catalogNote}</p>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">{dataCenters.map(center => <article key={center.name} className="rounded-xl border border-border bg-background p-6"><Server className="h-6 w-6 text-desk-gold" /><h4 className="mt-4 font-semibold">{center.name}</h4><p className="mt-2 text-sm text-muted-foreground">{center.location[language]}</p><dl className="mt-5 space-y-4 text-sm">{[['power', copy.power], ['racks', copy.racks], ['network', copy.network]].map(([key, label]) => <div key={key}><dt className="text-xs font-medium text-muted-foreground">{label}</dt><dd className="mt-1 leading-relaxed">{center[key][language]}</dd></div>)}<div><dt className="text-xs font-medium text-muted-foreground">{copy.available}</dt><dd className="mt-1">{copy.notPublished}</dd></div></dl><a href={center.source} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-desk-navy underline">{copy.source}<ExternalLink className="h-3 w-3" /></a></article>)}</div>
    </section>
  );
}