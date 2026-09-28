import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

const FUNDS = [
  { symbol: 'SPY', category: '美国大盘', description: '追踪标普 500 指数，覆盖美国大型上市公司。' },
  { symbol: 'QQQ', category: '科技成长', description: '追踪纳斯达克 100 指数，科技行业权重较高。' },
  { symbol: 'VTI', category: '全市场', description: '覆盖美国大、中、小型上市公司。' },
  { symbol: 'IWM', category: '美国小盘', description: '追踪罗素 2000 指数，聚焦小型公司。' },
  { symbol: 'TLT', category: '长期国债', description: '持有较长期限美国国债，对利率变化较敏感。' },
  { symbol: 'GLD', category: '黄金资产', description: '追踪黄金价格的交易所交易信托，非实物赎回。' },
];

let verified = null;
let verifiedAt = 0;
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const headers = { 'APCA-API-KEY-ID': secrets.get('ALPACA_API_KEY'), 'APCA-API-SECRET-KEY': secrets.get('ALPACA_SECRET_KEY') };
    if (!verified || Date.now() - verifiedAt > 300000) {
      const assets = await Promise.all(FUNDS.map(async fund => {
        const response = await fetch(`https://paper-api.alpaca.markets/v2/assets/${fund.symbol}`, { headers });
        if (!response.ok) return null;
        const asset = await response.json();
        return asset.status === 'active' && asset.tradable && asset.class === 'us_equity'
          ? { ...fund, name: asset.name, exchange: asset.exchange } : null;
      }));
      verified = assets.filter(Boolean);
      verifiedAt = Date.now();
    }
    if (!verified.length) return Response.json({ funds: [], asOf: null });
    const symbols = verified.map(fund => fund.symbol).join(',');
    const response = await fetch(`https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(symbols)}`, { headers });
    if (!response.ok) return Response.json({ error: '基金行情暂不可用' }, { status: 502 });
    const data = await response.json();
    const snapshots = data.snapshots || data;
    const funds = verified.map(fund => {
      const quote = snapshots[fund.symbol];
      const price = quote?.latestTrade?.p || quote?.dailyBar?.c || null;
      const previousClose = quote?.prevDailyBar?.c;
      return { ...fund, price, change: price > 0 && previousClose > 0 ? (price / previousClose - 1) * 100 : null, volume: quote?.dailyBar?.v || null };
    });
    return Response.json({ funds, asOf: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}