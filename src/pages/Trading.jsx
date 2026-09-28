import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";
import { motion } from "framer-motion";
import { getMetalPrices } from "@/functions/getMetalPrices";
import { getCryptoPrices } from "@/functions/getCryptoPrices";
import { executeSwap as executeSwapFn } from "@/functions/executeSwap";

import SwapInterface from "../components/trading/SwapInterface";
import TradingViewChart from "../components/trading/TradingViewChart";
import MarketOverview from "../components/trading/MarketOverview";
import GoldBullionNews from "@/components/trading/GoldBullionNews";
import CryptoMarket from "@/components/trading/CryptoMarket";

export default function Trading() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [prices, setPrices] = useState({});
  const [quote, setQuote] = useState(null);
  const [quoteUnavailable, setQuoteUnavailable] = useState(true);
  const [cryptoCoins, setCryptoCoins] = useState([]);
  const [cryptoLoading, setCryptoLoading] = useState(true);
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [priceChanges, setPriceChanges] = useState({
    gold: 0,
    silver: 0,
    platinum: 0,
    palladium: 0
  });
  const [selectedSymbol, setSelectedSymbol] = useState("GOLD"); // New state for selected symbol

  useEffect(() => {
    loadUserData();
    loadPrices();
    
    // Update prices every 30 seconds
    const interval = setInterval(() => {
      loadPrices();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const loadPrices = async () => {
    try {
      const [priceData, cryptoResult] = await Promise.all([getMetalPrices(), getCryptoPrices({}).catch(() => null)]);
      setCryptoCoins(cryptoResult?.data?.coins || []);
      setCryptoLoading(false);
      const updated = Date.parse(priceData.data.forexUpdatedAt);
      const forexStale = !Number.isFinite(updated) || Date.now() - updated > 4 * 24 * 60 * 60 * 1000;
      if (priceData.data.success && !priceData.data.fallback && !forexStale) {
        const combined = { ...priceData.data.prices, ...(cryptoResult?.data?.prices || {}) };
        setPrices(combined);
        setPriceChanges({ ...priceData.data.changes, ...(cryptoResult?.data?.changes || {}) });
        setQuote({ ...priceData.data, prices: combined });
        setQuoteUnavailable(false);
      } else {
        setQuoteUnavailable(true);
        setPrices({});
      }
    } catch (error) {
      setCryptoLoading(false);
      setQuoteUnavailable(true);
      setPrices({});
      console.error("Error loading prices:", error);
    }
  };

  const executeSwap = async (fromAsset, toAsset, amount) => {
    try {
      // Delegate to server-side function for atomic execution with:
      // - Fresh balance re-fetch from DB (prevents stale state)
      // - Server-side price fetching (prevents price manipulation)
      // - Server-side balance validation (prevents overdraft)
      // - Atomic balance + transaction update (prevents race conditions)
      const result = await executeSwapFn({ fromAsset, toAsset, amount });
      const data = result.data;

      if (data.success) {
        setUser(current => current ? { ...current, wallet_balances: data.newBalances } : current);
        loadUserData();
        return { success: true, netAmount: data.netAmount, fee: data.fee };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Error executing swap:", error);
      const msg = error?.response?.data?.error || error.message;
      return { success: false, error: msg };
    }
  };

  const handleSymbolClick = (symbol) => {
    setSelectedSymbol(symbol);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">
              交易中心
            </h1>
            <p className="text-slate-600 mt-2">以市场价格交易贵金属及加密货币</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-800">
              <Zap className="w-3 h-3 mr-1" />
              {quoteUnavailable ? '报价暂不可用' : '展示价模拟波动 · 交易按真实报价'}
            </Badge>
            <Badge className="bg-blue-100 text-blue-800">
              贵金属／加密货币兑换 0.5% 手续费
            </Badge>
          </div>
        </motion.div>

        {/* Chart and Market Overview */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Price Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2 h-[560px]"
          >
            <TradingViewChart symbol={selectedSymbol} />
          </motion.div>

          {/* Market Overview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[560px]"
          >
            <MarketOverview 
              prices={prices} 
              priceChanges={priceChanges} 
              onSymbolClick={handleSymbolClick}
            />
          </motion.div>
        </div>

        <CryptoMarket coins={cryptoCoins} loading={cryptoLoading} onSelect={symbol => { setSelectedCrypto({ symbol }); document.getElementById('crypto-swap')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} />

        {/* Swap Interface and Trading Tips */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <SwapInterface 
              user={user}
              cryptoCoins={cryptoCoins}
              selectedCrypto={selectedCrypto}
              prices={prices}
              quote={quote}
              quoteUnavailable={quoteUnavailable}
              onSwap={executeSwap}
              isLoading={isLoading}
            />
          </motion.div>

          {/* Trading Tips */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex"
          >
            <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg flex-1 flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <h3 className="text-lg font-bold mb-4">交易提示</h3>
                <div className="space-y-3 text-blue-100 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">所有贵金属价格按金衡盎司（31.1克）计价</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">点击上方任意金属查看其价格走势图</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">大额交易前请先关注价格走势</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">使用百分比按钮快速分配余额</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-300 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-sm">贵金属、加密货币及外汇兑换均收取 0.5% 手续费；双向兑换均从到账资产中扣除</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Gold and silver news */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <GoldBullionNews />
        </motion.div>
      </div>
    </div>
  );
}