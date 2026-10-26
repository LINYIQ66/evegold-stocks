import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Info, ExternalLink } from 'lucide-react';
import { historicalPrices, sources } from '@/components/uranium/marketContent';

export default function UraniumPriceHistory({ copy }) {
  return (
    <section id="market-research" className="scroll-mt-6 grid gap-6 lg:grid-cols-3" aria-label={copy.chartTitle}>
      <div className="rounded-2xl bg-desk-navy p-7 text-desk-silver">
        <p className="text-xs font-semibold tracking-widest text-desk-gold">{copy.quoteLabel}</p>
        <h2 className="mt-8 text-lg">{copy.quoteTitle}</h2>
        <p className="mt-3 text-5xl font-semibold tabular-nums">$52.71</p>
        <p className="mt-2 text-sm text-desk-gold">{copy.unit}</p>
        <p className="mt-6 text-sm leading-relaxed text-desk-silver/80">{copy.quoteNote}</p>
        <a href={sources.prices} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex items-center gap-2 text-sm text-desk-gold underline">{copy.source}: U.S. EIA · Table 3<ExternalLink className="h-3 w-3" /></a>
      </div>
      <div className="rounded-2xl border border-border bg-card p-5 md:p-7 lg:col-span-2">
        <h2 className="text-xl font-semibold">{copy.chartTitle}</h2><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{copy.chartSub}</p>
        <div className="mt-6 h-60 text-desk-navy" role="img" aria-label={historicalPrices.map(p => `${p.year}: $${p.price.toFixed(2)}`).join('; ')}>
          <ResponsiveContainer width="100%" height="100%"><LineChart data={historicalPrices} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.12} />
            <XAxis dataKey="year" tick={{ fill: 'currentColor', fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis domain={[20, 60]} tick={{ fill: 'currentColor', fontSize: 12 }} tickFormatter={value => `$${value}`} tickLine={false} axisLine={false} width={45} />
            <Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="rounded-lg border border-border bg-card p-3 text-xs text-card-foreground shadow-sm"><p>{label}</p><p className="mt-1 font-semibold">${Number(payload[0].value).toFixed(2)} USD/lb</p></div> : null} />
            <Line type="linear" dataKey="price" stroke="currentColor" strokeWidth={3} dot={{ r: 4, fill: 'currentColor' }} isAnimationActive={false} />
          </LineChart></ResponsiveContainer>
        </div>
        <div className="mt-4 flex gap-2 rounded-lg bg-muted p-3 text-xs leading-relaxed text-muted-foreground"><Info className="h-4 w-4 shrink-0" /><p>{copy.unavailable}</p></div>
        <p className="mt-3 text-xs text-muted-foreground">{copy.snapshot}</p>
      </div>
    </section>
  );
}