import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Loader2 } from "lucide-react";

const STATUS = {
  pending: { label: "审核中", cls: "bg-yellow-100 text-yellow-800" },
  approved: { label: "已到账", cls: "bg-green-100 text-green-800" },
  rejected: { label: "已拒绝", cls: "bg-red-100 text-red-800" },
};
const METHOD = { bank_transfer: "银行转账", usdt_erc20: "USDT-ERC20", usdt_trc20: "USDT-TRC20", usdt_sol: "USDT-SOL" };
const fmt = (n) => Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function FundFlowLedger({ email, start, end }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    base44.entities.FundRequest.filter(
      { user_email: email, created_date: { $gte: start.toISOString(), $lte: end.toISOString() } },
      "-created_date", 500
    ).then(setRows).finally(() => setLoading(false));
  }, [email, start.getTime(), end.getTime()]);

  const done = rows.filter((r) => r.status === "approved");
  const sum = (t) => done.filter((r) => r.request_type === t).reduce((s, r) => s + (r.amount || 0), 0);
  const inflow = sum("deposit"), outflow = sum("withdrawal");

  return (
    <Card className="bg-white border shadow-sm mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base"><Wallet className="w-4 h-4 text-blue-600" />资金出入金流水</CardTitle>
        <div className="grid grid-cols-3 gap-2 pt-2 text-sm">
          <div className="rounded-lg bg-green-50 p-2"><p className="text-slate-500 text-xs">入金（已到账）</p><p className="font-semibold text-green-700">+{fmt(inflow)}</p></div>
          <div className="rounded-lg bg-red-50 p-2"><p className="text-slate-500 text-xs">出金（已到账）</p><p className="font-semibold text-red-700">-{fmt(outflow)}</p></div>
          <div className="rounded-lg bg-slate-50 p-2"><p className="text-slate-500 text-xs">净流入</p><p className="font-semibold">{fmt(inflow - outflow)}</p></div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? <Loader2 className="w-5 h-5 animate-spin text-slate-400 mx-auto my-4" /> : rows.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-4">当日无出入金记录</p>
        ) : (
          <div className="divide-y">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className={`font-medium ${r.request_type === "deposit" ? "text-green-700" : "text-red-700"}`}>{r.request_type === "deposit" ? "入金" : "出金"}</span>
                  <span className="text-slate-500 ml-2">{METHOD[r.method] || r.method} · {new Date(r.created_date).toLocaleTimeString("en-SG", { timeZone: "Asia/Singapore", hour12: false })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.request_type === "deposit" ? "+" : "-"}{fmt(r.amount)} {r.asset?.toUpperCase()}</span>
                  <Badge className={STATUS[r.status]?.cls}>{STATUS[r.status]?.label || r.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}