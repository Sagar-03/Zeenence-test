import { useState, useEffect, useCallback } from 'react';
import { fetchKlines } from '../lib/binanceRest';
import { useWebSocket } from './useWebSocket';

export function useKlines(symbol, interval) {
    const [candles, setCandles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchKlines(symbol, interval, 200, abortController.signal);
                setCandles(data);
                setLoading(false);
            } catch (err) {
                if (err.name === 'AbortError') return;
                setError(err.message);
                setLoading(false);
            }
        };

        loadData();

        return () => {
            abortController.abort();
        };
    }, [symbol, interval]);

    const handleWsMessage = useCallback((data) => {
        if (data && data.k) {
            const { t, o, h, l, c, v } = data.k;
            const tSeconds = t / 1000;

            const newCandle = {
                time: tSeconds,
                open: parseFloat(o),
                high: parseFloat(h),
                low: parseFloat(l),
                close: parseFloat(c),
                volume: parseFloat(v),
            };

            setCandles((prevCandles) => {
                if (prevCandles.length === 0) return [newCandle];

                const lastCandle = prevCandles[prevCandles.length - 1];

                if (lastCandle.time === newCandle.time) {
                    const copy = [...prevCandles];
                    copy[copy.length - 1] = newCandle;
                    return copy;
                }

                if (newCandle.time > lastCandle.time) {
                    return [...prevCandles, newCandle];
                }

                return prevCandles; 
            });
        }
    }, []);

    useWebSocket(`${symbol.toLowerCase()}@kline_${interval}`, handleWsMessage, !loading);

    return { candles, loading, error };
}
