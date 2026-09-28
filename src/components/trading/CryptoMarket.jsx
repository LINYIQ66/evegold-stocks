import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useIndicativePrices from '@/components/quotes/useIndicativePrices';

export default function CryptoMarket({ coins, loading, onSelect }) {
  const top = coins.filter(coin => coin.rank <= 20 && coin.symbol !== 'USDT');
  const base = useMemo(() => Object.fromEntries(coins.map(coin => [coin.symbol, coin.price])), [coins]);
  const indicative = useIndicativePrices(base);
  return (
    <Card className="mb-8 bg-card border-0 shadow-lg">
      <CardHeader><CardTitle>加密货币 · 市值前 20</CardTitle></CardHeader>
      <CardContent>
        {loading ? <p className="text-sm text-muted-foreground">正在加载加密货币报价…</p> :
          !top.length ? <p className="text-sm text-muted-foreground">暂时无法获取加密货币实时价格，交易已暂停。</p> :
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {top.map(coin => <button key={coin.symbol} type="button" onClick={() => onSelect(`CRYPTO_${coin.symbol}`)} className="text-left rounded-lg border p-3 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <div className="flex justify-between gap-2"><strong className="text-sm">{coin.symbol}</strong><span className="text-xs text-muted-foreground">#{coin.rank}</span></div>
              <p className="text-xs text-muted-foreground truncate">{coin.name} · {coin.source || 'CoinMarketCap'}</p>
              <div className="mt-2 flex items-center justify-between gap-2 text-sm"><span>${(indicative[coin.symbol] ?? coin.price) < 1 ? (indicative[coin.symbol] ?? coin.price).toFixed(6) : (indicative[coin.symbol] ?? coin.price).toLocaleString('en-US', { maximumFractionDigits: 2 })}</span><span className={coin.change >= 0 ? 'text-green-600' : 'text-red-600'}>{coin.change >= 0 ? '+' : ''}{coin.change.toFixed(2)}%</span></div>
            </button>)}
          </div>}
        <p className="mt-3 text-xs text-muted-foreground">优先使用 OKX 现货美元报价；没有美元交易对时按 USDT／美元价格折算。OKX 报价不可用时使用 CoinMarketCap。USDT 已列于货币兑换；API 基准价每 30 秒刷新；展示价每 1–2 秒围绕基准价随机波动 ±0.05%–0.1%，仅供参考，交易按提交时服务端报价结算。</p>
      </CardContent>
    </Card>
  );
}