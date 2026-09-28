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
});

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

export async function getCryptoMarket(heldSymbols = []) {
  if (!topCache || Date.now() - cachedAt > 30000) {
    const listings = await cmc('listings/latest?start=1&limit=20&convert=USD');
    if (!Array.isArray(listings) || !listings.some(c => c.symbol === 'BTC') || !listings.some(c => c.symbol === 'ETH')) throw new Error('Incomplete crypto market quotes');
    topCache = listings.filter(validQuote).map(normalize);
    cachedAt = Date.now();
  }
  const coins = [...topCache];
  const extra = [...new Set(heldSymbols.map(s => String(s).toUpperCase()))]
    .filter(s => /^[A-Z0-9]{2,15}$/.test(s) && !coins.some(c => c.symbol === s)).slice(0, 40);
  if (extra.length) {
    const quotes = await cmc(`quotes/latest?symbol=${encodeURIComponent(extra.join(','))}&convert=USD`);
    for (const symbol of extra) {
      const matches = quotes?.[symbol];
      const coin = Array.isArray(matches) ? matches.find(c => c.symbol === symbol && validQuote(c)) : matches;
      if (coin && validQuote(coin)) coins.push(normalize(coin));
    }
  }
  const prices = {};
  const changes = {};
  for (const coin of coins) {
    prices[`crypto_${coin.symbol.toLowerCase()}`] = coin.price;
    changes[`crypto_${coin.symbol.toLowerCase()}`] = coin.change;
  }
  return { coins, prices, changes, timestamp: new Date().toISOString() };
}