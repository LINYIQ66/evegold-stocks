import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function CryptoLoanCard({ loan, symbol, prices }) {
  const quantity = Number(loan.collateral_amount);
  const price = Number(prices[`crypto_${symbol.toLowerCase()}`]);
  const loanAsset = String(loan.loan_asset || '').toLowerCase();
  const debtPrice = loanAsset === 'usd' ? 1 : Number(prices[loanAsset]);
  const threshold = Number(loan.liquidation_threshold) > 0 ? Number(loan.liquidation_threshold) : 85;
  const ready = quantity > 0 && price > 0 && debtPrice > 0 && Number(loan.loan_amount) > 0;
  const ltv = ready ? Number(loan.loan_amount) * debtPrice / (quantity * price) * 100 : null;
  const gap = ltv === null ? null : threshold - ltv;
  const drop = ltv === null ? null : Math.max(0, (1 - ltv / threshold) * 100);
  const risk = gap !== null && gap <= 0 ? 'danger' : gap !== null && gap <= 10 ? 'warning' : 'safe';
  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-semibold text-foreground">质押 {quantity.toLocaleString('en-US', { maximumFractionDigits: 8 })} {symbol}</span>
          <span className="text-sm text-muted-foreground">借款 {Number(loan.loan_amount).toLocaleString('en-US', { maximumFractionDigits: 2 })} {loan.loan_asset}</span>
        </div>
        {ltv === null ? <p role="status" className="text-sm text-muted-foreground">报价暂不可用，无法计算质押率和平仓风险。</p> : (
          <div className="grid gap-2 sm:grid-cols-3 text-sm">
            <p>当前质押率 <strong className="block text-lg">{ltv.toFixed(2)}%</strong></p>
            <p>平仓线 <strong className="block text-lg">{threshold.toFixed(1)}%</strong></p>
            <p>距离平仓线 <strong className="block text-lg">{gap <= 0 ? `已超出 ${Math.abs(gap).toFixed(2)} 个百分点` : `${gap.toFixed(2)} 个百分点`}</strong></p>
          </div>
        )}
        {ltv !== null && <p role={risk === 'safe' ? undefined : 'alert'} className={risk === 'danger' ? 'rounded-md bg-destructive/10 p-3 text-sm text-destructive' : risk === 'warning' ? 'rounded-md bg-accent p-3 text-sm text-foreground' : 'text-sm text-muted-foreground'}>
          {risk === 'danger' ? '已达到或超过平仓线，请尽快检查并处理贷款。' : risk === 'warning' ? `接近平仓线：质押资产价格再下跌约 ${drop.toFixed(2)}% 即触及阈值。` : `当前距离平仓线对应的价格跌幅约 ${drop.toFixed(2)}%。`}
        </p>}
      </CardContent>
    </Card>
  );
}