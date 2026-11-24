import { secrets } from 'base44:runtime';
import { fetchAvePrices } from './aveToken.ts';

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

// Built-in on-chain token; others come from admin-approved ListedToken records.
const PIX = { symbol: 'PIX', name: 'PiX (Polygon)', chain: 'polygon', address: '0xab787774bdf01fc22410165ffabf76e0e0ebc94f', logo_url: '' };

// Approved tokens trade; disabled tokens keep a price (wallet valuation) but cannot trade.
export async function loadListedTokens(base44) {
  const res = await base44.asServiceRole.entities.ListedToken.filter({ status: { $in: ['approved', 'disabled'] } }, '-created_date', 500);
  return Array.isArray(res) ? res : (res?.items || []);
}

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
    .filter(p => p.chainId === token.chain && p.baseToken?.address?.toLowerCase() === token.address.toLowerCase() && Number(p.priceUsd) > 0)
    .sort((a, b) => (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0))[0];
  if (!pair) throw new Error('no pair');
  return { price: Number(pair.priceUsd), change: pair.priceChange?.h24 ?? 0, source: 'DexScreener' };
}

async function getFallbackQuote(token) {
  try {
    return await getGeckoTerminalQuote(token);
  } catch {
    return await getDexScreenerQuote(token);
  }
}

// ave.ai batch quote first; tokens it misses fall back to GeckoTerminal / DexScreener.
async function getOnchainCoins(tokens) {
  const now = Date.now();
  const coins = [];
  const stale = [];
  for (const token of tokens) {
    const cached = onchainCache.get(token.token_id);
    if (cached && now - cached.at < 60000) coins.push({ ...cached.coin, tradable: token.tradable });
    else stale.push(token);
  }
  if (!stale.length) return coins;
  let quotes = {};
  try {
    quotes = await fetchAvePrices(stale.map(t => t.token_id));
  } catch (error) {
    console.warn('ave.ai batch quotes unavailable:', error.message);
  }
  const missing = stale.filter(t => !quotes[t.token_id]).slice(0, 6);
  const fallbacks = await Promise.allSettled(missing.map(getFallbackQuote));
  missing.forEach((token, i) => {
    if (fallbacks[i].status === 'fulfilled') quotes[token.token_id] = fallbacks[i].value;
    else console.warn(`On-chain quote unavailable for ${token.symbol}:`, fallbacks[i].reason?.message);
  });
  for (const token of stale) {
    const quote = quotes[token.token_id];
    if (!quote) continue;
    const coin = {
      symbol: token.symbol, name: token.name, chain: token.chain, address: token.address, logo: token.logo_url || '',
      onchain: true, price: quote.price, change: quote.change, source: quote.source, quotedAt: new Date().toISOString(),
    };
    onchainCache.set(token.token_id, { coin, at: now });
    coins.push({ ...coin, tradable: token.tradable });
  }
  return coins;
}

export async function getCryptoMarket(heldSymbols = [], listedTokens = []) {
  if (!topCache || Date.now() - cachedAt > 30000) {
    const listings = await cmc('listings/latest?start=1&limit=20&convert=USD');
    if (!Array.isArray(listings) || !listings.some(c => c.symbol === 'BTC') || !listings.some(c => c.symbol === 'ETH')) throw new Error('Incomplete crypto market quotes');
    topCache = listings.filter(validQuote).map(normalize);
    cachedAt = Date.now();
  }
  const coins = topCache.map(coin => ({ ...coin }));
  const onchainTokens = [
    { ...PIX, tradable: true },
    ...listedTokens
      .filter(t => /^[A-Z0-9]{2,15}$/.test(t.symbol || '') && t.symbol !== 'PIX')
      .map(t => ({ symbol: t.symbol, name: t.name || t.symbol, chain: t.chain, address: t.address, logo_url: t.logo_url, tradable: t.status === 'approved' })),
  ]
    .filter(t => !coins.some(c => c.symbol === t.symbol))
    .map(t => ({ ...t, token_id: `${t.address}-${t.chain}` }));

  const extra = [...new Set(heldSymbols.map(s => String(s).toUpperCase()))]
    .filter(s => /^[A-Z0-9]{2,15}$/.test(s) && !coins.some(c => c.symbol === s) && !onchainTokens.some(t => t.symbol === s)).slice(0, 40);
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
  for (const coin of await getOnchainCoins(onchainTokens)) {
    coins.push(coin);
    prices[`crypto_${coin.symbol.toLowerCase()}`] = coin.price;
    changes[`crypto_${coin.symbol.toLowerCase()}`] = coin.change;
  }
  return { coins, prices, changes, timestamp: new Date().toISOString() };
}