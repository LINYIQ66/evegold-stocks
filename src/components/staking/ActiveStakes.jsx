
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { TrendingUp, Calendar, Coins, AlertTriangle, Loader2 } from "lucide-react";
import { format, differenceInDays, differenceInSeconds } from "date-fns";
import { motion } from "framer-motion";

export default function ActiveStakes({ stakes, prices, onUnstake, isLoading }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  // BUG FIX 3: State for confirmation modal
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStake, setSelectedStake] = useState(null);
  const [isUnstaking, setIsUnstaking] = useState(false);

  // Update time every second to show live rewards
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const calculateRewards = (stake) => {
    const stakeStartTime = new Date(stake.start_date);
    const secondsStaked = Math.max(0, differenceInSeconds(currentTime, stakeStartTime));
    
    // Calculate APR as a yearly rate, then convert to per-second
    const yearlyRate = (stake.apr || 4.5) / 100;
    const secondsPerYear = 365 * 24 * 60 * 60;
    const secondlyRate = yearlyRate / secondsPerYear;
    
    const rewardsEarned = stake.amount * secondlyRate * secondsStaked;
    
    // Debug log for troubleshooting
    // console.log('Stake calculation:', {
    //   asset: stake.asset,
    //   amount: stake.amount,
    //   secondsStaked,
    //   yearlyRate,
    //   secondlyRate,
    //   rewardsEarned,
    //   stakeStartTime,
    //   currentTime
    // });
    
    return Math.max(0, rewardsEarned);
  };

  const getDaysStaked = (stake) => {
    return Math.max(0, differenceInDays(currentTime, new Date(stake.start_date)));
  };

  const getHoursStaked = (stake) => {
    const totalSeconds = Math.max(0, differenceInSeconds(currentTime, new Date(stake.start_date)));
    return Math.floor(totalSeconds / 3600);
  };

  const getMinutesStaked = (stake) => {
    const totalSeconds = Math.max(0, differenceInSeconds(currentTime, new Date(stake.start_date)));
    return Math.floor(totalSeconds / 60);
  };

  const handleUnstakeClick = (stake) => {
    setSelectedStake(stake);
    setShowConfirmModal(true);
  };

  const handleConfirmUnstake = async () => {
    if (!selectedStake) return;
    setIsUnstaking(true);
    await onUnstake(selectedStake);
    setIsUnstaking(false);
    setShowConfirmModal(false);
    setSelectedStake(null);
  };
  
  const getAssetColor = (asset) => {
    switch (asset) {
      case "GOLD": return "from-yellow-500 to-orange-600";
      case "SILVER": return "from-gray-400 to-gray-600";
      case "PLATINUM": return "from-purple-500 to-indigo-600";
      case "PALLADIUM": return "from-pink-500 to-rose-600";
      default: return "from-blue-500 to-indigo-600";
    }
  };

  if (isLoading) {
    return <Card className="animate-pulse h-64 bg-slate-200 rounded-lg" />;
  }

  if (stakes.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardContent className="p-12 text-center">
          <Coins className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Active Stakes</h3>
          <p className="text-slate-600">Use the form to stake your assets and start earning rewards.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
    <div className="space-y-6">
      <CardHeader className="p-0">
        <CardTitle className="text-2xl font-bold text-slate-900">Your Active Stakes</CardTitle>
      </CardHeader>
      {stakes.map((stake, index) => {
        const rewards = calculateRewards(stake);
        const stakeValue = stake.amount * (prices[stake.asset.toLowerCase()] || 0);
        const rewardsValue = rewards * (prices[stake.asset.toLowerCase()] || 0);
        const daysStaked = getDaysStaked(stake);
        const hoursStaked = getHoursStaked(stake);
        const minutesStaked = getMinutesStaked(stake);

        return (
          <motion.div
            key={stake.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getAssetColor(stake.asset)} rounded-xl flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">{stake.asset[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl">{stake.asset}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Staked on {format(new Date(stake.start_date), 'MMM d, yyyy')}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-600">
                          {daysStaked > 0 ? `${daysStaked} days, ${hoursStaked % 24} hours` : 
                           hoursStaked > 0 ? `${hoursStaked} hours` : 
                           `${minutesStaked} minutes`}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleUnstakeClick(stake)} className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                    Unstake & Claim
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div>
                    <p className="text-sm text-slate-600">Staked Amount</p>
                    <p className="font-semibold text-lg">{stake.amount.toFixed(4)} {stake.asset}</p>
                    <p className="text-sm text-slate-500">≈ ${stakeValue.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Rewards Earned</p>
                    <div className="flex items-center gap-2">
                      <motion.p 
                        key={Math.floor(rewards * 1000000)} // Update animation trigger more frequently
                        initial={{ scale: 1 }}
                        animate={{ scale: [1, 1.02, 1] }}
                        transition={{ duration: 0.2 }}
                        className="font-semibold text-lg text-green-600"
                      >
                        +{rewards.toFixed(8)} {stake.asset}
                      </motion.p>
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                    <p className="text-sm text-slate-500">≈ ${rewardsValue.toFixed(4)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600">Staking APR</p>
                    <p className="font-semibold text-lg text-blue-600">{stake.apr || 4.5}%</p>
                    <p className="text-xs text-slate-500">
                      Daily: +{((stake.apr || 4.5) / 365).toFixed(4)}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>

    {/* BUG FIX 3: Confirmation Modal */}
    <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><AlertTriangle className="text-yellow-500"/>Confirm Unstake</DialogTitle>
                <DialogDescription>
                    You are about to unstake your assets. Rewards will stop accumulating and will be paid out to your wallet.
                </DialogDescription>
            </DialogHeader>
            {selectedStake && (
                 <div className="space-y-4 py-4">
                    <div>
                        <p className="text-sm text-slate-500">Unstaking Principal</p>
                        <p className="font-semibold text-lg">{selectedStake.amount.toFixed(4)} {selectedStake.asset}</p>
                    </div>
                     <div>
                        <p className="text-sm text-slate-500">Estimated Rewards to Claim</p>
                        <p className="font-semibold text-lg text-green-600">
                            +{calculateRewards(selectedStake).toFixed(8)} {selectedStake.asset}
                        </p>
                    </div>
                 </div>
            )}
            <DialogFooter>
                <Button variant="outline" onClick={() => setShowConfirmModal(false)} disabled={isUnstaking}>Cancel</Button>
                <Button onClick={handleConfirmUnstake} disabled={isUnstaking}>
                    {isUnstaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Confirm & Unstake
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  );
}
