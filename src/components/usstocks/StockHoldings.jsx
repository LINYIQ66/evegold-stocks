import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Briefcase } from "lucide-react";

const US_STOCK_SYMBOLS = [
  "aapl","msft","nvda","amzn","googl","meta","tsla","amd","intc","sndk",
  "mu","mstr","pltr","hood","nflx","orcl","coin","baba","openai","crwv"
];

const DISPLAY_NAMES = {
  aapl: "Apple", msft: "Microsoft", nvda: "NVIDIA", amzn: "Amazon",
  googl: "Alphabet", meta: "Meta", tsla: "Tesla", amd: "AMD",
  intc: "Intel", sndk: "SanDisk", mu: "Micron", mstr: "MicroStrategy",
  pltr: "Palantir", hood: "Robinhood", nflx: "Netflix", orcl: "Oracle",
  coin: "Coinbase", baba: "Alibaba", openai: "OpenAI", crwv: "CoreWeave"
};

export default function StockHoldings({ user, prices, onSymbolClick }) {
  const balances = user?.wallet_balances || {};

  const holdings = US_STOCK_SYMBOLS
    .filter(key => (balances[key] || 0) > 0)
    .map(key => {
      const shares = balances[key];
      const symbol = key.toUpperCase();
      const price = prices?.[symbol]?.price || null;
      const change = prices?.[symbol]?.change || 0;
      const value = price ? shares * price : null;
      return { key, symbol, shares, price, change, value, name: DISPLAY_NAMES[key] };
    });

  if (holdings.length === 0) return null;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-slate-700 flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-blue-500" />
          My Stock Holdings
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {holdings.map(h => (
            <div
              key={h.key}
              onClick={() => onSymbolClick?.(h.symbol)}
              className="bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 rounded-xl p-3 cursor-pointer transition-all"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900 text-sm">{h.symbol}</span>
                {h.change !== 0 && (
                  <span className={`text-xs font-medium flex items-center gap-0.5 ${h.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {h.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {h.change >= 0 ? "+" : ""}{h.change.toFixed(2)}%
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 truncate">{h.name}</p>
              <p className="text-xs text-slate-600 mt-1">{h.shares.toFixed(6)} shares</p>
              {h.value !== null && (
                <p className="text-sm font-semibold text-blue-700 mt-0.5">${h.value.toFixed(2)}</p>
              )}
              {h.price && (
                <p className="text-xs text-slate-400">@ ${h.price.toFixed(2)}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}