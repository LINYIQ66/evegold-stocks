import React from "react";

const compact = (value) => Number.isFinite(value)
  ? new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value)
  : "—";

const money = (value) => Number.isFinite(value)
  ? `$${compact(value)}`
  : "—";

export default function StockQuoteMetrics({ data, isSelected }) {
  const metrics = [
    ["买价", data.bid, true],
    ["卖价", data.ask, true],
    ["日内最高", data.high, true],
    ["日内最低", data.low, true],
    ["成交量", data.volume, false],
    ["成交金额", data.turnover, "compactMoney"],
  ];

  return (
    <div className={`grid grid-cols-2 gap-x-4 gap-y-2 mt-3 pt-3 border-t ${isSelected ? "border-white/20" : "border-slate-100"}`}>
      {metrics.map(([label, value, format]) => (
        <div key={label} className="flex items-center justify-between gap-2 min-w-0">
          <span className={`text-[11px] ${isSelected ? "text-blue-100" : "text-slate-400"}`}>{label}</span>
          <span className={`text-xs font-semibold truncate ${isSelected ? "text-white" : "text-slate-700"}`}>
            {format === true ? (Number.isFinite(value) ? `$${value.toFixed(2)}` : "—") : format === "compactMoney" ? money(value) : compact(value)}
          </span>
        </div>
      ))}
    </div>
  );
}