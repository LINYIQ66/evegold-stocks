import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalDraftLinks({ language = 'zh' }) {
  const zh = language === 'zh';
  return (
    <nav aria-label={zh ? '政策草稿' : 'Policy drafts'} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <Link to="/Privacy" className="font-semibold underline underline-offset-4 hover:opacity-75">{zh ? '隐私政策 Privacy（草稿）' : 'Privacy (Draft)'}</Link>
      <Link to="/Terms" className="font-semibold underline underline-offset-4 hover:opacity-75">{zh ? '网站使用条款 Terms（草稿）' : 'Terms (Draft)'}</Link>
      <span className="text-xs">{zh ? '【待确认】非生效协议' : '[Pending confirmation] Not effective agreements'}</span>
    </nav>
  );
}