import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { ave, useAveBudget } from '../../shared/aveToken.ts';

const SORTS = ['market_cap', 'tx_volume_u_24h', 'main_pair_tvl', 'fdv', 'price_change_24h', 'holders'];
let topicsCache = null;
// Same search / ranking within 60s is served from memory instead of calling ave.ai again.
const listCache = new Map();
const LIST_TTL = 60000;

const num = v => Number(v) || 0;

function normalize(t) {
  return {
    id: `${t.token}-${t.chain}`, token: t.token, chain: t.chain, symbol: t.symbol, name: t.name, logo: t.logo_url,
    price: num(t.current_price_usd), change24h: num(t.token_price_change_24h ?? t.price_change_24h),
    market_cap: num(t.market_cap), fdv: num(t.fdv), tx_volume_u_24h: num(t.tx_volume_u_24h ?? t.token_tx_volume_usd_24h),
    main_pair_tvl: num(t.main_pair_tvl ?? t.tvl), holders: num(t.holders),
  };
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    useAveBudget(base44);
    const { keyword = '', topic = 'hot', sort = 'market_cap' } = await req.json().catch(() => ({}));
    const orderby = SORTS.includes(sort) ? sort : 'market_cap';
    const q = String(keyword).trim().slice(0, 80);

    if (!topicsCache) topicsCache = await ave('/ranks/topics');
    const topicId = topicsCache.some(t => t.id === topic) ? topic : 'hot';

    const path = q
      ? `/tokens?keyword=${encodeURIComponent(q)}&limit=300${['market_cap', 'tx_volume_u_24h', 'main_pair_tvl', 'fdv'].includes(orderby) ? `&orderby=${orderby}` : ''}`
      : `/ranks?topic=${encodeURIComponent(topicId)}`;
    let hit = listCache.get(path);
    if (!hit || Date.now() - hit.at > LIST_TTL) {
      hit = { raw: (await ave(path)) || [], at: Date.now(), asOf: new Date().toISOString() };
      if (listCache.size > 200) listCache.clear();
      listCache.set(path, hit);
    }

    const tokens = hit.raw.map(normalize);
    tokens.sort((a, b) => b[orderby] - a[orderby]);
    return Response.json({ tokens, topics: topicsCache, topic: topicId, asOf: hit.asOf });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}