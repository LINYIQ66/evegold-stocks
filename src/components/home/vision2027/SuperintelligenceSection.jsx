import React from 'react';
import { useLanguage } from '@/components/common/LanguageProvider';
import { visionContent } from '@/components/home/vision2027/visionContent';
import VisionHero from '@/components/home/vision2027/VisionHero';
import VisionStory from '@/components/home/vision2027/VisionStory';
import VisionFoundations from '@/components/home/vision2027/VisionFoundations';
import VisionProductGrid from '@/components/home/vision2027/VisionProductGrid';
import VisionResearchNote from '@/components/home/vision2027/VisionResearchNote';

export default function SuperintelligenceSection() {
  const { language } = useLanguage();
  const languageIndex = language === 'zh' ? 0 : 1;
  const copy = visionContent[languageIndex === 0 ? 'zh' : 'en'];
  return (
    <section id="superintelligence-2027" lang={languageIndex === 0 ? 'zh-CN' : 'en'} className="overflow-hidden bg-vision-night font-body text-desk-silver">
      <VisionHero copy={copy} />
      <div className="mx-auto max-w-7xl px-6 md:px-10"><VisionStory copy={copy} /><VisionFoundations copy={copy} /><VisionProductGrid copy={copy} languageIndex={languageIndex} /><VisionResearchNote copy={copy} /></div>
    </section>
  );
}