
import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, File, Copy, Check, AlertCircle } from "lucide-react";

const CopyButton = ({ text }) => {
    const [isCopied, setIsCopied] = useState(false);
    const copy = async () => {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    return (
        <Button variant="ghost" size="sm" onClick={copy} className="gap-1">
            {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {isCopied ? "Copied!" : "Copy"}
        </Button>
    );
};

export default function DepositModal({ isOpen, onClose, onSubmit, settings }) {
  const [method, setMethod] = useState("usdt");
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [proofOfPayment, setProofOfPayment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usdtNetwork, setUsdtNetwork] = useState("erc20");
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProofOfPayment(e.target.files[0]);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const submissionMethod = method === 'usdt' ? `usdt_${usdtNetwork}` : 'bank_transfer';
    await onSubmit({ method: submissionMethod, asset, amount: parseFloat(amount), proofOfPayment });
    setIsSubmitting(false);
  };
  
  const handleMethodChange = (value) => {
      setMethod(value);
      if (value === 'usdt') {
        setAsset('USDT');
      } else {
        setAsset('USD'); // Default to USD for bank transfer
      }
  };

  const bankDetails = (() => {
    if (asset === 'SGD') return settings.bank_deposit_details_sgd;
    if (asset === 'CNH') return settings.bank_deposit_details_cnh;
    return settings.bank_deposit_details;
  })();

  const usdtAddresses = {
    erc20: settings.usdt_deposit_address_erc20?.address || "Not configured",
    trc20: settings.usdt_deposit_address_trc20?.address || "Not configured",
    sol: settings.usdt_deposit_address_sol?.address || "Not configured"
  };
  const selectedUsdtAddress = usdtAddresses[usdtNetwork];

  const networkAlerts = {
    erc20: "Only send USDT on the Ethereum (ERC-20) network.",
    trc20: "Only send USDT on the TRON (TRC-20) network.",
    sol: "Only send USDT on the Solana network."
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div>
            <Label>Deposit Method</Label>
            <Select value={method} onValueChange={handleMethodChange}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="usdt">USDT</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {method === 'bank_transfer' && (
            <div className="space-y-4">
              <div>
                <Label>Currency</Label>
                <Select value={asset} onValueChange={setAsset}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="SGD">SGD</SelectItem>
                    <SelectItem value="CNH">CNH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-4 bg-slate-100 rounded-lg space-y-2">
                  <h4 className="font-semibold">Bank Transfer Details ({asset})</h4>
                  <p><strong>Bank:</strong> {bankDetails?.name || "Not configured"}</p>
                  <p><strong>Account Number:</strong> {bankDetails?.number || "Not configured"}</p>
                  <p><strong>Beneficiary:</strong> {bankDetails?.beneficiary || "Not configured"}</p>
              </div>
            </div>
          )}

          {method === 'usdt' && (
            <div className="space-y-4">
              <div>
                <Label>Network</Label>
                <Select value={usdtNetwork} onValueChange={setUsdtNetwork}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="erc20">ERC-20 (Ethereum)</SelectItem>
                    <SelectItem value="trc20">TRC-20 (TRON)</SelectItem>
                    <SelectItem value="sol">Solana</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-slate-100 rounded-lg space-y-3 text-center">
                  <h4 className="font-semibold">Deposit USDT ({usdtNetwork.toUpperCase()})</h4>
                  <div className="flex justify-center bg-white p-4 rounded-lg">
                    {selectedUsdtAddress !== "Not configured" ? (
                      <img src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${selectedUsdtAddress}`} alt="USDT Deposit QR Code" />
                    ) : (
                      <div className="w-40 h-40 flex items-center justify-center bg-gray-200 text-gray-500 text-sm">QR Not Available</div>
                    )}
                  </div>
                  <div className="flex items-center justify-between bg-white p-2 rounded-md">
                      <p className="text-sm break-all">{selectedUsdtAddress}</p>
                      <CopyButton text={selectedUsdtAddress} />
                  </div>
                  <p className="text-xs text-red-600 bg-red-50 p-2 rounded-md flex items-center gap-2">
                    <AlertCircle className="w-6 h-6 flex-shrink-0" />
                    <span>{networkAlerts[usdtNetwork]} Sending other assets or using the wrong network will result in permanent loss.</span>
                  </p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="amount">Amount ({asset})</Label>
            <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          </div>

          <div>
            <Label>Proof of Payment</Label>
            <div 
              onClick={handleUploadAreaClick}
              className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-slate-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
                <div className="flex text-sm text-slate-600">
                  <span className="relative bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                  </span>
                  <p className="pl-1">or click to browse</p>
                  <input 
                    ref={fileInputRef}
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileChange}
                    accept="image/png, image/jpeg, application/pdf"
                  />
                </div>
                <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
              </div>
            </div>
            {proofOfPayment && (
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-700">
                <File className="w-4 h-4" />
                <span>{proofOfPayment.name}</span>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={!proofOfPayment || isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Deposit Request"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
