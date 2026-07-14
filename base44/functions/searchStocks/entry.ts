import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Cache Alpaca assets list to avoid re-fetching on every search
let assetsCache = null;
let assetsCacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour
const BLOCKED_SYMBOLS = new Set(["SKHYV"]); // Deprecated tickers — hidden from search

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const query = (body.q || '').trim().toLowerCase();

    if (!query || query.length < 1) {
      return Response.json({ results: [] });
    }

    const apiKey = Deno.env.get("ALPACA_API_KEY");
    const secretKey = Deno.env.get("ALPACA_SECRET_KEY");

    // Fetch and cache all active US equity assets
    if (!assetsCache || Date.now() - assetsCacheTime > CACHE_TTL) {
      const res = await fetch('https://paper-api.alpaca.markets/v2/assets?status=active&asset_class=us_equity', {
        headers: {
          'APCA-API-KEY-ID': apiKey,
          'APCA-API-SECRET-KEY': secretKey,
        }
      });

      if (!res.ok) {
        return Response.json({ error: 'Alpaca API error' }, { status: 502 });
      }

      const assets = await res.json();
      assetsCache = assets.filter(a => a.tradable && !BLOCKED_SYMBOLS.has(a.symbol.toUpperCase()));
      assetsCacheTime = Date.now();
    }

    // Fuzzy search: match symbol prefix first, then symbol contains, then name contains
    const startsWithSymbol = [];
    const containsSymbol = [];
    const containsName = [];

    for (const a of assetsCache) {
      const sym = a.symbol.toLowerCase();
      const name = (a.name || '').toLowerCase();

      if (sym.startsWith(query)) {
        startsWithSymbol.push(a);
      } else if (sym.includes(query)) {
        containsSymbol.push(a);
      } else if (name.includes(query)) {
        containsName.push(a);
      }
    }

    const results = [...startsWithSymbol, ...containsSymbol, ...containsName]
      .slice(0, 20)
      .map(a => ({ symbol: a.symbol, name: a.name, exchange: a.exchange }));

    return Response.json({ results });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});