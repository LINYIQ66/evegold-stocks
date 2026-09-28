import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { getCryptoMarket } from '../../shared/cryptoMarket.ts';

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    const held = [...Object.keys(user.wallet_balances || {}), ...Object.keys(user.locked_balances || {})]
      .filter(key => /^crypto_[a-z0-9]{2,15}$/.test(key))
      .map(key => key.slice(7));
    return Response.json(await getCryptoMarket(held));
  } catch (error) {
    return Response.json({ error: error.message }, { status: 503 });
  }
}