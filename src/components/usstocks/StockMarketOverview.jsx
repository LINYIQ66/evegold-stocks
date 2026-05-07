import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { getStockPrices } from "@/functions/getStockPrices";

// Default stock list — dynamically updated from backend
const DEFAULT_STOCKS = [
  { symbol: "AAPL",   name: "Apple" },
  { symbol: "MSFT",   name: "Microsoft" },
  { symbol: "NVDA",   name: "NVIDIA" },
  { symbol: "AMZN",   name: "Amazon" },
  { symbol: "GOOGL",  name: "Alphabet" },
  { symbol: "META",   name: "Meta" },
  { symbol: "TSLA",   name: "Tesla" },
  { symbol: "AMD",    name: "AMD" },
  { symbol: "INTC",   name: "Intel" },
  { symbol: "SNDK",   name: "SanDisk" },
  { symbol: "MU",     name: "Micron" },
  { symbol: "MSTR",   name: "MicroStrategy" },
  { symbol: "PLTR",   name: "Palantir" },
  { symbol: "HOOD",   name: "Robinhood" },
  { symbol: "NFLX",   name: "Netflix" },
  { symbol: "ORCL",   name: "Oracle" },
  { symbol: "COIN",   name: "Coinbase" },
  { symbol: "BABA",   name: "Alibaba" },
  { symbol: "OPENAI", name: "OpenAI" },
  { symbol: "CRWV",   name: "CoreWeave" },
];

export { DEFAULT_STOCKS as US_STOCKS };

export default function StockMarketOverview({ onStockClick, selectedSymbol, onPriceUpdate, onAllPricesUpdate }) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);

  const loadPrices = async () => {
    try {
      const res = await getStockPrices({});
      if (res?.data?.prices) {
        setPrices(res.data.prices);
        setLoading(false);
        if (onPriceUpdate && selectedSymbol && res.data.prices[selectedSymbol]) {
          onPriceUpdate(res.data.prices[selectedSymbol].price);
        }
        if (onAllPricesUpdate) {
          onAllPricesUpdate(res.data.prices);
        }
      }
    } catch (e) {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
    intervalRef.current = setInterval(loadPrices, 30000); // every 30s (API rate limits)
    return () => clearInterval(intervalRef.current);
  }, []);

  // Notify parent when selected symbol changes
  useEffect(() => {
    if (onPriceUpdate && prices[selectedSymbol]) {
      onPriceUpdate(prices[selectedSymbol].price);
    }
  }, [selectedSymbol, prices]);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-slate-900 text-base flex items-center gap-2">
          美股行情
          <Badge className="bg-green-100 text-green-800 text-xs">实时</Badge>
          {loading && <RefreshCw className="w-3 h-3 animate-spin text-slate-400" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-2 min-h-0">
        <div className="space-y-0.5">
          {DEFAULT_STOCKS.map((stock) => {
            const data = prices[stock.symbol];
            const isPositive = data ? data.change >= 0 : true;
            const isSelected = selectedSymbol === stock.symbol;

            return (
              <div
                key={stock.symbol}
                onClick={() => onStockClick(stock.symbol)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                    : "hover:bg-slate-50"
                }`}
              >
                <div className="min-w-0">
                  <p className={`font-semibold text-sm leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                    {stock.symbol}
                  </p>
                  <p className={`text-xs truncate leading-tight ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                    {data?.name || stock.name}
                  </p>
                </div>
                <div className="text-right ml-2 flex-shrink-0">
                  {data?.price ? (
                    <>
                      <p className={`font-semibold text-sm leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                        ${data.price.toFixed(2)}
                      </p>
                      <div className={`flex items-center gap-0.5 justify-end text-xs font-medium leading-tight ${
                        isSelected ? "text-blue-100" : isPositive ? "text-green-600" : "text-red-500"
                      }`}>
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {data.change >= 0 ? "+" : ""}{data.change.toFixed(2)}%
                      </div>
                    </>
                  ) : (
                    <p className={`text-xs ${loading ? "text-slate-400 animate-pulse" : "text-slate-400"}`}>
                      {loading ? "Loading..." : "—"}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}