
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeftRight, Download, Search, Calendar as CalendarIcon, ArrowDownLeft, ArrowUpRight, Banknote, PiggyBank, Award, Package, Star, DollarSign } from "lucide-react";
import { format, subDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { motion } from "framer-motion";

// Helper function to get transaction icon
const getTransactionIcon = (type) => {
  switch (type) {
    case 'swap': return ArrowLeftRight;
    case 'deposit': return ArrowDownLeft;
    case 'withdrawal': return ArrowUpRight;
    case 'loan': return Banknote;
    case 'repayment': return Banknote;
    case 'staking': return PiggyBank;
    case 'unstaking': return PiggyBank;
    case 'staking_reward': return Award;
    case 'physical_redemption': return Package;
    case 'eve_reward': return Star;
    default: return DollarSign;
  }
};

export default function TransactionLogs({ transactions, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [date, setDate] = useState({ from: subDays(new Date(), 90), to: new Date() });

  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.created_date);
    // Ensure both from and to dates are selected, and transactionDate falls within the range
    const matchesDate = date.from && date.to && transactionDate >= date.from && transactionDate <= date.to;

    const matchesSearch = (transaction.created_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.user_email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         transaction.from_asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.to_asset?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === "all" || transaction.transaction_type === typeFilter;
    const matchesStatus = statusFilter === "all" || transaction.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "swap":
        return "bg-blue-100 text-blue-800";
      case "deposit":
        return "bg-green-100 text-green-800";
      case "withdrawal":
        return "bg-red-100 text-red-800";
      case "loan":
        return "bg-purple-100 text-purple-800";
      case "repayment":
        return "bg-orange-100 text-orange-800";
      case "staking":
      case "unstaking":
        return "bg-indigo-100 text-indigo-800"; 
      case "staking_reward":
        return "bg-teal-100 text-teal-800";
      case "physical_redemption":
        return "bg-pink-100 text-pink-800"; // New color for physical redemption
      case "eve_reward":
        return "bg-amber-100 text-amber-800"; // New color for EVE reward
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportTransactions = () => {
    const csvContent = [
      ['Date', 'User', 'Type', 'From Asset', 'To Asset', 'Amount (USD)', 'Fee (USD)', 'EVE Rebate (EVE)', 'Status'].join(','),
      ...filteredTransactions.map(t => [
        format(new Date(t.created_date), 'yyyy-MM-dd HH:mm:ss'),
        t.user_email || t.created_by || '',
        t.transaction_type,
        t.from_asset || '',
        t.to_asset || '',
        t.amount_usd || 0,
        t.fee_usd || 0,
        t.eve_amount || 0, // Add EVE Rebate to CSV
        t.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {Array(5).fill(0).map((_, index) => (
              <div key={index} className="h-12 bg-slate-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            <ArrowLeftRight className="w-5 h-5 text-blue-600" />
            Transaction Logs ({filteredTransactions.length})
          </CardTitle>
          <Button onClick={exportTransactions} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="grid md:grid-cols-5 gap-4">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <Input
              placeholder="Search by user email or asset..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
                <Button id="date" variant={"outline"} className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (date.to ? `${format(date.from, "LLL dd, y")} - ${format(date.to, "LLL dd, y")}`: format(date.from, "LLL dd, y")) : <span>Pick a date</span>}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
            </PopoverContent>
          </Popover>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger><SelectValue placeholder="Transaction Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="swap">Swap</SelectItem>
              <SelectItem value="deposit">Deposit</SelectItem>
              <SelectItem value="withdrawal">Withdrawal</SelectItem>
              <SelectItem value="loan">Loan</SelectItem>
              <SelectItem value="repayment">Repayment</SelectItem>
              <SelectItem value="staking">Staking</SelectItem>
              <SelectItem value="unstaking">Unstaking</SelectItem>
              <SelectItem value="staking_reward">Staking Reward</SelectItem>
              <SelectItem value="physical_redemption">Physical Redemption</SelectItem>
              <SelectItem value="eve_reward">EVE Reward</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Transaction Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Type</TableHead> {/* Reordered for icon + type */}
                <TableHead>User</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Amount (USD)</TableHead>
                <TableHead>Fee (USD)</TableHead>
                <TableHead>EVE Rebate (EVE)</TableHead> {/* New column */}
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead> {/* Reordered date */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction, index) => {
                const Icon = getTransactionIcon(transaction.transaction_type);
                return (
                  <motion.tr
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                          <Icon className="w-5 h-5 text-slate-500" />
                          <span className="capitalize font-medium text-slate-800">{transaction.transaction_type.replace(/_/g, ' ')}</span>
                      </div>
                    </TableCell>
                    
                    <TableCell className="font-medium">
                      {(transaction.user_email || transaction.created_by)?.split('@')[0] || 'System'}
                    </TableCell>
                    
                    <TableCell>
                      {transaction.from_asset && transaction.to_asset ? (
                        <span className="text-sm">
                          {transaction.from_asset} → {transaction.to_asset}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-sm">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell className="font-semibold">
                      ${transaction.amount_usd?.toFixed(2) || '0.00'}
                    </TableCell>
                    
                    <TableCell className="text-red-600 font-medium">
                      ${transaction.fee_usd?.toFixed(4) || '0.0000'} {/* Changed to fixed 4 decimals */}
                    </TableCell>
                    
                    {/* New Cell for EVE Rebate */}
                    <TableCell className="text-green-600 font-mono">
                      {transaction.eve_amount > 0 ? `+${transaction.eve_amount.toFixed(2)} EVE` : 'N/A'}
                    </TableCell>

                    <TableCell>
                      <Badge className={`${getStatusColor(transaction.status)} border capitalize`}>
                        {transaction.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="font-mono text-sm">
                      {format(new Date(transaction.created_date), 'MMM d, HH:mm')}
                    </TableCell>
                  </motion.tr>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <ArrowLeftRight className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No Transactions Found</h3>
            <p className="text-slate-600">Try adjusting your filters to see more transactions.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
