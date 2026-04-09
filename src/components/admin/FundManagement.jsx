import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, MinusCircle, Search, DollarSign, Lock, Wallet } from "lucide-react";

export default function FundManagement({ users, onAddFunds, onDeductFunds, isLoading }) {
  const [selectedUser, setSelectedUser] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("USD");
  const [balanceType, setBalanceType] = useState("wallet"); // "wallet" or "locked"
  const [notes, setNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const assets = [
    { value: "usd", label: "USD" },
    { value: "sgd", label: "SGD" },
    { value: "cnh", label: "CNH" },
    { value: "inr", label: "INR" },
    { value: "myr", label: "MYR" },
    { value: "thb", label: "THB" },
    { value: "vnd", label: "VND" },
    { value: "idr", label: "IDR" },
    { value: "lak", label: "LAK" },
    { value: "usdt", label: "USDT" },
    { value: "gold", label: "Gold" },
    { value: "silver", label: "Silver" },
    { value: "platinum", label: "Platinum" },
    { value: "palladium", label: "Palladium" }
  ];

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Auto-select if search matches exactly one user
  React.useEffect(() => {
    if (filteredUsers.length === 1 && searchTerm) {
      setSelectedUser(filteredUsers[0].id);
    }
  }, [filteredUsers, searchTerm]);

  const handleAddFunds = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    await onAddFunds(selectedUser, asset.toLowerCase(), parseFloat(amount), notes, balanceType);
    resetForm();
    setIsProcessing(false);
  };

  const handleDeductFunds = async () => {
    if (!selectedUser || !amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    await onDeductFunds(selectedUser, asset.toLowerCase(), parseFloat(amount), notes, balanceType);
    resetForm();
    setIsProcessing(false);
  };

  const resetForm = () => {
    setSelectedUser("");
    setAmount("");
    setAsset("USD");
    setBalanceType("wallet");
    setNotes("");
  };

  const selectedUserData = users.find(u => u.id === selectedUser);

  const getTotalValue = (balances, prices = {}) => {
    if (!balances) return 0;
    const defaultPrices = {
      usd: 1, sgd: 0.74, cnh: 0.138, inr: 0.012, myr: 0.213, thb: 0.027, vnd: 0.000041, idr: 0.00006, lak: 0.000045, usdt: 1,
      gold: 2024.50, silver: 24.85, platinum: 1045.30, palladium: 1825.75
    };
    return Object.entries(balances).reduce((total, [asset, balance]) => {
      return total + (balance * (prices[asset] || defaultPrices[asset] || 0));
    }, 0);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Fund Management Form */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            Balance Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label>Search User</Label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <Label>Select User</Label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent className="max-h-48">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map(user => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.full_name} ({user.email})
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-user" disabled>
                    No user found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Asset</Label>
              <Select value={asset} onValueChange={setAsset}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assets.map(assetOption => (
                    <SelectItem key={assetOption.value} value={assetOption.value}>
                      {assetOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label>Balance Type</Label>
            <Select value={balanceType} onValueChange={setBalanceType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wallet">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Available Balance
                  </div>
                </SelectItem>
                <SelectItem value="locked">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Locked Balance
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Admin Notes</Label>
            <Textarea
              placeholder="Reason for balance adjustment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button
              onClick={handleAddFunds}
              disabled={!selectedUser || !amount || isProcessing}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              ) : (
                <PlusCircle className="w-4 h-4 mr-2" />
              )}
              Add Funds
            </Button>

            <Button
              onClick={handleDeductFunds}
              disabled={!selectedUser || !amount || isProcessing}
              variant="outline"
              className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
            >
              {isProcessing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2" />
              ) : (
                <MinusCircle className="w-4 h-4 mr-2" />
              )}
              Deduct Funds
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected User Balance Preview */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>User Balance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedUserData ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <h4 className="font-semibold text-slate-900 mb-2">{selectedUserData.full_name}</h4>
                <p className="text-sm text-slate-600 mb-3">{selectedUserData.email}</p>
                
                {/* Total Account Value Summary */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-700">Available Balance Value</p>
                    <p className="text-xl font-bold text-blue-900">
                      ${getTotalValue(selectedUserData.wallet_balances).toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm font-medium text-orange-700">Locked Balance Value</p>
                    <p className="text-xl font-bold text-orange-900">
                      ${getTotalValue(selectedUserData.locked_balances).toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-sm font-medium text-green-700">Total Account Value</p>
                  <p className="text-2xl font-bold text-green-900">
                    ${(getTotalValue(selectedUserData.wallet_balances) + getTotalValue(selectedUserData.locked_balances)).toFixed(2)}
                  </p>
                </div>
              </div>

              <Tabs defaultValue="available" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="available">Available Balances</TabsTrigger>
                  <TabsTrigger value="locked">Locked Balances</TabsTrigger>
                </TabsList>
                
                <TabsContent value="available" className="space-y-3 mt-4">
                  {assets.map(assetOption => {
                    const balance = selectedUserData.wallet_balances?.[assetOption.value] || 0;
                    return (
                      <div key={`wallet-${assetOption.value}`} className="flex justify-between items-center p-3 bg-slate-50 rounded-md">
                        <span className="font-medium">{assetOption.label}</span>
                        <span className="text-slate-600">
                          {balance.toFixed(['vnd', 'idr', 'lak'].includes(assetOption.value) ? 0 : assetOption.value.includes('usd') || assetOption.value === 'sgd' || assetOption.value === 'usdt' || assetOption.value === 'cnh' || assetOption.value === 'inr' || assetOption.value === 'myr' || assetOption.value === 'thb' ? 2 : 4)}
                        </span>
                      </div>
                    );
                  })}
                </TabsContent>

                <TabsContent value="locked" className="space-y-3 mt-4">
                  {assets.map(assetOption => {
                    const balance = selectedUserData.locked_balances?.[assetOption.value] || 0;
                    return (
                      <div key={`locked-${assetOption.value}`} className="flex justify-between items-center p-3 bg-yellow-50 rounded-md">
                        <span className="font-medium flex items-center gap-2">
                          <Lock className="w-4 h-4 text-yellow-600" />
                          {assetOption.label}
                        </span>
                        <span className="text-slate-600">
                          {balance.toFixed(['vnd', 'idr', 'lak'].includes(assetOption.value) ? 0 : assetOption.value.includes('usd') || assetOption.value === 'sgd' || assetOption.value === 'usdt' || assetOption.value === 'cnh' || assetOption.value === 'inr' || assetOption.value === 'myr' || assetOption.value === 'thb' ? 2 : 4)}
                        </span>
                      </div>
                    );
                  })}
                </TabsContent>
              </Tabs>

              {amount && asset && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h5 className="font-medium text-blue-900 mb-2">Preview Adjustment:</h5>
                  <div className="text-sm text-blue-700">
                    Target: {balanceType === 'wallet' ? 'Available' : 'Locked'} {asset.toUpperCase()} Balance
                    <br />
                    Current: {((balanceType === 'wallet' ? selectedUserData.wallet_balances : selectedUserData.locked_balances)?.[asset.toLowerCase()] || 0).toFixed(2)}
                    <br />
                    After adjustment: {(((balanceType === 'wallet' ? selectedUserData.wallet_balances : selectedUserData.locked_balances)?.[asset.toLowerCase()] || 0) + parseFloat(amount || 0)).toFixed(2)}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <DollarSign className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Select a User</h3>
              <p className="text-slate-600">Choose a user to view and adjust their balances.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}