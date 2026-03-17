import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Coins, Lock, Unlock, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function CollateralOverview({ user, loans, prices, isLoading }) {
  const metals = ["GOLD", "SILVER", "PLATINUM", "PALLADIUM"];

  const getAssetData = (asset) => {
    const balance = user?.wallet_balances?.[asset.toLowerCase()] || 0;
    const price = prices[asset.toLowerCase()] || 0;
    const value = balance * price;
    
    // Calculate locked amount in loans
    const locked = loans
      .filter(loan => loan.status === "active" && loan.collateral_asset === asset)
      .reduce((total, loan) => total + loan.collateral_amount, 0);
    
    const available = balance - locked;
    const lockedValue = locked * price;
    const availableValue = available * price;
    
    return {
      symbol: asset,
      balance,
      price,
      value,
      locked,
      available,
      lockedValue,
      availableValue,
      lockedPercentage: balance > 0 ? (locked / balance) * 100 : 0
    };
  };

  const getAssetColor = (asset) => {
    switch (asset) {
      case "GOLD": return "from-yellow-500 to-orange-600";
      case "SILVER": return "from-gray-400 to-gray-600";
      case "PLATINUM": return "from-purple-500 to-indigo-600";
      case "PALLADIUM": return "from-pink-500 to-rose-600";
      default: return "from-blue-500 to-indigo-600";
    }
  };

  const totalCollateralValue = metals.reduce((total, asset) => {
    const data = getAssetData(asset);
    return total + data.lockedValue;
  }, 0);

  const totalAvailableValue = metals.reduce((total, asset) => {
    const data = getAssetData(asset);
    return total + data.availableValue;
  }, 0);

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Total Collateral Value</p>
                <p className="text-3xl font-bold">${totalCollateralValue.toFixed(2)}</p>
              </div>
              <Lock className="w-10 h-10 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-2">Available for Collateral</p>
                <p className="text-3xl font-bold">${totalAvailableValue.toFixed(2)}</p>
              </div>
              <Unlock className="w-10 h-10 text-green-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Breakdown */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-blue-600" />
            Asset Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {metals.map((asset, index) => {
            const data = getAssetData(asset);
            
            return (
              <motion.div
                key={asset}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-slate-50 rounded-xl"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAssetColor(asset)} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-sm">{asset[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{asset}</h3>
                      <p className="text-sm text-slate-600">${data.price.toFixed(2)} per unit</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {data.balance.toFixed(4)} units
                  </Badge>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Balance</p>
                    <p className="font-semibold text-slate-900">${data.value.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Locked in Loans</p>
                    <p className="font-semibold text-red-600">${data.lockedValue.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{data.locked.toFixed(4)} units</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Available</p>
                    <p className="font-semibold text-green-600">${data.availableValue.toFixed(2)}</p>
                    <p className="text-xs text-slate-500">{data.available.toFixed(4)} units</p>
                  </div>
                </div>

                {data.balance > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">
                        Utilization
                      </span>
                      <span className="text-sm text-slate-600">
                        {data.lockedPercentage.toFixed(1)}% locked
                      </span>
                    </div>
                    <Progress value={data.lockedPercentage} className="h-2" />
                  </div>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}