import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { analysisCompanies } from './MarketAnalysisData';

export default function MarketAnalysisCharts() {
  const revenue = [...analysisCompanies].sort((a, b) => b.revenue - a.revenue);
  return <div className="grid md:grid-cols-2 gap-6">
    <Card className="border-0 shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">市值对比 · 2026 年 9 月 18 日快照（十亿美元，约数）</CardTitle></CardHeader>
      <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={analysisCompanies}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="symbol" tick={{fontSize:11}} /><YAxis tick={{fontSize:11}} unit="B" />
        <Tooltip formatter={v => [`$${(v / 1000).toFixed(1)}T`, '市值']} /><Bar dataKey="cap" fill="#6366f1" radius={[6,6,0,0]} />
      </BarChart></ResponsiveContainer></CardContent></Card>
    <Card className="border-0 shadow-md"><CardHeader className="pb-2"><CardTitle className="text-sm text-slate-700">最近已公布全年营收（十亿美元）</CardTitle></CardHeader>
      <CardContent><ResponsiveContainer width="100%" height={250}><BarChart data={revenue}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="symbol" tick={{fontSize:11}} /><YAxis tick={{fontSize:11}} unit="B" />
        <Tooltip formatter={(v, name, item) => [`$${v.toFixed(1)}B (${item.payload.year})`, '营收']} /><Bar dataKey="revenue" fill="#10b981" radius={[6,6,0,0]} />
      </BarChart></ResponsiveContainer><p className="text-xs text-slate-500 mt-2">各公司财年截止日不同；此图不是 2026 年 9 月单月营收。</p></CardContent></Card>
  </div>;
}