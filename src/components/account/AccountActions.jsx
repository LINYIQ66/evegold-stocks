import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountActions({ onDepositClick, onWithdrawClick, isKycApproved }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Fund Management</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Button 
            onClick={onDepositClick} 
            disabled={!isKycApproved}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <ArrowDownToLine className="w-5 h-5 mr-2" />
            Deposit Funds
          </Button>
          <Button 
            onClick={onWithdrawClick} 
            disabled={!isKycApproved}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <ArrowUpFromLine className="w-5 h-5 mr-2" />
            Withdraw Funds
          </Button>
          {!isKycApproved && (
            <p className="text-sm text-slate-500 col-span-2 text-center mt-2">
              Please complete KYC verification to deposit or withdraw funds.
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}