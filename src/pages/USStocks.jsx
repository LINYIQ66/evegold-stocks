import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { getUserTransactions } from "@/functions/getUserTransactions";
import { executeStockTrade } from "@/functions/executeStockTrade";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Zap } from "lucide-react";
import { motion } from "framer-motion";

import StockChart from "../components/usstocks/StockChart";
import StockMarketOverview from "../components/usstocks/StockMarketOverview";
import StockTradeInterface from "../components/usstocks/StockTradeInterface";
import StockHoldings from "../components/usstocks/StockHoldings";
import StockTradeHistory from "../components/usstocks/StockTradeHistory";
import USStocksFooter from "../components/usstocks/USStocksFooter";
import USStockPendingOrders from "../components/usstocks/USStockPendingOrders.jsx";

export default function USStocks() {
  const [selectedSymbol, setSelectedSymbol] = useState("AAPL");
  const [user, setUser] = useState(null);
  const [livePrice, setLivePrice] = useState(null);
  const [allPrices, setAllPrices] = useState({});
  const [transactions, setTransactions] = useState([]);

  const refreshUser = async () => {
    try {
      const u = await User.me();
      setUser(u);
    } catch {}
  };

  const loadTransactions = async () => {
    try {
      const result = await getUserTransactions({});
      setTransactions(result?.data?.transactions || []);
    } catch {}
  };

  useEffect(() => {
    refreshUser();
    loadTransactions();
  }, []);

  // Reset livePrice when symbol changes
  useEffect(() => {
    setLivePrice(null);
  }, [selectedSymbol]);

  /**
   * handleTrade is called with the already-computed calc object from StockTradeInterface.
   * BUY:  calc = { spent, fee, sharesReceived, execPrice }
   *       Deduct `spent` USDT, add `sharesReceived` shares
   * SELL: calc = { shares, gross, fee, netUsdt, execPrice }
   *       Deduct `shares` stock, add `netUsdt` USDT
   */
  const handleTrade = async (side, symbol, calc, currency = "USDT", orderType = "market") => {
    try {
      if (!user) return { success: false, error: "Please log in to trade." };

      // Delegate to server-side function for atomic execution with:
      // - Fresh balance re-fetch from DB (prevents stale state)
      // - Server-side price fetching for market orders (prevents price manipulation)
      // - Server-side balance validation (prevents overdraft)
      // - Atomic balance + transaction update (prevents race conditions)
      const result = await executeStockTrade({
        side,
        symbol,
        currency,
        orderType,
        spendAmount: side === "buy" ? calc.spent : undefined,
        shares: side === "buy" ? calc.sharesReceived : calc.shares,
        limitPrice: orderType === "limit" ? calc.execPrice : undefined,
      });
      const data = result.data;

      if (data.success) {
        await refreshUser();
        loadTransactions();
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      const msg = error?.response?.data?.error || error.message;
      return { success: false, error: msg };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-3"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              美股交易
            </h1>
            <p className="text-slate-500 mt-1 text-sm">代币化美股 · 0.1% 手续费</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-green-100 text-green-800 text-xs">
              <Zap className="w-3 h-3 mr-1" /> 实时报价
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 text-xs">
              <TrendingUp className="w-3 h-3 mr-1" /> 0.1% 手续费
            </Badge>
          </div>
        </motion.div>

        {/* Chart + Market List */}
        <div className="grid lg:grid-cols-3 gap-6 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2 h-[520px]"
          >
            <StockChart symbol={selectedSymbol} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="h-[520px]"
          >
            <StockMarketOverview
              onStockClick={setSelectedSymbol}
              selectedSymbol={selectedSymbol}
              onPriceUpdate={setLivePrice}
              onAllPricesUpdate={setAllPrices}
              user={user}
            />
          </motion.div>
        </div>

        {/* Trade Interface */}
        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <StockTradeInterface
              user={user}
              selectedSymbol={selectedSymbol}
              livePrice={livePrice}
              onTrade={handleTrade}
            />
          </motion.div>
          <USStockPendingOrders
            transactions={transactions}
            onRefresh={() => { refreshUser(); loadTransactions(); }}
            livePrice={livePrice}
            allPrices={allPrices}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
          >
            <StockHoldings
              user={user}
              prices={allPrices}
              onSymbolClick={setSelectedSymbol}
              transactions={transactions}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <StockTradeHistory transactions={transactions} />
          </motion.div>
        </div>

        {/* Footer */}
        <USStocksFooter />
      </div>
    </div>
  );
}