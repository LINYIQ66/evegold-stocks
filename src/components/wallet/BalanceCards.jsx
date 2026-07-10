import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Coins,
  TrendingUp,
  TrendingDown,
  Lock,
  JapaneseYen,
  Star,
  Info,
  Search,
  ArrowUpDown,
  BarChart2
} from "lucide-react";
import { motion } from "framer-motion";

const FIAT_AND_METAL_ASSETS = [
  { symbol: "USD",      name: "US Dollar",          icon: DollarSign,  color: "from-green-500 to-emerald-600" },
  { symbol: "EUR",      name: "Euro",               icon: DollarSign,  color: "from-sky-500 to-blue-600" },
  { symbol: "GBP",      name: "British Pound",      icon: DollarSign,  color: "from-indigo-500 to-violet-600" },
  { symbol: "AUD",      name: "Australian Dollar",  icon: DollarSign,  color: "from-cyan-500 to-teal-600" },
  { symbol: "NZD",      name: "New Zealand Dollar", icon: DollarSign,  color: "from-emerald-400 to-green-500" },
  { symbol: "CAD",      name: "Canadian Dollar",    icon: DollarSign,  color: "from-red-600 to-rose-700" },
  { symbol: "AED",      name: "UAE Dirham",         icon: DollarSign,  color: "from-stone-500 to-neutral-600" },
  { symbol: "JPY",      name: "Japanese Yen",       icon: JapaneseYen, color: "from-rose-400 to-red-500" },
  { symbol: "HKD",      name: "Hong Kong Dollar",   icon: DollarSign,  color: "from-amber-500 to-orange-600" },
  { symbol: "TWD",      name: "New Taiwan Dollar",  icon: DollarSign,  color: "from-fuchsia-500 to-pink-600" },
  { symbol: "SGD",      name: "Singapore Dollar",   icon: DollarSign,  color: "from-blue-500 to-cyan-600" },
  { symbol: "CNH",      name: "Chinese Yuan",       icon: JapaneseYen, color: "from-red-500 to-rose-600" },
  { symbol: "INR",      name: "Indian Rupee",       icon: JapaneseYen, color: "from-orange-500 to-orange-600" },
  { symbol: "MYR",      name: "Malaysian Ringgit",  icon: DollarSign,  color: "from-teal-500 to-teal-600" },
  { symbol: "THB",      name: "Thai Baht",          icon: DollarSign,  color: "from-emerald-500 to-emerald-600" },
  { symbol: "VND",      name: "Vietnamese Dong",    icon: DollarSign,  color: "from-sky-500 to-sky-600" },
  { symbol: "IDR",      name: "Indonesian Rupiah",  icon: DollarSign,  color: "from-lime-500 to-green-600" },
  { symbol: "LAK",      name: "Lao Kip",            icon: DollarSign,  color: "from-amber-500 to-yellow-600" },
  { symbol: "USDT",     name: "Tether USD",         icon: Coins,       color: "from-gray-500 to-slate-600" },
  { symbol: "GOLD",     name: "Gold",               icon: Coins,       color: "from-yellow-500 to-orange-600" },
  { symbol: "SILVER",   name: "Silver",             icon: Coins,       color: "from-gray-400 to-gray-600" },
  { symbol: "PLATINUM", name: "Platinum",           icon: Coins,       color: "from-purple-500 to-indigo-600" },
  { symbol: "PALLADIUM",name: "Palladium",          icon: Coins,       color: "from-pink-500 to-rose-600" },
];

const US_STOCKS = [
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
  { symbol: "PDD",    name: "PDD Holdings" },
  { symbol: "SPCX",   name: "SPACEX" },
  { symbol: "OPENAI", name: "OpenAI" },
  { symbol: "CRWV",   name: "CoreWeave" },
];

