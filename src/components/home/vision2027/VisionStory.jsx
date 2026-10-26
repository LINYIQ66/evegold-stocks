import React from 'react';

export default function VisionStory({ copy }) {
  return (
    <section id="vision-intelligence" className="scroll-mt-8 border-b border-vision-line py-14 md:py-20" aria-labelledby="vision-story-title">
      <p className="text-[10px] font-semibold tracking-[0.22em] text-vision-glow sm:text-xs">{copy.chapter}</p>
      <h3 id="vision-story-title" className="mt-5 whitespace-pre-line font-heading text-3xl font-semibold leading-tight tracking-tight text-desk-silver md:text-4xl">{copy.storyTitle}</h3>
      <div className="mt-9 grid gap-x-10 gap-y-9 md:grid-cols-2">{copy.chapters.map((chapter, index) => <article key={chapter.title} className="border-t border-vision-line pt-5"><div className="flex items-start gap-3"><span className="pt-1 font-display text-xs text-desk-gold">0{index + 1}</span><h4 className="text-base font-semibold leading-relaxed text-desk-silver md:text-lg">{chapter.title}</h4></div><p className="mt-4 text-sm leading-loose text-desk-silver/75">{chapter.text}</p></article>)}</div>
    </section>
  );
}