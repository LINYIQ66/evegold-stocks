import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight,
  Banknote,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function TransactionHistory({ transactions, isLoading }) {
  const getTransactionIcon = (type) => {
    switch (type) {
      case 'swap': return ArrowLeftRight;
      case 'deposit': return ArrowDownLeft;
      case 'withdrawal': return ArrowUpRight;
      case 'loan': case 'repayment': return Banknote;
      default: return Clock;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'swap': return 'text-blue-600 bg-blue-100';
      case 'deposit': return 'text-green-600 bg-green-100';
      case 'withdrawal': return 'text-red-600 bg-red-100';
      case 'loan': return 'text-purple-600 bg-purple-100';
      case 'repayment': return 'text-orange-600 bg-orange-100';
      case 'staking': case 'unstaking': return 'text-indigo-600 bg-indigo-100';
      case 'staking_reward': case 'eve_reward': return 'text-amber-600 bg-amber-100';
      case 'physical_redemption': return 'text-pink-600 bg-pink-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-slate-900">Transaction History</span>
          <Badge variant="outline">
            {transactions.length} transactions
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            Array(5).fill(0).map((_, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            ))
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No transactions yet</h3>
              <p className="text-slate-600">Your transaction history will appear here</p>
            </div>
          ) : (
            transactions.map((transaction, index) => {
              const Icon = getTransactionIcon(transaction.transaction_type);
              const iconColor = getTransactionColor(transaction.transaction_type);
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors duration-200"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${iconColor}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900 capitalize">
                      {transaction.transaction_type.replace(/_/g, ' ')}
                      {transaction.from_asset && transaction.to_asset && 
                        ` ${transaction.from_asset.toUpperCase()} → ${transaction.to_asset.toUpperCase()}`
                      }
                      {!transaction.from_asset && !transaction.to_asset && transaction.asset &&
                        ` (${transaction.asset.toUpperCase()})`
                      }
                    </h4>
                    {transaction.description && (
                      <p className="text-xs text-slate-400 truncate max-w-xs">{transaction.description}</p>
                    )}
                    <p className="text-sm text-slate-600">
                      {format(new Date(transaction.created_date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      ${transaction.amount_usd?.toFixed(2)}
                    </p>
                    <Badge className={`text-xs ${getStatusColor(transaction.status)}`}>
                      {transaction.status}
                    </Badge>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}