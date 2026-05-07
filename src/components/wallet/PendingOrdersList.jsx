import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, X, TrendingUp, TrendingDown, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Transaction, User } from "@/entities/all";

export default function PendingOrdersList({ orders, isLoading, onRefresh }) {
  const [cancellingId, setCancellingId] = useState(null);

  const handleCancel = async (order) => {
    setCancellingId(order.id);
    try {
      // Parse the limit order metadata from description
      let meta = {};
      try { meta = JSON.parse(order.description || "{}"); } catch {}

      const { side, currency, symbol, shares } = meta;
      const currencyKey = (currency || "usdt").toLowerCase();
      const stockKey = (symbol || order.from_asset || "").toLowerCase();

      // Get latest user data
      const user = await User.me();
      const newBalances = { ...(user.wallet_balances || {}) };

      if (side === "buy") {
        // Unfreeze USDT/USD: add back frozen amount
        const frozenKey = `frozen_${currencyKey}`;
        const frozenAmt = newBalances[frozenKey] || 0;
        const refundAmt = Math.min(order.amount_usd, frozenAmt);
        newBalances[currencyKey] = (newBalances[currencyKey] || 0) + refundAmt;
        newBalances[frozenKey] = Math.max(0, frozenAmt - refundAmt);
      } else {
        // Unfreeze shares: add back frozen stock
        const frozenKey = `frozen_${stockKey}`;
        const frozenAmt = newBalances[frozenKey] || 0;
        const refundShares = Math.min(shares || 0, frozenAmt);
        newBalances[stockKey] = (newBalances[stockKey] || 0) + refundShares;
        newBalances[frozenKey] = Math.max(0, frozenAmt - refundShares);
      }

      // Mark transaction as failed (cancelled)
      await Transaction.update(order.id, { status: "failed", description: JSON.stringify({ ...meta, cancelledAt: new Date().toISOString() }) });
      await User.updateMyUserData({ wallet_balances: newBalances });
      onRefresh();
    } catch (e) {
      console.error("Cancel failed:", e);
    }
    setCancellingId(null);
  };

  const pendingOrders = orders.filter(t =>
    t.status === "pending" &&
    t.transaction_type === "swap"
  );

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <Card key={i} className="bg-white/80 border-0 shadow">
            <CardContent className="p-4">
              <div className="animate-pulse flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-slate-200 rounded" />
                  <div className="h-3 w-24 bg-slate-200 rounded" />
                </div>
                <div className="h-8 w-20 bg-slate-200 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (pendingOrders.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        <Clock className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="font-medium">No pending limit orders</p>
        <p className="text-sm mt-1">Limit orders will appear here until executed or cancelled</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {pendingOrders.map((order, i) => {
          let meta = {};
          try { meta = JSON.parse(order.description || "{}"); } catch {}
          const { side, currency, symbol, limitPrice, shares } = meta;
          const isBuy = side === "buy";

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-white/90 border-0 shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isBuy ? "bg-green-100" : "bg-red-100"}`}>
                        {isBuy
                          ? <TrendingUp className="w-4 h-4 text-green-600" />
                          : <TrendingDown className="w-4 h-4 text-red-600" />}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-slate-900 text-sm">
                            {isBuy ? "Buy" : "Sell"} {symbol || order.to_asset}
                          </span>
                          <Badge className={`text-xs ${isBuy ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            Limit Order
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Frozen
                          </Badge>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 space-x-2">
                          <span>
                            {isBuy
                              ? `Frozen: $${order.amount_usd.toFixed(2)} ${currency || "USDT"}`
                              : `Frozen: ${shares?.toFixed(6) || "—"} ${symbol || order.from_asset}`}
                          </span>
                          <span>·</span>
                          <span>Limit @ ${parseFloat(limitPrice || order.exchange_rate || 0).toFixed(2)}</span>
                          <span>·</span>
                          <span>{order.created_date ? format(new Date(order.created_date), "MMM d, HH:mm") : "—"}</span>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(order)}
                      disabled={cancellingId === order.id}
                      className="flex-shrink-0 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 gap-1"
                    >
                      {cancellingId === order.id ? (
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-red-600" />
                      ) : (
                        <X className="w-3.5 h-3.5" />
                      )}
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}