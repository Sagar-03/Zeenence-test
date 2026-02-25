const REST_BASE = import.meta.env.VITE_BINANCE_REST_BASE;

export async function fetchTicker(symbol) {
    const url = `${REST_BASE}/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Failed to fetch ticker for ${symbol}`);
    }
    const data = await response.json();
    return data;
}

export async function fetchKlines(symbol, interval, limit = 200, signal) {
    const url = `${REST_BASE}/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Failed to fetch klines for ${symbol} at ${interval}`);
    }
    const data = await response.json();
    return data.map((d) => ({
        time: d[0] / 1000, 
        open: parseFloat(d[1]),
        high: parseFloat(d[2]),
        low: parseFloat(d[3]),
        close: parseFloat(d[4]),
        volume: parseFloat(d[5]),
    }));
}
