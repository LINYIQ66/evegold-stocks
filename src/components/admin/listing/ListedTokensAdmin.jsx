import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import AddTokenByContract from '@/components/admin/listing/AddTokenByContract';
import ListedTokenRow from '@/components/admin/listing/ListedTokenRow';

const FILTERS = [['pending', '待审核'], ['approved', '已上架'], ['disabled', '暂停交易'], ['rejected', '已拒绝']];

export default function ListedTokensAdmin() {
  const [status, setStatus] = useState('pending');
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    setLoading(true);
    base44.entities.ListedToken.filter({ status }, '-created_date', 200)
      .then(res => setTokens(Array.isArray(res) ? res : res.items || []))
      .finally(() => setLoading(false));
  }, [status, reload]);

  const handleChange = (record) => {
    if (record.status !== status) setTokens(list => list.filter(t => t.id !== record.id));
    else setTokens(list => list.map(t => (t.id === record.id ? record : t)));
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">链上代币上架</h2>
        <p className="text-sm text-muted-foreground">ave.ai 收录的代币需经管理员查合约并批准后，才会出现在交易页并可兑换；余额统一记入用户钱包。</p>
      </div>
      <AddTokenByContract onAdded={() => { setStatus('pending'); setReload(n => n + 1); }} />
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(([value, label]) => <Button key={value} size="sm" variant={status === value ? 'default' : 'outline'} onClick={() => setStatus(value)}>{label}</Button>)}
      </div>
      {loading ? <p role="status" className="text-sm text-muted-foreground">加载中…</p>
        : !tokens.length ? <p className="text-sm text-muted-foreground">暂无代币。</p>
        : tokens.map(t => <ListedTokenRow key={t.id} token={t} onChange={handleChange} />)}
    </div>
  );
}