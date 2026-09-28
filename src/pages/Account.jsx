import React, { useState, useEffect } from "react";
import { FundRequest, SystemSetting, Transaction, PhysicalRedemption, SupportTicket, User } from "@/entities/all";
import { base44 } from "@/api/base44Client";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { UserCheck, LogOut, User as UserIcon, Activity, FileText, Package, LifeBuoy, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import KYCStatus from "../components/kyc/KYCStatus";
import KYCForm from "../components/kyc/KYCForm";
import DocumentUpload from "../components/kyc/DocumentUpload";
import KYCApproved from "../components/kyc/KYCApproved";
import DepositModal from "../components/wallet/DepositModal";
import WithdrawalModal from "../components/account/WithdrawalModal";
import AccountActions from "../components/account/AccountActions";
import ActivityFeed from "../components/account/ActivityFeed";
import StatementGenerator from "../components/account/StatementGenerator";
import MyPhysicalInventory from "../components/account/MyPhysicalInventory";
import SupportTickets from "../components/account/SupportTickets"; // New Import
import InterestHistory from "../components/wallet/InterestHistory";
import GuestAccountGate from '@/components/account/GuestAccountGate';
import CryptoCollateralDashboard from '@/components/account/CryptoCollateralDashboard';
import { useLanguage } from "@/components/common/LanguageProvider";

export default function Account() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [physicalRedemptions, setPhysicalRedemptions] = useState([]);
  const [supportTickets, setSupportTickets] = useState([]); // New state
  const [isLoading, setIsLoading] = useState(true);
  const [systemSettings, setSystemSettings] = useState({});
  const [isDepositModalOpen, setDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setWithdrawalModalOpen] = useState(false);

  const { t } = useLanguage();

  useEffect(() => {
    loadUserData();
    loadSystemSettings();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      const userData = await User.me();
      setUser(userData);
      if (userData?.email) {
        const [userTransactions, userRedemptions, userTickets] = await Promise.all([
          Transaction.filter({ user_email: userData.email }, "-created_date", 100),
          PhysicalRedemption.filter({ user_email: userData.email }, "-created_date"),
          SupportTicket.filter({ user_email: userData.email }, "-created_date") // Fetch tickets
        ]);
        setTransactions(userTransactions);
        setPhysicalRedemptions(userRedemptions);
        setSupportTickets(userTickets); // Set tickets
      } else {
        setTransactions([]);
        setPhysicalRedemptions([]);
        setSupportTickets([]);
      }
    } catch (error) {
      // Not logged in, user will be null
      console.error("Error loading user data:", error);
      setUser(null); // Ensure user is null on error or not logged in
      setTransactions([]);
      setPhysicalRedemptions([]);
      setSupportTickets([]);
    }
    setIsLoading(false);
  };
  
  const loadSystemSettings = async () => {
      try {
          const settingsData = await SystemSetting.list();
          const settingsMap = settingsData.reduce((acc, setting) => {
            acc[setting.setting_key] = setting.setting_value;
            return acc;
          }, {});
          setSystemSettings(settingsMap);
      } catch (error) {
          console.error("Error loading system settings:", error);
      }
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin('/Account');
  };

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
      setTransactions([]); // Clear data on logout
      setPhysicalRedemptions([]); // Clear data on logout
      setSupportTickets([]); // Clear data on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      await User.updateMyUserData({
        ...formData,
        kyc_status: "pending"
      });
      await loadUserData();
      return { success: true };
    } catch (error) {
      console.error("Error submitting KYC form:", error);
      return { success: false, error: error.message };
    }
  };

  const handleDocumentUpload = async (documentType, file) => {
    try {
      const { file_url } = await UploadFile({ file });
      
      const currentDocs = user.kyc_documents || {};
      const updatedDocs = {
        ...currentDocs,
        [documentType]: file_url
      };

      await User.updateMyUserData({
        kyc_documents: updatedDocs
      });

      await loadUserData();
      return { success: true };
    } catch (error) {
      console.error("Error uploading document:", error);
      return { success: false, error: error.message };
    }
  };
  
  const handleCreateDepositRequest = async (requestData) => {
    try {
      const { file_url } = await UploadFile({ file: requestData.proofOfPayment });
      await FundRequest.create({
        request_type: 'deposit',
        user_email: user.email,
        asset: requestData.asset,
        amount: requestData.amount,
        method: requestData.method,
        proof_of_payment_url: file_url,
        status: 'pending'
      });
      setDepositModalOpen(false);
      // Reload user data to fetch new transactions/fund requests if applicable
      await loadUserData();
      return { success: true };
    } catch(error) {
      console.error("Error creating deposit request:", error);
      return { success: false, error: error.message };
    }
  };
  
  const handleCreateWithdrawalRequest = async (requestData) => {
    try {
        await FundRequest.create({
            request_type: 'withdrawal',
            user_email: user.email,
            amount: requestData.amount,
            asset: requestData.asset,
            method: requestData.method,
            user_destination_details: requestData.user_destination_details,
            status: 'pending'
        });
        setWithdrawalModalOpen(false);
        // Reload user data to fetch new transactions/fund requests if applicable
        await loadUserData();
        return { success: true };
    } catch(error) {
      console.error("Error creating withdrawal request:", error);
      return { success: false, error: error.message };
    }
  };

  const handleDeliveryRequest = async (redemptionId, address, notes) => {
    try {
      await PhysicalRedemption.update(redemptionId, {
        delivery_address: address,
        delivery_notes: notes,
        delivery_requested_date: new Date().toISOString()
      });
      loadUserData(); // Refresh to show updated status
      return { success: true };
    } catch (error) {
      console.error("Error requesting delivery:", error);
      return { success: false, error: error.message };
    }
  };

  const handleCreateTicket = async (ticketData) => {
    try {
        await SupportTicket.create({
            ...ticketData,
            user_email: user.email,
            status: 'Open'
        });
        await loadUserData(); // Refresh to show the new ticket
        return { success: true };
    } catch (error) {
        console.error("Error creating support ticket:", error);
        return { success: false, error: error.message };
    }
  };
  
  if (!user && isLoading) return <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground" role="status">正在加载账户…</div>;
  if (!user) return <GuestAccountGate onLogin={handleLogin} />;

  return (
    <>
      {user && (
          <>
            <DepositModal
              isOpen={isDepositModalOpen}
              onClose={() => setDepositModalOpen(false)}
              onSubmit={handleCreateDepositRequest}
              settings={systemSettings}
            />
            <WithdrawalModal
              isOpen={isWithdrawalModalOpen}
              onClose={() => setWithdrawalModalOpen(false)}
              onSubmit={handleCreateWithdrawalRequest}
              user={user}
            />
          </>
      )}
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header with logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-between items-center mb-8"
          >
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 to-blue-900 bg-clip-text text-transparent mb-4">
                我的账户
              </h1>
              <p className="text-xl text-slate-600 max-w-2xl">
                管理您的个人信息、身份验证和账户活动。
              </p>
            </div>
            
            <div className="ml-6 flex flex-col items-end gap-2">
              {user && (
                <div className="text-right mb-2">
                  <p className="font-semibold text-slate-900">{user.full_name || "用户"}</p>
                  <p className="text-sm text-slate-600">{user.email}</p>
                </div>
              )}
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </motion.div>
          
          <Tabs defaultValue="kyc" className="space-y-0">
            <TabsList className="inline-flex flex-wrap gap-2 bg-white w-full p-4 rounded-xl border border-slate-200 shadow-sm mb-12 md:mb-8">
                <TabsTrigger value="kyc" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-blue-50"><UserCheck className="w-3 h-3 md:w-4 md:h-4 mr-1" />KYC</TabsTrigger>
                <TabsTrigger value="inventory" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-green-50"><Package className="w-3 h-3 md:w-4 md:h-4 mr-1" />实物库存</TabsTrigger>
                <TabsTrigger value="funds" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-purple-50"><UserIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />资金</TabsTrigger>
                <TabsTrigger value="activity" className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-orange-50"><Activity className="w-3 h-3 md:w-4 md:h-4 mr-1" />活动记录</TabsTrigger>
                <TabsTrigger value="statements" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-amber-50"><FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" />账单</TabsTrigger>
                <TabsTrigger value="interest" className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-amber-50"><TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />利息记录</TabsTrigger>
                <TabsTrigger value="crypto-loans" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-blue-50"><TrendingUp className="w-3 h-3 md:w-4 md:h-4 mr-1" />质押贷款</TabsTrigger>
                <TabsTrigger value="support" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700 data-[state=inactive]:bg-slate-100 data-[state=inactive]:text-slate-600 text-xs md:text-sm px-3 md:px-4 py-2 rounded-lg transition-all hover:bg-red-50"><LifeBuoy className="w-3 h-3 md:w-4 md:h-4 mr-1" />客服支持</TabsTrigger>
            </TabsList>

            <TabsContent value="kyc">
              <div className="space-y-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-8">
                  <KYCStatus user={user} isLoading={isLoading} />
                </motion.div>
                {user?.kyc_status === "approved" ? ( <KYCApproved /> ) : (
                  <div className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
                      <KYCForm user={user} onSubmit={handleFormSubmit} isLoading={isLoading} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
                      <DocumentUpload user={user} onUpload={handleDocumentUpload} isLoading={isLoading} />
                    </motion.div>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="inventory">
              <MyPhysicalInventory 
                redemptions={physicalRedemptions}
                onDeliveryRequest={handleDeliveryRequest}
                isLoading={isLoading}
              />
            </TabsContent>

            <TabsContent value="funds">
              <AccountActions 
                onDepositClick={() => setDepositModalOpen(true)}
                onWithdrawClick={() => setWithdrawalModalOpen(true)}
                isKycApproved={user?.kyc_status === 'approved'}
              />
            </TabsContent>

            <TabsContent value="activity">
                <ActivityFeed transactions={transactions} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="statements">
                <StatementGenerator user={user} />
            </TabsContent>

            <TabsContent value="interest">
                <InterestHistory transactions={transactions} isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="crypto-loans">
                {user && <CryptoCollateralDashboard user={user} />}
            </TabsContent>
            
            <TabsContent value="support">
                <SupportTickets 
                    tickets={supportTickets}
                    onSubmit={handleCreateTicket}
                    isLoading={isLoading}
                />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}