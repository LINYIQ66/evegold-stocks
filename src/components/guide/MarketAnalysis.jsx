import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MarketAnalysisCharts from './MarketAnalysisCharts';
import MarketAnalysisSectors from './MarketAnalysisSectors';
import { analysisCompanies, marketCapSource } from './MarketAnalysisData';

export default function MarketAnalysis({ stocks, onSelectStock }) {
  return <div className="space-y-6">
    <p className="text-sm text-slate-600">截至 2026 年 9 月：市值为 9 月 18 日市场快照，营收为最近公布的完整财年数据。市值随行情变化，并非实时成交数据。</p>
    <MarketAnalysisCharts />
    <MarketAnalysisSectors stocks={stocks} />
    <Card className="border-0 shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">大型科技公司对比</CardTitle></CardHeader>
      <CardContent><div className="overflow-x-auto"><table className="w-full text-xs"><thead><tr className="border-b text-slate-500">
        <th className="text-left py-2">股票</th><th className="text-right py-2">市值快照</th><th className="text-right py-2">全年营收</th><th className="text-right py-2">财年</th>
      </tr></thead><tbody>{analysisCompanies.map(c => <tr key={c.symbol} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => { const stock = stocks.find(s => s.symbol === c.symbol); if (stock) onSelectStock({ ...stock, marketCap: `约 $${(c.cap / 1000).toFixed(1)}T（2026-09-18）`, revenue: `$${c.revenue.toFixed(1)}B (${c.year})`, peRatio: '—', divYield: '—' }); }}>
        <td className="py-3 font-semibold">{c.symbol}</td><td className="text-right">约 ${(c.cap / 1000).toFixed(1)}T</td><td className="text-right">${c.revenue.toFixed(1)}B</td><td className="text-right">{c.year}</td>
      </tr>)}</tbody></table></div></CardContent></Card>
    <p className="text-xs text-slate-500">来源：<a className="underline" href={marketCapSource} target="_blank" rel="noopener noreferrer">市值快照（2026-09-18）</a>；{analysisCompanies.map((c, i) => <React.Fragment key={c.symbol}>{i > 0 ? '、' : ''}<a className="underline" href={c.source} target="_blank" rel="noopener noreferrer">{c.symbol} 财报</a></React.Fragment>)}。仅供参考，不构成投资建议。</p>
  </div>;
}