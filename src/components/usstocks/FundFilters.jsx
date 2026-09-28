import React from 'react';
import { Search } from 'lucide-react';

export default function FundFilters({ query, setQuery, category, setCategory, sector, setSector, categories, sectors }) {
  return <div className="space-y-3 rounded-xl bg-card p-4 border border-border">
    <label className="relative block"><Search className="w-4 h-4 absolute top-3 left-3 text-muted-foreground" aria-hidden="true" /><span className="sr-only">搜索基金代码或名称</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索基金代码或名称" className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-2 text-sm text-foreground" /></label>
    <div className="flex flex-wrap gap-2" aria-label="基金类型">
      {[['', '全部基金'], ...categories.map(c => [c, c])].map(([value, label]) => <button type="button" key={label} onClick={() => setCategory(value)} aria-pressed={category === value} className={`rounded-full px-3 py-1.5 text-xs border ${category === value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border'}`}>{label}</button>)}
    </div>
    <div className="flex flex-wrap gap-2" aria-label="行业主题">
      {[['', '全部主题'], ...sectors.map(s => [s, s])].map(([value, label]) => <button type="button" key={label} onClick={() => setSector(value)} aria-pressed={sector === value} className={`rounded-full px-3 py-1.5 text-xs border ${sector === value ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-muted-foreground border-border'}`}>{label}</button>)}
    </div>
  </div>;
}