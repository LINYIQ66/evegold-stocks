import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

// Only exchange-traded ETFs returned by Polygon and active, tradable US equities at Alpaca.
const CATEGORIES = ['货币市场基金', '债券基金', '股票基金', '指数基金', '对冲基金', '混合基金', '其他基金'];
const SECTORS = ['AI行业', '医疗', '科技', '能源', '金融', '房地产', '黄金'];
const FEATURED = ['SPY', 'QQQ', 'VTI', 'IWM', 'TLT', 'GLD'];
let catalog = null;
let cachedAt = 0;

function classify(name, symbol) {
  const n = name.toLowerCase();
  let category = '其他基金';
  if (/money market/.test(n)) category = '货币市场基金';
  else if (/bond|treasury|fixed income|municipal|corporate debt|credit|income fund|clo|t-bill/.test(n)) category = '债券基金';
  else if (/hedge fund/.test(n)) category = '对冲基金';
  else if (/multi.asset|asset allocation|balanced|target date|stock.bond|equity and bond/.test(n)) category = '混合基金';
  else if (/index|s&p 500|nasdaq.100|russell 2000|total stock market|msci|ftse/.test(n) || ['QQQ', 'SPY', 'VTI', 'IWM'].includes(symbol)) category = '指数基金';
  else if (/equity|stock|growth|dividend|technology|health|ai |artificial intelligence|semiconductor|small.cap|large.cap|value|sector/.test(n)) category = '股票基金';
  const sector = /artificial intelligence|\bai\b|robotic|machine learning/.test(n) ? 'AI行业'
    : /health|medical|biotech|pharma/.test(n) ? '医疗'
    : /technology|software|semiconductor|digital|cyber/.test(n) ? '科技'
    : /energy|oil|gas|solar|uranium/.test(n) ? '能源'
    : /bank|financial|fintech/.test(n) ? '金融'
    : /real estate|reit/.test(n) ? '房地产'
    : /gold|precious metal/.test(n) ? '黄金' : null;
  return { category, sector };
}

async function loadCatalog() {
  if (catalog && Date.now() - cachedAt < 1800000) return catalog;
  const alpacaHeaders = { 'APCA-API-KEY-ID': secrets.get('ALPACA_API_KEY'), 'APCA-API-SECRET-KEY': secrets.get('ALPACA_SECRET_KEY') };
  const response = await fetch('https://paper-api.alpaca.markets/v2/assets?status=active&asset_class=us_equity', { headers: alpacaHeaders });
  if (!response.ok) throw new Error('基金目录暂不可用，请稍后重试');
  const assets = await response.json();
  // Alpaca has no fund-type field. Match explicit ETF names and known exchange-traded fund families;
  // do not label arbitrary equities or non-listed mutual/hedge funds as tradable funds.
  const fundName = /\bETF\b|exchange.traded|\bindex fund\b|\biShares\b|\bSPDR\b|\bVanguard\b|\bInvesco\b|\bProShares\b|\bDirexion\b|\bFirst Trust\b|\bGlobal X\b|\bWisdomTree\b|\bVanEck\b|\bPacer\b|\bSchwab\b|\bFranklin Templeton\b|\bAmplify\b|\bDefiance\b/i;
  const nextCatalog = assets.filter(a => a.status === 'active' && a.tradable && a.class === 'us_equity' && (fundName.test(a.name) || FEATURED.includes(a.symbol))).map(a => ({ symbol: a.symbol, name: a.name, exchange: a.exchange, ...classify(a.name, a.symbol) }));
  nextCatalog.sort((a, b) => (FEATURED.indexOf(a.symbol) < 0 ? 999 : FEATURED.indexOf(a.symbol)) - (FEATURED.indexOf(b.symbol) < 0 ? 999 : FEATURED.indexOf(b.symbol)) || a.symbol.localeCompare(b.symbol));
  catalog = nextCatalog;
  cachedAt = Date.now();
  return catalog;
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    if (!await base44.auth.me()) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { query = '', category = '', sector = '', page = 1 } = await req.json().catch(() => ({}));
    const all = await loadCatalog();
    const q = String(query).trim().toLowerCase().slice(0, 80);
    const filtered = all.filter(fund => (!q || fund.symbol.toLowerCase().includes(q) || fund.name.toLowerCase().includes(q)) && (!category || fund.category === category) && (!sector || fund.sector === sector));
    if (q) filtered.sort((a, b) => (a.symbol.toLowerCase() === q ? -1 : a.symbol.toLowerCase().startsWith(q) ? 0 : 1) - (b.symbol.toLowerCase() === q ? -1 : b.symbol.toLowerCase().startsWith(q) ? 0 : 1) || a.symbol.localeCompare(b.symbol));
    const pageNumber = Math.min(1000, Math.max(1, Number(page) || 1));
    const funds = filtered.slice((pageNumber - 1) * 18, pageNumber * 18);
    if (funds.length) {
      const headers = { 'APCA-API-KEY-ID': secrets.get('ALPACA_API_KEY'), 'APCA-API-SECRET-KEY': secrets.get('ALPACA_SECRET_KEY') };
      const response = await fetch(`https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(funds.map(f => f.symbol).join(','))}`, { headers });
      if (!response.ok) throw new Error('基金行情暂不可用，请稍后重试');
      const data = await response.json();
      const quotes = data.snapshots || data;
      for (const fund of funds) {
        const quote = quotes[fund.symbol];
        fund.price = quote?.latestTrade?.p || quote?.dailyBar?.c || null;
        const previous = quote?.prevDailyBar?.c;
        fund.change = fund.price > 0 && previous > 0 ? (fund.price / previous - 1) * 100 : null;
      }
    }
    return Response.json({ funds, total: filtered.length, page: pageNumber, categories: CATEGORIES, sectors: SECTORS, asOf: new Date().toISOString() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}