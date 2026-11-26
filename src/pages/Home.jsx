import React from 'react';
import { useLanguage } from '@/components/common/LanguageProvider';
import { getHomeCopy } from '@/components/home/compact/homeCopy';
import CompactHero from '@/components/home/compact/CompactHero';
import MarketGrid from '@/components/home/compact/MarketGrid';
import EveStrip from '@/components/home/compact/EveStrip';
import SuperintelligenceSection from '@/components/home/vision2027/SuperintelligenceSection';

export default function Home() {
  const { language } = useLanguage();
  const copy = getHomeCopy(language);
  return (
    <div className="bg-slate-50">
      <CompactHero copy={copy} />
      <MarketGrid copy={copy} />
      <EveStrip copy={copy} />
      <SuperintelligenceSection />
    </div>
  );
}