
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator, AlertTriangle, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoanCalculator({ user, prices, onCreateLoan, isLoading }) {
  const [collateralAsset, setCollateralAsset] = useState("GOLD");
  const [loanAsset, setLoanAsset] = useState("USD");
  const [desiredLoanAmount, setDesiredLoanAmount] = useState(""); // User's target loan amount
  const [requiredCollateral, setRequiredCollateral] = useState(0); // Auto-calculated
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState(null);

  const collateralAssets = [
    { symbol: "GOLD", name: "Gold", color: "text-yellow-600" },
    { symbol: "SILVER", name: "Silver", color: "text-gray-500" },
    { symbol: "PLATINUM", name: "Platinum", color: "text-purple-600" },
    { symbol: "PALLADIUM", name: "Palladium", color: "text-pink-600" }
  ];

  const loanAssets = [
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
    { symbol: "USDT", name: "Tether USD", color: "text-gray-600" }
  ];

  const getBalance = (asset) => {
    return user?.wallet_balances?.[asset.toLowerCase()] || 0;
  };

  // Auto-calculate required collateral when desired loan amount changes
  useEffect(() => {
    if (desiredLoanAmount && parseFloat(desiredLoanAmount) > 0) {
      const loanAmountUSD = parseFloat(desiredLoanAmount) * (prices[loanAsset.toLowerCase()] || 1);
      const collateralValueNeeded = loanAmountUSD / 0.8; // Since max LTV is 80%
      const collateralPrice = prices[collateralAsset.toLowerCase()] || 0;
      
      if (collateralPrice > 0) {
        const collateralAmountNeeded = collateralValueNeeded / collateralPrice;
        setRequiredCollateral(collateralAmountNeeded);
      } else {
        setRequiredCollateral(0);
      }
    } else {
      setRequiredCollateral(0);
    }
  }, [desiredLoanAmount, loanAsset, collateralAsset, prices]);

  const calculateLoanDetails = () => {
    if (!desiredLoanAmount || parseFloat(desiredLoanAmount) <= 0 || requiredCollateral <= 0) return null;
    
    const loanAmount = parseFloat(desiredLoanAmount);
    const loanAmountUSD = loanAmount * (prices[loanAsset.toLowerCase()] || 1);
    const collateralPrice = prices[collateralAsset.toLowerCase()] || 0;
    const collateralValue = requiredCollateral * collateralPrice;
    const ltvRatio = collateralValue > 0 ? (loanAmountUSD / collateralValue) * 100 : 0;
    const interestRate = 8.5;
    
    return {
      loanAmount,
      loanAmountUSD,
      collateralValue,
      ltvRatio,
      interestRate,
      monthlyInterestUSD: (loanAmountUSD * interestRate) / 100 / 12,
      monthlyInterest: (loanAmount * interestRate) / 100 / 12
    };
  };

  const calculation = calculateLoanDetails();

  const handleCreateLoan = async () => {
    if (!calculation || requiredCollateral <= 0) return;

    setIsCreating(true);
    const loanData = {
      collateral_asset: collateralAsset,
      collateral_amount: requiredCollateral,
      loan_asset: loanAsset,
      loan_amount: calculation.loanAmount,
      ltv_ratio: calculation.ltvRatio,
      interest_rate: calculation.interestRate,
      status: "active"
    };

    const result = await onCreateLoan(loanData);
    setResult(result);
    setIsCreating(false);
    
    if (result.success) {
      setDesiredLoanAmount("");
      setRequiredCollateral(0);
      setTimeout(() => setResult(null), 3000);
    }
  };

  const collateralBalance = getBalance(collateralAsset);
  const isInsufficientBalance = requiredCollateral > collateralBalance;
  const hasValidInput = desiredLoanAmount && parseFloat(desiredLoanAmount) > 0;

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Calculator Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Calculator className="w-6 h-6 text-blue-600" />
            Loan Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Desired Loan Amount Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">How much do you want to borrow?</label>
            
            <div className="flex gap-3">
              <Select value={loanAsset} onValueChange={setLoanAsset}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {loanAssets.map(asset => (
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
                placeholder="Enter amount..."
                value={desiredLoanAmount}
                onChange={(e) => setDesiredLoanAmount(e.target.value)}
                className="flex-1 text-lg"
              />
            </div>
          </div>

          {/* Required Collateral Display */}
          {hasValidInput && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700">Required Collateral</label>
                <span className="text-sm text-slate-500">
                  Available: {collateralBalance.toFixed(4)}
                </span>
              </div>
              
              <div className="flex gap-3">
                <Select value={collateralAsset} onValueChange={setCollateralAsset}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {collateralAssets.map(asset => (
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
                  value={requiredCollateral.toFixed(6)}
                  readOnly
                  className="flex-1 text-lg bg-slate-50"
                />
              </div>
            </motion.div>
          )}

          {/* Error Messages */}
          <AnimatePresence>
            {isInsufficientBalance && hasValidInput && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
              >
                <AlertTriangle className="w-4 h-4" />
                Insufficient {collateralAsset} balance. You need {requiredCollateral.toFixed(4)} but only have {collateralBalance.toFixed(4)}.
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Messages */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
                  result.success 
                    ? 'text-green-600 bg-green-50' 
                    : 'text-red-600 bg-red-50'
                }`}
              >
                {result.success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Loan created successfully!
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4" />
                    Loan creation failed: {result.error}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Create Loan Button */}
          <Button
            onClick={handleCreateLoan}
            disabled={!hasValidInput || !calculation || isInsufficientBalance || isCreating}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg py-6"
          >
            {isCreating ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Creating Loan...
              </div>
            ) : (
              <>
                <Calculator className="w-5 h-5 mr-2" />
                Create Loan
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Loan Details */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-slate-900">Loan Details</CardTitle>
        </CardHeader>
        <CardContent>
          {calculation ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-600">Loan Amount</span>
                  <div className="text-right">
                    <span className="font-bold text-green-600">{calculation.loanAmount.toFixed(2)} {loanAsset}</span>
                    <span className="text-xs text-slate-500 block">≈ ${calculation.loanAmountUSD.toFixed(2)} USD</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Required Collateral</span>
                  <div className="text-right">
                    <span className="font-semibold">{requiredCollateral.toFixed(4)} {collateralAsset}</span>
                    <span className="text-xs text-slate-500 block">≈ ${calculation.collateralValue.toFixed(2)} USD</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">LTV Ratio</span>
                  <span className="font-semibold">{calculation.ltvRatio.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Interest Rate</span>
                  <span className="font-semibold">{calculation.interestRate}% APR</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-slate-600">Monthly Interest</span>
                  <div className="text-right">
                    <span className="font-bold text-slate-900">{calculation.monthlyInterest.toFixed(2)} {loanAsset}</span>
                    <span className="text-xs text-slate-500 block">≈ ${calculation.monthlyInterestUSD.toFixed(2)} USD</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Loan Terms</h4>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Loan-to-value ratio: {calculation.ltvRatio.toFixed(1)}%</li>
                  <li>• Liquidation threshold at 85% LTV</li>
                  <li>• Interest compounds daily</li>
                  <li>• Early repayment allowed without penalty</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Calculator className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Enter Loan Amount</h3>
              <p className="text-slate-600">Specify how much you want to borrow to see required collateral</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
