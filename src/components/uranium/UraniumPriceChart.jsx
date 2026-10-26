import React from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function UraniumPriceChart({ points, title, copy }) {
  return (
    <article className="min-w-0 rounded-2xl border border-border bg-card p-5">
      <h3 className="font-semibold">{title}</h3><p className="mt-2 text-xs text-muted-foreground">{copy.unit}</p>
      {points.length ? <div className="mt-5 h-64 text-desk-navy" role="img" aria-label={`${title}: ${points.map(p => `${p.date} $${p.price}`).join('; ')}`}>
        <ResponsiveContainer width="100%" height="100%"><LineChart data={points} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
          <CartesianGrid stroke="currentColor" opacity={0.12} strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" tickFormatter={date => date.slice(5)} tick={{ fill: 'currentColor', fontSize: 11 }} minTickGap={25} tickLine={false} axisLine={false} />
          <YAxis domain={['auto', 'auto']} tick={{ fill: 'currentColor', fontSize: 11 }} tickFormatter={value => `$${value}`} width={50} tickLine={false} axisLine={false} />
          <Tooltip content={({ active, payload, label }) => active && payload?.length ? <div className="rounded-lg border border-border bg-card p-3 text-xs text-card-foreground"><p>{label}</p><p className="mt-1 font-semibold">${Number(payload[0].value).toFixed(2)} · {copy.unit}</p></div> : null} />
          <Line type="linear" dataKey="price" stroke="currentColor" strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} connectNulls={false} />
        </LineChart></ResponsiveContainer>
      </div> : <div className="mt-5 flex h-64 items-center justify-center bg-muted/40 text-sm text-muted-foreground">{copy.empty}</div>}
    </article>
  );
}