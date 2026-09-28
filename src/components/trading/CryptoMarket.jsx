import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useIndicativePrices from '@/components/quotes/useIndicativePrices';

export default function CryptoMarket({ coins, loading, onSelect }) {
  const top = coins.filter((coin) => coin.rank <= 20 && coin.symbol !== 'USDT');
  const base = useMemo(() => Object.fromEntries(coins.map((coin) => [coin.symbol, coin.price])), [coins]);
  const indicative = useIndicativePrices(base);
  return (
    <Card className="mb-8 bg-card border-0 shadow-lg">
      <CardHeader><CardTitle>加密货币 · 市值前 20</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-sm text-muted-foreground">正在加载加密货币报价…</p> :
        !top.length ? <p className="text-sm text-muted-foreground">暂时无法获取加密货币实时价格，交易已暂停。</p> :
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {top.map((coin) => <button key={coin.symbol} type="button" onClick={() => onSelect(`CRYPTO_${coin.symbol}`)} className="text-left rounded-lg border p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex justify-between gap-2"><strong className="text-sm">{coin.symbol}</strong><span className="text-xs text-muted-foreground">#{coin.rank}</span></div>
              <p className="text-xs text-muted-foreground truncate">{coin.name} · {coin.source || 'CoinMarketCap'}</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm"><span>${(indicative[coin.symbol] ?? coin.price) < 1 ? (indicative[coin.symbol] ?? coin.price).toFixed(6) : (indicative[coin.symbol] ?? coin.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span><span className={coin.change >= 0 ? 'text-green-600' : 'text-red-600'}>{coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%</span></div>
            </button>)}
          </div>}
        
      </CardContent>
    </Card>);

}