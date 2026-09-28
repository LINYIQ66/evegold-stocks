import React, { useEffect, useState } from 'react';
import { getTradableFunds } from '@/functions/getTradableFunds';
import { ArrowUpRight, Layers, Landmark, Gem, ChartNoAxesCombined, Grid2X2, TrendingUp } from 'lucide-react';

const icons = { SPY: Layers, QQQ: ChartNoAxesCombined, VTI: Grid2X2, IWM: TrendingUp, TLT: Landmark, GLD: Gem };
export default function TradableFunds({ onSelect, onPrices }) {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const result = await getTradableFunds({});
        if (!active) return;
        const items = result?.data?.funds || [];
        setFunds(items); setError('');
        const quotes = Object.fromEntries(items.filter(item => item.price > 0).map(item => [item.symbol, { price: item.price, change: item.change ?? 0, name: item.name, volume: item.volume }]));
        onPrices(quotes);
      } catch (e) { if (active) setError(e?.response?.data?.error || '基金行情暂不可用'); }
      finally { if (active) setLoading(false); }
    };
    load();
    const timer = setInterval(load, 30000);
    return () => { active = false; clearInterval(timer); };
  }, [refresh]);
  const selectFund = symbol => {
    onSelect(symbol);
    document.getElementById('stock-trade')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <section id="funds" aria-labelledby="funds-title" className="mb-8 space-y-5">
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card min-h-48 md:min-h-56 flex items-center">
      <img src="https://media.base44.com/images/public/6886dc1b205b0d8cbd737462/05115f87c_generated_image.png" alt="以层叠资产与走势线象征多元基金组合的插画" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 max-w-lg p-6 md:p-9"><span className="text-xs font-semibold uppercase tracking-widest text-primary">ETF · 基金</span><h2 id="funds-title" className="mt-2 text-2xl md:text-3xl font-bold text-foreground">探索可交易基金</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">参考 Morningstar 的基金分类方式，从投资方向、行情与交易成本了解基金，再使用本平台现有的美股交易入口下单。</p></div>
    </div>
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-lg text-foreground">当前可交易的交易所基金</h3><p className="text-xs text-muted-foreground">最近成交价仅供参考 · 下单价以交易确认结果为准</p></div>
    {loading && <p role="status" className="rounded-xl bg-card p-6 text-muted-foreground">正在核对基金和行情…</p>}
    {!loading && error && <div role="alert" className="rounded-xl bg-card p-6 text-destructive">{error} <button type="button" className="underline ml-2" onClick={() => { setLoading(true); setRefresh(n => n + 1); }}>重试</button></div>}
    {!loading && !error && !funds.length && <p className="rounded-xl bg-card p-6 text-muted-foreground">目前暂无确认可交易的基金。</p>}
    {!loading && !error && <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{funds.map(fund => {
      const Icon = icons[fund.symbol] || Layers;
      return <article key={fund.symbol} className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3"><div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-primary"><Icon className="w-6 h-6" aria-hidden="true" /></div><span className="text-xs text-muted-foreground rounded-full bg-secondary px-3 py-1">{fund.category}</span></div>
        <div><h4 className="font-bold text-lg text-foreground">{fund.symbol}</h4><p className="text-sm text-muted-foreground line-clamp-2" title={fund.name}>{fund.name}</p><p className="text-sm text-muted-foreground mt-2">{fund.description}</p></div>
        <div className="mt-auto pt-3 border-t border-border flex items-end justify-between gap-2"><div><p className="text-xs text-muted-foreground">最近成交价 · USD</p><p className="font-bold text-xl text-foreground">{fund.price > 0 ? `$${fund.price.toFixed(2)}` : '暂无报价'}</p><p className={`text-xs ${fund.change == null ? 'text-muted-foreground' : fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.change == null ? '涨跌暂无数据' : `${fund.change >= 0 ? '+' : ''}${fund.change.toFixed(2)}% 较前收盘`}</p></div><button type="button" disabled={!fund.price} onClick={() => selectFund(fund.symbol)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">查看并交易 <ArrowUpRight className="w-4 h-4" /></button></div>
      </article>;
    })}</div>}
    <p className="text-xs text-muted-foreground">ETF 在交易所按证券价格买卖，并非申购开放式共同基金；交易手续费 0.1%，市价单买卖点差各 0.3%，限价单按实际成交价执行。基金自身费用未计入平台手续费。</p>
  </section>;
}