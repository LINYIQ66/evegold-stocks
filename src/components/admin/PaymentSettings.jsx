import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";

export default function PaymentSettings({ settings, onUpdateSettings }) {
  const [usdtErc20Address, setUsdtErc20Address] = useState('');
  const [usdtTrc20Address, setUsdtTrc20Address] = useState('');
  const [usdtSolAddress, setUsdtSolAddress] = useState('');
  const [bankDetails, setBankDetails] = useState({ name: '', number: '', beneficiary: '' });
  const [sgdBankDetails, setSgdBankDetails] = useState({ name: '', number: '', beneficiary: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setUsdtErc20Address(settings.usdt_deposit_address_erc20?.address || '');
    setUsdtTrc20Address(settings.usdt_deposit_address_trc20?.address || '');
    setUsdtSolAddress(settings.usdt_deposit_address_sol?.address || '');
    setBankDetails(settings.bank_deposit_details || { name: '', number: '', beneficiary: '' });
    setSgdBankDetails(settings.bank_deposit_details_sgd || { name: '', number: '', beneficiary: '' });
  }, [settings]);

  const handleSaveSetting = async (key, value) => {
    setIsSaving(true);
    await onUpdateSettings(key, value);
    setIsSaving(false);
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>USDT Deposit Settings</CardTitle>
        </CardHeader>
        <CardContent>
           <Tabs defaultValue="erc20">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="erc20">ERC-20</TabsTrigger>
              <TabsTrigger value="trc20">TRC-20</TabsTrigger>
              <TabsTrigger value="sol">Solana</TabsTrigger>
            </TabsList>
            <TabsContent value="erc20" className="pt-4 space-y-4">
              <div>
                <Label htmlFor="usdt-erc20-address">USDT (ERC-20) Wallet Address</Label>
                <Input 
                  id="usdt-erc20-address" 
                  value={usdtErc20Address}
                  onChange={(e) => setUsdtErc20Address(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <Button onClick={() => handleSaveSetting('usdt_deposit_address_erc20', { address: usdtErc20Address })} className="gap-2" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save ERC-20 Address</>}
              </Button>
            </TabsContent>
            <TabsContent value="trc20" className="pt-4 space-y-4">
               <div>
                <Label htmlFor="usdt-trc20-address">USDT (TRC-20) Wallet Address</Label>
                <Input 
                  id="usdt-trc20-address" 
                  value={usdtTrc20Address}
                  onChange={(e) => setUsdtTrc20Address(e.target.value)}
                  placeholder="T..."
                />
              </div>
              <Button onClick={() => handleSaveSetting('usdt_deposit_address_trc20', { address: usdtTrc20Address })} className="gap-2" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save TRC-20 Address</>}
              </Button>
            </TabsContent>
            <TabsContent value="sol" className="pt-4 space-y-4">
               <div>
                <Label htmlFor="usdt-sol-address">USDT (Solana) Wallet Address</Label>
                <Input 
                  id="usdt-sol-address" 
                  value={usdtSolAddress}
                  onChange={(e) => setUsdtSolAddress(e.target.value)}
                  placeholder="So..."
                />
              </div>
              <Button onClick={() => handleSaveSetting('usdt_deposit_address_sol', { address: usdtSolAddress })} className="gap-2" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save Solana Address</>}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Bank Transfer Deposit Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="usd_bank">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="usd_bank">USD Details</TabsTrigger>
              <TabsTrigger value="sgd_bank">SGD Details</TabsTrigger>
            </TabsList>
            <TabsContent value="usd_bank" className="pt-4 space-y-4">
              <div>
                <Label htmlFor="bank-name">Bank Name (USD)</Label>
                <Input 
                  id="bank-name"
                  value={bankDetails.name}
                  onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="account-number">Account Number (USD)</Label>
                <Input 
                  id="account-number"
                  value={bankDetails.number}
                  onChange={(e) => setBankDetails({...bankDetails, number: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="beneficiary-name">Beneficiary Name (USD)</Label>
                <Input 
                  id="beneficiary-name"
                  value={bankDetails.beneficiary}
                  onChange={(e) => setBankDetails({...bankDetails, beneficiary: e.target.value})}
                />
              </div>
              <Button onClick={() => handleSaveSetting('bank_deposit_details', bankDetails)} className="gap-2" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save USD Bank Details</>}
              </Button>
            </TabsContent>
            <TabsContent value="sgd_bank" className="pt-4 space-y-4">
              <div>
                <Label htmlFor="sgd-bank-name">Bank Name (SGD)</Label>
                <Input 
                  id="sgd-bank-name"
                  value={sgdBankDetails.name}
                  onChange={(e) => setSgdBankDetails({...sgdBankDetails, name: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sgd-account-number">Account Number (SGD)</Label>
                <Input 
                  id="sgd-account-number"
                  value={sgdBankDetails.number}
                  onChange={(e) => setSgdBankDetails({...sgdBankDetails, number: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="sgd-beneficiary-name">Beneficiary Name (SGD)</Label>
                <Input 
                  id="sgd-beneficiary-name"
                  value={sgdBankDetails.beneficiary}
                  onChange={(e) => setSgdBankDetails({...sgdBankDetails, beneficiary: e.target.value})}
                />
              </div>
              <Button onClick={() => handleSaveSetting('bank_deposit_details_sgd', sgdBankDetails)} className="gap-2" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4" /> Save SGD Bank Details</>}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}