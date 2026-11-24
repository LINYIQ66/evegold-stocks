import React, { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Atom } from 'lucide-react';
import { getAlpacaPrices } from '@/functions/getAlpacaPrices';
import { URANIUM_ASSETS } from '@/components/usstocks/uranium/uraniumAssets';

export default function UraniumTradables({ onSelect, onPrices }) {
  const [quotes, setQuotes] = useState({});
  const [loading, setLoading] = useState(true);
  const onPricesRef = useRef(onPrices);
  onPricesRef.current = onPrices;

  useEffect(() => {
    let active = true;
    const load = () => getAlpacaPrices({ symbols: URANIUM_ASSETS.map(a => a.symbol).join(',') })
      .then(res => {
        if (!active) return;
        const prices = res?.data?.prices || {};
        const named = Object.fromEntries(URANIUM_ASSETS.filter(a => prices[a.symbol]).map(a => [a.symbol, { ...prices[a.symbol], name: a.name }]));
        setQuotes(named);
        if (Object.keys(named).length) onPricesRef.current(named);
      })
      .catch(() => {})
      .finally(() => active && setLoading(false));
    load();
    const timer = setInterval(load, 60000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const select = symbol => {
    onSelect(symbol);
    document.getElementById('stock-trade')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-lg font-semibold text-foreground">可买卖的全球铀基金与股票</h3>
        <p className="text-xs text-muted-foreground">{loading ? '正在加载行情…' : '最近成交价仅供参考 · 实际成交以交易确认为准'}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {URANIUM_ASSETS.map(asset => {
          const q = quotes[asset.symbol];
          return (
            <article key={asset.symbol} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-sm">
              <div className="flex items-center justify-between"><Atom className="h-5 w-5 text-desk-gold" /><span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">{asset.category}</span></div>
              <div><h4 className="text-lg font-bold">{asset.symbol}</h4><p className="truncate text-xs text-muted-foreground" title={asset.name}>{asset.name}</p><p className="mt-1 text-xs text-muted-foreground">{asset.exchange} · {asset.sector}</p></div>
              <div className="mt-auto border-t border-border pt-3">
                <p className="text-lg font-bold">{q?.price ? `$${q.price.toFixed(2)}` : '暂无报价'}</p>
                {q?.price > 0 && <p className={`text-xs ${(q.change || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>{(q.change || 0) >= 0 ? '+' : ''}{(q.change || 0).toFixed(2)}%</p>}
                <button type="button" disabled={!q?.price} onClick={() => select(asset.symbol)} className="mt-2 inline-flex w-full items-center justify-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">买卖 <ArrowUpRight className="h-4 w-4" /></button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}