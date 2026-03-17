
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { 
  ArrowLeftRight, 
  Banknote, 
  PiggyBank, // Added PiggyBank
  Landmark
} from "lucide-react";
import { motion } from "framer-motion";

export default function QuickActions({ user, isLoading }) {
  const actions = [
    {
      title: "Trade Assets",
      description: "Swap between currencies and metals",
      icon: ArrowLeftRight,
      color: "from-blue-600 to-indigo-600",
      link: createPageUrl("Trading")
    },
    {
      title: "Get Loan",
      description: "Borrow against your metals",
      icon: Banknote,
      color: "from-green-600 to-emerald-600",
      link: createPageUrl("Lending") // Changed from "Loan" to "Lending" as per outline
    },
    {
      title: "Stake Assets", // New action
      description: "Earn rewards on your metals", // New description
      icon: PiggyBank, // New icon
      color: "from-purple-600 to-violet-600", // New color
      link: createPageUrl("Staking") // New link
    }
  ];

  const kycStatus = user?.kyc_status || 'not_started';
  const isVerified = kycStatus === 'approved';
  const accountType = isVerified ? 'Premium' : 'Standard';
  const tradingLimit = isVerified ? 1000000 : 10000;

  const kycStatusConfig = {
    approved: { text: "Verified", color: "text-green-600" },
    pending: { text: "Pending", color: "text-yellow-600" },
    rejected: { text: "Rejected", color: "text-red-600" },
    not_started: { text: "Not Verified", color: "text-slate-600" },
  };
  const currentKycStatus = kycStatusConfig[kycStatus];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Quick Actions</h2>
      
      <div className="space-y-4">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link to={action.link}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors duration-300">
                        {action.title}
                      </h3>
                      <p className="text-sm text-slate-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Account Summary */}
      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900">
            <Landmark className="w-5 h-5" />
            Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <>
              <div className="flex justify-between"><Skeleton className="h-5 w-20" /><Skeleton className="h-5 w-24" /></div>
              <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-20" /></div>
              <div className="flex justify-between"><Skeleton className="h-5 w-28" /><Skeleton className="h-5 w-32" /></div>
              <div className="flex justify-between"><Skeleton className="h-5 w-24" /><Skeleton className="h-5 w-16" /></div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">KYC Status</span>
                <span className={`font-semibold ${currentKycStatus.color}`}>{currentKycStatus.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Account Type</span>
                <span className="text-blue-600 font-semibold">{accountType}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Trading Limit</span>
                <span className="text-slate-900 font-semibold">${tradingLimit.toLocaleString()}</span>
              </div>
              {user?.created_date && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Member Since</span>
                  <span className="text-slate-600">{format(new Date(user.created_date), 'yyyy')}</span>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
