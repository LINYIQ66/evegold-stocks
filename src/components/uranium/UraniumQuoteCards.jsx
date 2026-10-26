import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function UraniumQuoteCards({ data, copy, language }) {
  const formatDate = value => value ? new Date(value).toLocaleString(language === 'zh' ? 'zh-CN' : 'en-GB', { timeZone: 'Asia/Singapore', hour12: false }) : copy.noCheck;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {['spot', 'futures'].map(kind => {
        const series = data[kind];
        const stale = series?.last_checked_at && Date.now() - Date.parse(series.last_checked_at) > 8 * 86400000;
        return <article key={kind} className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-lg font-semibold text-desk-navy">{copy[kind]}</h3>
          <p className="mt-4 text-4xl font-semibold tabular-nums">{series?.latest ? `$${Number(series.latest.price).toFixed(2)}` : copy.missing}</p>
          <p className="mt-2 text-xs text-muted-foreground">{copy.unit}</p>
          <p className="mt-4 text-sm">{copy.date}: {series?.latest?.date || '—'}</p>
          <p className="mt-2 text-xs text-muted-foreground">{copy.checked}: {formatDate(series?.last_checked_at)}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy[`${kind}Note`]}</p>
          {series?.error && <p role="status" className="mt-3 text-xs text-destructive">{copy.error}</p>}
          {stale && <p role="status" className="mt-3 text-xs text-destructive">{copy.stale}</p>}
          {series?.source_url && <a href={series.source_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs text-desk-navy underline">{copy.source} · {series.source_name}<ExternalLink className="h-3 w-3" /></a>}
        </article>;
      })}
    </div>
  );
}