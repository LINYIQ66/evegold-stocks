import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { manageListedToken } from '@/functions/manageListedToken';
import ContractInfo from '@/components/admin/listing/ContractInfo';

export default function AddTokenByContract({ onAdded }) {
  const [chain, setChain] = useState('eth');
  const [address, setAddress] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const run = async (action) => {
    setBusy(true); setError('');
    try {
      const res = await manageListedToken({ action, chain, address });
      if (action === 'check') setResult(res.data);
      else { setResult(null); setAddress(''); onAdded(); }
    } catch (e) {
      setError(e?.response?.data?.error || '操作失败');
    } finally { setBusy(false); }
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <p className="font-semibold">按合约查找代币</p>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Input className="sm:w-40" value={chain} onChange={e => setChain(e.target.value)} placeholder="链，如 eth / bsc / solana" />
        <Input className="flex-1" value={address} onChange={e => setAddress(e.target.value)} placeholder="合约地址" />
        <Button variant="outline" disabled={busy || !address.trim()} onClick={() => run('check')}>{busy ? '查询中…' : '查合约'}</Button>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {result && (
        <div className="space-y-3 rounded-lg bg-secondary p-3">
          <div className="flex items-center gap-2">
            {result.info.logo_url && <img src={result.info.logo_url} alt="" className="h-6 w-6 rounded-full" />}
            <strong>{result.info.ave_symbol}</strong><span className="text-sm text-muted-foreground">{result.info.name}</span>
          </div>
          <ContractInfo info={result.info} />
          {result.existing
            ? <p className="text-sm text-muted-foreground">该代币已在列表中（状态：{result.existing.status}）。</p>
            : <Button size="sm" disabled={busy} onClick={() => run('add')}>加入待审核列表</Button>}
        </div>
      )}
    </div>
  );
}