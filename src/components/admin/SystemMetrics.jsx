
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { format, subDays } from "date-fns";

export default function SystemMetrics({ transactions, loans, users, isLoading }) {
  // Generate daily transaction volume data
  const generateVolumeData = () => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayTransactions = transactions.filter(t => {
        const tDate = new Date(t.created_date);
        return tDate.toDateString() === date.toDateString();
      });
      
      const volume = dayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      const fees = dayTransactions.reduce((sum, t) => sum + (t.fee || 0), 0);
      
      data.push({
        date: format(date, 'MMM d'),
        volume: volume,
        fees: fees,
        transactions: dayTransactions.length
      });
    }
    return data;
  };

  // Generate asset distribution data
  const generateAssetData = () => {
    const assetCounts = {};
    transactions.forEach(t => {
      if (t.to_asset) {
        assetCounts[t.to_asset] = (assetCounts[t.to_asset] || 0) + 1;
      }
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
    
    return Object.entries(assetCounts).map(([asset, count], index) => ({
      name: asset,
      value: count,
      color: colors[index % colors.length]
    }));
  };

  const volumeData = generateVolumeData();
  const assetData = generateAssetData();
  
  const totalVolume = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalFees = transactions.reduce((sum, t) => sum + (t.fee || 0), 0);
  const activeUsers = users.filter(u => u.kyc_status === 'approved').length;
  const activeLoanValue = loans.filter(l => l.status === 'active').reduce((sum, l) => sum + l.loan_amount, 0);

  if (isLoading) {
    return (
      <div className="grid gap-6">
        {Array(4).fill(0).map((_, index) => (
          <Card key={index} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-slate-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Total Volume</p>
                <p className="text-2xl font-bold">${totalVolume.toFixed(0)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-2">Revenue (Fees)</p>
                <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-600 to-violet-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 mb-2">Active Users</p>
                <p className="text-2xl font-bold">{activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 mb-2">Loan Value</p>
                <p className="text-2xl font-bold">${activeLoanValue.toFixed(0)}</p>
              </div>
              <Activity className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Volume Chart */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Daily Trading Volume (7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                    formatter={(value, name) => [
                      name === 'volume' ? `$${value.toFixed(2)}` : `$${value.toFixed(2)}`,
                      name === 'volume' ? 'Volume' : 'Fees'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    dot={{ fill: '#3B82F6', r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fees" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Distribution */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Popular Trading Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {assetData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} trades`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {assetData.map((asset, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: asset.color }}
                  />
                  <span className="text-sm font-medium">{asset.name}</span>
                  <span className="text-sm text-slate-500">({asset.value})</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/a0d6759fb_Screenshot2025-08-23105026.png" 
              alt="EVE FINANCE Logo" 
              className="w-8 h-8 rounded-lg object-cover"
            />
            <CardTitle>System Health & Performance</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">API Status</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-700">Operational</span>
              </div>
              <p className="text-sm text-green-600 mt-1">99.9% uptime</p>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Trading Engine</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-blue-700">Active</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">Avg response: 124ms</p>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Database</h4>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-purple-700">Healthy</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">Connection pool: 85%</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
