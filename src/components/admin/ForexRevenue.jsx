import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ForexRevenue({ entries = [], total = 0 }) {
  const byAsset = entries.reduce((totals, entry) => {
    totals[entry.to_asset] = (totals[entry.to_asset] || 0) + entry.fee_to_amount;
    return totals;
  }, {});
  return (
    <Card className="border-border bg-card">
      <CardHeader><CardTitle>外汇手续费收入 · ${total.toFixed(2)} USD</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">仅统计选定期间内已完成兑换的实际手续费；为手续费收入，不代表扣除奖励与运营成本后的净利润。</p>
        {entries.length === 0 ? <p className="text-sm text-muted-foreground">此期间暂无已完成的外汇手续费记录。</p> : (
          <>
            <div className="flex flex-wrap gap-2 text-sm">{Object.entries(byAsset).map(([asset, amount]) => <span className="rounded-md bg-secondary px-3 py-2" key={asset}>{asset} +{amount.toFixed(8)}</span>)}</div>
            <div className="max-h-72 overflow-auto border-t border-border pt-3">
              {entries.map(entry => <div key={entry.id} className="flex flex-wrap justify-between gap-2 border-b border-border py-2 text-sm">
                <div><p>{new Date(entry.created_date).toLocaleString('zh-CN', { timeZone: 'Asia/Singapore' })} · {entry.from_asset} → {entry.to_asset}</p><p className="text-xs text-muted-foreground">扣除 {entry.from_amount.toFixed(8)} {entry.from_asset} · 费用前 {entry.gross_to_amount.toFixed(8)} · 客户到账 {entry.net_to_amount.toFixed(8)} {entry.to_asset}</p></div>
                <span className="font-medium">平台入账 +{entry.fee_to_amount.toFixed(8)} {entry.to_asset} · ${entry.fee_usd.toFixed(4)}</span>
              </div>)}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}