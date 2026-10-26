import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function VisionResearchNote({ copy }) {
  return (
    <footer className="border-t border-vision-line pb-14 pt-10 md:pb-20">
      <div className="grid gap-8 lg:grid-cols-2"><div><h3 className="font-heading text-2xl font-semibold text-desk-silver">{copy.closingTitle}</h3><p className="mt-5 text-sm leading-loose text-desk-silver/75">{copy.closingText}</p></div><aside className="rounded-xl border border-vision-line bg-vision-panel/40 p-5"><h4 className="text-xs font-semibold text-desk-gold">{copy.sources}</h4><a href="https://www.iea.org/reports/energy-and-ai/executive-summary" target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-vision-glow underline underline-offset-4">{copy.sourceName}<ExternalLink className="h-3 w-3" /></a><p className="mt-3 text-xs leading-loose text-desk-silver/60">{copy.sourceNote}</p><p className="mt-3 text-xs leading-loose text-desk-silver/60">{copy.risk}</p></aside></div>
    </footer>
  );
}