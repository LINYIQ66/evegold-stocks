import React from 'react';
import { ArrowRight } from 'lucide-react';
import { visionMedia } from '@/components/home/vision2027/visionMedia';

export default function VisionFoundations({ copy }) {
  return (
    <section id="vision-foundations" className="scroll-mt-8 border-b border-vision-line py-14 md:py-20" aria-labelledby="vision-foundations-title">
      <div className="grid items-center gap-8 lg:grid-cols-5">
        <div className="lg:col-span-2"><p className="text-[10px] font-semibold tracking-[0.22em] text-vision-glow sm:text-xs">{copy.foundation}</p><h3 id="vision-foundations-title" className="mt-5 whitespace-pre-line font-heading text-3xl font-semibold leading-tight tracking-tight text-desk-silver md:text-4xl">{copy.foundationTitle}</h3><p className="mt-6 text-sm leading-loose text-desk-silver/75">{copy.foundationText}</p></div>
        <figure className="overflow-hidden rounded-2xl border border-vision-line bg-vision-panel lg:col-span-3"><img src={visionMedia.industry} width={1000} height={563} loading="lazy" decoding="async" alt={copy.imageAlt} className="aspect-video h-auto w-full object-cover" /><figcaption className="px-4 py-3 text-[10px] leading-relaxed text-desk-silver/60">{copy.imageCaption}</figcaption></figure>
      </div>
      <ol className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">{copy.chain.map((item, index) => <li key={item} className="flex items-center justify-between gap-2 rounded-lg border border-vision-line bg-vision-panel/50 px-3 py-3 text-xs font-medium text-desk-silver/85"><span>{item}</span>{index < copy.chain.length - 1 && <ArrowRight aria-hidden="true" className="h-3 w-3 shrink-0 text-desk-gold" />}</li>)}</ol>
    </section>
  );
}