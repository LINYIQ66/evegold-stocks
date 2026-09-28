import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LIVE_URL = "https://kopiagent.amt.land/gold-silver/";

export default function GoldBullionNews() {
  const [refreshTime, setRefreshTime] = useState(Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setRefreshTime(Date.now()), 60 * 60 * 1000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-slate-900">Gold Bullion News 最新资讯与动态</CardTitle>
        <a href={LIVE_URL} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm text-blue-700 hover:underline">打开 Live 页面 ↗</a>
      </CardHeader>
      <CardContent className="p-0">
        <iframe
          src={`${LIVE_URL}?refresh=${refreshTime}`}
          title="Gold Bullion News 实时贵金属资讯"
          className="w-full h-[800px] rounded-b-lg border-0"
          loading="lazy"
        />
      </CardContent>
    </Card>
  );
}