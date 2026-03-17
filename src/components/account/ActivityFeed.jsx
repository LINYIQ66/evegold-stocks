
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUpRight,
  ArrowDownLeft,
  ArrowLeftRight,
  Banknote,
  Clock,
  PiggyBank,
  Award,
  Star // Added for EVE reward
} from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function ActivityFeed({ transactions, isLoading }) {
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
      case 'physical_redemption': return Award;
      case 'eve_reward': return Star;
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
      case 'staking': return 'text-indigo-600 bg-indigo-100';
      case 'unstaking': return 'text-indigo-600 bg-indigo-100';
      case 'staking_reward': return 'text-yellow-600 bg-yellow-100';
      case 'physical_redemption': return 'text-gray-600 bg-gray-100';
      case 'eve_reward': return 'text-violet-600 bg-violet-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionTitle = (tx) => {
    const type = tx.transaction_type.replace(/_/g, ' ');

    if (tx.transaction_type === 'eve_reward') {
        return `EVE Token Reward`;
    }
    if (tx.transaction_type === 'physical_redemption') {
        const goldCost = tx.total_cost_gold || 0;
        const silverCost = tx.total_cost_silver || 0;

        if (goldCost > 0) {
            return `${type} (${goldCost.toFixed(4)} GOLD)`;
        } else if (silverCost > 0) {
            return `${type} (${silverCost.toFixed(4)} SILVER)`;
        } else {
            return type; // Fallback if no cost data
        }
    }
    if (tx.from_asset && tx.to_asset) {
        return `${type} ${tx.from_asset} → ${tx.to_asset}`;
    }
    if (tx.from_asset) {
        return `${type} ${tx.from_asset}`;
    }
    if (tx.to_asset) {
        return `${type} ${tx.to_asset}`;
    }
    return type;
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-slate-900">Recent Activity</span>
          <Badge variant="outline">
            Last {transactions.length} transactions
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
                      {getTransactionTitle(transaction)}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {format(new Date(transaction.created_date), 'MMM d, yyyy • h:mm a')}
                    </p>
                  </div>

                  <div className="text-right">
                    {transaction.transaction_type === 'eve_reward' ? (
                        <p className="font-semibold text-green-600">
                            +{transaction.eve_amount?.toFixed(2)} EVE
                        </p>
                    ) : transaction.transaction_type === 'physical_redemption' ? (
                        <p className="font-semibold text-slate-900">
                            -
                        </p>
                    ) : (
                        <p className="font-semibold text-slate-900">
                            ${transaction.amount_usd?.toFixed(2)}
                        </p>
                    )}
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
