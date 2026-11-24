import React from 'react';
import { Badge } from '@/components/ui/badge';

const usd = v => {
  if (!v) return '—';
  if (v >= 1e12) return '异常值';
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
};

// Contract check summary from ave.ai (works for a fresh check result or a stored record).
export default function ContractInfo({ info }) {
  const flags = [
    info.is_honeypot && { label: '疑似貔貅盘', tone: 'destructive' },
    info.is_mintable && { label: '可增发', tone: 'destructive' },
    (info.buy_tax > 0 || info.sell_tax > 0) && { label: `买税 ${info.buy_tax}% / 卖税 ${info.sell_tax}%`, tone: 'destructive' },
  ].filter(Boolean);
  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {info.price !== undefined && <p>价格：<strong>${Number(info.price).toPrecision(4)}</strong></p>}
        <p>市值：<strong>{usd(info.market_cap)}</strong></p>
        <p>流动性：<strong>{usd(info.tvl)}</strong></p>
        <p>持币地址：<strong>{info.holders ? Number(info.holders).toLocaleString() : '—'}</strong></p>
        <p>ave 风险评分：<strong>{info.risk_score ?? '—'}</strong></p>
        {info.pairs !== undefined && <p>交易对数：<strong>{info.pairs}</strong></p>}
        {info.checked_at && <p className="col-span-2 text-muted-foreground">检查时间：{new Date(info.checked_at).toLocaleString()}</p>}
      </div>
      <div className="flex flex-wrap gap-1">
        {flags.length ? flags.map(f => <Badge key={f.label} variant={f.tone}>{f.label}</Badge>) : <Badge variant="secondary">未发现貔貅 / 增发 / 交易税</Badge>}
      </div>
    </div>
  );
}