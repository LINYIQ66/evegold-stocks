import React, { useEffect, useRef, useState } from 'react';
import { getTradableFunds } from '@/functions/getTradableFunds';
import FundCard from '@/components/usstocks/FundCard';
import FundFilters from '@/components/usstocks/FundFilters';
export default function TradableFunds({ onSelect, onPrices }) {
  const [funds, setFunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [sector, setSector] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [refresh, setRefresh] = useState(0);
  const onPricesRef = useRef(onPrices);
  onPricesRef.current = onPrices;
  useEffect(() => { const timer = setTimeout(() => { setPage(1); setSearch(query); }, 350); return () => clearTimeout(timer); }, [query]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    const load = async () => {
      try {
        const result = await getTradableFunds({ query: search, category, sector, page });
        if (!active) return;
        const items = result?.data?.funds || [];
        setFunds(items); setTotal(result?.data?.total || 0); setError('');
        const quotes = Object.fromEntries(items.filter(item => item.price > 0).map(item => [item.symbol, { price: item.price, change: item.change ?? 0, name: item.name }]));
        if (Object.keys(quotes).length) onPricesRef.current(quotes);
      } catch (e) { if (active) setError(e?.response?.data?.error || '基金目录暂不可用'); }
      finally { if (active) setLoading(false); }
    };
    load();
    return () => { active = false; };
  }, [search, category, sector, page, refresh]);
  useEffect(() => { const timer = setInterval(() => setRefresh(n => n + 1), 60000); return () => clearInterval(timer); }, []);
  const selectFund = symbol => {
    onSelect(symbol);
    document.getElementById('stock-trade')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <section id="funds" aria-labelledby="funds-title" className="mt-8 mb-8 space-y-5">
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card min-h-48 md:min-h-56 flex items-center">
      <img src="https://media.base44.com/images/public/6886dc1b205b0d8cbd737462/05115f87c_generated_image.png" alt="层叠资产与走势线插画" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative z-10 max-w-lg p-6 md:p-9"><span className="text-xs font-semibold uppercase tracking-widest text-primary">ETF · 基金</span><h2 id="funds-title" className="mt-2 text-2xl md:text-3xl font-bold text-foreground">探索可交易基金</h2><p className="mt-3 text-sm leading-relaxed text-muted-foreground">按基金类型与行业主题查找交易所基金，使用现有钱包余额买卖。</p></div>
    </div>
    <FundFilters query={query} setQuery={setQuery} category={category} setCategory={value => { setPage(1); setCategory(value); }} sector={sector} setSector={value => { setPage(1); setSector(value); }} categories={['货币市场基金', '债券基金', '股票基金', '指数基金', '对冲基金', '混合基金', '其他基金']} sectors={['AI行业', '医疗', '科技', '能源', '金融', '房地产', '黄金']} />
    <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-lg text-foreground">可交易的交易所基金 <span className="text-sm font-normal text-muted-foreground">{total} 只</span></h3><p className="text-xs text-muted-foreground">最近成交价仅供参考 · 实际成交以交易确认为准</p></div>
    {loading && <p role="status" className="rounded-xl bg-card p-6 text-muted-foreground">正在加载基金和行情…</p>}
    {!loading && error && <div role="alert" className="rounded-xl bg-card p-6 text-destructive">{error} <button type="button" className="underline ml-2" onClick={() => setRefresh(n => n + 1)}>重试</button></div>}
    {!loading && !error && !funds.length && <p className="rounded-xl bg-card p-6 text-muted-foreground">该分类暂无可交易的交易所基金，请尝试其他分类或关键词。</p>}
    {!loading && !error && <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">{funds.map(fund => <FundCard key={fund.symbol} fund={fund} onSelect={selectFund} />)}</div>}
    {!loading && !error && total > 18 && <nav aria-label="基金分页" className="flex items-center justify-center gap-3"><button type="button" disabled={page === 1} onClick={() => setPage(p => p - 1)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm disabled:opacity-50">上一页</button><span className="text-sm text-muted-foreground">{page} / {Math.ceil(total / 18)}</span><button type="button" disabled={page >= Math.ceil(total / 18)} onClick={() => setPage(p => p + 1)} className="rounded-lg border border-border bg-card px-4 py-2 text-sm disabled:opacity-50">下一页</button></nav>}
    <p className="text-xs text-muted-foreground">仅展示接口标记可交易且名称可识别的交易所基金；分类由基金名称推断，仅供筛选，货币市场共同基金及非上市对冲基金不可在此交易。交易沿用美股钱包，手续费和点差按交易页面显示。</p>
  </section>;
}