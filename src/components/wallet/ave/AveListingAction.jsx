import React from 'react';
import { Link } from 'react-router-dom';

const LABELS = { pending: '审核中', rejected: '未通过', disabled: '暂停交易' };

export default function AveListingAction({ status, busy, onRequest }) {
  if (status === 'approved') return <Link to="/Trading#crypto-swap" className="text-xs font-semibold text-primary underline">去交易</Link>;
  if (LABELS[status]) return <span className="text-xs text-muted-foreground">{LABELS[status]}</span>;
  return (
    <button type="button" disabled={busy} onClick={onRequest} className="text-xs font-semibold text-primary underline disabled:opacity-50">
      {busy ? '提交中…' : '申请上架'}
    </button>
  );
}