import React from 'react';
import { ArrowUpRight, Layers } from 'lucide-react';

export default function FundCard({ fund, onSelect }) {
  return <article className="rounded-xl border border-border bg-card p-5 shadow-sm flex flex-col gap-4">
    <div className="flex items-start justify-between gap-3">
      <div className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-primary"><Layers className="w-6 h-6" aria-hidden="true" /></div>
      <div className="flex flex-wrap justify-end gap-1"><span className="text-xs text-muted-foreground rounded-full bg-secondary px-3 py-1">{fund.category}</span>{fund.sector && <span className="text-xs text-muted-foreground rounded-full bg-secondary px-3 py-1">{fund.sector}</span>}</div>
    </div>
    <div><h4 className="font-bold text-lg text-foreground">{fund.symbol}</h4><p className="text-sm text-muted-foreground" title={fund.name}>{fund.name}</p><p className="text-xs text-muted-foreground mt-2">{fund.exchange} · 交易所交易基金</p></div>
    <div className="mt-auto pt-3 border-t border-border flex items-end justify-between gap-2">
      <div><p className="text-xs text-muted-foreground">最近成交价 · USD</p><p className="font-bold text-xl text-foreground">{fund.price > 0 ? `$${fund.price < 1 ? fund.price.toFixed(4) : fund.price.toFixed(2)}` : '暂无报价'}</p><p className={`text-xs ${fund.change == null ? 'text-muted-foreground' : fund.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fund.change == null ? '涨跌暂无数据' : `${fund.change >= 0 ? '+' : ''}${fund.change.toFixed(2)}% 较前收盘`}</p></div>
      <button type="button" disabled={!fund.price} onClick={() => onSelect(fund.symbol)} className="inline-flex items-center gap-1 rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">{fund.price ? '查看并交易' : '暂无行情'} <ArrowUpRight className="w-4 h-4" /></button>
    </div>
  </article>;
}