import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DeskShell from '@/components/uranium/DeskShell';
import CompanySections from '@/components/uranium/CompanySections';
import useDeskLanguage from '@/components/uranium/useDeskLanguage';
import { companyContent } from '@/components/uranium/companyContent';

export default function AboutUs() {
  const [language, setLanguage] = useDeskLanguage();
  const { hash } = useLocation();
  const copy = companyContent[language];
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [hash]);
  return (
    <DeskShell language={language} setLanguage={setLanguage}>
      <main>
        <section className="bg-desk-navy px-5 py-16 text-desk-silver md:px-10 md:py-20"><div className="mx-auto max-w-6xl"><p className="text-xs font-semibold tracking-widest text-desk-gold">{copy.eyebrow}</p><h1 className="mt-7 max-w-3xl text-4xl font-semibold leading-tight md:text-6xl">{copy.title}</h1><p className="mt-6 max-w-2xl text-base leading-relaxed text-desk-silver/80">{copy.intro}</p></div></section>
        <CompanySections copy={copy} />
      </main>
    </DeskShell>
  );
}