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

    // Get latest quotes (bid/ask)
    const quoteRes = await fetch(
      `https://data.alpaca.markets/v2/stocks/quotes/latest?symbols=${encodeURIComponent(symbols)}`,
      {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': secretKey,
        }
      }
    );

    if (!quoteRes.ok) {
      const errText = await quoteRes.text();
      return Response.json({ error: `Alpaca quotes error: ${quoteRes.status} ${errText}` }, { status: 502 });
    }

    const quoteData = await quoteRes.json();
    const prices = {};

    for (const [symbol, quote] of Object.entries(quoteData.quotes || {})) {
      const bid = quote.bp || 0;
      const ask = quote.ap || 0;
      const price = (bid + ask) / 2 || bid || ask;
      if (price > 0) {
        prices[symbol] = {
          price,
          change: 0,
          name: symbol,
        };
      }
    }

    // Get snapshots for 24h change (best effort)
    try {
      const snapRes = await fetch(
        `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(symbols)}`,
        {
          headers: {
            'APCA-API-KEY-ID': apiKey,
            'APCA-API-SECRET-KEY': secretKey,
          }
        }
      );

      if (snapRes.ok) {
        const snapData = await snapRes.json();
        for (const [symbol, snap] of Object.entries(snapData.snapshots || {})) {
          if (prices[symbol] && snap.daily_bar) {
            const current = snap.daily_bar.c;
            const prevClose = snap.prev_daily_bar?.c || snap.daily_bar.o;
            if (current > 0) {
              prices[symbol].price = current;
              if (prevClose > 0) {
                prices[symbol].change = ((current - prevClose) / prevClose) * 100;
              }
            }
          }
        }
      }
    } catch (e) {
      // Snapshots not available, prices from quotes are sufficient
    }

    return Response.json({ prices, timestamp: Date.now() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});