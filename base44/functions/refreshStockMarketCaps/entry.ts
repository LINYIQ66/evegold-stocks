import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { secrets } from 'base44:runtime';

const SYMBOLS = ['AAPL', 'MSFT', 'NVDA', 'AMZN', 'GOOGL', 'META', 'TSLA', 'AMD', 'INTC', 'SNDK', 'MU', 'MSTR', 'PLTR', 'HOOD', 'NFLX', 'ORCL', 'COIN', 'BABA', 'CRWV'];
const SETTING_KEY = 'us_stock_market_caps';

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const { batch = 0 } = await req.json().catch(() => ({}));
    if (!Number.isInteger(batch) || batch < 0 || batch > 3) return Response.json({ error: '无效批次' }, { status: 400 });
    const key = secrets.get('POLYGON_API_KEY');
    const existing = (await base44.asServiceRole.entities.SystemSetting.filter({ setting_key: SETTING_KEY }))[0];
    const values = { ...(existing?.setting_value?.values || {}) };
    const checkedAt = new Date().toISOString();
    let updated = 0;
    const failed = [];
    // Polygon's rate limit is five requests per minute; the workflow waits between these batches.
    {
      const results = await Promise.all(SYMBOLS.slice(batch * 5, batch * 5 + 5).map(async symbol => {
        try {
          const response = await fetch(`https://api.polygon.io/v3/reference/tickers/${symbol}`, { headers: { Authorization: `Bearer ${key}` } });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const result = (await response.json()).results;
          if (result?.ticker !== symbol || !Number.isFinite(result.market_cap) || result.market_cap <= 0) throw new Error('无有效市值');
          return { symbol, marketCap: result.market_cap };
        } catch (error) {
          return { symbol, error: error.message };
        }
      }));
      for (const result of results) {
        if (result.error) failed.push(result.symbol);
        else {
          values[result.symbol] = { marketCap: result.marketCap, asOf: checkedAt };
          updated++;
        }
      }
    }
    if (!updated) return Response.json({ error: '市值接口暂不可用', batch, failed }, { status: 502 });
    const setting_value = { values, source: 'Polygon ticker details', checkedAt };
    if (existing) await base44.asServiceRole.entities.SystemSetting.update(existing.id, { setting_value });
    else await base44.asServiceRole.entities.SystemSetting.create({ setting_key: SETTING_KEY, setting_value });
    return Response.json({ updated, failed, checkedAt });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}