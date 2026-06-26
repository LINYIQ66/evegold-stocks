import React, { useState, useEffect } from "react";
import { User, Transaction } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  FileText, 
  ArrowLeftRight, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Banknote, 
  PiggyBank, 
  Award, 
  Package,
  Calendar as CalendarIcon,
  Download,
  Clock
} from "lucide-react";
import { format, subDays } from "date-fns";
import { motion } from "framer-motion";

const SINGAPORE_TZ = 'Asia/Singapore';

// Helper to format dates in Singapore Time using native Intl API
const formatInSgTime = (date, options) => {
    return new Date(date).toLocaleString('en-SG', { timeZone: SINGAPORE_TZ, ...options });
}

export default function DailyStatement() {
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(subDays(new Date(), 1));
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentSgTime, setCurrentSgTime] = useState("");

  useEffect(() => {
    loadUserAndStatements();
  }, [selectedDate]);

  useEffect(() => {
      // Update Singapore time every second
      const timer = setInterval(() => {
        setCurrentSgTime(formatInSgTime(new Date(), {
            year: 'numeric', month: 'long', day: 'numeric', 
            hour: '2-digit', minute: '2-digit', second: '2-digit', timeZoneName: 'short'
        }));
      }, 1000);
      return () => clearInterval(timer);
  }, []);

  const loadUserAndStatements = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      
      if (userData?.email) {
        // Calculate UTC start and end dates for the selected day in SGT (UTC+8)
        const year = selectedDate.getUTCFullYear();
        const month = selectedDate.getUTCMonth();
        const day = selectedDate.getUTCDate();
        
        // Start of day in SGT (day, 00:00 SGT) is (day-1, 16:00 UTC)
        const sgStartDateUTC = new Date(Date.UTC(year, month, day) - (8 * 60 * 60 * 1000));
        
        // End of day in SGT (day, 23:59:59 SGT) is (day, 15:59:59 UTC)
        const sgEndDateUTC = new Date(Date.UTC(year, month, day, 23, 59, 59) - (8 * 60 * 60 * 1000));

        const allTransactions = await Transaction.filter({ user_email: userData.email }, "-created_date", 2000);
        
        const dayTransactions = allTransactions.filter(tx => {
          const txDateUTC = new Date(tx.created_date); // created_date is already UTC
          return txDateUTC >= sgStartDateUTC && txDateUTC <= sgEndDateUTC;
        });
        
        setTransactions(dayTransactions);
      }
    } catch (error) {
      console.error("Error loading statement:", error);
    }
    setIsLoading(false);
  };

  const isStatementAvailable = () => {
    const nowUTC = new Date();
    // Statement for selectedDate is available next day at 10:00 SGT (02:00 UTC)
    const statementAvailabilityUTC = new Date(selectedDate);
    statementAvailabilityUTC.setUTCDate(statementAvailabilityUTC.getUTCDate() + 1);
    statementAvailabilityUTC.setUTCHours(2, 0, 0, 0);

    return nowUTC > statementAvailabilityUTC;
  };

  const categorizeTransactions = () => {
    const categories = {
      trading: { name: "交易与兑换", icon: ArrowLeftRight, color: "text-blue-600 bg-blue-50", transactions: [] },
      deposits: { name: "存款", icon: ArrowDownLeft, color: "text-green-600 bg-green-50", transactions: [] },
      withdrawals: { name: "取款", icon: ArrowUpRight, color: "text-red-600 bg-red-50", transactions: [] },
      lending: { name: "贷款与还款", icon: Banknote, color: "text-purple-600 bg-purple-50", transactions: [] },
      staking: { name: "质押活动", icon: PiggyBank, color: "text-indigo-600 bg-indigo-50", transactions: [] },
      rewards: { name: "奖励与收益", icon: Award, color: "text-yellow-600 bg-yellow-50", transactions: [] },
      physical: { name: "实物兑换", icon: Package, color: "text-orange-600 bg-orange-50", transactions: [] }
    };

    transactions.forEach(tx => {
      switch (tx.transaction_type) {
        case 'swap': categories.trading.transactions.push(tx); break;
        case 'deposit': categories.deposits.transactions.push(tx); break;
        case 'withdrawal': categories.withdrawals.transactions.push(tx); break;
        case 'loan': case 'repayment': categories.lending.transactions.push(tx); break;
        case 'staking': case 'unstaking': categories.staking.transactions.push(tx); break;
        case 'staking_reward': case 'eve_reward': categories.rewards.transactions.push(tx); break;
        case 'physical_redemption': categories.physical.transactions.push(tx); break;
        default: categories.trading.transactions.push(tx);
      }
    });
    return categories;
  };

  const calculateSummary = () => {
    const summary = {
      totalTransactions: transactions.length, totalValue: 0, totalFees: 0, netGainLoss: 0
    };
    transactions.forEach(tx => {
      summary.totalValue += tx.amount_usd || 0;
      summary.totalFees += tx.fee_usd || 0;
      if (tx.transaction_type === 'staking_reward') summary.netGainLoss += tx.amount_usd || 0;
      else if (tx.transaction_type === 'repayment') summary.netGainLoss -= tx.fee_usd || 0;
    });
    return summary;
  };

  const exportStatement = () => {
    const statementData = {
      user: user.full_name,
      email: user.email,
      date: format(selectedDate, 'yyyy-MM-dd'),
      transactions: transactions,
      summary: calculateSummary()
    };
    const blob = new Blob([JSON.stringify(statementData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${format(selectedDate, 'yyyy-MM-dd')}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const categories = categorizeTransactions();
  const summary = calculateSummary();
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-6">
        <Card className="w-full max-w-md"><CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">请登录</h3>
            <p className="text-slate-600">您需要登录才能查看每日账单。</p>
        </CardContent></Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent">每日账单</h1>
            <p className="text-slate-600 mt-1">{currentSgTime}</p>
          </div>
          <div className="flex items-center gap-3">
            <Popover>
              <PopoverTrigger asChild><Button variant="outline" className="gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {format(selectedDate, 'MMM d, yyyy')}
              </Button></PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} disabled={(date) => date > subDays(new Date(), 1)} /></PopoverContent>
            </Popover>
            <Button onClick={exportStatement} variant="outline" className="gap-2"><Download className="w-4 h-4" />导出</Button>
          </div>
        </motion.div>

        {!isStatementAvailable() && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <Card className="bg-yellow-50 border-yellow-200"><CardContent className="p-4"><div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="font-semibold text-yellow-800">账单尚未生成</p>
                <p className="text-sm text-yellow-700">每日账单于次日新加坡时间 10:00 后可查看。</p>
              </div>
            </div></CardContent></Card>
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-xl"><CardContent className="p-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center"><p className="text-blue-100 mb-1 text-sm">交易笔数</p><p className="text-2xl font-bold">{summary.totalTransactions}</p></div>
              <div className="text-center"><p className="text-blue-100 mb-1 text-sm">总价值</p><p className="text-2xl font-bold">${summary.totalValue.toFixed(2)}</p></div>
              <div className="text-center"><p className="text-blue-100 mb-1 text-sm">总手续费</p><p className="text-2xl font-bold">${summary.totalFees.toFixed(2)}</p></div>
              <div className="text-center"><p className="text-blue-100 mb-1 text-sm">净盈亏</p><p className={`text-2xl font-bold ${summary.netGainLoss >= 0 ? 'text-green-200' : 'text-red-200'}`}>${summary.netGainLoss.toFixed(2)}</p></div>
            </div>
          </CardContent></Card>
        </motion.div>

        <div className="space-y-6">
          {Object.entries(categories).map(([key, category], index) => {
            if (category.transactions.length === 0) return null;
            return (
              <motion.div key={key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + index * 0.1 }}>
                <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg"><CardHeader><CardTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${category.color}`}><category.icon className="w-5 h-5" /></div>
                  <div><span className="text-slate-900">{category.name}</span><Badge className="ml-3 bg-slate-100 text-slate-700">{category.transactions.length} 笔交易</Badge></div>
                </CardTitle></CardHeader><CardContent><div className="space-y-3">
                  {category.transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium text-slate-900 capitalize">{tx.transaction_type.replace(/_/g, ' ')}</span>
                          {tx.from_asset && tx.to_asset && (<span className="text-sm text-slate-600">{tx.from_asset.toUpperCase()} → {tx.to_asset.toUpperCase()}</span>)}
                          {!tx.from_asset && !tx.to_asset && tx.asset && (<span className="text-sm text-slate-600">({tx.asset.toUpperCase()})</span>)}
                        </div>
                        {tx.description && <p className="text-xs text-slate-400 mb-0.5">{tx.description}</p>}
                        <p className="text-sm text-slate-500">{formatInSgTime(tx.created_date, { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-slate-900">${tx.amount_usd?.toFixed(2) || '0.00'}</p>
                        {tx.fee_usd > 0 && (<p className="text-xs text-red-600">手续费：${tx.fee_usd.toFixed(2)}</p>)}
                      </div>
                    </div>
                  ))}
                </div></CardContent></Card>
              </motion.div>
            );
          })}
        </div>

        {transactions.length === 0 && !isLoading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">暂无交易记录</h3>
            <p className="text-slate-600">{format(selectedDate, 'yyyy年MM月d日')} 无交易记录</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}