import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function MarketAnalysisSectors({ stocks }) {
  const groups = [
    { name: '科技及人工智能', match: s => s.sector.includes('Technology') },
    { name: '通信服务', match: s => s.sector.includes('Communication') },
    { name: '消费', match: s => s.sector.includes('Consumer') },
    { name: '金融及加密金融', match: s => s.sector.includes('Financials') },
  ];
  const counts = groups.map(g => ({ name: g.name, count: stocks.filter(g.match).length }));
  return <Card className="border-0 shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">本指南精选股票的行业分布</CardTitle></CardHeader>
    <CardContent className="space-y-3">{counts.map(g => <div key={g.name}>
      <div className="flex justify-between text-xs text-slate-600 mb-1"><span>{g.name}</span><span>{g.count} / {stocks.length}</span></div>
      <div className="bg-slate-100 h-2 rounded-full"><div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${g.count / stocks.length * 100}%` }} /></div>
    </div>)}<p className="text-xs text-slate-500">按本指南展示的 {stocks.length} 只标的统计；跨行业公司可能同时计入多个类别，不代表整个美股市场。</p></CardContent>
  </Card>;
}