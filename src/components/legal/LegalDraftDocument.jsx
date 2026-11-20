import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LegalDraftDocument({ document: policy }) {
  useEffect(() => {
    const previous = document.title;
    document.title = `${policy.title} ${policy.english} | EVE METAL`;
    return () => { document.title = previous; };
  }, [policy.english]);
  return (
    <main lang="zh-CN" className="min-h-screen bg-background px-5 py-8 font-body text-foreground md:py-12">
      <article className="mx-auto max-w-3xl">
        <header className="border-b border-border pb-8">
          <Link to="/AboutUs" className="text-sm font-semibold text-desk-navy underline underline-offset-4">EVE METAL · 关于我们</Link>
          <p className="mt-7 text-sm font-semibold tracking-widest text-muted-foreground">{policy.english.toUpperCase()}</p>
          <h1 className="mt-3 text-3xl font-bold font-heading md:text-4xl">{policy.title}</h1>
          <p className="mt-5 text-sm text-muted-foreground">更新日期：2026 年 11 月 21 日</p>
        </header>
        <div className="space-y-8 py-8">
          {policy.sections.map(section => (
            <section key={section.title} className="space-y-3">
              <h2 className="text-xl font-semibold font-heading">{section.title}</h2>
              {section.paragraphs.map(text => <p key={text} className="break-words text-sm leading-7 text-muted-foreground">{text}</p>)}
              {section.links && <ul className="space-y-2">{section.links.map(link => <li key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-desk-navy underline underline-offset-4">{link.label}</a></li>)}</ul>}
            </section>
          ))}
        </div>
        <footer className="flex flex-wrap gap-5 border-t border-border pt-6 text-sm font-semibold underline underline-offset-4">
          <Link to="/Privacy">Privacy 隐私政策</Link><Link to="/Terms">Terms 网站使用条款</Link><Link to="/AboutUs#contact">一般联系栏目</Link><Link to="/Account">账户与客服入口</Link>
        </footer>
      </article>
    </main>
  );
}