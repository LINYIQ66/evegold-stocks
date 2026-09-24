import React from "react";
import { Button } from "@/components/ui/button";

const METALS = new Set(["GOLD", "SILVER", "PLATINUM", "PALLADIUM"]);

export default function OrderToolbar({ asset, balance, onAmountChange, disabled }) {
  const isMetal = METALS.has(asset);
  const amounts = isMetal ? [0.1, 0.5, 1] : [100, 500, 1000];
  const formatAmount = value => String(Math.floor((value + 1e-10) * 1e6) / 1e6);
  return <div className="rounded-lg border bg-slate-50 p-3 space-y-2" aria-label="快捷下单工具栏">
    <div className="flex items-center justify-between text-xs text-slate-600"><span className="font-semibold">快捷下单</span><span>可用 {balance.toLocaleString('en-US', { maximumFractionDigits: 6 })} {asset}</span></div>
    <div className="flex flex-wrap gap-2">
      {amounts.map(value => <Button key={value} type="button" variant="outline" size="sm" disabled={disabled || value > balance} onClick={() => onAmountChange(String(value))}>{value} {asset}</Button>)}
      {[25, 50, 75, 100].map(pct => <Button key={pct} type="button" variant="outline" size="sm" disabled={disabled || balance <= 0} onClick={() => onAmountChange(formatAmount(balance * pct / 100))}>{pct === 100 ? 'MAX' : `${pct}%`}</Button>)}
    </div>
  </div>;
}