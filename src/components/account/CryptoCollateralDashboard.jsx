import React, { useEffect, useState } from 'react';
import { Loan } from '@/entities/all';
import { getCryptoPrices } from '@/functions/getCryptoPrices';
import { getMetalPrices } from '@/functions/getMetalPrices';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CryptoLoanCard from '@/components/account/CryptoLoanCard';

export default function CryptoCollateralDashboard({ user }) {
  const [data, setData] = useState({ loans: [], prices: {}, loading: true, error: '' });
  useEffect(() => {
    if (!user?.email) return;
    let active = true;
    async function load() {
      try {
        const [loans, crypto, metal] = await Promise.all([
          Loan.filter({ created_by: user.email, status: 'active' }, '-created_date'),
          getCryptoPrices({}),
          getMetalPrices().catch(() => null),
        ]);
        if (active) setData({ loans: loans.filter(loan => ['BTC', 'ETH'].includes(String(loan.collateral_asset || '').toUpperCase().replace(/^CRYPTO_/, ''))), prices: { usd: 1, ...(metal?.data?.success ? metal.data.prices : {}), ...crypto.data.prices }, loading: false, error: '' });
      } catch (error) {
        if (active) setData(previous => ({ ...previous, prices: {}, loading: false, error: '无法获取最新贷款或市场报价，请稍后重试。' }));
      }
    }
    load();
    const interval = setInterval(load, 30000);
    return () => { active = false; clearInterval(interval); };
  }, [user?.email]);
  return (
    <Card className="bg-card shadow-sm">
      <CardHeader><CardTitle>BTC / ETH 质押贷款看板</CardTitle></CardHeader>
      <CardContent className="space-y-5">
        {data.loading ? <p role="status" className="text-sm text-muted-foreground">正在读取贷款与市场报价…</p> : data.error ? <p role="alert" className="text-sm text-destructive">{data.error}</p> : ['BTC', 'ETH'].map(symbol => {
          const loans = data.loans.filter(loan => String(loan.collateral_asset).toUpperCase().replace(/^CRYPTO_/, '') === symbol);
          const total = loans.reduce((sum, loan) => sum + Number(loan.collateral_amount || 0), 0);
          return <section key={symbol} aria-label={`${symbol} 质押贷款`} className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2"><h3 className="font-semibold text-foreground">{symbol} · 已质押 {total.toLocaleString('en-US', { maximumFractionDigits: 8 })} {symbol}</h3><span className="text-sm text-muted-foreground">{loans.length} 笔活跃贷款</span></div>
            {loans.length ? loans.map(loan => <CryptoLoanCard key={loan.id} loan={loan} symbol={symbol} prices={data.prices} />) : <p className="text-sm text-muted-foreground">暂无 {symbol} 质押贷款。</p>}
          </section>;
        })}
      </CardContent>
    </Card>
  );
}