import React from 'react';
import { Link } from 'react-router-dom';

export default function RankingNavigation() {
  return <nav aria-label="美股市场页面" className="flex flex-wrap gap-2 mb-6">
    {[['/USStocks', '交易'], ['/USStockPopular', '热门排行'], ['/USStockMovers', '涨跌榜']].map(([path, label]) => <Link key={path} to={path} className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">{label}</Link>)}
  </nav>;
}