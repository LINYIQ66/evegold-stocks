import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { loadSpot, loadFutures, mergeSeries } from './sources.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(error => {
      if (error.status === 401 || error.response?.status === 401) return null;
      throw error;
    });
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });
    const settings = await base44.asServiceRole.entities.SystemSetting.filter({ setting_key: 'uranium_market_prices_v1' }, { sort: '-updated_date', limit: 1 });
    const record = settings.items[0];
    const old = record?.setting_value || {};
    const checkedAt = new Date().toISOString();
    const results = await Promise.allSettled([loadSpot(), loadFutures()]);
    const value = { ...old, last_attempt_at: checkedAt };
    const errors = [];
    ['spot', 'futures'].forEach((key, index) => {
      const result = results[index];
      if (result.status === 'fulfilled') value[key] = mergeSeries(old[key], result.value, checkedAt);
      else {
        errors.push({ source: key, message: result.reason.message });
        value[key] = { ...old[key], error: result.reason.message, last_attempt_at: checkedAt };
        console.error(`Uranium ${key}: ${result.reason.message}`);
      }
    });
    const data = { setting_key: 'uranium_market_prices_v1', setting_value: value };
    if (record) await base44.asServiceRole.entities.SystemSetting.update(record.id, data);
    else await base44.asServiceRole.entities.SystemSetting.create(data);
    return Response.json({ status: errors.length ? 'partial_or_failed' : 'updated', checked_at: checkedAt, spot: value.spot?.latest, futures: value.futures?.latest, years: Object.keys(value.spot?.by_year || {}), errors }, { status: errors.length ? 502 : 200 });
  } catch (error) {
    console.error(error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}