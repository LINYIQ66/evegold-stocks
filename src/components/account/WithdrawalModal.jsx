
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function WithdrawalModal({ isOpen, onClose, onSubmit, user }) {
  const [method, setMethod] = useState("bank_transfer");
  const [asset, setAsset] = useState("USD");
  const [amount, setAmount] = useState("");
  const [details, setDetails] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMethodChange = (value) => {
    setMethod(value);
    setDetails({});
    if (value === 'crypto') {
      setAsset('USDT');
    } else {
      setAsset('USD');
    }
  };

  const handleAssetChange = (value) => {
    setAsset(value);
  }

  const handleDetailChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    await onSubmit({
      method: method,
      asset: asset,
      amount: parseFloat(amount),
      user_destination_details: details
    });
    setIsSubmitting(false);
    onClose();
  };
  
  const currentBalance = user?.wallet_balances?.[asset.toLowerCase()] || 0;
  const isAmountInvalid = parseFloat(amount) > currentBalance || parseFloat(amount) <= 0;

  const validateForm = () => {
    if (!amount || isAmountInvalid) return false;
    if (method === 'bank_transfer') {
      return details.bankName && details.accountNumber && details.beneficiaryName && details.swiftCode;
    }
    if (method === 'crypto') {
      return details.walletAddress;
    }
    return false;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Withdrawal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label>Withdrawal Method</Label>
            <Select value={method} onValueChange={handleMethodChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                <SelectItem value="crypto">Crypto (USDT)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label>Asset</Label>
            {method === 'bank_transfer' ? (
                <Select value={asset} onValueChange={handleAssetChange}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                    <SelectItem value="NZD">NZD - New Zealand Dollar</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AED">AED - UAE Dirham</SelectItem>
                    <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                    <SelectItem value="HKD">HKD - Hong Kong Dollar</SelectItem>
                    <SelectItem value="TWD">TWD - New Taiwan Dollar</SelectItem>
                    <SelectItem value="SGD">SGD - Singapore Dollar</SelectItem>
                    <SelectItem value="CNH">CNH - Chinese Yuan</SelectItem>
                    <SelectItem value="VND">VND - Vietnamese Dong</SelectItem>
                    <SelectItem value="LAK">LAK - Lao Kip</SelectItem>
                    <SelectItem value="MYR">MYR - Malaysian Ringgit</SelectItem>
                    <SelectItem value="THB">THB - Thai Baht</SelectItem>
                    <SelectItem value="IDR">IDR - Indonesian Rupiah</SelectItem>
                  </SelectContent>
                </Select>
            ) : (
                <Input value="USDT" disabled />
            )}
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1">
                <Label htmlFor="amount">Amount to Withdraw</Label>
                <span className="text-sm text-slate-500">
                    Balance: {currentBalance.toFixed(2)} {asset}
                </span>
            </div>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
             {amount && isAmountInvalid && <p className="text-sm text-red-500 mt-1">Invalid amount or exceeds balance.</p>}
          </div>

          <div className="p-4 bg-slate-100 rounded-lg space-y-4">
            <h4 className="font-semibold">Destination Details</h4>
            {method === 'bank_transfer' && (
              <div className="space-y-3">
                <Input name="bankName" placeholder="Bank Name" onChange={handleDetailChange} required />
                <Input name="swiftCode" placeholder="SWIFT/BIC Code (e.g., DBSSSGSG)" onChange={handleDetailChange} required />
                <Input name="accountNumber" placeholder="Account Number" onChange={handleDetailChange} required />
                <Input name="beneficiaryName" placeholder="Beneficiary Name" onChange={handleDetailChange} required />
                <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                  <strong>Important:</strong> Ensure all details are accurate. International transfers may take 1-5 business days and incur bank fees.
                </div>
              </div>
            )}
            {method === 'crypto' && (
              <div className="space-y-2">
                 <Textarea name="walletAddress" placeholder="USDT Wallet Address (e.g., ERC-20, TRC-20, Solana)" onChange={handleDetailChange} required />
                 <p className="text-xs text-slate-500">Please ensure the address and network are correct. We are not liable for funds sent to wrong addresses.</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting || !validateForm()}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
