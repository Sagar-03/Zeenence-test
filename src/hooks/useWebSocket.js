import { useState, useEffect, useRef } from "react";

const WS_BASE = import.meta.env.VITE_BINANCE_WS_BASE;

export function useWebSocket(streamPath, onMessage, enabled = true) {
    const [status, setStatus] = useState("closed"); // 'connecting' | 'open' | 'closed' | 'error'

    const wsRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const manualCloseRef = useRef(false);
    const onMessageRef = useRef(onMessage);

    // Keep latest callback without forcing reconnect
    onMessageRef.current = onMessage;

    useEffect(() => {
        if (!enabled) return;

        manualCloseRef.current = false;

        const connect = () => {
            setStatus("connecting");

            const ws = new WebSocket(`${WS_BASE}/${streamPath}`);
            wsRef.current = ws;

            ws.onopen = () => setStatus("open");

            ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    onMessageRef.current?.(data);
                } catch {
                    // ignore
                }
            };

            ws.onerror = () => setStatus("error");

            ws.onclose = () => {
                setStatus("closed");

                // Only reconnect if it wasn't an intentional close
                if (!manualCloseRef.current) {
                    reconnectTimeoutRef.current = setTimeout(connect, 3000);
                }
            };
        };

        connect();

        return () => {
            manualCloseRef.current = true;
            clearTimeout(reconnectTimeoutRef.current);

            const ws = wsRef.current;
            wsRef.current = null;

            if (
                ws &&
                (ws.readyState === WebSocket.CONNECTING ||
                    ws.readyState === WebSocket.OPEN)
            ) {
                ws.close();
            }
        };
    }, [streamPath, enabled]);

    return { status };
}