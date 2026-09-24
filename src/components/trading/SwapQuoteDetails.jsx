import React from "react";

export default function SwapQuoteDetails({ calculation, fromAsset, toAsset, quote, quoteUnavailable }) {
  const fromPrice = quote?.prices?.[fromAsset.toLowerCase()];
  const toPrice = quote?.prices?.[toAsset.toLowerCase()];
  const rate = fromPrice > 0 && toPrice > 0 ? fromPrice / toPrice : null;
  const small = ['LAK', 'VND', 'IDR'].includes(fromAsset);
  const stamp = quote?.forexUpdatedAt;
  const time = stamp && !Number.isNaN(Date.parse(stamp)) ? new Date(stamp).toLocaleString('zh-CN', { timeZone: 'Asia/Singapore', hour12: false }) : null;
  const updatedToday = time && new Date(stamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' }) === new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' });
  return <div className="rounded-lg border bg-slate-50 p-4 space-y-3" aria-live="polite">
    <div className="flex flex-wrap justify-between gap-1 text-sm"><span className="text-slate-600">参考汇率（费用前）</span><span className="font-semibold text-slate-900">{rate && !quoteUnavailable ? `${small ? 1000 : 1} ${fromAsset} = ${(rate * (small ? 1000 : 1)).toLocaleString('en-US', { maximumFractionDigits: 8 })} ${toAsset}` : '报价暂不可用'}</span></div>
    <p className="text-xs text-slate-500">{quoteUnavailable ? '当前无法取得有效报价，请稍后重试。' : time ? `外汇来源：${updatedToday ? '今日已更新' : '最近更新'} ${time}（新加坡时间）；页面每 30 秒刷新报价。` : '页面每 30 秒刷新报价；外汇更新时刻未提供。'}</p>
    <div className="flex justify-between gap-2 text-sm"><span className="text-slate-600">手续费 ({((calculation?.feeRate ?? (['GOLD','SILVER','PLATINUM','PALLADIUM'].includes(fromAsset) || ['GOLD','SILVER','PLATINUM','PALLADIUM'].includes(toAsset) ? 0.005 : 0.02)) * 100).toFixed(1)}%)</span><span className="text-red-600 font-medium">{calculation ? `-${calculation.fee.toFixed(6)} ${toAsset}` : '—'}</span></div>
    <div className="flex justify-between gap-2 text-sm border-t pt-2"><span className="text-slate-600">预计到账（扣费后）</span><strong>{calculation ? `${calculation.netAmount.toFixed(6)} ${toAsset}` : '—'}</strong></div>
    <p className="text-xs text-slate-500">报价仅供参考，实际成交以提交时重新获取的汇率与费用为准。</p>
  </div>;
}