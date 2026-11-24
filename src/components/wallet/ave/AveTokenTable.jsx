import React from 'react';

const usd = v => {
  if (!v) return '—';
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(2)}`;
};
const price = v => !v ? '—' : v >= 1 ? `$${v.toFixed(4)}` : `$${v.toPrecision(4)}`;

export default function AveTokenTable({ tokens }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-secondary text-xs text-muted-foreground">
          <tr><th className="px-3 py-2 text-left">代币</th><th className="px-3 py-2 text-left">链</th><th className="px-3 py-2 text-right">价格</th><th className="px-3 py-2 text-right">24h</th><th className="px-3 py-2 text-right">市值</th><th className="px-3 py-2 text-right">24h 成交额</th><th className="px-3 py-2 text-right">流动性</th><th className="px-3 py-2 text-right">持币地址</th></tr>
        </thead>
        <tbody>
          {tokens.map(t => (
            <tr key={t.id} className="border-t border-border bg-card">
              <td className="px-3 py-2">
                <div className="flex items-center gap-2">
                  {t.logo ? <img src={t.logo} alt="" className="h-6 w-6 rounded-full" loading="lazy" /> : <div className="h-6 w-6 rounded-full bg-secondary" />}
                  <div className="min-w-0"><p className="font-semibold">{t.symbol}</p><p className="max-w-40 truncate text-xs text-muted-foreground" title={t.token}>{t.name}</p></div>
                </div>
              </td>
              <td className="px-3 py-2 text-xs uppercase text-muted-foreground">{t.chain}</td>
              <td className="px-3 py-2 text-right tabular-nums">{price(t.price)}</td>
              <td className={`px-3 py-2 text-right tabular-nums ${t.change24h >= 0 ? 'text-green-600' : 'text-red-600'}`}>{t.change24h >= 0 ? '+' : ''}{t.change24h.toFixed(2)}%</td>
              <td className="px-3 py-2 text-right tabular-nums">{usd(t.market_cap)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{usd(t.tx_volume_u_24h)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{usd(t.main_pair_tvl)}</td>
              <td className="px-3 py-2 text-right tabular-nums">{t.holders ? t.holders.toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}