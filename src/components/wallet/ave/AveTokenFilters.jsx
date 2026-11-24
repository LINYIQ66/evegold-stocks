import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SORT_OPTIONS = [
  ['market_cap', '市值'], ['tx_volume_u_24h', '24h 成交额'], ['price_change_24h', '24h 涨跌幅'],
  ['main_pair_tvl', '流动性'], ['fdv', '完全稀释估值'], ['holders', '持币地址'],
];

export default function AveTokenFilters({ query, setQuery, sort, setSort, topics, topic, setTopic, searching }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={e => setQuery(e.target.value)} placeholder="搜索代币符号或合约地址，例如 PEPE" className="pl-9" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="md:w-48"><SelectValue /></SelectTrigger>
          <SelectContent>{SORT_OPTIONS.map(([v, l]) => <SelectItem key={v} value={v}>按{l}排序</SelectItem>)}</SelectContent>
        </Select>
      </div>
      <div className={`flex flex-wrap gap-2 ${searching ? 'opacity-50' : ''}`}>
        {topics.map(t => (
          <button key={t.id} type="button" disabled={searching} onClick={() => setTopic(t.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition ${topic === t.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}>
            {t.name_zh || t.name_en}
          </button>
        ))}
      </div>
      {searching && <p className="text-xs text-muted-foreground">搜索时显示全链匹配结果，清空搜索框可返回板块。</p>}
    </div>
  );
}