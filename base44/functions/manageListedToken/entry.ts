import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { normalizeTokenRef, fetchAveContract, contractFields, suggestSymbol } from '../../shared/aveToken.ts';
import { getCryptoMarket } from '../../shared/cryptoMarket.ts';

const bad = (error, status = 400) => Response.json({ error }, { status });
const first = res => (Array.isArray(res) ? res : res?.items || []);

// Admin-only: check contracts on ave.ai, add, approve, reject or suspend on-chain tokens.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch(e => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return bad('Unauthorized', 401);
    if (user.role !== 'admin') return bad('Forbidden', 403);
    const body = await req.json().catch(() => ({}));
    const Listed = base44.asServiceRole.entities.ListedToken;

    if (body.action === 'check' || body.action === 'add') {
      const ref = normalizeTokenRef(body.chain, body.address);
      if (!ref) return bad('链或合约地址格式不正确');
      const existing = first(await Listed.filter({ token_id: ref.token_id }))[0] || null;
      if (body.action === 'add' && existing) return Response.json({ record: existing });
      const info = await fetchAveContract(ref);
      if (body.action === 'check') return Response.json({ ref, info, existing });
      const record = await Listed.create({ ...ref, ...contractFields(info), symbol: suggestSymbol(info.ave_symbol), status: 'pending' });
      return Response.json({ record });
    }

    const record = body.id ? await Listed.get(body.id).catch(e => (e.status === 404 ? null : Promise.reject(e))) : null;
    if (!record) return bad('代币记录不存在', 404);
    const note = String(body.note || '').slice(0, 500);

    if (body.action === 'recheck') {
      const info = await fetchAveContract(record);
      await Listed.update(record.id, contractFields(info));
      return Response.json({ record: { ...record, ...contractFields(info) }, info });
    }

    if (body.action === 'approve') {
      const symbol = String(body.symbol || '').trim().toUpperCase();
      if (!/^[A-Z0-9]{2,15}$/.test(symbol)) return bad('交易代码需为 2-15 位字母或数字');
      const wasListed = ['approved', 'disabled'].includes(record.status);
      if (wasListed && record.symbol && record.symbol !== symbol) return bad('已上架代币不能修改交易代码（会影响用户钱包余额）');
      if (symbol === 'PIX') return bad('该交易代码已被占用');
      const sameSymbol = first(await Listed.filter({ symbol }));
      if (sameSymbol.some(o => o.id !== record.id && ['approved', 'disabled'].includes(o.status))) return bad('该交易代码已被其他代币使用');
      const market = await getCryptoMarket([]);
      if (market.coins.some(c => !c.onchain && c.symbol === symbol)) return bad('该交易代码与主流币冲突，请换一个');
      const info = await fetchAveContract(record);
      if (!(info.price > 0)) return bad('ave.ai 暂无该代币报价，无法上架');
      const update = { ...contractFields(info), symbol, status: 'approved', review_note: note || record.review_note || '' };
      await Listed.update(record.id, update);
      return Response.json({ record: { ...record, ...update } });
    }

    if (body.action === 'reject' || body.action === 'disable') {
      const status = body.action === 'reject' ? 'rejected' : 'disabled';
      if (status === 'disabled' && record.status !== 'approved') return bad('只有已上架的代币可以暂停交易');
      if (status === 'rejected' && record.status !== 'pending') return bad('只有待审核的代币可以拒绝');
      await Listed.update(record.id, { status, review_note: note });
      return Response.json({ record: { ...record, status, review_note: note } });
    }

    return bad('未知操作');
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}