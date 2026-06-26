import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// ETF → spot metal multipliers (each ETF share represents a fraction of a troy ounce)
const METAL_ETFS = {
  gold:     { symbol: 'GLD',  multiplier: 10  }, // 1 share ≈ 1/10 oz
  silver:   { symbol: 'SLV',  multiplier: 1   }, // 1 share ≈ 1 oz
  platinum: { symbol: 'PPLT', multiplier: 100 }, // 1 share ≈ 1/100 oz
  palladium:{ symbol: 'PALL', multiplier: 100 }, // 1 share ≈ 1/100 oz
};

// Fetch metal spot prices + 24h change from Alpaca ETF proxies
const getMetalPricesFromAlpaca = async () => {
  const apiKey = Deno.env.get('ALPACA_API_KEY');
  const secretKey = Deno.env.get('ALPACA_SECRET_KEY');
  if (!apiKey || !secretKey) {
    throw new Error('Alpaca API keys not configured');
  }

  const etfSymbols = Object.values(METAL_ETFS).map(m => m.symbol).join(',');
  const headers = {
    'APCA-API-KEY-ID': apiKey,
    'APCA-API-SECRET-KEY': secretKey,
  };

  // Latest trades for current price
  const tradeRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/trades/latest?symbols=${encodeURIComponent(etfSymbols)}`,
    { headers }
  );
  if (!tradeRes.ok) {
    const errText = await tradeRes.text();
    throw new Error(`Alpaca trades error: ${tradeRes.status} ${errText}`);
  }
  const tradeData = await tradeRes.json();

  // Snapshots for 24h change (prev daily close)
  const snapRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(etfSymbols)}`,
    { headers }
  );
  // Alpaca snapshots: symbols are at the root level (not nested under "snapshots")
  const snapData = snapRes.ok ? await snapRes.json() : {};

  const prices = {};
  const changes = {};

  for (const [metal, cfg] of Object.entries(METAL_ETFS)) {
    const trade = tradeData.trades?.[cfg.symbol];
    if (!trade || !trade.p) continue;

    const spotPrice = trade.p * cfg.multiplier;
    prices[metal] = spotPrice;

    // 24h change from previous daily close (Alpaca uses camelCase keys)
    const snap = snapData[cfg.symbol];
    const prevClose = snap?.prevDailyBar?.c;
    if (prevClose && prevClose > 0) {
      const prevSpot = prevClose * cfg.multiplier;
      changes[metal] = ((spotPrice - prevSpot) / prevSpot) * 100;
    } else {
      changes[metal] = 0;
    }
  }

  if (!prices.gold && !prices.silver && !prices.platinum && !prices.palladium) {
    throw new Error('No metal prices returned from Alpaca');
  }

  return { prices, changes };
};

const getForexRatesFromExchangeRateAPI = async (apiKey) => {
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.result !== 'success') {
    throw new Error('Failed to fetch exchange rates');
  }
  
  const rates = data.conversion_rates;
  
  // Return the price of 1 unit of each currency in USD (inverted rates)
  return {
    sgd: 1 / (rates.SGD || 1.35),
    cnh: 1 / (rates.CNY || 7.25),
    inr: 1 / (rates.INR || 83.50),
    myr: 1 / (rates.MYR || 4.70),
    thb: 1 / (rates.THB || 36.50),
    vnd: 1 / (rates.VND || 24500),
    idr: 1 / (rates.IDR || 16200),
    lak: 1 / (rates.LAK || 21700),
    eur: 1 / (rates.EUR || 0.92),
    gbp: 1 / (rates.GBP || 0.79),
    aud: 1 / (rates.AUD || 1.50),
    nzd: 1 / (rates.NZD || 1.62),
    jpy: 1 / (rates.JPY || 155),
    hkd: 1 / (rates.HKD || 7.82),
    twd: 1 / (rates.TWD || 32.25),
    cad: 1 / (rates.CAD || 1.37),
    aed: 1 / (rates.AED || 3.67),
  };
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const exchangeRateApiKey = Deno.env.get('EXCHANGERATE_API_KEY');

    if (!exchangeRateApiKey) {
      return Response.json({ success: false, error: 'API keys not configured' }, { status: 500 });
    }

    const [metalData, forexRates] = await Promise.all([
      getMetalPricesFromAlpaca(),
      getForexRatesFromExchangeRateAPI(exchangeRateApiKey)
    ]);

    // Combine all prices, ensuring they are all valued in USD
    const currentPrices = {
      usd: 1.00,
      usdt: 1.00,
      ...forexRates,
      ...metalData.prices
    };

    const priceChanges = {
      ...metalData.changes,
      sgd: 0, cnh: 0, inr: 0, myr: 0, thb: 0, vnd: 0, idr: 0, lak: 0,
      eur: 0, gbp: 0, aud: 0, nzd: 0, jpy: 0, hkd: 0, twd: 0, cad: 0, aed: 0,
    };

    return Response.json({
      success: true,
      prices: currentPrices,
      changes: priceChanges,
      _debug: metalData.debugSnap,
      timestamp: new Date().toISOString()
    }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    
    // Return fallback prices in case of API failure
    const fallbackPrices = {
      usd: 1.00,
      sgd: 1 / 1.35,
      cnh: 1 / 7.25,
      inr: 1 / 83.50,
      myr: 1 / 4.70,
      thb: 1 / 36.50,
      vnd: 1 / 24500,
      idr: 1 / 16200,
      lak: 1 / 21700,
      eur: 1 / 0.92,
      gbp: 1 / 0.79,
      aud: 1 / 1.50,
      nzd: 1 / 1.62,
      jpy: 1 / 155,
      hkd: 1 / 7.82,
      twd: 1 / 32.25,
      cad: 1 / 1.37,
      aed: 1 / 3.67,
      usdt: 1.00,
      gold: 2024.50,
      silver: 24.85,
      platinum: 1045.30,
      palladium: 1825.75
    };

    const zeroChanges = Object.keys(fallbackPrices).reduce((acc, key) => ({...acc, [key]: 0}), {});

    return Response.json({
      success: true,
      prices: fallbackPrices,
      changes: zeroChanges,
      timestamp: new Date().toISOString(),
      fallback: true
    }, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
});