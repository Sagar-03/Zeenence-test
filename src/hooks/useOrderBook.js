import { useState, useEffect } from "react";

export function useOrderBook(symbol = "ETHUSDT", limit = 10) {
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [spread, setSpread] = useState(0);
    const [lastUpdateId, setLastUpdateId] = useState(0);

    useEffect(() => {
        const wsUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`;
        const ws = new WebSocket(wsUrl);

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.bids && data.asks) {
                // Partial book depth returns asks ascending (lowest first) and bids descending (highest first).
                const asks = data.asks.slice(0, limit);
                const bids = data.bids.slice(0, limit);

                // Calculate cumulative total starting from the best (lowest) ask
                let currentAskTotal = 0;
                const asksWithTotals = asks.map(([price, qty]) => {
                    currentAskTotal += parseFloat(qty);
                    return { price: parseFloat(price), qty: parseFloat(qty), total: currentAskTotal };
                });

                // Calculate cumulative total starting from the best (highest) bid
                let currentBidTotal = 0;
                const bidsWithTotals = bids.map(([price, qty]) => {
                    currentBidTotal += parseFloat(qty);
                    return { price: parseFloat(price), qty: parseFloat(qty), total: currentBidTotal };
                });

                const currentSpread =
                    asksWithTotals.length && bidsWithTotals.length
                        ? asksWithTotals[0].price - bidsWithTotals[0].price
                        : 0;

                setOrderBook({ bids: bidsWithTotals, asks: asksWithTotals });
                setSpread(currentSpread);
                setLastUpdateId(data.lastUpdateId);
            }
        };

        return () => {
            ws.close();
        };
    }, [symbol, limit]);

    return { orderBook, spread, lastUpdateId };
}
