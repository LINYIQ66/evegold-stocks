import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export default function VisionProductCard({ product, copy, languageIndex }) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-xl border border-vision-line bg-vision-panel/60 p-5 transition-colors hover:border-vision-glow/50 motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-3"><p className="max-w-48 text-[9px] font-medium leading-relaxed tracking-[0.12em] text-vision-glow/80">{product.category}</p><span className="font-display text-lg font-semibold leading-none tracking-tight text-desk-gold">{product.symbol}</span></div>
      <h4 className="mt-4 text-lg font-semibold leading-snug text-desk-silver">{product.title[languageIndex]}</h4>
      <p className="mt-2 text-[10px] font-medium tracking-widest text-desk-gold">{copy.lens}</p>
      <p className="mt-2 flex-1 text-sm leading-loose text-desk-silver/75">{product.text[languageIndex]}</p>
      <div className="mt-5 border-t border-vision-line pt-4"><p className="text-[10px] text-desk-silver/50">{copy.observe}</p><p className="mt-1 text-xs leading-relaxed text-desk-silver/80">{product.watch[languageIndex]}</p><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">{product.links.map(([to, zh, en]) => <Link key={to} to={to} className="inline-flex items-center gap-1 text-xs font-medium text-vision-glow underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vision-glow">{languageIndex === 0 ? zh : en}<ArrowUpRight className="h-3 w-3" /></Link>)}</div></div>
    </article>
  );
}