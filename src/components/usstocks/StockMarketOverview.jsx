import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, RefreshCw, Star, X } from "lucide-react";
import { getStockPrices } from "@/functions/getStockPrices";
import { getAlpacaPrices } from "@/functions/getAlpacaPrices";
import { User } from "@/entities/all";
import StockSearch from "./StockSearch";
import StockQuoteMetrics from "./StockQuoteMetrics";

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
  { symbol: "SPCX",   name: "SpaceX" },
  { symbol: "SKHY",   name: "SK Hynix" },
];

export { DEFAULT_STOCKS as US_STOCKS };

export default function StockMarketOverview({ onStockClick, selectedSymbol, onPriceUpdate, onAllPricesUpdate, user }) {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [addedStocks, setAddedStocks] = useState([]);
  const intervalRef = useRef(null);

  // Load added stocks from user profile (fallback to localStorage for guests)
  useEffect(() => {
    if (user?.stock_watchlist) {
      setAddedStocks(user.stock_watchlist);
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem('addedStocks') || '[]');
        setAddedStocks(stored);
      } catch (e) {
        setAddedStocks([]);
      }
    }
  }, [user]);

  const handleAddStock = async (stock) => {
    const updated = [...addedStocks, { symbol: stock.symbol, name: stock.name }];
    setAddedStocks(updated);
    if (user) {
      try {
        await User.updateMyUserData({ stock_watchlist: updated });
      } catch (e) {
        // Fallback to localStorage if update fails
      }
    } else {
      localStorage.setItem('addedStocks', JSON.stringify(updated));
    }
  };

  const handleRemoveStock = async (symbol) => {
    const updated = addedStocks.filter(s => s.symbol !== symbol);
    setAddedStocks(updated);
    if (user) {
      try {
        await User.updateMyUserData({ stock_watchlist: updated });
      } catch (e) {
        // Fallback to localStorage if update fails
      }
    } else {
      localStorage.setItem('addedStocks', JSON.stringify(updated));
    }
  };

  // Combined stock list: defaults + user-added (deduped)
  const allStocks = [
    ...DEFAULT_STOCKS,
    ...addedStocks.filter(s => !DEFAULT_STOCKS.some(d => d.symbol === s.symbol)),
  ];

  const loadPrices = async () => {
    setLoading(true);

    const addedSymbols = addedStocks
      .filter(s => !DEFAULT_STOCKS.some(d => d.symbol === s.symbol))
      .map(s => s.symbol);
    const KNOWN_NON_STOCKS = new Set(["usd", "usdt", "gold", "silver", "platinum", "palladium", "eve"]);
    const heldCustomStocks = Object.keys(user?.wallet_balances || {})
      .filter(k => !k.startsWith("frozen_"))
      .filter(k => !KNOWN_NON_STOCKS.has(k.toLowerCase()))
      .filter(k => (user.wallet_balances[k] || 0) > 0)
      .filter(k => !DEFAULT_STOCKS.some(d => d.symbol === k.toUpperCase()))
      .map(k => k.toUpperCase());
    const customSymbols = [...new Set([...addedSymbols, ...heldCustomStocks])];

    const publish = (updates) => {
      if (!updates || Object.keys(updates).length === 0) return;
      setPrices(previous => ({ ...previous, ...updates }));
      if (onPriceUpdate && updates[selectedSymbol]) {
        onPriceUpdate(updates[selectedSymbol].price);
      }
      if (onAllPricesUpdate) onAllPricesUpdate(updates);
    };

    const defaultRequest = getStockPrices({})
      .then(res => publish(res?.data?.prices || {}));
    const customRequest = customSymbols.length > 0
      ? getAlpacaPrices({ symbols: customSymbols.join(',') })
          .then(res => publish(res?.data?.prices || {}))
      : Promise.resolve();

    await Promise.allSettled([defaultRequest, customRequest]);
    setLoading(false);
  };

  useEffect(() => {
    loadPrices();
    intervalRef.current = setInterval(loadPrices, 30000);
    return () => clearInterval(intervalRef.current);
  }, [addedStocks]);

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
        <div className="mb-2">
          <StockSearch onAdd={handleAddStock} addedSymbols={allStocks.map(s => s.symbol)} />
        </div>
        <div className="space-y-2">
          {allStocks.map((stock) => {
            const isCustom = !DEFAULT_STOCKS.some(d => d.symbol === stock.symbol);
            const data = prices[stock.symbol];
            const isPositive = data ? data.change >= 0 : true;
            const isSelected = selectedSymbol === stock.symbol;

            return (
              <div
                key={stock.symbol}
                onClick={() => onStockClick(stock.symbol)}
                className={`px-3 py-3 rounded-lg cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow"
                    : "bg-white hover:bg-slate-50 border border-slate-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className={`font-semibold text-sm leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                        {stock.symbol}
                      </p>
                      {isCustom && (
                        <Star className={`w-3 h-3 flex-shrink-0 ${isSelected ? "text-yellow-300" : "text-yellow-500"}`} fill="currentColor" />
                      )}
                    </div>
                    <p className={`text-xs truncate mt-0.5 ${isSelected ? "text-blue-100" : "text-slate-400"}`}>
                      {data?.name || stock.name}
                    </p>
                  </div>
                  <div className="flex items-start gap-1 flex-shrink-0">
                    <div className="text-right">
                      {data?.price ? (
                        <>
                          <p className={`font-bold text-base leading-tight ${isSelected ? "text-white" : "text-slate-900"}`}>
                            ${data.price.toFixed(2)}
                          </p>
                          <div className={`flex items-center gap-0.5 justify-end text-xs font-semibold mt-1 ${
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
                    {isCustom && (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleRemoveStock(stock.symbol); }}
                        className={`p-1 rounded transition-colors ${
                          isSelected ? "text-white/70 hover:text-white hover:bg-white/20" : "text-slate-400 hover:text-red-500 hover:bg-red-50"
                        }`}
                        title="移除"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
                {data?.price && <StockQuoteMetrics data={data} isSelected={isSelected} />}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}