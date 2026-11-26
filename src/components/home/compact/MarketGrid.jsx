import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftRight, BarChart2, Package, Wallet, Banknote, PiggyBank, ChevronRight } from 'lucide-react';

const ITEMS = [
  { page: 'Trading', icon: ArrowLeftRight },
  { page: 'USStocks', icon: BarChart2 },
  { page: 'Physical', icon: Package },
  { page: 'Wallet', icon: Wallet },
  { page: 'Lending', icon: Banknote },
  { page: 'Staking', icon: PiggyBank },
];

export default function MarketGrid({ copy }) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-8">
      <h2 className="text-sm font-semibold text-slate-500 mb-3">{copy.marketsTitle}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {ITEMS.map(({ page, icon: Icon }) => {
          const [title, desc] = copy.markets[page];
          return (
            <Link key={page} to={`/${page}`} className="group flex items-center gap-3 rounded-xl border bg-white p-4 hover:border-desk-gold transition-colors">
              <div className="w-10 h-10 rounded-lg bg-desk-navy flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-desk-gold" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500 truncate">{desc}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-desk-gold" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}