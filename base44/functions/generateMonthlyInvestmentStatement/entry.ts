import { createClientFromRequest } from 'npm:@base44/sdk@0.8.49';
import { jsPDF } from 'npm:jspdf@4.0.0';

const METALS = new Set(['GOLD', 'SILVER', 'PLATINUM', 'PALLADIUM']);
const CURRENCIES = new Set(['USD', 'USDT', 'SGD', 'CNH', 'CNY', 'INR', 'MYR', 'THB', 'VND', 'IDR', 'LAK', 'EUR', 'GBP', 'AUD', 'NZD', 'JPY', 'HKD', 'TWD', 'CAD', 'AED']);
const money = (value) => `$${(Number(value) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const safeText = (value) => String(value || '').replace(/[^\x20-\x7E]/g, '?');

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { month, userEmail } = await req.json();
    if (typeof month !== 'string' || !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return Response.json({ error: 'Month must be in YYYY-MM format' }, { status: 400 });
    }
    if (userEmail && (typeof userEmail !== 'string' || userEmail.toLowerCase() !== user.email.toLowerCase()) && user.role !== 'admin') {
      return Response.json({ error: 'Only administrators can generate statements for other clients' }, { status: 403 });
    }
    const email = userEmail ? userEmail.trim() : user.email;
    if (!email) return Response.json({ error: 'Client email is required' }, { status: 400 });
    const clients = await base44.asServiceRole.entities.User.filter({ email });
    if (!clients.length) return Response.json({ error: 'Client not found' }, { status: 404 });
    const client = clients[0];
    const [year, monthNumber] = month.split('-').map(Number);
    // Calendar-month boundaries use Singapore time (UTC+8), matching the daily statements.
    const start = new Date(Date.UTC(year, monthNumber - 1, 1) - 8 * 3600000);
    const end = new Date(Date.UTC(year, monthNumber, 1) - 8 * 3600000);
    const period = { $gte: start.toISOString(), $lt: end.toISOString() };
    const [byEmail, byCreator] = await Promise.all([
      base44.asServiceRole.entities.Transaction.filter({ user_email: client.email, created_date: period, transaction_type: 'swap', status: 'completed' }, '-created_date', 5000),
      base44.asServiceRole.entities.Transaction.filter({ created_by: client.email, created_date: period, transaction_type: 'swap', status: 'completed' }, '-created_date', 5000),
    ]);
    if (byEmail.length === 5000 || byCreator.length === 5000) {
      return Response.json({ error: 'Too many trades for a single statement; contact support for an export.' }, { status: 422 });
    }
    const trades = [...new Map([...byEmail, ...byCreator]
      .filter(tx => !tx.user_email || tx.user_email.toLowerCase() === client.email.toLowerCase())
      .map(tx => [tx.id, tx])).values()]
      .filter(tx => tx.created_date >= start.toISOString() && tx.created_date < end.toISOString())
      .sort((a, b) => new Date(a.created_date) - new Date(b.created_date));
    const metalTrades = trades.filter(tx => METALS.has(String(tx.from_asset).toUpperCase()) || METALS.has(String(tx.to_asset).toUpperCase()));
    const stockTrades = trades.filter(tx => !metalTrades.includes(tx) && [tx.from_asset, tx.to_asset].some(asset => {
      const key = String(asset || '').toUpperCase();
      return key && !CURRENCIES.has(key) && key !== 'EVE';
    }));

    const doc = new jsPDF();
    let y = 20;
    let page = 1;
    const line = (text, size = 10, bold = false) => {
      doc.setFont('helvetica', bold ? 'bold' : 'normal');
      doc.setFontSize(size);
      for (const row of doc.splitTextToSize(safeText(text), 175)) {
        if (y > 272) {
          doc.setFontSize(9);
          doc.text(`Page ${page++}`, 190, 285, { align: 'right' });
          doc.addPage();
          y = 20;
          doc.setFont('helvetica', bold ? 'bold' : 'normal');
          doc.setFontSize(size);
        }
        doc.text(row, 18, y);
        y += size > 12 ? 9 : 7;
      }
    };
    line('EVE FINANCE', 18, true);
    line('Monthly Investment Statement', 15, true);
    line(`Period: ${month} (Singapore Time, UTC+8)`);
    line(`Client: ${client.full_name || client.email}`);
    line(`Email: ${client.email}`);
    line(`Generated: ${new Date().toLocaleString('en-GB', { timeZone: 'Asia/Singapore' })} SGT`);
    y += 4;
    const section = (title, entries) => {
      line(`${title} - ${entries.length} completed trades`, 13, true);
      line(`Total traded value (USD): ${money(entries.reduce((sum, tx) => sum + (Number(tx.amount_usd) || 0), 0))}`);
      line(`Total fees (USD): ${money(entries.reduce((sum, tx) => sum + (Number(tx.fee_usd) || 0), 0))}`);
      y += 2;
      if (!entries.length) line('No completed trades during this period.');
      for (const tx of entries) {
        const at = new Date(tx.created_date).toLocaleString('en-GB', { timeZone: 'Asia/Singapore', hour12: false });
        const pair = `${String(tx.from_asset || '?').toUpperCase()} -> ${String(tx.to_asset || '?').toUpperCase()}`;
        line(`${at} SGT  ${pair}`);
        line(`  Value: ${money(tx.amount_usd)} USD  |  Fee: ${money(tx.fee_usd)} USD  |  Rate: ${Number(tx.exchange_rate) || 0}`);
      }
      y += 6;
    };
    section('Stock trading', stockTrades);
    section('Precious metal trading', metalTrades);
    line(`Combined: ${stockTrades.length + metalTrades.length} trades | Value: ${money([...stockTrades, ...metalTrades].reduce((s, tx) => s + (Number(tx.amount_usd) || 0), 0))} USD`, 10, true);
    line(`Combined fees: ${money([...stockTrades, ...metalTrades].reduce((s, tx) => s + (Number(tx.fee_usd) || 0), 0))} USD`);
    line('Trading activity only; values are transaction amounts, not portfolio returns.');
    doc.setFontSize(9);
    doc.text(`Page ${page}`, 190, 285, { align: 'right' });
    const filename = `EVE-investment-statement-${month}.pdf`;
    return Response.json({ filename, pdfBase64: doc.output('datauristring').split(',')[1] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}