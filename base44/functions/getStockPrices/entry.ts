// getStockPrices - Fetches tokenized US stock/asset prices from CoinMarketCap
// All IDs are verified Binance/tradfi-assets-derivatives tokens

Deno.serve(async (req) => {
  try {
    // Verified CMC IDs - all confirmed Binance tokenized derivatives
    const STOCKS = [
      { symbol: "AAPL",   id: 39491, name: "Apple" },
      { symbol: "MSFT",   id: 39495, name: "Microsoft" },
      { symbol: "NVDA",   id: 38153, name: "NVIDIA" },
      { symbol: "AMZN",   id: 39471, name: "Amazon" },
      { symbol: "GOOGL",  id: 39470, name: "Alphabet" },
      { symbol: "META",   id: 39513, name: "Meta" },
      { symbol: "TSLA",   id: 38152, name: "Tesla" },
      { symbol: "AMD",    id: 39489, name: "AMD" },
      { symbol: "INTC",   id: 39472, name: "Intel" },
      { symbol: "SNDK",   id: 39507, name: "SanDisk" },
      { symbol: "MU",     id: 39469, name: "Micron" },
      { symbol: "MSTR",   id: 39473, name: "MicroStrategy" },
      { symbol: "PLTR",   id: 39475, name: "Palantir" },
      { symbol: "HOOD",   id: 39478, name: "Robinhood" },
      { symbol: "NFLX",   id: 39479, name: "Netflix" },
      { symbol: "ORCL",   id: 39482, name: "Oracle" },
      { symbol: "COIN",   id: 39483, name: "Coinbase" },
      { symbol: "BABA",   id: 39486, name: "Alibaba" },
      { symbol: "OPENAI", id: 39485, name: "OpenAI" },
      { symbol: "CRWV",   id: 39497, name: "CoreWeave" },
      // Custom stocks not on CMC — fetched from Alpaca as fallback
      { symbol: "SPCX",   id: null,  name: "SPCX", alpaca: true },
    ];

    const cmcStocks = STOCKS.filter(s => !s.alpaca);
    const alpacaStocks = STOCKS.filter(s => s.alpaca);

    const ids = cmcStocks.map(s => s.id).join(",");
    const url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?id=${ids}&convert=USD`;

    const res = await fetch(url, {
      headers: {
        "X-CMC_PRO_API_KEY": Deno.env.get("CMC_API_KEY"),
        "Accept": "application/json",
      }
    });

    const json = await res.json();

    if (!res.ok || json.status?.error_code) {
      return Response.json({ error: json.status?.error_message || "CMC API error" }, { status: 500 });
    }

    const prices = {};
    for (const stock of cmcStocks) {
      const entry = json.data?.[String(stock.id)];
      if (entry?.quote?.USD?.price > 0) {
        prices[stock.symbol] = {
          price: entry.quote.USD.price,
          change: entry.quote.USD.percent_change_24h || 0,
          name: stock.name,
        };
      }
    }

    // Fetch Alpaca prices for custom stocks not on CMC
    if (alpacaStocks.length > 0) {
      const alpacaSymbols = alpacaStocks.map(s => s.symbol).join(",");
      try {
        const alpacaRes = await fetch(
          `https://data.alpaca.markets/v2/stocks/trades/latest?symbols=${encodeURIComponent(alpacaSymbols)}`,
          {
            headers: {
              'APCA-API-KEY-ID': Deno.env.get("ALPACA_API_KEY"),
              'APCA-API-SECRET-KEY': Deno.env.get("ALPACA_SECRET_KEY"),
            }
          }
        );
        if (alpacaRes.ok) {
          const alpacaData = await alpacaRes.json();
          for (const stock of alpacaStocks) {
            const trade = alpacaData.trades?.[stock.symbol];
            if (trade?.p > 0) {
              prices[stock.symbol] = {
                price: trade.p,
                change: 0,
                name: stock.name,
              };
            }
          }
        }
      } catch (e) {
        // Alpaca fetch failed — skip these symbols
      }
    }

    return Response.json({ prices, stocks: STOCKS.map(s => ({ symbol: s.symbol, name: s.name })), timestamp: Date.now() });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});