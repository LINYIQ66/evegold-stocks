import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Atom } from 'lucide-react';
import UraniumPriceHistory from '@/components/uranium/UraniumPriceHistory';
import UraniumMarketPrices from '@/components/uranium/UraniumMarketPrices';
import UraniumResearch from '@/components/uranium/UraniumResearch';
import NuclearFuelOverview from '@/components/uranium/NuclearFuelOverview';
import useDeskLanguage from '@/components/uranium/useDeskLanguage';
import { marketContent } from '@/components/uranium/marketContent';
import UraniumTradables from '@/components/usstocks/uranium/UraniumTradables';

export default function UraniumHub({ onSelect, onPrices }) {
  const [language] = useDeskLanguage();
  const copy = marketContent[language];
  const { hash } = useLocation();

  useEffect(() => {
    if (hash === '#uranium') setTimeout(() => document.getElementById('uranium')?.scrollIntoView({ behavior: 'smooth' }), 300);
  }, [hash]);

  return (
    <section id="uranium" aria-labelledby="uranium-title" className="mt-8 mb-8 scroll-mt-5 space-y-10">
      <div className="rounded-2xl bg-desk-navy p-6 text-desk-silver md:p-10">
        <p className="text-xs font-semibold tracking-widest text-desk-gold">{copy.eyebrow}</p>
        <div className="mt-4 flex items-start justify-between gap-6">
          <div>
            <h2 id="uranium-title" className="text-2xl font-semibold leading-tight md:text-4xl">{language === 'zh' ? '全球铀市场' : 'Global Uranium Market'}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-desk-silver/80">{copy.intro}</p>
          </div>
          <Atom className="hidden h-16 w-16 shrink-0 text-desk-gold md:block" />
        </div>
      </div>
      <UraniumTradables onSelect={onSelect} onPrices={onPrices} />
      <UraniumPriceHistory copy={copy} />
      <UraniumMarketPrices language={language} />
      <UraniumResearch copy={copy} />
      <NuclearFuelOverview copy={copy} />
    </section>
  );
}