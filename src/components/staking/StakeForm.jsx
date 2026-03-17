
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PiggyBank, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StakeForm({ user, onStake, isLoading }) {
  const [asset, setAsset] = useState("GOLD");
  const [amount, setAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);

  const stakeableAssets = [
    { symbol: "GOLD", name: "Gold", color: "text-yellow-600" },
    { symbol: "SILVER", name: "Silver", color: "text-gray-500" },
    { symbol: "PLATINUM", name: "Platinum", color: "text-purple-600" },
    { symbol: "PALLADIUM", name: "Palladium", color: "text-pink-600" }
  ];

  const getBalance = (asset) => {
    return user?.wallet_balances?.[asset.toLowerCase()] || 0;
  };

  const handleStake = async () => {
    setIsStaking(true);
    await onStake(asset, parseFloat(amount));
    setIsStaking(false);
    setAmount("");
  };
  
  const setPercentage = (percentage) => {
    const balance = getBalance(asset);
    // Use floor to prevent rounding up and exceeding the balance
    const newAmount = Math.floor((balance * percentage / 100) * 100000000) / 100000000;
    setAmount(newAmount.toString());
  };

  const balance = getBalance(asset);
  const isInsufficientBalance = parseFloat(amount) > balance;
  const isInvalidAmount = !amount || parseFloat(amount) <= 0;

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <PiggyBank className="w-6 h-6 text-blue-600" />
          Create a New Stake
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Asset to Stake</label>
            <span className="text-sm text-slate-500">
              Balance: {balance.toFixed(4)}
            </span>
          </div>
          <Select value={asset} onValueChange={setAsset}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {stakeableAssets.map(asset => (
                <SelectItem key={asset.symbol} value={asset.symbol}>
                  <span className={`font-medium ${asset.color}`}>{asset.name}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-slate-700">Amount</label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="text-lg"
          />
          <div className="flex gap-2">
            {[25, 50, 75, 100].map(p => (
              <Button key={p} variant="outline" size="sm" onClick={() => setPercentage(p)} className="text-xs">{p}%</Button>
            ))}
          </div>
        </div>
        
        <AnimatePresence>
          {isInsufficientBalance && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              <AlertCircle className="w-4 h-4" />
              Insufficient {asset} balance
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={handleStake}
          disabled={isInvalidAmount || isInsufficientBalance || isStaking || isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-lg py-6"
        >
          {isStaking ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              Staking...
            </div>
          ) : "Stake Now"}
        </Button>
      </CardContent>
    </Card>
  );
}
