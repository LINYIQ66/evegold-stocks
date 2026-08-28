import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Get latest quotes from Alpaca for dynamically added stock symbols
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const symbols = (body.symbols || '').trim();

    if (!symbols) {
      return Response.json({ prices: {} });
    }

    const apiKey = Deno.env.get("ALPACA_API_KEY");
    const secretKey = Deno.env.get("ALPACA_SECRET_KEY");

    const snapshotRes = await fetch(
      `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(symbols)}`,
      {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': secretKey,
        }
      }
    );

    if (!snapshotRes.ok) {
      const errText = await snapshotRes.text();
      return Response.json({ error: `Alpaca snapshots error: ${snapshotRes.status} ${errText}` }, { status: 502 });
    }

    const snapshotData = await snapshotRes.json();
    const snapshots = snapshotData.snapshots || snapshotData;
    const prices = {};

    for (const [symbol, snapshot] of Object.entries(snapshots)) {
      const price = snapshot?.latestTrade?.p || snapshot?.dailyBar?.c || 0;
      const previousClose = snapshot?.prevDailyBar?.c;
      if (price > 0) {
        prices[symbol] = {
          price,
          change: previousClose > 0 ? ((price - previousClose) / previousClose) * 100 : 0,
          name: symbol,
          bid: snapshot?.latestQuote?.bp || null,
          ask: snapshot?.latestQuote?.ap || null,
          high: snapshot?.dailyBar?.h || null,
          low: snapshot?.dailyBar?.l || null,
          volume: snapshot?.dailyBar?.v || null,
          vwap: snapshot?.dailyBar?.vw || null,
          turnover: snapshot?.dailyBar?.v && snapshot?.dailyBar?.vw
            ? snapshot.dailyBar.v * snapshot.dailyBar.vw
            : null,
        };
      }
    }

    return Response.json({ prices, timestamp: Date.now() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});