import React, { useState, useEffect } from "react";
import { User, Transaction } from "@/entities/all";
import { useLocation } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Printer, ArrowLeft } from "lucide-react";

const StatementView = ({ user, transactions, startDate, endDate }) => (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-start pb-6 border-b">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">Account Statement</h1>
                <p className="text-slate-600">EVE METAL</p>
            </div>
            <div className="text-right">
                <p className="font-semibold">{user?.full_name}</p>
                <p className="text-sm text-slate-500">{user?.email}</p>
                <p className="text-sm text-slate-500">
                    Period: {format(new Date(startDate), "MMM d, yyyy")} - {format(new Date(endDate), "MMM d, yyyy")}
                </p>
            </div>
        </div>

        {/* Balances */}
        <div className="my-8">
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Final Balances</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(user?.wallet_balances || {})
                    .filter(([, balance]) => balance > 0)
                    .map(([asset, balance]) => (
                        <div key={asset} className="bg-slate-50 p-4 rounded-md">
                            <p className="text-sm uppercase text-slate-500">{asset}</p>
                            <p className="text-lg font-bold text-slate-900">{balance.toFixed(4)}</p>
                        </div>
                ))}
            </div>
        </div>

        {/* Transactions */}
        <div>
            <h2 className="text-xl font-semibold mb-4 text-slate-800">Transaction History</h2>
            <table className="w-full text-left">
                <thead>
                    <tr className="border-b bg-slate-50">
                        <th className="p-3 text-sm font-semibold text-slate-600">Date</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Type</th>
                        <th className="p-3 text-sm font-semibold text-slate-600">Details</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 text-right">Amount (USD)</th>
                        <th className="p-3 text-sm font-semibold text-slate-600 text-right">Fee (USD)</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? transactions.map(tx => (
                        <tr key={tx.id} className="border-b hover:bg-slate-50">
                            <td className="p-3 text-sm">{format(new Date(tx.created_date), "yyyy-MM-dd HH:mm")}</td>
                            <td className="p-3 text-sm capitalize">{tx.transaction_type.replace('_', ' ')}</td>
                            <td className="p-3 text-sm">{tx.from_asset || ''} {tx.from_asset && tx.to_asset && '→'} {tx.to_asset || ''}</td>
                            <td className="p-3 text-sm font-mono text-right">${tx.amount_usd?.toFixed(2) || '0.00'}</td>
                            <td className="p-3 text-sm font-mono text-red-600 text-right">${tx.fee_usd?.toFixed(2) || '0.00'}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="5" className="text-center p-8 text-slate-500">No transactions for this period.</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

export default function StatementPage() {
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const urlParams = new URLSearchParams(location.search);
    const userEmail = urlParams.get('user_email');
    const startDate = urlParams.get('start_date');
    const endDate = urlParams.get('end_date');

    useEffect(() => {
        if (userEmail && startDate && endDate) {
            const loadStatementData = async () => {
                setIsLoading(true);
                try {
                    const [userData, txData] = await Promise.all([
                        User.filter({ email: userEmail }),
                        Transaction.filter({
                            user_email: userEmail,
                            created_date: {
                                $gte: new Date(startDate).toISOString(),
                                $lte: new Date(endDate).toISOString()
                            }
                        }, "-created_date")
                    ]);
                    setUser(userData[0]);
                    setTransactions(txData);
                } catch (error) {
                    console.error("Error loading statement data:", error);
                }
                setIsLoading(false);
            };
            loadStatementData();
        }
    }, [userEmail, startDate, endDate]);

    return (
        <div className="bg-slate-100 min-h-screen p-4 md:p-8 font-sans">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex justify-between items-center print:hidden">
                    <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
                        <ArrowLeft className="w-4 h-4" /> Back
                    </Button>
                    <Button onClick={() => window.print()} className="gap-2">
                        <Printer className="w-4 h-4" /> Print Statement
                    </Button>
                </div>

                {isLoading ? (
                    <div className="text-center p-12">Loading statement...</div>
                ) : user ? (
                    <StatementView user={user} transactions={transactions} startDate={startDate} endDate={endDate} />
                ) : (
                    <div className="text-center p-12">Could not load statement data.</div>
                )}
            </div>
        </div>
    );
}