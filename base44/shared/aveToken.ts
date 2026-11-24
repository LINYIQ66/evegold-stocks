import { secrets, waitUntil } from 'base44:runtime';

const BASE = 'https://prod.ave-api.com/v2';
const num = v => Number(v) || 0;

// Daily ave.ai quota shared by every function: usage is counted per UTC day in SystemSetting
// (ave_usage_YYYY-MM-DD) with atomic $inc, flushed in small batches to stay under entity rate limits.
export const AVE_DAILY_LIMIT = 990000;
const budget = { client: null, day: '', total: 0, pending: 0, syncing: null, flushQueued: false };
const dayKey = () => `ave_usage_${new Date().toISOString().slice(0, 10)}`;

export function useAveBudget(base44) {
  budget.client = base44.asServiceRole;
}

async function sync() {
  const E = budget.client.entities.SystemSetting;
  const key = dayKey();
  if (budget.day !== key) { budget.day = key; budget.total = 0; }
  const n = budget.pending;
  budget.pending = 0;
  if (n) {
    const r = await E.updateMany({ setting_key: key }, { $inc: { 'setting_value.count': n } });
    if (!r.updated) await E.create({ setting_key: key, setting_value: { count: n, limit: AVE_DAILY_LIMIT } });
  }
  const recs = await E.filter({ setting_key: key });
  budget.total = recs.reduce((s, r) => s + num(r.setting_value?.count), 0);
}

const syncOnce = () => (budget.syncing ||= sync().finally(() => { budget.syncing = null; }));

async function charge(cost) {
  if (!budget.client) throw new Error('ave.ai 流量计数未初始化');
  if (budget.day !== dayKey()) await syncOnce();
  if (budget.total + budget.pending + cost > AVE_DAILY_LIMIT) throw new Error('今日 ave.ai 流量额度已用完，次日（UTC 0 点）自动恢复');
  budget.pending += cost;
  if (!budget.flushQueued) {
    budget.flushQueued = true;
    waitUntil(new Promise(r => setTimeout(r, 5000)).then(syncOnce).catch(e => console.warn('ave.ai 用量同步失败:', e.message)).finally(() => { budget.flushQueued = false; }));
  }
}

// ave.ai free-tier keys are rate limited per second; wait once and retry before failing.
export async function ave(path, init = {}, retried = false, cost = 1) {
  await charge(cost);
  const headers = { 'X-API-KEY': secrets.get('AVE_API_KEY'), Accept: 'application/json' };
  if (init.body) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${BASE}${path}`, { ...init, headers, signal: AbortSignal.timeout(10000) });
  if ((res.status === 403 || res.status === 429) && !retried) {
    await new Promise(r => setTimeout(r, 1200));
    return ave(path, init, true, cost);
  }
  if (!res.ok) throw new Error(`ave.ai 数据暂不可用 (${res.status})`);
  const json = await res.json();
  if (json.status !== 1) throw new Error(json.msg || 'ave.ai 数据暂不可用');
  return json.data;
}

export function normalizeTokenRef(chain, address) {
  const c = String(chain || '').trim().toLowerCase();
  let a = String(address || '').trim();
  if (!/^[a-z0-9_-]{2,30}$/.test(c) || !/^[A-Za-z0-9]{20,80}$/.test(a)) return null;
  if (/^0x[0-9a-fA-F]{40}$/.test(a)) a = a.toLowerCase();
  return { chain: c, address: a, token_id: `${a}-${c}` };
}

export async function fetchAveContract(ref) {
  const data = await ave(`/tokens/${encodeURIComponent(`${ref.address}-${ref.chain}`)}`);
  const t = data?.token;
  if (!t?.symbol) throw new Error('ave.ai 未收录该合约');
  return {
    ave_symbol: String(t.symbol).slice(0, 40),
    name: String(t.name || t.symbol).slice(0, 120),
    logo_url: t.logo_url || '',
    price: num(t.current_price_usd),
    change24h: num(t.price_change_24h),
    market_cap: num(t.market_cap),
    tvl: num(t.main_pair_tvl ?? t.tvl),
    holders: num(t.holders),
    volume_24h: num(t.tx_volume_u_24h),
    risk_level: Number(t.risk_level ?? -1),
    risk_score: num(t.risk_score),
    buy_tax: num(t.buy_tax),
    sell_tax: num(t.sell_tax),
    is_honeypot: String(t.is_honeypot) === '1' || t.is_honeypot === true,
    is_mintable: String(t.is_mintable) === '1',
    pairs: (data.pairs || []).length,
    website: t.website || '',
    checked_at: new Date().toISOString(),
  };
}

const STORED = ['ave_symbol', 'name', 'logo_url', 'market_cap', 'tvl', 'holders', 'risk_level', 'risk_score', 'buy_tax', 'sell_tax', 'is_honeypot', 'is_mintable', 'checked_at'];
export const contractFields = info => Object.fromEntries(STORED.map(k => [k, info[k]]));

export function suggestSymbol(aveSymbol) {
  const s = String(aveSymbol || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 15);
  return s.length >= 2 ? s : '';
}

// Batch live quotes: { [token_id]: { price, change } }
export async function fetchAvePrices(tokenIds) {
  if (!tokenIds.length) return {};
  const ids = tokenIds.slice(0, 200);
  // Counted per token so batch quotes never under-count against the daily quota.
  const data = await ave('/tokens/price', { method: 'POST', body: JSON.stringify({ token_ids: ids }) }, false, ids.length);
  const out = {};
  for (const [id, q] of Object.entries(data || {})) {
    const price = num(q?.current_price_usd);
    if (price > 0) out[id] = { price, change: num(q.price_change_24h), source: 'ave.ai' };
  }
  return out;
}