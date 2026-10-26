import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone, Building2 } from 'lucide-react';
import RecruitmentForm from '@/components/careers/RecruitmentForm';

export default function CompanySections({ copy }) {
  const linkClass = 'inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium hover:bg-muted';
  return (
    <div className="mx-auto max-w-6xl space-y-12 px-5 py-12 md:px-10">
      <section id="about" className="scroll-mt-6 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-muted p-7"><p className="text-5xl font-light text-desk-navy">{copy.years}</p><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.experience}</p></div>
        <div className="md:col-span-2"><h2 className="text-2xl font-semibold">{copy.aboutTitle}</h2><p className="mt-5 text-base leading-loose text-muted-foreground">{copy.aboutText}</p></div>
      </section>
      <section id="financial-markets" className="scroll-mt-6 rounded-2xl border border-border p-7">
        <h2 className="text-2xl font-semibold">{copy.financialTitle}</h2><p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground">{copy.financialText}</p>
        <div className="mt-6 flex flex-wrap gap-3">{[['/USStocks', copy.stocks], ['/Trading', copy.metals], ['/Wallet', copy.wallet]].map(([href, text]) => <Link key={href} to={href} className={linkClass}>{text}<ArrowUpRight className="h-4 w-4" /></Link>)}</div>
      </section>
      <section id="energy" className="scroll-mt-6 rounded-2xl bg-desk-navy p-7 text-desk-silver">
        <h2 className="text-2xl font-semibold">{copy.energyTitle}</h2><p className="mt-4 max-w-3xl text-sm leading-relaxed text-desk-silver/80">{copy.energyText}</p><Link to="/UraniumMarket" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-desk-gold underline">{copy.energyLink}<ArrowUpRight className="h-4 w-4" /></Link>
      </section>
      <div className="grid gap-8 md:grid-cols-2">
        <section id="venues" className="scroll-mt-6"><Building2 className="mb-4 h-6 w-6 text-desk-gold" /><h2 className="text-2xl font-semibold">{copy.venuesTitle}</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.venuesText}</p><Link to="/Home" className={`${linkClass} mt-5`}>{copy.venuesLink}<ArrowUpRight className="h-4 w-4" /></Link></section>
      </div>
      <section id="careers" className="scroll-mt-6 rounded-2xl border border-border p-7"><h2 className="text-2xl font-semibold">{copy.careersTitle}</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">{copy.careersText}</p><RecruitmentForm /></section>
      <section id="contact" className="scroll-mt-6 rounded-2xl border border-border bg-muted/40 p-7">
        <h2 className="text-2xl font-semibold">{copy.contactTitle}</h2><p className="mt-3 text-sm text-muted-foreground">{copy.contactText}</p>
        <a href="tel:+6583687572" className="mt-5 inline-flex flex-wrap items-center gap-3 rounded-xl bg-desk-navy px-5 py-4 text-desk-silver"><Phone className="h-5 w-5" /><span className="font-semibold">+65 8368 7572</span><span className="text-xs">{copy.call}</span></a><p className="mt-4 text-xs leading-relaxed text-muted-foreground">{copy.contactNote}</p>
      </section>
    </div>
  );
}