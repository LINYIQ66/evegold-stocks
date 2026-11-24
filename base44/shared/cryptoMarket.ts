import { secrets } from 'base44:runtime';

let topCache = null;
let cachedAt = 0;

const validQuote = (coin) => Number.isFinite(coin?.quote?.USD?.price) && coin.quote.USD.price > 0;
const normalize = (coin) => ({
  symbol: coin.symbol.toUpperCase(),
  name: coin.name,
  rank: coin.cmc_rank,
  price: coin.quote.USD.price,
  change: coin.quote.USD.percent_change_24h ?? 0,
  source: 'CoinMarketCap',
});

// OKX public spot market data needs no API credentials. Prefer direct USD pairs,
// then convert USDT pairs to USD using the current CMC USDT/USD quote.
async function getOkxQuotes(usdtUsd) {
  const response = await fetch('https://www.okx.com/api/v5/market/tickers?instType=SPOT', {
    headers: { Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error('OKX market quotes unavailable');
  const result = await response.json();
  if (result.code !== '0' || !Array.isArray(result.data)) throw new Error('OKX market quotes unavailable');
  const quotes = new Map();
  for (const ticker of result.data) {
    const match = /^([A-Z0-9]{2,15})-(USD|USDT)$/.exec(ticker.instId || '');
    if (!match) continue;
    const [, symbol, currency] = match;
    if (currency === 'USDT' && (!Number.isFinite(usdtUsd) || usdtUsd <= 0)) continue;
    const price = Number(ticker.last);
    const open = Number(ticker.open24h);
    const timestamp = Number(ticker.ts);
    if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(timestamp) || Math.abs(Date.now() - timestamp) > 90000) continue;
    const converted = currency === 'USD' ? price : price * usdtUsd;
    const previous = quotes.get(symbol);
    if (previous && previous.currency === 'USD' && currency !== 'USD') continue;
    quotes.set(symbol, {
      currency,
      price: converted,
      change: Number.isFinite(open) && open > 0 ? (price / open - 1) * 100 : null,
      quotedAt: new Date(timestamp).toISOString(),
    });
  }
  return quotes;
}

async function cmc(path) {
  const key = secrets.get('CMC_API_KEY');
  if (!key) throw new Error('CMC_API_KEY is not configured');
  const response = await fetch(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/${path}`, {
    headers: { 'X-CMC_PRO_API_KEY': key, 'Accept': 'application/json' },
  });
  if (!response.ok) throw new Error('Crypto market quotes unavailable');
  const data = await response.json();
  if (data.status?.error_code) throw new Error('Crypto market quotes unavailable');
  return data.data;
}

// On-chain tokens priced from their DEX pool (not listed on CMC/OKX under these contracts).
const ONCHAIN_TOKENS = [
  { symbol: 'PIX', name: 'PiX (Polygon)', chain: 'polygon', address: '0xab787774bdf01fc22410165ffabf76e0e0ebc94f' },
];

const onchainCache = new Map();

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

async function getGeckoTerminalQuote(token) {
  const network = token.chain === 'polygon' ? 'polygon_pos' : token.chain;
  const data = await fetchJson(`https://api.geckoterminal.com/api/v2/networks/${network}/tokens/${token.address}?include=top_pools`);
  const price = Number(data?.data?.attributes?.price_usd);
  if (!(price > 0)) throw new Error('no price');
  return { price, change: Number(data.included?.[0]?.attributes?.price_change_percentage?.h24) || 0, source: 'GeckoTerminal' };
}

async function getDexScreenerQuote(token) {
  const data = await fetchJson(`https://api.dexscreener.com/tokens/v1/${token.chain}/${token.address}`);
  const pair = (Array.isArray(data) ? data : data.pairs || [])
    .filter(p => p.chainId === token.chain && p.baseToken?.address?.toLowerCase() === token.address && Number(p.priceUsd) > 0)
    .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
  if (!pair) throw new Error('no pair');
  return { price: Number(pair.priceUsd), change: pair.priceChange?.h24 ?? 0, source: 'DexScreener' };
}

async function getAveQuote(token) {
  const response = await fetch(`https://prod.ave-api.com/v2/tokens/${token.address}-${token.chain}`, {
    headers: { 'X-API-KEY': secrets.get('AVE_API_KEY'), Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`ave.ai HTTP ${response.status}`);
  const data = (await response.json())?.data?.token;
  const price = Number(data?.current_price_usd);
  if (!(price > 0)) throw new Error('no price');
  return { price, change: Number(data.price_change_24h) || 0, source: 'ave.ai' };
}

async function getOnchainQuote(token) {
  const cached = onchainCache.get(token.symbol);
  if (cached && Date.now() - cached.at < 60000) return cached.coin;
  let quote;
  for (const source of [getAveQuote, getGeckoTerminalQuote, getDexScreenerQuote]) {
    try {
      quote = await source(token);
      break;
    } catch (error) {
      console.warn(`${source.name} failed for ${token.symbol}:`, error.message);
    }
  }
  if (!quote) throw new Error(`No on-chain quote for ${token.symbol}`);
  const coin = { symbol: token.symbol, name: token.name, onchain: true, ...quote, quotedAt: new Date().toISOString() };
  onchainCache.set(token.symbol, { coin, at: Date.now() });
  return coin;
}

export async function getCryptoMarket(heldSymbols = []) {
  if (!topCache || Date.now() - cachedAt > 30000) {
    const listings = await cmc('listings/latest?start=1&limit=20&convert=USD');
    if (!Array.isArray(listings) || !listings.some(c => c.symbol === 'BTC') || !listings.some(c => c.symbol === 'ETH')) throw new Error('Incomplete crypto market quotes');
    topCache = listings.filter(validQuote).map(normalize);
    cachedAt = Date.now();
  }
  const coins = topCache.map(coin => ({ ...coin }));
  const extra = [...new Set(heldSymbols.map(s => String(s).toUpperCase()))]
    .filter(s => /^[A-Z0-9]{2,15}$/.test(s) && !coins.some(c => c.symbol === s) && !ONCHAIN_TOKENS.some(t => t.symbol === s)).slice(0, 40);
  if (extra.length) {
    const quotes = await cmc(`quotes/latest?symbol=${encodeURIComponent(extra.join(','))}&convert=USD`);
    for (const symbol of extra) {
      const matches = quotes?.[symbol];
      const coin = Array.isArray(matches) ? matches.find(c => c.symbol === symbol && validQuote(c)) : matches;
      if (coin && validQuote(coin)) coins.push(normalize(coin));
    }
  }
  const usdtUsd = topCache.find(c => c.symbol === 'USDT')?.price;
  let okxQuotes = new Map();
  try {
    okxQuotes = await getOkxQuotes(usdtUsd);
  } catch (error) {
    console.warn('OKX quotes unavailable; using CoinMarketCap quotes:', error.message);
  }
  const prices = {};
  const changes = {};
  for (const coin of coins) {
    const okx = okxQuotes.get(coin.symbol);
    if (okx) {
      coin.price = okx.price;
      coin.change = okx.change ?? coin.change;
      coin.source = 'OKX';
      coin.quotedAt = okx.quotedAt;
    }
    prices[`crypto_${coin.symbol.toLowerCase()}`] = coin.price;
    changes[`crypto_${coin.symbol.toLowerCase()}`] = coin.change;
  }
  const onchain = await Promise.allSettled(ONCHAIN_TOKENS.map(getOnchainQuote));
  for (const result of onchain) {
    if (result.status !== 'fulfilled') {
      console.warn('On-chain quote unavailable:', result.reason?.message);
      continue;
    }
    const coin = result.value;
    coins.push(coin);
    prices[`crypto_${coin.symbol.toLowerCase()}`] = coin.price;
    changes[`crypto_${coin.symbol.toLowerCase()}`] = coin.change;
  }
  return { coins, prices, changes, timestamp: new Date().toISOString() };
}