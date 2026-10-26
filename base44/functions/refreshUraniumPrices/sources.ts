const spotUrl = 'https://www.cameco.com/invest/markets/uranium-price';
const futuresUrl = 'https://finance.yahoo.com/quote/UX%3DF/';

async function get(url) {
  const request = () => fetch(url, { signal: AbortSignal.timeout(20000), headers: { 'User-Agent': 'EVE-METAL-MarketResearch/1.0', Accept: 'application/json,text/html' } });
  let response = await request();
  if (response.status === 429) {
    const header = response.headers.get('Retry-After');
    const seconds = header ? Number(header) : 5;
    if (Number.isFinite(seconds) && seconds >= 0 && seconds <= 20) {
      await response.body?.cancel();
      await new Promise(resolve => setTimeout(resolve, Math.max(5, seconds) * 1000));
      response = await request();
    }
  }
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}`);
  return response;
}

export async function loadSpot() {
  const html = await (await get(spotUrl)).text();
  if (!html.includes('Uranium Spot Price')) throw new Error('Spot table heading changed');
  const points = [];
  const today = new Date().toISOString().slice(0, 10);
  for (const match of html.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...match[1].matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)];
    if (cells.length < 2 || !/field-spot-price/.test(cells[1][0])) continue;
    const date = cells[0][1].replace(/<[^>]*>/g, '').trim().replaceAll('/', '-');
    const price = Number(cells[1][1].replace(/<[^>]*>/g, '').trim());
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && date >= '2024-01-01' && date <= today && Number.isFinite(price) && price > 0) points.push({ date, price });
  }
  if (!points.some(p => p.date.startsWith('2024')) || !points.some(p => p.date.startsWith('2025'))) throw new Error('Spot historical table is incomplete');
  return { points, source_url: spotUrl, source_name: 'Cameco · UxC / TradeTech', instrument: 'U3O8 month-end spot industry average' };
}

export async function loadFutures() {
  const payload = await (await get('https://query1.finance.yahoo.com/v8/finance/chart/UX%3DF?range=5d&interval=1d')).json();
  const series = payload.chart?.result?.[0];
  if (payload.chart?.error || series?.meta?.symbol !== 'UX=F' || series.meta.instrumentType !== 'FUTURE' || series.meta.currency !== 'USD' || !/uranium|u3o8/i.test(series.meta.shortName || '')) throw new Error('Invalid uranium futures instrument');
  const closes = series.indicators?.quote?.[0]?.close || [];
  const points = (series.timestamp || []).flatMap((time, index) => {
    const price = closes[index];
    if (typeof price !== 'number' || !Number.isFinite(price) || price <= 0 || !Number.isFinite(time) || time * 1000 > Date.now()) return [];
    const date = new Date(time * 1000).toISOString().slice(0, 10);
    return date >= '2024-01-01' ? [{ date, price: Math.round(price * 10000) / 10000 }] : [];
  });
  if (!points.length) throw new Error('No dated futures prices available');
  return { points, source_url: futuresUrl, source_name: 'Yahoo Finance · COMEX · UX=F', instrument: 'UX=F', provider_instrument_name: series.meta.shortName };
}

export function mergeSeries(previous, incoming, checkedAt) {
  const points = new Map(Object.values(previous?.by_year || {}).flat().map(p => [p.date, p]));
  for (const point of incoming.points) points.set(point.date, point);
  const sorted = [...points.values()].sort((a, b) => a.date.localeCompare(b.date));
  const byYear = {};
  for (const point of sorted) (byYear[point.date.slice(0, 4)] ||= []).push(point);
  const { points: unused, ...metadata } = incoming;
  return { ...metadata, by_year: byYear, latest: sorted.at(-1), last_checked_at: checkedAt, error: null };
}