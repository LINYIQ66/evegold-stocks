import React from 'react';
import { Link } from 'react-router-dom';

export default function LegalDraftLinks({ language = 'zh' }) {
  const zh = language === 'zh';
  return (
    <nav aria-label={zh ? '隐私政策与网站使用条款' : 'Privacy and terms'} className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
      <Link to="/Privacy" className="font-semibold underline underline-offset-4 hover:opacity-75">{zh ? '隐私政策 Privacy' : 'Privacy'}</Link>
      <Link to="/Terms" className="font-semibold underline underline-offset-4 hover:opacity-75">{zh ? '网站使用条款 Terms' : 'Terms'}</Link>
    </nav>
  );
}