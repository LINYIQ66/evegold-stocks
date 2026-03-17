
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Banknote, Calculator, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function ActiveLoans({ loans, prices, onRepayLoan, isLoading, user }) {
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [repaymentType, setRepaymentType] = useState("full");
  const [paymentAsset, setPaymentAsset] = useState("USD");
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const calculateInterest = (loan) => {
    // Aligned with backend logic for consistency
    const loanCreatedDate = new Date(loan.created_date);
    const daysSinceLoan = Math.max(0, Math.floor((new Date() - loanCreatedDate) / (1000 * 60 * 60 * 24)));
    const dailyRate = (loan.interest_rate / 100) / 365;
    const accruedInterest = loan.loan_amount * dailyRate * daysSinceLoan;
    return accruedInterest;
  };

  const calculateRepaymentAmount = (loan, type) => {
    const interest = calculateInterest(loan);
    const principal = loan.loan_amount;
    
    switch (type) {
      case "25":
        return (principal + interest) * 0.25;
      case "50":
        return (principal + interest) * 0.50;
      case "75":
        return (principal + interest) * 0.75;
      case "full":
        return principal + interest;
      case "interest_only":
        return interest;
      default:
        return principal + interest;
    }
  };

  const calculateCurrentLTV = (loan) => {
    const collateralPrice = prices[loan.collateral_asset.toLowerCase()] || 0;
    const currentCollateralValue = loan.collateral_amount * collateralPrice;
    return currentCollateralValue > 0 ? (loan.loan_amount / currentCollateralValue) * 100 : 0;
  };

  const getLTVColor = (ltv) => {
    if (ltv >= 85) return "text-red-600 bg-red-100";
    if (ltv >= 75) return "text-orange-600 bg-orange-100";
    return "text-green-600 bg-green-100";
  };

  const handleRepaymentClick = (loan, type) => {
    setSelectedLoan(loan);
    setRepaymentType(type);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmRepayment = async () => {
    if (!selectedLoan) return;
    
    const repaymentAmount = calculateRepaymentAmount(selectedLoan, repaymentType);
    // Pass the payment asset to the handler function
    const result = await onRepayLoan(selectedLoan.id, repaymentAmount, paymentAsset);
    
    if (result.success) {
      setIsConfirmModalOpen(false);
      setSelectedLoan(null);
    }
  };

  const getPaymentAssetBalance = (asset) => {
    return user?.wallet_balances?.[asset.toLowerCase()] || 0;
  };

  const getRepaymentAmountInAsset = (usdAmount, asset) => {
    const assetPrice = prices[asset.toLowerCase()] || 1;
    return usdAmount / assetPrice;
  };

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {Array(3).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-24 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (loans.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Banknote className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Loans</h3>
          <p className="text-slate-600">You don't have any active loans. Use the calculator to create your first loan.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {loans.map((loan, index) => {
          const currentLTV = calculateCurrentLTV(loan);
          const collateralPrice = prices[loan.collateral_asset.toLowerCase()] || 0;
          const collateralValue = loan.collateral_amount * collateralPrice;
          const accruedInterest = calculateInterest(loan);
          const totalOwed = loan.loan_amount + accruedInterest;
          const daysSinceLoan = Math.max(0, Math.floor((new Date() - new Date(loan.created_date)) / (1000 * 60 * 60 * 24))); // Consistent with calculateInterest
          
          return (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Banknote className="w-5 h-5 text-blue-600" />
                      {loan.collateral_asset} Collateralized Loan
                    </CardTitle>
                    <Badge className={`px-3 py-1 ${getLTVColor(currentLTV)} border`}>
                      {currentLTV.toFixed(1)}% LTV
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Loan Overview */}
                  <div className="grid md:grid-cols-5 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Principal</p>
                      <p className="text-xl font-bold text-slate-900">
                        {loan.loan_amount.toFixed(2)} {loan.loan_asset}
                      </p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Accrued Interest</p>
                      <p className="text-xl font-bold text-yellow-700">
                        {accruedInterest.toFixed(2)} {loan.loan_asset}
                      </p>
                      <p className="text-xs text-slate-500">{daysSinceLoan} days</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Total Owed</p>
                      <p className="text-xl font-bold text-red-700">
                        {totalOwed.toFixed(2)} {loan.loan_asset}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Collateral</p>
                      <p className="text-xl font-bold text-slate-900">
                        {loan.collateral_amount.toFixed(4)} {loan.collateral_asset}
                      </p>
                      <p className="text-sm text-slate-500">
                        ≈ ${collateralValue.toFixed(2)}
                      </p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg">
                      <p className="text-sm text-slate-600 mb-1">Interest Rate</p>
                      <p className="text-xl font-bold text-slate-900">
                        {loan.interest_rate}% APR
                      </p>
                      <p className="text-xs text-slate-500">
                         {((loan.loan_amount * (loan.interest_rate / 100) / 365)).toFixed(2)} {loan.loan_asset}/day
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-slate-200">
                     <Button
                      onClick={() => handleRepaymentClick(loan, "interest_only")}
                      variant="outline"
                      className="flex-1"
                    >
                      Pay Interest
                      <span className="text-xs ml-1">({(accruedInterest).toFixed(2)} {loan.loan_asset})</span>
                    </Button>
                    <Button
                      onClick={() => handleRepaymentClick(loan, "25")}
                      variant="outline"
                      className="flex-1"
                    >
                      25%
                      <span className="text-xs ml-1">({(totalOwed * 0.25).toFixed(2)} {loan.loan_asset})</span>
                    </Button>
                    <Button
                      onClick={() => handleRepaymentClick(loan, "50")}
                      variant="outline"
                      className="flex-1"
                    >
                      50%
                      <span className="text-xs ml-1">({(totalOwed * 0.50).toFixed(2)} {loan.loan_asset})</span>
                    </Button>
                    <Button
                      onClick={() => handleRepaymentClick(loan, "full")}
                      className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    >
                      Full Repayment
                      <span className="text-xs ml-1">({totalOwed.toFixed(2)} {loan.loan_asset})</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Repayment Confirmation Modal */}
      <Dialog open={isConfirmModalOpen} onOpenChange={setIsConfirmModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Confirm Repayment
            </DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">Repayment Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Principal:</span>
                    <span>{selectedLoan.loan_amount.toFixed(2)} {selectedLoan.loan_asset}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accrued Interest:</span>
                    <span>{calculateInterest(selectedLoan).toFixed(2)} {selectedLoan.loan_asset}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-2">
                    <span>Total Amount:</span>
                    <span>{calculateRepaymentAmount(selectedLoan, repaymentType).toFixed(2)} {selectedLoan.loan_asset}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">Payment Asset</label>
                <Select value={paymentAsset} onValueChange={setPaymentAsset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="CNH">CNH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-blue-700">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Amount to deduct: {getRepaymentAmountInAsset(
                        calculateRepaymentAmount(selectedLoan, repaymentType),
                        paymentAsset
                      ).toFixed(2)} {paymentAsset}
                    </span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">
                    Available balance: {getPaymentAssetBalance(paymentAsset).toFixed(2)} {paymentAsset}
                  </div>
                </div>

                {getPaymentAssetBalance(paymentAsset) < getRepaymentAmountInAsset(
                  calculateRepaymentAmount(selectedLoan, repaymentType),
                  paymentAsset
                ) && (
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-red-700">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Insufficient {paymentAsset} balance</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmRepayment}
                  disabled={getPaymentAssetBalance(paymentAsset) < getRepaymentAmountInAsset(
                    calculateRepaymentAmount(selectedLoan, repaymentType),
                    paymentAsset
                  )}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  Confirm Repayment
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
