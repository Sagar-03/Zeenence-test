import React, { useState, useEffect } from "react";

// Desktop Components
import GlobalNav from "./components/GlobalNav";
import StatsBar from "./components/StatsBar";
import ChartToolbar from "./components/ChartToolbar";
import OrderBook from "./components/OrderBook";
import OrderEntry from "./components/OrderEntry";

// Mobile Components
import Header from "./components/Header";
import TopNav from "./components/TopNav";
import MobileStatsBar from "./components/MobileStatsBar";
import InfoRow from "./components/InfoRow";
import TimeframeSelector from "./components/TimeframeSelector";
import ActionBar from "./components/ActionBar";

import Chart from "./components/Chart";
import ChartSidebar from "./components/ChartSidebar";
import { useMarketTicker } from "./hooks/useMarketTicker";
import { useKlines } from "./hooks/useKlines";

const SYMBOL = "ETHUSDT";

function App() {
  const [interval, setInterval] = useState("15m");
  const [retryTick, setRetryTick] = useState(0);
  const [showMobileOB, setShowMobileOB] = useState(false);

  const {
    ticker,
    lastPrice,
    priceDir,
    error: tickerError,
  } = useMarketTicker(SYMBOL);

  // Re-fetch klines if retry is clicked
  useEffect(() => {
    // Just depends on retryTick, useKlines doesn't take a force key
  }, [interval, retryTick]);

  const { candles, loading, error: klinesError } = useKlines(SYMBOL, interval);

  return (
    <div className="app-container">
      {/* --- DESKTOP HEADER ZONE --- */}
      <div className="desktop-only">
        <GlobalNav />
        <StatsBar
          ticker={ticker}
          lastPrice={lastPrice}
          priceDir={priceDir}
          error={tickerError}
        />
      </div>

      {/* --- MOBILE HEADER ZONE --- */}
      <div className="mobile-only">
        <Header connected={!tickerError && !klinesError} />
        <TopNav />
        <MobileStatsBar
          ticker={ticker}
          lastPrice={lastPrice}
          priceDir={priceDir}
          error={tickerError}
        />
        <InfoRow />
      </div>

      {/* --- SHARED MAIN AREA --- */}
      <div className="main-area">
        <div className="main-content">
          <div className="desktop-only">
            <ChartToolbar interval={interval} setInterval={setInterval} />
          </div>
          <div className="mobile-only">
            <TimeframeSelector interval={interval} setInterval={setInterval} />
          </div>

          <div
            className="chart-container-flex"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="desktop-only" style={{ flex: "none" }}>
              <ChartSidebar />
            </div>
            <div
              style={{
                flex: 1,
                minWidth: 0,
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Chart
                candles={candles}
                loading={loading}
                error={klinesError}
                onRetry={() => setRetryTick((prev) => prev + 1)}
              />
            </div>
          </div>

          <div className="mobile-only" style={{ padding: "8px 16px" }}>
            <button
              onClick={() => setShowMobileOB(!showMobileOB)}
              style={{
                width: "100%",
                padding: "8px",
                borderRadius: "4px",
                backgroundColor: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              {showMobileOB ? "Hide Order Book" : "View Order Book"}
            </button>
          </div>
          {showMobileOB && (
            <div
              className="mobile-only"
              style={{
                height: "450px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <OrderBook />
            </div>
          )}
        </div>

        {/* --- DESKTOP RIGHT PANELS --- */}
        <div className="right-panels">
          <OrderBook />
          <OrderEntry />
        </div>
      </div>

      {/* --- MOBILE ACTION BAR --- */}
      <div className="mobile-only">
        <ActionBar />
      </div>
    </div>
  );
}

export default App;
