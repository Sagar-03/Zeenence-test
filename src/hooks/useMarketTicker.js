import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchTicker } from '../lib/binanceRest';
import { useWebSocket } from './useWebSocket';

export function useMarketTicker(symbol = 'ETHUSDT') {
    const [ticker, setTicker] = useState(null);
    const [lastPrice, setLastPrice] = useState(null);
    const [priceDir, setPriceDir] = useState(null); // 'up' | 'down' | null
    const [error, setError] = useState(null);
    const prevPriceRef = useRef(null);

    const fetchIntervalRef = useRef(null);

    // Fetch from REST
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const data = await fetchTicker(symbol);
                setTicker(data);
                const currentPrice = parseFloat(data.lastPrice);

                if (prevPriceRef.current !== null && currentPrice !== prevPriceRef.current) {
                    setPriceDir(currentPrice > prevPriceRef.current ? 'up' : 'down');
                }

                setLastPrice(currentPrice);
                prevPriceRef.current = currentPrice;
                setError(null);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchInitial();
        fetchIntervalRef.current = setInterval(fetchInitial, 60000);

        return () => {
            clearInterval(fetchIntervalRef.current);
        };
    }, [symbol]);

    // Subscribe to trade WS stream for realtime price updates
    const handleWsMessage = useCallback((data) => {
        if (data && data.p) {
            const currentPrice = parseFloat(data.p);
            if (prevPriceRef.current !== null && currentPrice !== prevPriceRef.current) {
                setPriceDir(currentPrice > prevPriceRef.current ? 'up' : 'down');
            }
            setLastPrice(currentPrice);
            prevPriceRef.current = currentPrice;

            // We don't update the full ticker object on every trade, only the last price.
        }
    }, []);

    useWebSocket(`${symbol.toLowerCase()}@trade`, handleWsMessage);

    return { ticker, lastPrice, priceDir, error };
}
