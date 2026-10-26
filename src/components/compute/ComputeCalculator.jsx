import React, { useState } from 'react';
import { gpuModels } from '@/components/compute/computeCatalog';
import { Input } from '@/components/ui/input';

export default function ComputeCalculator({ quotes, copy, model, onModelChange }) {
  const [tier, setTier] = useState('secure_hourly');
  const [usage, setUsage] = useState({ count: '8', hours: '24', days: '30', months: '3' });
  const quote = quotes.find(item => item.model === model);
  const rate = quote?.[tier];
  const valid = [['count', 100000], ['hours', 24], ['days', 31], ['months', 60]].every(([key, max]) => Number.isInteger(Number(usage[key])) && Number(usage[key]) >= 1 && Number(usage[key]) <= max);
  const hourly = rate * Number(usage.count);
  const monthly = hourly * Number(usage.hours) * Number(usage.days);
  const money = value => valid && Number.isFinite(value) ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(value) : '—';
  const selectClass = 'h-10 w-full rounded-md border border-input bg-background px-3 text-sm';
  return (
    <section id="compute-calculator" className="scroll-mt-6 rounded-xl border border-border bg-background p-5 md:p-7">
      <h3 className="text-xl font-semibold">{copy.calculator}</h3>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <label className="space-y-2 text-sm"><span className="block font-medium">{copy.model}</span><select className={selectClass} value={model} onChange={event => onModelChange(event.target.value)}>{gpuModels.map(item => <option key={item}>{item}</option>)}</select></label>
        <label className="space-y-2 text-sm"><span className="block font-medium">{copy.provider} · Runpod</span><select className={selectClass} value={tier} onChange={event => setTier(event.target.value)}><option value="secure_hourly">{copy.secure}</option><option value="community_hourly">{copy.community}</option></select></label>
        {[['count', copy.count, 100000], ['hours', copy.hours, 24], ['days', copy.days, 31], ['months', copy.months, 60]].map(([key, label, max]) => <label key={key} className="space-y-2 text-sm"><span className="block font-medium">{label}</span><Input type="number" min={1} max={max} step={1} value={usage[key]} onChange={event => setUsage(previous => ({ ...previous, [key]: event.target.value }))} /></label>)}
      </div>
      {Number.isFinite(rate) ? <div className="mt-6 grid gap-4 md:grid-cols-3">{[[copy.hourly, hourly], [copy.monthly, monthly], [copy.budget, monthly * Number(usage.months)]].map(([label, value]) => <div key={label} className="rounded-lg bg-muted p-5"><p className="text-xs text-muted-foreground">{label} · USD</p><p className="mt-3 break-words text-2xl font-semibold tabular-nums text-desk-navy">{money(value)}</p></div>)}</div> : <p className="mt-5 text-sm text-muted-foreground">{copy.noRate}</p>}
      {quote && <p className="mt-4 text-xs text-muted-foreground">{model} · {rate?.toFixed(2)} USD / GPU·h · {copy.sourceDate}: {quote.source_date}</p>}
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.calcNote}</p>
    </section>
  );
}