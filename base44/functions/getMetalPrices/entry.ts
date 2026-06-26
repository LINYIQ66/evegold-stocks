import { createClientFromRequest } from 'npm:@base44/sdk@0.8.31';

// Primary: MetalPriceAPI for spot metal prices
const getMetalPricesFromAPI = async (apiKey) => {
  const symbols = 'XAU,XAG,XPT,XPD';
  const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${symbols}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error('MetalPriceAPI returned error: ' + JSON.stringify(data));
  }
  
  return {
    gold: 1 / data.rates.XAU,
    silver: 1 / data.rates.XAG,
    platinum: 1 / data.rates.XPT,
    palladium: 1 / data.rates.XPD,
  };
};

// Fallback: Alpaca ETF proxies for metal prices
const METAL_ETFS = {
  gold:     { symbol: 'GLD',  multiplier: 10  },
  silver:   { symbol: 'SLV',  multiplier: 1   },
  platinum: { symbol: 'PPLT', multiplier: 100 },
  palladium:{ symbol: 'PALL', multiplier: 100 },
};

const getMetalPricesFromAlpaca = async () => {
  const apiKey = Deno.env.get('ALPACA_API_KEY');
  const secretKey = Deno.env.get('ALPACA_SECRET_KEY');
  if (!apiKey || !secretKey) throw new Error('Alpaca API keys not configured');

  const etfSymbols = Object.values(METAL_ETFS).map(m => m.symbol).join(',');
  const headers = {
    'APCA-API-KEY-ID': apiKey,
    'APCA-API-SECRET-KEY': secretKey,
  };

  const tradeRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/trades/latest?symbols=${encodeURIComponent(etfSymbols)}`,
    { headers }
  );
  if (!tradeRes.ok) throw new Error('Alpaca trades error');
  const tradeData = await tradeRes.json();

  const snapRes = await fetch(
    `https://data.alpaca.markets/v2/stocks/snapshots?symbols=${encodeURIComponent(etfSymbols)}`,
    { headers }
  );
  const snapData = snapRes.ok ? await snapRes.json() : {};

  const prices = {};
  const changes = {};

  for (const [metal, cfg] of Object.entries(METAL_ETFS)) {
    const trade = tradeData.trades?.[cfg.symbol];
    if (!trade || !trade.p) continue;
    prices[metal] = trade.p * cfg.multiplier;

    const prevClose = snapData[cfg.symbol]?.prevDailyBar?.c;
    if (prevClose && prevClose > 0) {
      const prevSpot = prevClose * cfg.multiplier;
      changes[metal] = ((prices[metal] - prevSpot) / prevSpot) * 100;
    } else {
      changes[metal] = 0;
    }
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

    const metalApiKey = Deno.env.get('METALPRICEAPI_KEY');
    const exchangeRateApiKey = Deno.env.get('EXCHANGERATE_API_KEY');

    if (!exchangeRateApiKey) {
      return Response.json({ success: false, error: 'API keys not configured' }, { status: 500 });
    }

    // Try MetalPriceAPI first, fall back to Alpaca ETFs
    let metalPrices;
    let metalChanges = { gold: 0, silver: 0, platinum: 0, palladium: 0 };

    try {
      if (!metalApiKey) throw new Error('No MetalPriceAPI key');
      metalPrices = await getMetalPricesFromAPI(metalApiKey);
    } catch (e) {
      console.log('MetalPriceAPI failed, trying Alpaca fallback:', e.message);
      const alpacaData = await getMetalPricesFromAlpaca();
      metalPrices = alpacaData.prices;
      metalChanges = alpacaData.changes;
    }

    const forexRates = await getForexRatesFromExchangeRateAPI(exchangeRateApiKey);

    const currentPrices = {
      usd: 1.00,
      usdt: 1.00,
      ...forexRates,
      ...metalPrices
    };

    const priceChanges = {
      ...metalChanges,
      sgd: 0, cnh: 0, inr: 0, myr: 0, thb: 0, vnd: 0, idr: 0, lak: 0,
      eur: 0, gbp: 0, aud: 0, nzd: 0, jpy: 0, hkd: 0, twd: 0, cad: 0, aed: 0,
    };

    return Response.json({
      success: true,
      prices: currentPrices,
      changes: priceChanges,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error fetching prices:', error);
    
    const fallbackPrices = {
      usd: 1.00, usdt: 1.00,
      sgd: 1/1.35, cnh: 1/7.25, inr: 1/83.50, myr: 1/4.70,
      thb: 1/36.50, vnd: 1/24500, idr: 1/16200, lak: 1/21700,
      eur: 1/0.92, gbp: 1/0.79, aud: 1/1.50, nzd: 1/1.62,
      jpy: 1/155, hkd: 1/7.82, twd: 1/32.25, cad: 1/1.37, aed: 1/3.67,
      gold: 2024.50, silver: 24.85, platinum: 1045.30, palladium: 1825.75
    };
    const zeroChanges = Object.keys(fallbackPrices).reduce((acc, key) => ({...acc, [key]: 0}), {});

    return Response.json({
      success: true,
      prices: fallbackPrices,
      changes: zeroChanges,
      timestamp: new Date().toISOString(),
      fallback: true
    });
  }
});