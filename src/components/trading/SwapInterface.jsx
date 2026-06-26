import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, ArrowUpDown, AlertCircle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SwapInterface({ user, prices, onSwap, isLoading }) {
  const [fromAsset, setFromAsset] = useState("USD");
  const [toAsset, setToAsset] = useState("GOLD");
  const [amount, setAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState(null);

  const assets = [
    { symbol: "USD", name: "US Dollar", color: "text-green-600" },
    { symbol: "EUR", name: "Euro", color: "text-sky-600" },
    { symbol: "GBP", name: "British Pound", color: "text-indigo-600" },
    { symbol: "AUD", name: "Australian Dollar", color: "text-cyan-600" },
    { symbol: "NZD", name: "New Zealand Dollar", color: "text-emerald-600" },
    { symbol: "CAD", name: "Canadian Dollar", color: "text-red-700" },
    { symbol: "AED", name: "UAE Dirham", color: "text-stone-600" },
    { symbol: "JPY", name: "Japanese Yen", color: "text-rose-600" },
    { symbol: "HKD", name: "Hong Kong Dollar", color: "text-amber-600" },
    { symbol: "TWD", name: "New Taiwan Dollar", color: "text-fuchsia-600" },
    { symbol: "SGD", name: "Singapore Dollar", color: "text-blue-600" },
    { symbol: "CNH", name: "Chinese Yuan", color: "text-red-600" },
    { symbol: "INR", name: "Indian Rupee", color: "text-orange-600" },
    { symbol: "MYR", name: "Malaysian Ringgit", color: "text-teal-600" },
    { symbol: "THB", name: "Thai Baht", color: "text-emerald-600" },
    { symbol: "VND", name: "Vietnamese Dong", color: "text-sky-600" },
    { symbol: "IDR", name: "Indonesian Rupiah", color: "text-lime-600" },
    { symbol: "LAK", name: "Lao Kip", color: "text-amber-600" },
    { symbol: "USDT", name: "Tether USD", color: "text-gray-600" },
    { symbol: "GOLD", name: "Gold", color: "text-yellow-600" },
    { symbol: "SILVER", name: "Silver", color: "text-gray-500" },
    { symbol: "PLATINUM", name: "Platinum", color: "text-purple-600" },
    { symbol: "PALLADIUM", name: "Palladium", color: "text-pink-600" }
  ];

  const getBalance = (asset) => {
    return user?.wallet_balances?.[asset.toLowerCase()] || 0;
  };

  const calculateSwap = () => {
    if (!amount || !fromAsset || !toAsset) return null;
    
    const fromPrice = prices[fromAsset.toLowerCase()];
    const toPrice = prices[toAsset.toLowerCase()];
    
    // Check if prices are available to prevent division by zero or NaN results
    if (fromPrice === undefined || toPrice === undefined || toPrice === 0) {
      return null;
    }

    const exchangeRate = fromPrice / toPrice;
    const grossAmount = parseFloat(amount) * exchangeRate;
    const fee = grossAmount * 0.02; // 2% fee
    const netAmount = grossAmount - fee;
    
    // For display purposes, show exchange rate for small currencies in 1000 units
    const smallUnitCurrencies = ['LAK', 'VND', 'IDR'];
    const displayExchangeRate = smallUnitCurrencies.includes(fromAsset) ? exchangeRate * 1000 : exchangeRate;
    const displayFromUnit = smallUnitCurrencies.includes(fromAsset) ? `1000 ${fromAsset}` : `1 ${fromAsset}`;
    
    return {
      grossAmount,
      fee,
      netAmount,
      exchangeRate,
      displayExchangeRate,
      displayFromUnit
    };
  };

  const handleSwap = async () => {
    const calculation = calculateSwap();
    if (!calculation || isInsufficientBalance || fromAsset === toAsset) return;

    setIsSwapping(true);
    const result = await onSwap(fromAsset, toAsset, parseFloat(amount));
    setSwapResult(result);
    setIsSwapping(false);
    
    if (result.success) {
      setAmount("");
      // Clear swap result after a delay for better UX
      setTimeout(() => setSwapResult(null), 3000);
    }
  };

  const setPercentage = (percentage) => {
    const balance = getBalance(fromAsset);
    // Truncate to 2 decimal places to prevent rounding up and exceeding the balance
    const newAmount = Math.floor((balance * percentage / 100) * 100) / 100;
    setAmount(newAmount.toFixed(2));
  };

  const swapAssets = () => {
    const temp = fromAsset;
    setFromAsset(toAsset);
    setToAsset(temp);
  };

  const calculation = calculateSwap();
  const fromBalance = getBalance(fromAsset);
  const isInsufficientBalance = parseFloat(amount) > fromBalance;
  // Disable conditions for the main swap button
  const isSwapButtonDisabled = !amount || !calculation || isInsufficientBalance || isSwapping || fromAsset === toAsset || parseFloat(amount) <= 0;


  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-slate-900">
          <ArrowLeftRight className="w-6 h-6 text-blue-600" />
          资产兑换
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Asset */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">从</label>
            <span className="text-sm text-slate-500">
              余额：{fromBalance.toFixed(2)} {fromAsset}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Select value={fromAsset} onValueChange={setFromAsset}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${asset.color}`}>{asset.symbol}</span>
                      <span className="text-slate-500 text-sm">{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 text-lg"
              min="0"
              step="0.01"
            />
          </div>
          
          {/* Percentage Buttons */}
          <div className="flex gap-2">
            {[25, 50, 75, 100].map(percentage => (
              <Button
                key={percentage}
                variant="outline"
                size="sm"
                onClick={() => setPercentage(percentage)}
                className="text-xs"
                disabled={fromBalance <= 0}
              >
                {percentage}%
              </Button>
            ))}
          </div>
        </div>

        {/* Swap Button with Double Arrow */}
        <div className="flex justify-center">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="outline"
              size="icon"
              onClick={swapAssets}
              className="rounded-full bg-blue-50 hover:bg-blue-100 border-blue-200 w-12 h-12"
              disabled={isLoading || isSwapping}
            >
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
            </Button>
          </motion.div>
        </div>

        {/* To Asset */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">至</label>
            <span className="text-sm text-slate-500">
              余额：{getBalance(toAsset).toFixed(2)} {toAsset}
            </span>
          </div>
          
          <div className="flex gap-3">
            <Select value={toAsset} onValueChange={setToAsset}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {assets.map(asset => (
                  <SelectItem key={asset.symbol} value={asset.symbol}>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${asset.color}`}>{asset.symbol}</span>
                      <span className="text-slate-500 text-sm">{asset.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <div className="flex-1 p-3 bg-slate-50 rounded-lg border">
              <span className="text-lg font-medium text-slate-900">
                {calculation ? calculation.netAmount.toFixed(6) : "0.00"}
              </span>
            </div>
          </div>
        </div>

        {/* Swap Details */}
        {calculation && parseFloat(amount) > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-slate-50 rounded-lg space-y-2"
          >
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">汇率</span>
              <span className="font-medium">{calculation.displayFromUnit} = {calculation.displayExchangeRate.toFixed(6)} {toAsset}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">手续费 (2%)</span>
              <span className="font-medium text-red-600">-{calculation.fee.toFixed(6)} {toAsset}</span>
            </div>
            <div className="flex justify-between text-sm border-t pt-2">
              <span className="text-slate-600">您将收到</span>
              <span className="font-bold text-slate-900">{calculation.netAmount.toFixed(6)} {toAsset}</span>
            </div>
          </motion.div>
        )}

        {/* Error Messages */}
        <AnimatePresence>
          {isInsufficientBalance && parseFloat(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              {fromAsset} 余额不足
            </motion.div>
          )}
          {fromAsset === toAsset && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              不能在相同资产之间兑换。
            </motion.div>
          )}
          {parseFloat(amount) <= 0 && amount !== "" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              请输入正数金额进行兑换。
            </motion.div>
          )}
          {!calculation && amount !== "" && parseFloat(amount) > 0 && (prices[fromAsset.toLowerCase()] === undefined || prices[toAsset.toLowerCase()] === undefined) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              无法获取所选资产的实时价格。
            </motion.div>
          )}
        </AnimatePresence>

        {/* Swap Result */}
        <AnimatePresence>
          {swapResult && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                swapResult.success 
                  ? 'text-green-600 bg-green-50' 
                  : 'text-red-600 bg-red-50'
              }`}
            >
              {swapResult.success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  兑换成功！收到 {swapResult.netAmount.toFixed(6)} {toAsset}
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  兑换失败：{swapResult.error || "未知错误。"}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Execute Button */}
        <Button
          onClick={handleSwap}
          disabled={isSwapButtonDisabled || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
        >
          {isSwapping || isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              正在处理兑换...
            </div>
          ) : (
            <>
              <ArrowLeftRight className="w-5 h-5 mr-2" />
              执行兑换
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}