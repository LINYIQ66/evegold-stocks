import React from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

export default function GpuMarketplace({ query, copy, language, onChoose }) {
  const data = query.data;
  const quotes = data?.quotes || [];
  const stale = data?.spot_checked_at && Date.now() - new Date(data.spot_checked_at).getTime() > 7 * 86400000;
  const money = value => Number.isFinite(value) ? `$${value.toFixed(2)}` : '—';
  return (
    <section id="gpu-marketplace" className="scroll-mt-6 rounded-xl border border-border bg-background p-5 md:p-7">
      <h3 className="text-xl font-semibold">{copy.marketplace}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.priceNote}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy.weekly}</p>
      {data?.spot_checked_at && <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground"><span>{copy.sourceDate}: {data.source_date}</span><span>{copy.checked}: {new Date(data.spot_checked_at).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-GB', { timeZone: 'Asia/Singapore' })} (SGT)</span></div>}
      {data?.prices_error && <p role="status" className="mt-3 text-xs text-destructive">{copy.priceFailed}</p>}{stale && <p role="status" className="mt-3 text-xs text-destructive">{copy.stale}</p>}
      {query.isLoading ? <p className="mt-6 flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</p> : query.isError ? <div className="mt-5 text-sm"><p role="alert">{copy.loadError}</p><button className="mt-2 underline" onClick={() => query.refetch()}>{copy.retry}</button></div> : !quotes.length ? <p className="mt-6 text-sm text-muted-foreground">{copy.pending}</p> : <div className="mt-6 overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b border-border text-xs text-muted-foreground"><tr>{[copy.model, copy.memory, copy.community, copy.secure, copy.region, copy.quantity, ''].map((label, index) => <th key={index} className="whitespace-nowrap px-3 py-3 font-medium">{label}</th>)}</tr></thead><tbody>{quotes.map(quote => <tr key={quote.model} className="border-b border-border last:border-0"><td className="whitespace-nowrap px-3 py-4 font-semibold">NVIDIA {quote.model}<span className="mt-1 block text-xs font-normal text-muted-foreground">{quote.provider}</span></td><td className="px-3 py-4">{quote.memory_gb} GB</td><td className="px-3 py-4 tabular-nums">{money(quote.community_hourly)}</td><td className="px-3 py-4 font-semibold tabular-nums text-desk-navy">{money(quote.secure_hourly)}</td><td className="px-3 py-4 text-xs text-muted-foreground">{copy.confirm}</td><td className="px-3 py-4 text-xs text-muted-foreground">{copy.notPublished}</td><td className="px-3 py-4"><button onClick={() => onChoose(quote.model)} className="whitespace-nowrap rounded-lg border border-border px-3 py-2 text-xs font-medium">{copy.enquire}</button></td></tr>)}</tbody></table></div>}
      <a href="https://www.runpod.io/pricing" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-desk-navy underline">Runpod · {copy.source}<ExternalLink className="h-3 w-3" /></a>
    </section>
  );
}