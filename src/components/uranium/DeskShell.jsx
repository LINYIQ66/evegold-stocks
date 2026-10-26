import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Globe2 } from 'lucide-react';

export default function DeskShell({ language, setLanguage, children }) {
  const zh = language === 'zh';
  const sections = [['about', 'About Us', '关于我们'], ['financial-markets', 'Financial Markets', '金融市场'], ['energy', 'Energy and Commodities', '能源与大宗商品'], ['venues', 'Venues', '服务渠道'], ['careers', 'Careers', '加入我们'], ['contact', 'Contact Us', '联系我们']];
  return (
    <div className="min-h-screen bg-background text-foreground" lang={zh ? 'zh-CN' : 'en'}>
      <header className="border-b border-border px-5 py-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link to="/AboutUs" className="flex items-center gap-3">
            <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0d6759fb_Screenshot2025-08-23105026.png" alt="EVE METAL" className="h-10 w-10 rounded-lg" />
            <div><p className="text-xl font-bold tracking-widest text-desk-navy">EVE METAL</p><p className="text-xs text-muted-foreground">Global Metals & Financial Markets</p></div>
          </Link>
          <div className="flex items-center gap-3 text-sm">
            <Globe2 className="h-4 w-4 text-muted-foreground" />
            <div className="flex rounded-lg border border-border p-1">
              {[['en', 'EN'], ['zh', '中文']].map(([code, label]) => <button key={code} type="button" aria-pressed={language === code} onClick={() => setLanguage(code)} className={`rounded-md px-3 py-1.5 text-xs font-semibold ${language === code ? 'bg-desk-navy text-desk-silver' : 'text-muted-foreground hover:bg-muted'}`}>{label}</button>)}
            </div>
          </div>
        </div>
        <nav aria-label={zh ? 'EVE METAL 导航' : 'EVE METAL navigation'} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link to="/Home" className="hover:underline">{zh ? '主页' : 'Home'}</Link>
          {sections.map(([id, en, cn]) => <Link key={id} to={`/AboutUs#${id}`} className="text-muted-foreground hover:text-foreground hover:underline">{zh ? cn : en}</Link>)}
          <Link to="/UraniumMarket" className="inline-flex items-center gap-1 font-semibold text-desk-navy">{zh ? '核燃料市场研究' : 'Nuclear Fuels Desk'}<ArrowUpRight className="h-4 w-4" /></Link>
        </nav>
      </header>
      {children}
      <footer className="border-t border-border px-5 py-8 text-xs text-muted-foreground md:px-10"><p>EVE METAL — Global Metals & Financial Markets.</p><p className="mt-2">© {new Date().getFullYear()} EVE METAL. {zh ? '本栏仅作资讯与研究用途。' : 'This section is for information and research only.'}</p></footer>
    </div>
  );
}