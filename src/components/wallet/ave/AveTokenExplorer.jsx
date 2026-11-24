import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAveTokens } from '@/functions/getAveTokens';
import AveTokenFilters from '@/components/wallet/ave/AveTokenFilters';
import AveTokenTable from '@/components/wallet/ave/AveTokenTable';

export default function AveTokenExplorer() {
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');
  const [sort, setSort] = useState('market_cap');
  const [topic, setTopic] = useState('hot');
  const [topics, setTopics] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retry, setRetry] = useState(0);

  useEffect(() => { const timer = setTimeout(() => setKeyword(query.trim()), 400); return () => clearTimeout(timer); }, [query]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    getAveTokens({ keyword, topic, sort })
      .then(res => { if (!active) return; setTokens(res.data.tokens || []); setTopics(res.data.topics || []); setError(''); })
      .catch(e => active && setError(e?.response?.data?.error || '链上代币数据暂不可用'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [keyword, topic, sort, retry]);

  return (
    <Card className="mt-8 bg-white/80 shadow-lg backdrop-blur-sm">
      <CardHeader>
        <CardTitle>链上代币行情</CardTitle>
        <p className="text-xs text-muted-foreground">数据来源 ave.ai · 覆盖多条公链，仅供查询参考，不代表平台可交易资产</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AveTokenFilters query={query} setQuery={setQuery} sort={sort} setSort={setSort} topics={topics} topic={topic} setTopic={setTopic} searching={!!keyword} />
        {loading && <p role="status" className="py-6 text-center text-sm text-muted-foreground">正在加载链上代币…</p>}
        {!loading && error && <p role="alert" className="py-6 text-center text-sm text-destructive">{error} <button type="button" className="ml-2 underline" onClick={() => setRetry(n => n + 1)}>重试</button></p>}
        {!loading && !error && !tokens.length && <p className="py-6 text-center text-sm text-muted-foreground">没有找到匹配的代币。</p>}
        {!loading && !error && tokens.length > 0 && <AveTokenTable tokens={tokens} />}
      </CardContent>
    </Card>
  );
}