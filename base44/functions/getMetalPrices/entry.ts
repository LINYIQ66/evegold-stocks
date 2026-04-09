
import { createClient } from 'npm:@base44/sdk@0.1.0';

const base44 = createClient({
    appId: Deno.env.get('BASE44_APP_ID'),
});

const getMetalPricesFromAPI = async (apiKey) => {
    const symbols = 'XAU,XAG,XPT,XPD';
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=${symbols}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
        throw new Error('Failed to fetch metal prices');
    }
    
    return {
        gold: 1 / data.rates.XAU,
        silver: 1 / data.rates.XAG,
        platinum: 1 / data.rates.XPT,
        palladium: 1 / data.rates.XPD,
    };
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
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        base44.auth.setToken(token);
        
        const user = await base44.auth.me();
        if (!user) {
            return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), { status: 401 });
        }

        const metalApiKey = Deno.env.get('METALPRICEAPI_KEY');
        const exchangeRateApiKey = Deno.env.get('EXCHANGERATE_API_KEY');

        if (!metalApiKey || !exchangeRateApiKey) {
            return new Response(JSON.stringify({ success: false, error: 'API keys not configured' }), { status: 500 });
        }

        const [metalPrices, forexRates] = await Promise.all([
            getMetalPricesFromAPI(metalApiKey),
            getForexRatesFromExchangeRateAPI(exchangeRateApiKey)
        ]);

        // Combine all prices, ensuring they are all valued in USD
        const currentPrices = {
            usd: 1.00,
            usdt: 1.00,
            ...forexRates,
            ...metalPrices
        };

        // Mock 24h changes (in production, calculate from historical data)
        const priceChanges = {
            gold: (Math.random() - 0.5) * 2,
            silver: (Math.random() - 0.5) * 4,
            platinum: (Math.random() - 0.5) * 3,
            palladium: (Math.random() - 0.5) * 5,
            sgd: (Math.random() - 0.5) * 0.5,
            cnh: (Math.random() - 0.5) * 0.8,
            inr: (Math.random() - 0.5) * 1.0,
            myr: (Math.random() - 0.5) * 0.6,
            thb: (Math.random() - 0.5) * 0.7,
            vnd: (Math.random() - 0.5) * 0.3,
            idr: (Math.random() - 0.5) * 1.2,
            lak: (Math.random() - 0.5) * 1.5,
            eur: (Math.random() - 0.5) * 0.5,
            gbp: (Math.random() - 0.5) * 0.6,
            aud: (Math.random() - 0.5) * 0.8,
            nzd: (Math.random() - 0.5) * 0.9,
            jpy: (Math.random() - 0.5) * 0.4,
            hkd: (Math.random() - 0.5) * 0.2,
            twd: (Math.random() - 0.5) * 0.3,
            cad: (Math.random() - 0.5) * 0.5,
            aed: (Math.random() - 0.5) * 0.1,
        };

        return new Response(JSON.stringify({
            success: true,
            prices: currentPrices,
            changes: priceChanges,
            timestamp: new Date().toISOString()
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error('Error fetching prices:', error);
        
        // Return fallback prices with the correct logic in case of API failure
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

        return new Response(JSON.stringify({
            success: true,
            prices: fallbackPrices,
            changes: zeroChanges,
            timestamp: new Date().toISOString(),
            fallback: true
        }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
});
