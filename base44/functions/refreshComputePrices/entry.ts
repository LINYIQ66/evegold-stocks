import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';

const priceSource = 'https://www.runpod.io/pricing';
const futuresSource = 'https://www.cmegroup.com/markets/energy/power/compute-futures.html';
const models = [
  { slug: 'h100-sxm', model: 'H100 SXM', memory_gb: 80 },
  { slug: 'h200', model: 'H200', memory_gb: 141 },
  { slug: 'b200', model: 'B200', memory_gb: 180 },
  { slug: 'b300', model: 'B300', memory_gb: 288 }
];

async function readPage(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(25000), headers: { Accept: 'text/html' } });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  const html = await response.text();
  if (html.length > 2000000) throw new Error('Source exceeds size limit');
  return html;
}

function parsePrices(html, checkedAt) {
  const blocks = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match => {
    const value = JSON.parse(match[1]);
    return Array.isArray(value) ? value : value['@graph'] || [value];
  });
  const date = blocks.find(item => item['@type'] === 'WebPage')?.dateModified;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) throw new Error('Source price-list date missing');
  const quotes = models.map(spec => {
    const product = blocks.find(item => item['@type'] === 'Product' && item['@id'] === `${priceSource}/#gpu-${spec.slug}`);
    const offers = product?.offers?.offers;
    if (!Array.isArray(offers)) throw new Error(`Missing product: ${spec.model}`);
    const getPrice = name => {
      const offer = offers.find(item => item.name === name);
      const value = Number(offer?.price);
      if (offer?.priceCurrency !== 'USD' || !Number.isFinite(value) || value <= 0 || value > 100) throw new Error(`Invalid hourly price for ${spec.model}`);
      return value;
    };
    return { model: spec.model, memory_gb: spec.memory_gb, provider: 'Runpod', community_hourly: getPrice('Community Cloud'), secure_hourly: getPrice('Secure Cloud'), currency: 'USD', unit: 'GPU-hour', source_date: date, checked_at: checkedAt, source_url: priceSource };
  });
  return { quotes, source_date: date, spot_checked_at: checkedAt };
}

export default async function(req) {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me().catch(error => { if (error.status === 401 || error.response?.status === 401) return null; throw error; });
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
  const service = base44.asServiceRole;
  const page = await service.entities.SystemSetting.filter({ setting_key: 'compute_market_prices_v1' }, { sort: '-updated_date', limit: 1 });
  const existing = page.items[0];
  const checkedAt = new Date().toISOString();
  const snapshot = { ...(existing?.setting_value || {}), last_attempt_at: checkedAt };
  const results = await Promise.allSettled([readPage(priceSource).then(html => parsePrices(html, checkedAt)), readPage(futuresSource)]);
  if (results[0].status === 'fulfilled') {
    Object.assign(snapshot, results[0].value, { prices_error: null });
  } else snapshot.prices_error = String(results[0].reason?.message || 'Price source unavailable').slice(0, 250);
  if (results[1].status === 'fulfilled' && /GPU1/.test(results[1].value) && /GPU2/.test(results[1].value) && /730/.test(results[1].value)) {
    snapshot.futures_reference = { checked_at: checkedAt, source_url: futuresSource, status: 'official_product_information_only', quotes_connected: false };
  }
  const data = { setting_key: 'compute_market_prices_v1', setting_value: snapshot };
  if (existing) await service.entities.SystemSetting.update(existing.id, data);
  else await service.entities.SystemSetting.create(data);
  return Response.json({ success: !snapshot.prices_error, quotes: snapshot.quotes || [], source_date: snapshot.source_date, spot_checked_at: snapshot.spot_checked_at, error: snapshot.prices_error, futures_reference: snapshot.futures_reference }, { status: snapshot.prices_error ? 502 : 200 });
}