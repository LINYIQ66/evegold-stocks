import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { normalizeTokenRef, fetchAveContract, contractFields, suggestSymbol } from '../../shared/aveToken.ts';

const first = res => (Array.isArray(res) ? res : res?.items || []);

// Signed-in users ask for an ave.ai token to be listed; it stays pending until an admin approves it.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: '请先登录' }, { status: 401 });
    const { chain, address } = await req.json().catch(() => ({}));
    const ref = normalizeTokenRef(chain, address);
    if (!ref) return Response.json({ error: '链或合约地址格式不正确' }, { status: 400 });

    const Listed = base44.asServiceRole.entities.ListedToken;
    const existing = first(await Listed.filter({ token_id: ref.token_id }))[0];
    if (existing) return Response.json({ record: { id: existing.id, token_id: existing.token_id, status: existing.status } });

    const mine = first(await Listed.filter({ requested_by_id: user.id, status: 'pending' }));
    if (mine.length >= 10) return Response.json({ error: '你已有 10 个待审核的上架申请，请等待审核' }, { status: 429 });

    const info = await fetchAveContract(ref);
    const record = await Listed.create({ ...ref, ...contractFields(info), symbol: suggestSymbol(info.ave_symbol), status: 'pending', requested_by_id: user.id });
    return Response.json({ record: { id: record.id, token_id: record.token_id, status: record.status } });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}