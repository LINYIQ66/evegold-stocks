
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DollarSign, 
  Coins,
  TrendingUp,
  TrendingDown,
  Lock,
  JapaneseYen,
  Star,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

export default function BalanceCards({ user, isLoading, prices, priceChanges, onInfoClick }) {
  const allAssets = [
    {
      symbol: "EVE",
      name: "EVE Reward Token",
      icon: Star,
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      symbol: "USD",
      name: "US Dollar",
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
    },
    {
      symbol: "EUR",
      name: "Euro",
      icon: DollarSign,
      color: "from-sky-500 to-blue-600",
    },
    {
      symbol: "GBP",
      name: "British Pound",
      icon: DollarSign,
      color: "from-indigo-500 to-violet-600",
    },
    {
      symbol: "AUD",
      name: "Australian Dollar",
      icon: DollarSign,
      color: "from-cyan-500 to-teal-600",
    },
    {
      symbol: "NZD",
      name: "New Zealand Dollar",
      icon: DollarSign,
      color: "from-emerald-400 to-green-500",
    },
    {
      symbol: "CAD",
      name: "Canadian Dollar",
      icon: DollarSign,
      color: "from-red-600 to-rose-700",
    },
    {
      symbol: "AED",
      name: "UAE Dirham",
      icon: DollarSign,
      color: "from-stone-500 to-neutral-600",
    },
    {
      symbol: "JPY",
      name: "Japanese Yen",
      icon: JapaneseYen,
      color: "from-rose-400 to-red-500",
    },
    {
      symbol: "HKD",
      name: "Hong Kong Dollar",
      icon: DollarSign,
      color: "from-amber-500 to-orange-600",
    },
    {
      symbol: "TWD",
      name: "New Taiwan Dollar",
      icon: DollarSign,
      color: "from-fuchsia-500 to-pink-600",
    },
    {
      symbol: "SGD",
      name: "Singapore Dollar",
      icon: DollarSign,
      color: "from-blue-500 to-cyan-600",
    },
    {
      symbol: "CNH",
      name: "Chinese Yuan",
      icon: JapaneseYen,
      color: "from-red-500 to-rose-600",
    },
    {
      symbol: "INR",
      name: "Indian Rupee",
      icon: JapaneseYen,
      color: "from-orange-500 to-orange-600",
    },
    {
      symbol: "MYR",
      name: "Malaysian Ringgit",
      icon: DollarSign,
      color: "from-teal-500 to-teal-600",
    },
    {
      symbol: "THB",
      name: "Thai Baht",
      icon: DollarSign,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      symbol: "VND",
      name: "Vietnamese Dong",
      icon: DollarSign,
      color: "from-sky-500 to-sky-600",
    },
    {
      symbol: "IDR",
      name: "Indonesian Rupiah",
      icon: DollarSign,
      color: "from-lime-500 to-green-600",
    },
    {
      symbol: "LAK",
      name: "Lao Kip",
      icon: DollarSign,
      color: "from-amber-500 to-yellow-600",
    },
    {
      symbol: "USDT",
      name: "Tether USD",
      icon: Coins,
      color: "from-gray-500 to-slate-600",
    },
    {
      symbol: "GOLD",
      name: "Gold",
      icon: Coins,
      color: "from-yellow-500 to-orange-600",
    },
    {
      symbol: "SILVER",
      name: "Silver",
      icon: Coins,
      color: "from-gray-400 to-gray-600",
    },
    {
      symbol: "PLATINUM",
      name: "Platinum",
      icon: Coins,
      color: "from-purple-500 to-indigo-600",
    },
    {
      symbol: "PALLADIUM",
      name: "Palladium",
      icon: Coins,
      color: "from-pink-500 to-rose-600",
    }
  ];

  const eveAsset = allAssets.find(a => a.symbol === 'EVE');
  const otherAssets = allAssets.filter(a => a.symbol !== 'EVE');

  const getAvailableBalance = (symbol) => {
    const key = symbol.toLowerCase();
    return user?.wallet_balances?.[key] || 0;
  };
  
  const getLockedBalance = (symbol) => {
    const key = symbol.toLowerCase();
    return user?.locked_balances?.[key] || 0;
  };

  const getValue = (balance, price) => {
    return balance * (price || 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Asset Balances</h2>
        <Badge className="bg-green-100 text-green-800">
          Live Prices
        </Badge>
      </div>
      
      {/* EVE Token Card */}
      {eveAsset && (
        <motion.div
            key={eveAsset.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
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
                         <div className={`w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center`}>
                            <Star className="w-6 h-6 text-yellow-300" />
                          </div>
                         <div>
                            <h3 className="font-bold text-xl text-white">{eveAsset.symbol}</h3>
                            <p className="text-sm text-violet-200">{eveAsset.name}</p>
                          </div>
                      </div>
                      <p className="text-4xl font-bold">
                        {(user?.wallet_balances?.eve || 0).toFixed(2)}
                      </p>
                      <p className="text-sm text-violet-200">Total Tokens Held</p>
                    </div>
                    <div className="flex flex-col items-center gap-3">
                       <Badge className="bg-yellow-400 text-yellow-900 font-semibold px-3 py-1">REWARD</Badge>
                       <Button variant="outline" size="sm" className="bg-white/10 border-white/20 hover:bg-white/20" onClick={onInfoClick}>
                         <Info className="w-4 h-4 mr-2"/>
                         Learn More
                       </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
        </motion.div>
      )}

      {otherAssets.length > 0 && <hr className="border-slate-200" />}

      <div className="grid md:grid-cols-2 gap-4">
        {otherAssets.map((asset, index) => {
          const availableBalance = getAvailableBalance(asset.symbol);
          const lockedBalance = getLockedBalance(asset.symbol);
          const totalBalance = availableBalance + lockedBalance;
          const currentPrice = prices[asset.symbol.toLowerCase()] || 0;
          const currentChange = priceChanges[asset.symbol.toLowerCase()] || 0;
          const totalValue = getValue(totalBalance, currentPrice);
          
          return (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-6 w-24" />
                      <Skeleton className="h-8 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${asset.color} rounded-xl flex items-center justify-center`}>
                            <asset.icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{asset.symbol}</h3>
                            <p className="text-sm text-slate-500">{asset.name}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold text-slate-900">
                              {totalBalance.toFixed(
                                ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'SGD', 'CNH', 'USDT', 'INR', 'MYR', 'THB', 'HKD'].includes(asset.symbol) ? 2 : 
                                ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(asset.symbol) ? 0 : 4
                              )}
                            </p>
                            <p className="text-sm text-slate-500">
                              Total Value ≈ ${totalValue.toFixed(2)}
                            </p>
                          </div>
                          
                          <div className="text-sm space-y-1 pt-2 border-t mt-2">
                             <div className="flex items-center justify-between">
                                <span>Available:</span>
                                <span className="font-medium text-green-600">
                                  {availableBalance.toFixed(
                                    ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'SGD', 'CNH', 'USDT', 'INR', 'MYR', 'THB', 'HKD'].includes(asset.symbol) ? 2 : 
                                    ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(asset.symbol) ? 0 : 4
                                  )}
                                </span>
                             </div>
                             {lockedBalance > 0 && (
                                <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1 text-slate-600"><Lock className="w-3 h-3"/>Locked:</span>
                                    <span className="font-medium text-yellow-800">
                                      {lockedBalance.toFixed(
                                        ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'SGD', 'CNH', 'USDT', 'INR', 'MYR', 'THB', 'HKD'].includes(asset.symbol) ? 2 : 
                                        ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(asset.symbol) ? 0 : 4
                                      )}
                                    </span>
                                </div>
                             )}
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2 border-t mt-2">
                            <span className="text-sm font-medium text-slate-600">
                              ${currentPrice.toFixed(
                                ['VND', 'IDR', 'LAK', 'JPY', 'TWD'].includes(asset.symbol) ? 6 :
                                ['INR', 'MYR', 'THB', 'CNH', 'SGD', 'USD', 'EUR', 'GBP', 'AUD', 'NZD', 'CAD', 'AED', 'USDT', 'HKD'].includes(asset.symbol) ? 3 :
                                2
                              )}
                            </span>
                            <div className={`flex items-center gap-1 ${
                              currentChange >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {currentChange >= 0 ? 
                                <TrendingUp className="w-3 h-3" /> : 
                                <TrendingDown className="w-3 h-3" />
                              }
                              <span className="text-xs font-medium">
                                {currentChange >= 0 ? '+' : ''}{currentChange.toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
