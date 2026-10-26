import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function ComputeFuturesInfo({ copy, reference, language }) {
  return (
    <section id="compute-futures" className="scroll-mt-6 rounded-xl border border-border bg-background p-5 md:p-7">
      <h3 className="text-xl font-semibold">{copy.futures}</h3><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.futuresIntro}</p>
      <div className="mt-5 flex flex-wrap gap-3">{['H100 · GPU1', 'B200 · GPU2'].map(label => <span key={label} className="rounded-lg bg-muted px-4 py-2 text-sm font-semibold text-desk-navy">{label}</span>)}</div>
      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{copy.futuresMissing}</p><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.trading}</p>
      {reference?.checked_at && <p className="mt-4 text-xs text-muted-foreground">{copy.checked}: {new Date(reference.checked_at).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-GB', { timeZone: 'Asia/Singapore' })} (SGT)</p>}
      <a href="https://www.cmegroup.com/markets/energy/power/compute-futures.html" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-desk-navy underline">{copy.official}<ExternalLink className="h-4 w-4" /></a>
    </section>
  );
}