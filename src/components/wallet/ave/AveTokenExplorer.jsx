import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAveTokens } from '@/functions/getAveTokens';
import AveTokenFilters from '@/components/wallet/ave/AveTokenFilters';
import AveTokenTable from '@/components/wallet/ave/AveTokenTable';
import { base44 } from '@/api/base44Client';
import { requestTokenListing } from '@/functions/requestTokenListing';

const PIX_ID = '0xab787774bdf01fc22410165ffabf76e0e0ebc94f-polygon';

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

  const [listed, setListed] = useState({});
  const [requesting, setRequesting] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    base44.entities.ListedToken.list('-created_date', 500)
      .then(res => setListed(Object.fromEntries((Array.isArray(res) ? res : res.items || []).map(r => [r.token_id, r.status]))));
  }, []);

  const tokenKey = t => `${/^0x[0-9a-fA-F]{40}$/.test(t.token) ? t.token.toLowerCase() : t.token}-${t.chain}`;
  const listingStatus = t => (tokenKey(t) === PIX_ID ? 'approved' : listed[tokenKey(t)]);

  const requestListing = async (t) => {
    setRequesting(t.id); setNotice('');
    try {
      const res = await requestTokenListing({ chain: t.chain, address: t.token });
      setListed(m => ({ ...m, [res.data.record.token_id]: res.data.record.status }));
      setNotice(`已提交 ${t.symbol} 的上架申请，管理员审核通过后即可交易。`);
    } catch (e) {
      setNotice(e?.response?.data?.error || '提交失败，请稍后重试');
    } finally { setRequesting(''); }
  };

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
        <p className="text-xs text-muted-foreground">数据来源 ave.ai · 覆盖多条公链，仅供查询参考。代币需经管理员审核合约后才可交易，余额统一记入钱包</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <AveTokenFilters query={query} setQuery={setQuery} sort={sort} setSort={setSort} topics={topics} topic={topic} setTopic={setTopic} searching={!!keyword} />
        {loading && <p role="status" className="py-6 text-center text-sm text-muted-foreground">正在加载链上代币…</p>}
        {!loading && error && <p role="alert" className="py-6 text-center text-sm text-destructive">{error} <button type="button" className="ml-2 underline" onClick={() => setRetry(n => n + 1)}>重试</button></p>}
        {!loading && !error && !tokens.length && <p className="py-6 text-center text-sm text-muted-foreground">没有找到匹配的代币。</p>}
        {notice && <p role="status" className="text-sm text-primary">{notice}</p>}
        {!loading && !error && tokens.length > 0 && <AveTokenTable tokens={tokens} listingStatus={listingStatus} requesting={requesting} onRequest={requestListing} />}
      </CardContent>
    </Card>
  );
}