import React from 'react';
import { visionProducts } from '@/components/home/vision2027/visionProducts';
import VisionProductCard from '@/components/home/vision2027/VisionProductCard';

export default function VisionProductGrid({ copy, languageIndex }) {
  return (
    <section id="vision-products" className="scroll-mt-8 py-14 md:py-20" aria-labelledby="vision-products-title">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-vision-glow sm:text-xs">{copy.productsEyebrow}</p>
      <div className="mt-5 flex flex-wrap items-end justify-between gap-5"><h3 id="vision-products-title" className="whitespace-pre-line font-heading text-3xl font-semibold leading-tight tracking-tight text-desk-silver md:text-4xl">{copy.productsTitle}</h3><p className="max-w-md text-sm leading-loose text-desk-silver/65">{copy.productsIntro}</p></div>
      <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visionProducts.map(product => <VisionProductCard key={product.id} product={product} copy={copy} languageIndex={languageIndex} />)}</div>
    </section>
  );
}