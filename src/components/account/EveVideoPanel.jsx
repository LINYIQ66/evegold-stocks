import React from 'react';

const EVE_VIDEO = 'https://media.base44.com/videos/public/6886dc1b205b0d8cbd737462/2f8085c66_EVE_.mp4';

export default function EveVideoPanel() {
  return (
    <section className="relative flex min-h-[430px] flex-col justify-end overflow-hidden rounded-3xl bg-primary text-primary-foreground lg:min-h-[680px]" aria-label="EVE 金融动态视频">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src={EVE_VIDEO}
        autoPlay
        muted
        loop
        playsInline
        controls
        aria-label="EVE 金融的黄金、白银与市场动态宣传视频"
      >
        您的浏览器不支持视频播放。
      </video>
      <div className="pointer-events-none relative z-10 bg-gradient-to-t from-primary via-primary/60 to-transparent p-7 pb-16 md:p-10 md:pb-16">
        <span className="text-xs font-semibold tracking-widest uppercase text-primary-foreground/70">EVE FINANCE · IN MOTION</span>
        <h2 className="mt-3 max-w-md text-3xl font-bold leading-tight md:text-4xl">看见价值流动的每一刻。</h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-primary-foreground/80">从贵金属到数字资产，以更清晰的视角探索市场。</p>
      </div>
    </section>
  );
}