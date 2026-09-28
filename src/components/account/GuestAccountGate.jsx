import React from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EveVideoPanel from '@/components/account/EveVideoPanel';

const LOGO = 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0d6759fb_Screenshot2025-08-23105026.png';

export default function GuestAccountGate({ onLogin }) {
  return (
    <main className="min-h-screen bg-background px-4 py-5 text-foreground sm:px-7 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-8">
        <section className="flex min-h-[480px] flex-col justify-between rounded-3xl border border-border bg-card p-7 shadow-sm sm:p-10 lg:min-h-[680px] lg:p-12">
          <div className="flex items-center gap-3">
            <img src={LOGO} alt="EVE FINANCE" className="h-11 w-11 rounded-xl object-cover" />
            <div><p className="text-lg font-bold tracking-wide">EVE FINANCE</p><p className="text-xs tracking-widest text-muted-foreground">更从容的金融体验</p></div>
          </div>
          <div className="my-12 max-w-lg">
            <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">YOUR FINANCIAL WORLD</p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl">从这里，开启<br />您的投资旅程。</h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">一个账户，探索贵金属、美股与数字资产。登录以继续，或创建账户开始使用 EVE 金融。</p>
            <div className="mt-9 space-y-4">
              <Button type="button" onClick={onLogin} size="lg" className="w-full justify-between rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-7 text-base font-bold text-white shadow-xl ring-4 ring-blue-100 hover:from-blue-700 hover:to-indigo-700 focus-visible:ring-blue-500 sm:max-w-md">登录或注册 <ArrowRight aria-hidden="true" /></Button>
              <p className="text-xs leading-relaxed text-muted-foreground">新用户可在安全认证页面注册；可用的登录方式以认证页面实际显示为准。</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground"><ShieldCheck className="h-4 w-4 shrink-0" aria-hidden="true" />由平台安全认证服务保护账户访问</div>
        </section>
        <EveVideoPanel />
      </div>
    </main>
  );
}