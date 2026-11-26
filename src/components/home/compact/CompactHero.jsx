import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TRUST_ICONS = [Shield, Zap, Activity];

export default function CompactHero({ copy }) {
  return (
    <section className="bg-desk-navy text-desk-silver">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div>
          <div className="h-1 w-12 bg-desk-gold rounded-full mb-4" />
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-white">{copy.title}</h1>
          <p className="mt-2 text-sm md:text-base text-desk-silver/80">{copy.sub}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-desk-silver/70">
            {copy.trust.map((label, i) => {
              const Icon = TRUST_ICONS[i];
              return <span key={label} className="flex items-center gap-1.5"><Icon className="w-3.5 h-3.5 text-desk-gold" />{label}</span>;
            })}
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <Link to="/Account">
            <Button className="bg-desk-gold text-desk-navy hover:bg-desk-gold/90 font-semibold">
              {copy.start}<ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
          <Link to="/Trading">
            <Button variant="outline" className="border-desk-silver/40 bg-transparent text-white hover:bg-white/10 hover:text-white">
              {copy.prices}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}