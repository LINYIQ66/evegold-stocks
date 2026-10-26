import React, { useState } from 'react';
import { Cpu } from 'lucide-react';
import useDeskLanguage from '@/components/uranium/useDeskLanguage';
import { computeCopy } from '@/components/compute/computeCopy';
import useComputeMarket from '@/components/compute/useComputeMarket';
import GpuMarketplace from '@/components/compute/GpuMarketplace';
import AiDataCenters from '@/components/compute/AiDataCenters';
import ComputeFuturesInfo from '@/components/compute/ComputeFuturesInfo';
import ComputeCalculator from '@/components/compute/ComputeCalculator';
import ComputeInquiryForm from '@/components/compute/ComputeInquiryForm';

export default function AiComputeSection() {
  const [language] = useDeskLanguage();
  const copy = computeCopy[language];
  const query = useComputeMarket();
  const [model, setModel] = useState('H100 SXM');
  const enquire = nextModel => { setModel(nextModel); document.getElementById('compute-inquiry')?.scrollIntoView({ block: 'start' }); };
  return (
    <section id="ai-compute" className="scroll-mt-6 space-y-8">
      <div className="rounded-2xl bg-desk-navy p-7 text-desk-silver md:p-10"><Cpu className="h-8 w-8 text-desk-gold" /><p className="mt-5 text-xs font-semibold tracking-widest text-desk-gold">EVE METAL</p><h2 className="mt-3 text-2xl font-semibold leading-tight md:text-3xl">{copy.title}</h2><p className="mt-3 text-lg font-medium">{copy.subtitle}</p><p className="mt-6 text-sm leading-loose text-desk-silver/90">{copy.intro}</p><p className="mt-4 text-sm leading-loose text-desk-silver/90">{copy.plan}</p><p className="mt-5 text-sm leading-loose text-desk-gold">{copy.strategy}</p><p className="mt-5 text-xs leading-relaxed text-desk-silver/80">{copy.disclaimer}</p></div>
      <GpuMarketplace query={query} copy={copy} language={language} onChoose={enquire} />
      <AiDataCenters copy={copy} language={language} />
      <ComputeFuturesInfo copy={copy} reference={query.data?.futures_reference} language={language} />
      <ComputeCalculator quotes={query.data?.quotes || []} copy={copy} model={model} onModelChange={setModel} />
      <ComputeInquiryForm copy={copy} model={model} onModelChange={setModel} />
      <p className="text-center text-sm font-semibold text-desk-navy">{copy.tagline}</p>
    </section>
  );
}