export default function BalanceCards({ user, isLoading, prices, priceChanges, stockPrices, onInfoClick, transactions = [] }) {
  const [search, setSearch] = useState("");
  const [sortByValue, setSortByValue] = useState(false);

  // Compute frozen amounts from pending limit orders (covers both manual and API-created orders)
  const pendingFrozen = useMemo(() => {
    const frozen = {};
    for (const tx of transactions) {
      if (tx.status !== "pending" || tx.transaction_type !== "swap") continue;
      let meta = {};
      try { meta = JSON.parse(tx.description || "{}"); } catch {}
      if (!meta.side || !meta.symbol) continue;
      if (meta.side === "buy") {
        const key = (meta.currency || "usdt").toLowerCase();
        frozen[key] = (frozen[key] || 0) + (tx.amount_usd || 0);
      } else {
        const key = meta.symbol.toLowerCase();
        frozen[key] = (frozen[key] || 0) + (meta.shares || 0);
      }
    }
    return frozen;
  }, [transactions]);

  const getAvailableBalance = (symbol) => {
    const key = symbol.toLowerCase();
    const raw = user?.wallet_balances?.[key] || 0;
    // If wallet already has frozen_key deducted (manual orders), don't double-subtract.
    // Use whichever frozen amount is larger: what wallet says vs what pending txs say.
    const walletFrozen = user?.wallet_balances?.[`frozen_${key}`] || 0;
    const txFrozen = pendingFrozen[key] || 0;
    // The actual available = raw - max(0, txFrozen - walletFrozen)
    // If txFrozen > walletFrozen, the API created orders not yet reflected in wallet frozen keys
    const extraFrozen = Math.max(0, txFrozen - walletFrozen);
    return Math.max(0, raw - extraFrozen);
  };

  // locked_balances = staking locks; frozen_* in wallet_balances = pending limit order freezes
  const getLockedBalance = (symbol) => {
    const key = symbol.toLowerCase();
    const staked = user?.locked_balances?.[key] || 0;
    const walletFrozen = user?.wallet_balances?.[`frozen_${key}`] || 0;
    const txFrozen = pendingFrozen[key] || 0;
    // Use the larger of the two to avoid double counting
    const frozen = Math.max(walletFrozen, txFrozen);
    return staked + frozen;
  };

  const formatBalance = (balance, symbol) => {
    const decimals = ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(symbol) ? 0 :
                     ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'SGD', 'CNH', 'USDT', 'INR', 'MYR', 'THB', 'HKD'].includes(symbol) ? 2 : 4;
    return balance.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  // Build combined asset list with USD values
  const allAssets = useMemo(() => {
    const fiatMetals = FIAT_AND_METAL_ASSETS.map(asset => {
      const avail = getAvailableBalance(asset.symbol);
      const locked = getLockedBalance(asset.symbol);
      const total = avail + locked;
      const price = prices[asset.symbol.toLowerCase()] || 0;
      const change = priceChanges[asset.symbol.toLowerCase()] || 0;
      return { ...asset, avail, locked, total, price, change, usdValue: total * price, isStock: false };
    });

    const knownSymbols = new Set([...FIAT_AND_METAL_ASSETS.map(a => a.symbol.toUpperCase()), ...US_STOCKS.map(s => s.symbol.toUpperCase())]);
    const stocks = US_STOCKS.map(stock => {
      const avail = getAvailableBalance(stock.symbol);
      const locked = getLockedBalance(stock.symbol);
      const total = avail + locked;
      const priceData = stockPrices?.[stock.symbol];
      const price = priceData?.price || 0;
      const change = priceData?.change || 0;
      return {
        ...stock,
        icon: BarChart2,
        color: "from-blue-500 to-indigo-600",
        avail, locked, total, price, change,
        usdValue: total * price,
        isStock: true
      };
    });

    // Dynamically include any user-held stock not in the predefined US_STOCKS list
    const customStocks = Object.keys(user?.wallet_balances || {})
      .filter(k => !k.startsWith("frozen_"))
      .filter(k => !knownSymbols.has(k.toUpperCase()))
      .filter(k => (user.wallet_balances[k] || 0) > 0)
      .map(symbol => {
        const sym = symbol.toUpperCase();
        const avail = getAvailableBalance(sym);
        const locked = getLockedBalance(sym);
        const total = avail + locked;
        const priceData = stockPrices?.[sym];
        const price = priceData?.price || 0;
        const change = priceData?.change || 0;
        return {
          symbol: sym,
          name: priceData?.name || sym,
          icon: BarChart2,
          color: "from-blue-500 to-indigo-600",
          avail, locked, total, price, change,
          usdValue: total * price,
          isStock: true
        };
      });

    return [...fiatMetals, ...stocks, ...customStocks];
  }, [user, prices, priceChanges, stockPrices]);

  const filteredAssets = useMemo(() => {
    let list = allAssets.filter(a => a.total > 0 || !search); // when no search, show all; when searching, still show zero ones if matching

    if (search) {
      const q = search.toLowerCase();
      list = allAssets.filter(a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q));
    }

    if (sortByValue) {
      list = [...list].sort((a, b) => b.usdValue - a.usdValue);
    }

    return list;
  }, [allAssets, search, sortByValue]);

  const eveBalance = user?.wallet_balances?.eve || 0;

  return (
    <div className="space-y-4">
      {/* Header + controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">Asset Balances</h2>
          <Badge className="bg-green-100 text-green-800">Live Prices</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search assets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-8 h-9 w-48"
            />
          </div>
          <Button
            variant={sortByValue ? "default" : "outline"}
            size="sm"
            onClick={() => setSortByValue(v => !v)}
            className="gap-1.5 h-9"
          >
            <ArrowUpDown className="w-4 h-4" />
            By Value
          </Button>
        </div>
      </div>

      {/* EVE Token Card */}
      {(!search || "EVE".includes(search.toUpperCase()) || "EVE Reward Token".toLowerCase().includes(search.toLowerCase())) && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 shadow-2xl hover:shadow-violet-400/40 transition-all duration-300">
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-32 bg-white/20" />
                    <Skeleton className="h-10 w-48 bg-white/20" />
                  </div>
                  <Skeleton className="h-10 w-32 bg-white/20" />
                </div>
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                        <Star className="w-6 h-6 text-yellow-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-xl text-white">EVE</h3>
                        <p className="text-sm text-violet-200">EVE Reward Token</p>
                      </div>
                    </div>
                    <p className="text-4xl font-bold">
                      {eveBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className="text-sm text-violet-200">Total Tokens Held</p>
                    <p className="text-lg font-semibold text-yellow-300 mt-1">
                      ≈ ${(eveBalance * 0.01).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <Badge className="bg-yellow-400 text-yellow-900 font-semibold px-3 py-1">REWARD</Badge>
                    <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20" onClick={onInfoClick}>
                      <Info className="w-4 h-4 mr-2" />Learn More
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      <hr className="border-slate-200" />

      {/* Asset Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="bg-white/80 border-0 shadow-lg">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-20" />
              </CardContent>
            </Card>
          ))
        ) : filteredAssets.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-slate-400">No assets found.</div>
        ) : (
          filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 bg-gradient-to-r ${asset.color} rounded-xl flex items-center justify-center`}>
                          <asset.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-900">{asset.symbol}</h3>
                            {asset.isStock && <Badge className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0">Stock</Badge>}
                          </div>
                          <p className="text-sm text-slate-500">{asset.name}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-2xl font-bold text-slate-900">
                            {asset.isStock
                              ? asset.total.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
                              : formatBalance(asset.total, asset.symbol)}
                          </p>
                          <p className="text-sm text-slate-500">
                            Total Value ≈ ${asset.usdValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="text-sm space-y-1 pt-2 border-t mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-500">Available:</span>
                            <span className="font-medium text-green-600">
                              {asset.isStock
                                ? asset.avail.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
                                : formatBalance(asset.avail, asset.symbol)}
                            </span>
                          </div>
                          {asset.locked > 0 && (
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1 text-slate-500"><Lock className="w-3 h-3" />Locked:</span>
                              <span className="font-medium text-yellow-800">
                                {asset.isStock
                                  ? asset.locked.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
                                  : formatBalance(asset.locked, asset.symbol)}
                              </span>
                            </div>
                          )}
                        </div>

                        {asset.price > 0 && (
                          <div className="flex items-center gap-2 pt-2 border-t mt-2">
                            <span className="text-sm font-medium text-slate-600">
                              ${asset.isStock ? asset.price.toFixed(2) : asset.price.toFixed(
                                ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(asset.symbol) ? 6 :
                                ['INR', 'MYR', 'THB', 'CNH', 'SGD', 'USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'USDT', 'HKD'].includes(asset.symbol) ? 3 : 2
                              )}
                            </span>
                            <div className={`flex items-center gap-1 ${asset.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {asset.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                              <span className="text-xs font-medium">{asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}