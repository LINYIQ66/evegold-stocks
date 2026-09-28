import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

const cache = new Map();
const DAY = 86400000;
const nyDate = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
const dateString = ms => new Date(ms).toISOString().slice(0, 10);

async function grouped(date, key) {
  const hit = cache.get(date);
  if (hit && Date.now() - hit.at < (date === nyDate() ? 300000 : DAY)) return hit.data;
  const res = await fetch(`https://api.polygon.io/v2/aggs/grouped/locale/us/market/stocks/${date}?adjusted=true`, { headers: { Authorization: `Bearer ${key}` } });
  if (!res.ok) throw new Error(res.status === 429 ? '数据服务请求过于频繁，请稍后再试' : `行情服务暂不可用 (${res.status})`);
  const json = await res.json();
  const data = json.results || [];
  cache.set(date, { at: Date.now(), data });
  return data;
}

async function latestOnOrBefore(anchor, key) {
  const ms = Date.parse(`${anchor}T12:00:00Z`);
  for (let n = 0; n <= 7; n++) {
    const date = dateString(ms - n * DAY);
    const weekday = new Date(`${date}T12:00:00Z`).getUTCDay();
    if (weekday === 0 || weekday === 6) continue;
    const rows = await grouped(date, key);
    if (rows.length) return { date, rows };
  }
  throw new Error('所选时段没有可用的市场收盘数据');
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const { view = 'popular', period = 'day' } = await req.json().catch(() => ({}));
    if (!['popular','movers'].includes(view) || !['day','week','month','ytd'].includes(period)) return Response.json({ error: '无效的排行条件' }, { status: 400 });
    const key = secrets.get('POLYGON_API_KEY');
    const latest = await latestOnOrBefore(nyDate(), key);
    if (view === 'popular') {
      const rows = latest.rows.filter(r => r.c >= 1 && r.v > 0 && r.vw > 0).sort((a,b) => b.v * b.vw - a.v * a.vw).slice(0, 50).map(r => ({ symbol: r.T, price: r.c, volume: r.v, turnover: r.v * r.vw }));
      return Response.json({ rows, asOf: latest.date, view, market: '美国上市证券（含 ETF）' });
    }
    const lastMs = Date.parse(`${latest.date}T12:00:00Z`);
    let anchor;
    if (period === 'day') anchor = dateString(lastMs - DAY);
    if (period === 'week') anchor = dateString(lastMs - 7 * DAY);
    if (period === 'month') { const d = new Date(lastMs); const day = d.getUTCDate(); d.setUTCDate(1); d.setUTCMonth(d.getUTCMonth() - 1); d.setUTCDate(Math.min(day, new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 0)).getUTCDate())); anchor = dateString(d.getTime()); }
    if (period === 'ytd') anchor = `${Number(latest.date.slice(0, 4)) - 1}-12-31`;
    const baseline = await latestOnOrBefore(anchor, key);
    const prior = new Map(baseline.rows.filter(r => r.c > 0).map(r => [r.T, r.c]));
    const ranked = latest.rows.filter(r => r.c >= 1 && r.v >= 1000000 && prior.has(r.T)).map(r => ({ symbol: r.T, price: r.c, volume: r.v, change: (r.c / prior.get(r.T) - 1) * 100 })).filter(r => Number.isFinite(r.change)).sort((a,b) => b.change - a.change);
    return Response.json({ gainers: ranked.slice(0, 30), losers: ranked.slice(-30).reverse(), asOf: latest.date, baseline: baseline.date, period, market: '美国上市证券（含 ETF）', criteria: '收盘价 ≥ $1，最新交易日成交量 ≥ 100 万股' });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 502 });
  }
}