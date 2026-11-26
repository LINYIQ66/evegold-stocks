import React from 'react';
import { Link } from 'react-router-dom';
import { Award } from 'lucide-react';

export default function EveStrip({ copy }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-desk-silver px-4 py-3">
        <p className="flex items-center gap-2 text-sm text-desk-navy"><Award className="w-4 h-4 text-desk-gold" />{copy.eve}</p>
        <Link to="/Wallet" className="text-sm font-semibold text-desk-navy underline underline-offset-4">{copy.eveCta}</Link>
      </div>
    </section>
  );
}