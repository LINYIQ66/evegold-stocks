import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import useUraniumPrices from '@/components/uranium/useUraniumPrices';
import UraniumQuoteCards from '@/components/uranium/UraniumQuoteCards';
import UraniumPriceChart from '@/components/uranium/UraniumPriceChart';
import { priceCopy } from '@/components/uranium/priceCopy';

export default function UraniumMarketPrices({ language }) {
  const { data, isLoading, isError, refetch } = useUraniumPrices();
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const copy = priceCopy[language];
  const years = [...new Set(['2024', '2025', '2026', ...Object.keys(data?.spot?.by_year || {}), ...Object.keys(data?.futures?.by_year || {})])].sort();
  return (
    <section className="space-y-6" aria-label={copy.title}>
      <div><h2 className="text-2xl font-semibold">{copy.title}</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{copy.schedule}</p></div>
      {isLoading ? <p className="flex items-center gap-2 text-sm"><Loader2 className="h-4 w-4 animate-spin" />{copy.loading}</p> : isError ? <div role="alert" className="text-sm text-destructive">{copy.loadError}<button onClick={() => refetch()} className="ml-3 underline">{copy.retry}</button></div> : !data ? <p className="rounded-xl bg-muted p-5 text-sm">{copy.pending}</p> : <>
        <UraniumQuoteCards data={data} copy={copy} language={language} />
        <label className="flex items-center gap-3 text-sm font-medium">{copy.year}<select value={year} onChange={event => setYear(event.target.value)} className="rounded-lg border border-input bg-background px-4 py-2 text-foreground">{years.map(value => <option key={value} value={value}>{value}</option>)}</select></label>
        <div className="grid gap-5 lg:grid-cols-2"><UraniumPriceChart points={data.spot?.by_year?.[year] || []} title={`${year} · ${copy.spotChart}`} copy={copy} /><UraniumPriceChart points={data.futures?.by_year?.[year] || []} title={`${year} · ${copy.futuresChart}`} copy={copy} /></div>
        <p className="rounded-xl bg-muted p-4 text-xs leading-relaxed text-muted-foreground">{copy.futuresHistory}</p>
      </>}
      <p className="text-xs leading-relaxed text-muted-foreground">{copy.disclaimer}</p>
    </section>
  );
}