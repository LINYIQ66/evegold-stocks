import React, { useEffect, useState } from 'react';
import { getMarketRankings } from '@/functions/getMarketRankings';
import RankingRows from '@/components/usstocks/RankingRows';
import RankingNavigation from '@/components/usstocks/RankingNavigation';

const periods = [['day', '每日'], ['week', '每周'], ['month', '每月'], ['ytd', '今年以来']];
export default function StockRanking({ view }) {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError(''); setData(null);
    getMarketRankings({ view, period }).then(res => { if (active) setData(res.data); }).catch(err => { if (active) setError(err?.response?.data?.error || '行情加载失败，请稍后重试'); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [view, period, refresh]);
  return <main className="min-h-screen bg-slate-50 p-4 md:p-8"><div className="mx-auto max-w-6xl">
    <RankingNavigation />
    <h1 className="text-3xl font-bold text-slate-900">{view === 'popular' ? '热门证券排行' : '美股涨跌榜'}</h1>
    <p className="mt-2 mb-5 text-sm text-slate-600">全美上市证券（含 ETF），按美东交易日收盘数据统计，不代表即时交易报价。</p>
    {view === 'movers' && <div className="flex flex-wrap gap-2 mb-5">{periods.map(([key, text]) => <button key={key} type="button" onClick={() => setPeriod(key)} aria-pressed={period === key} className={`rounded-lg px-4 py-2 text-sm ${period === key ? 'bg-primary text-primary-foreground' : 'bg-white text-slate-700 border'}`}>{text}</button>)}</div>}
    {loading ? <p role="status" className="rounded-xl bg-white p-6">正在加载市场数据…</p> : error ? <div role="alert" className="rounded-xl bg-white p-6 text-red-600">{error}<button className="ml-4 underline" onClick={() => setRefresh(n => n + 1)}>重试</button></div> : <>
      <p className="mb-4 text-sm text-slate-600">数据日期：{data.asOf}{data.baseline ? ` · 对比基准：${data.baseline}` : ''}。{view === 'popular' ? '按当日成交量 × 成交量加权均价估算成交额排序（收盘价 ≥ $1）。' : `${data.criteria}；按调整后收盘价计算。`}</p>
      {view === 'popular' ? <section className="rounded-xl bg-white shadow-sm overflow-hidden"><h2 className="p-4 font-semibold">成交额前 50</h2><RankingRows rows={data.rows} mode="popular" /></section> : <div className="grid gap-6 lg:grid-cols-2"><section className="rounded-xl bg-white shadow-sm overflow-hidden"><h2 className="p-4 font-semibold">涨幅前 30</h2><RankingRows rows={data.gainers} mode="movers" /></section><section className="rounded-xl bg-white shadow-sm overflow-hidden"><h2 className="p-4 font-semibold">跌幅前 30</h2><RankingRows rows={data.losers} mode="movers" /></section></div>}
    </>}
  </div></main>;
}