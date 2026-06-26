import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Coins, Calendar, Wallet } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function InterestHistory({ transactions, isLoading }) {
  const interestTxs = (transactions || [])
    .filter(t => t.transaction_type === "interest")
    .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const totalInterest = interestTxs.reduce((sum, t) => sum + (t.amount_usd || 0), 0);

  // Group by asset
  const byAsset = {};
  for (const tx of interestTxs) {
    const asset = (tx.asset || "USD").toUpperCase();
    byAsset[asset] = (byAsset[asset] || 0) + (tx.amount_usd || 0);
  }

  const summaryCards = [
    {
      label: "累计利息",
      value: `$${totalInterest.toFixed(4)}`,
      icon: TrendingUp,
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      text: "text-amber-700",
    },
    ...Object.entries(byAsset).map(([asset, amount]) => ({
      label: `${asset} 利息`,
      value: `$${amount.toFixed(4)}`,
      icon: Coins,
      color: "from-blue-500 to-indigo-500",
      bg: "bg-blue-50",
      text: "text-blue-700",
    })),
    {
      label: "利息次数",
      value: interestTxs.length,
      icon: Calendar,
      color: "from-emerald-500 to-teal-500",
      bg: "bg-emerald-50",
      text: "text-emerald-700",
    },
  ];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            <span className="text-slate-900">利息记录</span>
          </div>
          <Badge className="bg-amber-100 text-amber-800">
            4% APY · 每日结算
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {summaryCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className={`p-4 rounded-xl ${card.bg} border border-white/50`}
            >
              <div className="flex items-center gap-2 mb-2">
                <card.icon className={`w-4 h-4 ${card.text}`} />
                <span className="text-xs font-medium text-slate-600">{card.label}</span>
              </div>
              <p className={`text-lg font-bold ${card.text}`}>{card.value}</p>
            </motion.div>
          ))}
        </div>

        {/* Interest Rate Info */}
        <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
          <div className="flex items-center gap-2 text-sm text-amber-800">
            <Wallet className="w-4 h-4 flex-shrink-0" />
            <span>
              USD / USDT 可用余额按 <strong>4% 年化</strong> 每日计息（年化 ÷ 365），每日北京时间 12:00 自动发放
            </span>
          </div>
        </div>

        {/* Interest List */}
        <div className="space-y-3">
          {isLoading ? (
            Array(4).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-32" />
                </div>
                <Skeleton className="h-5 w-20" />
              </div>
            ))
          ) : interestTxs.length === 0 ? (
            <div className="text-center py-12">
              <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无利息记录</h3>
              <p className="text-sm text-slate-500">
                每日北京时间 12:00 自动结算 USD / USDT 可用余额利息
              </p>
            </div>
          ) : (
            interestTxs.map((tx, index) => {
              const isUsd = (tx.asset || "").toUpperCase() === "USD";
              return (
                <motion.div
                  key={tx.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex items-center gap-4 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isUsd ? "bg-green-100 text-green-600" : "bg-teal-100 text-teal-600"
                  }`}>
                    <Coins className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 text-sm">
                      {(tx.asset || "USD").toUpperCase()} 每日利息
                    </h4>
                    {tx.description && (
                      <p className="text-xs text-slate-500 truncate">{tx.description}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-0.5">
                      {format(new Date(tx.created_date), "yyyy-MM-dd HH:mm")}
                    </p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-amber-600">
                      +${tx.amount_usd?.toFixed(4)}
                    </p>
                    <Badge className="text-xs bg-green-100 text-green-800 mt-1">
                      已发放
                    </Badge>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}