import React from 'react';
import { ArrowDown, ArrowUpRight } from 'lucide-react';
import VisionBackdrop from '@/components/home/vision2027/VisionBackdrop';

export default function VisionHero({ copy }) {
  const anchors = ['vision-intelligence', 'vision-foundations', 'vision-products'];
  return (
    <header className="relative isolate overflow-hidden border-b border-vision-line">
      <VisionBackdrop copy={copy} />
      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-20 md:px-10 md:pt-24">
        <p className="max-w-lg text-[10px] font-semibold tracking-[0.24em] text-vision-glow sm:text-xs">{copy.eyebrow}</p>
        <div className="mt-10 max-w-2xl pb-14 md:mt-12 md:pb-20">
          <p className="font-display text-8xl font-extrabold leading-none tracking-tighter text-desk-silver md:text-[8rem]">{copy.year}<span className="ml-3 inline-block h-3 w-3 rounded-full bg-vision-glow align-baseline" /></p>
          <h2 className="mt-5 font-heading text-4xl font-bold leading-tight tracking-tight text-desk-silver sm:text-5xl md:text-6xl">{copy.title}</h2>
          <p className="mt-5 max-w-xl text-lg font-medium leading-relaxed text-desk-gold sm:text-xl">{copy.subtitle}</p>
          <p className="mt-6 max-w-xl text-sm leading-loose text-desk-silver/80 md:text-base">{copy.intro}</p>
          <div className="mt-8 flex flex-wrap gap-3"><a href="#vision-intelligence" className="inline-flex items-center gap-3 rounded-full bg-desk-silver px-5 py-3 text-sm font-semibold text-vision-night hover:bg-vision-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-glow">{copy.read}<ArrowDown className="h-4 w-4" /></a><a href="#vision-products" className="inline-flex items-center gap-3 rounded-full border border-desk-silver/30 bg-vision-night/30 px-5 py-3 text-sm font-medium text-desk-silver hover:border-vision-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-glow">{copy.explore}<ArrowUpRight className="h-4 w-4" /></a></div>
          <p className="mt-7 max-w-xl text-xs leading-relaxed text-desk-silver/65">{copy.scenario}</p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-5 border-t border-desk-silver/15 pt-5"><nav aria-label={copy.productsTitle.replace('\n', ' ')} className="flex flex-wrap gap-x-6 gap-y-3">{copy.nav.map((label, index) => <a key={label} href={`#${anchors[index]}`} className="inline-flex items-center gap-2 text-xs font-medium text-desk-silver/80 hover:text-vision-glow"><span className="text-vision-glow">0{index + 1}</span>{label}</a>)}</nav><div className="text-[10px] leading-relaxed text-desk-silver/55"><p>{copy.date}</p><p className="mt-1">{copy.generated}</p></div></div>
      </div>
    </header>
  );
}