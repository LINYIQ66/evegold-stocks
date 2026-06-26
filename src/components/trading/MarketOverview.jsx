import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Coins } from "lucide-react";
import { motion } from "framer-motion";

export default function MarketOverview({ prices, priceChanges, onSymbolClick }) {
  const metals = [
    {
      symbol: "GOLD",
      name: "黄金",
      price: prices.gold,
      change: priceChanges?.gold || 0,
      volume: "$2.4B",
      color: "from-yellow-500 to-orange-600"
    },
    {
      symbol: "SILVER",
      name: "白银",
      price: prices.silver,
      change: priceChanges?.silver || 0,
      volume: "$890M",
      color: "from-gray-400 to-gray-600"
    },
    {
      symbol: "PLATINUM",
      name: "铂金",
      price: prices.platinum,
      change: priceChanges?.platinum || 0,
      volume: "$145M",
      color: "from-purple-500 to-indigo-600"
    },
    {
      symbol: "PALLADIUM",
      name: "钯金",
      price: prices.palladium,
      change: priceChanges?.palladium || 0,
      volume: "$98M",
      color: "from-pink-500 to-rose-600"
    }
  ];

  return (
    <div className="h-full">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg h-full flex flex-col">
        <CardHeader className="py-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Coins className="w-5 h-5 text-blue-600" />
            市场概览
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 p-3 space-y-3">
          {metals.map((metal, index) => (
            <motion.div
              key={metal.symbol}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors duration-200 cursor-pointer"
              onClick={() => onSymbolClick && onSymbolClick(metal.symbol)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${metal.color} rounded-md flex items-center justify-center`}>
                    <span className="text-white font-bold text-base">{metal.symbol[0]}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{metal.symbol}</h3>
                    <p className="text-xs text-slate-500">{metal.name}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-lg text-slate-900">${metal.price.toFixed(2)}</p>
                  <div className={`flex items-center justify-end gap-1 ${
                    metal.change >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metal.change >= 0 ? 
                      <TrendingUp className="w-3 h-3" /> : 
                      <TrendingDown className="w-3 h-3" />
                    }
                    <span className="text-xs font-medium">
                      {metal.change >= 0 ? '+' : ''}{metal.change.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 mt-2 border-t border-slate-200">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-600">24小时成交量</span>
                  <span className="font-medium text-slate-900">{metal.volume}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}