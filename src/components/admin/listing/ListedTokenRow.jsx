import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { manageListedToken } from '@/functions/manageListedToken';
import ContractInfo from '@/components/admin/listing/ContractInfo';

const STATUS = { pending: ['待审核', 'outline'], approved: ['已上架', 'default'], rejected: ['已拒绝', 'destructive'], disabled: ['暂停交易', 'secondary'] };

export default function ListedTokenRow({ token, onChange }) {
  const [symbol, setSymbol] = useState(token.symbol || '');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const listed = ['approved', 'disabled'].includes(token.status);

  const run = async (action) => {
    setBusy(action); setError('');
    try {
      const res = await manageListedToken({ action, id: token.id, symbol, note });
      onChange(res.data.record);
    } catch (e) {
      setError(e?.response?.data?.error || '操作失败');
    } finally { setBusy(''); }
  };

  const [label, variant] = STATUS[token.status] || [token.status, 'outline'];
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        {token.logo_url ? <img src={token.logo_url} alt="" className="h-7 w-7 rounded-full" /> : <div className="h-7 w-7 rounded-full bg-secondary" />}
        <strong>{token.ave_symbol}</strong>
        <span className="text-sm text-muted-foreground">{token.name}</span>
        <Badge variant="outline" className="uppercase">{token.chain}</Badge>
        <Badge variant={variant}>{label}</Badge>
        {token.requested_by_id && <span className="text-xs text-muted-foreground">用户申请</span>}
      </div>
      <p className="break-all font-mono text-xs text-muted-foreground">{token.address}</p>
      <ContractInfo info={token} />
      {token.review_note && <p className="text-xs text-muted-foreground">备注：{token.review_note}</p>}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Input className="sm:w-40" value={symbol} disabled={listed && !!token.symbol} onChange={e => setSymbol(e.target.value.toUpperCase())} placeholder="交易代码" />
        <Input className="flex-1" value={note} onChange={e => setNote(e.target.value)} placeholder="审核备注（可选）" />
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" disabled={!!busy} onClick={() => run('recheck')}>{busy === 'recheck' ? '检查中…' : '重新查合约'}</Button>
        {token.status !== 'approved' && <Button size="sm" disabled={!!busy || !symbol} onClick={() => run('approve')}>{busy === 'approve' ? '处理中…' : token.status === 'disabled' ? '恢复交易' : '批准上架'}</Button>}
        {token.status === 'pending' && <Button size="sm" variant="destructive" disabled={!!busy} onClick={() => run('reject')}>拒绝</Button>}
        {token.status === 'approved' && <Button size="sm" variant="secondary" disabled={!!busy} onClick={() => run('disable')}>暂停交易</Button>}
      </div>
    </div>
  );
}