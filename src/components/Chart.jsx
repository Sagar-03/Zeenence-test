import { useEffect, useRef, useState } from "react";
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from "lightweight-charts";
import styles from "./Chart.module.css";
import { calcMA, calcRSI } from "../lib/indicators";
import { MoveDiagonal } from "lucide-react";

export default function Chart({ candles, loading, error, onRetry }) {
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const resizeObserverRef = useRef(null);

  const seriesRef = useRef({
    candle: null,
    volume: null,
    ma5: null,
    ma10: null,
    ma30: null,
    ma60: null,
    rsi: null,
  });

  const [activeIndicators, setActiveIndicators] = useState({
    MA: true,
    VOL: true,
    RSI: true,
    // OBV: true,
  });

  const [legendData, setLegendData] = useState(null);
  const isHoveringRef = useRef(false);
  const latestDataRef = useRef(null);

  const toggleIndicator = (name) => {
    setActiveIndicators((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: "solid", color: "#ffffff" },
        textColor: "#707a8a",
        fontSize: 12,
        fontFamily: "'JetBrains Mono', monospace",
        attributionLogo: false,
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      crosshair: {
        mode: 1,
        vertLine: { width: 1, color: "#707a8a", style: 0 },
        horzLine: { width: 1, color: "#707a8a", style: 0 },
      },
      timeScale: {
        borderColor: "#f0f0f0",
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: "#f0f0f0",
        autoScale: true,
      },
    });

    chartRef.current = chart;

    // Series (v5 API)
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#2ebd85",
      downColor: "#f6465d",
      borderVisible: false,
      wickUpColor: "#2ebd85",
      wickDownColor: "#f6465d",
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "volume",
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.85, // Highest point of the volume series will be at 85% of chart height
        bottom: 0,
      },
      visible: false,
    });

    const ma5Series = chart.addSeries(LineSeries, {
      color: "#2196f3",
      lineWidth: 1,
      crosshairMarkerVisible: false,
    });
    const ma10Series = chart.addSeries(LineSeries, {
      color: "#ff9800",
      lineWidth: 1,
      crosshairMarkerVisible: false,
    });
    const ma30Series = chart.addSeries(LineSeries, {
      color: "#9c27b0",
      lineWidth: 1,
      crosshairMarkerVisible: false,
    });
    const ma60Series = chart.addSeries(LineSeries, {
      color: "#f44336",
      lineWidth: 1,
      crosshairMarkerVisible: false,
    });

    const rsiSeries = chart.addSeries(LineSeries, {
      color: "#9c27b0",
      lineWidth: 1.5,
      priceScaleId: "rsi",
    });

    chart.priceScale("rsi").applyOptions({
      visible: false,
    });

    seriesRef.current = {
      candle: candleSeries,
      volume: volumeSeries,
      ma5: ma5Series,
      ma10: ma10Series,
      ma30: ma30Series,
      ma60: ma60Series,
      rsi: rsiSeries,
    };

    // Resize
    const handleResize = () => {
      if (!chartContainerRef.current) return;
      chart.applyOptions({
        width: chartContainerRef.current.clientWidth,
        height: chartContainerRef.current.clientHeight,
      });
    };

    const ro = new ResizeObserver(handleResize);
    resizeObserverRef.current = ro;
    ro.observe(chartContainerRef.current);

    // Initial size
    handleResize();

    // Crosshair legend update
    chart.subscribeCrosshairMove((param) => {
      const { candle, volume, ma5, ma10, ma30, ma60, rsi } = seriesRef.current;
      if (!param.time || param.point.x < 0 || param.point.y < 0) {
        isHoveringRef.current = false;
        setLegendData(latestDataRef.current);
        return;
      }
      isHoveringRef.current = true;
      const pData = param.seriesData.get(candle);
      if (pData) {
        setLegendData({
          price: pData,
          vol: param.seriesData.get(volume)?.value,
          ma5: param.seriesData.get(ma5)?.value,
          ma10: param.seriesData.get(ma10)?.value,
          ma30: param.seriesData.get(ma30)?.value,
          ma60: param.seriesData.get(ma60)?.value,
          rsi: param.seriesData.get(rsi)?.value,
        });
      }
    });

    return () => {
      try {
        ro.disconnect();
      } catch {
        error;
      }
      try {
        chart.remove();
      } catch {
        error;
      }
      chartRef.current = null;
      seriesRef.current = {};
    };
  }, []);

  // Update scale margins depending on active indicators
  useEffect(() => {
    if (!chartRef.current) return;
    const chart = chartRef.current;

    // Default main margins (0 to 80%) if no RSI
    // If RSI is active, Main takes 0 to 55%, RSI takes 60% to 75%
    const mainBottom = activeIndicators.RSI ? 0.45 : 0.2;

    chart.priceScale("right").applyOptions({
      scaleMargins: { top: 0.1, bottom: mainBottom },
    });

    chart.priceScale("volume").applyOptions({
      scaleMargins: { top: 0.85, bottom: 0 },
      visible: false,
    });

    if (activeIndicators.RSI) {
      chart.priceScale("rsi").applyOptions({
        scaleMargins: { top: 0.6, bottom: 0.25 },
        visible: false,
      });
    }
  }, [activeIndicators.RSI]);

  // Update data
  useEffect(() => {
    if (!chartRef.current || !candles || candles.length === 0) return;

    const { candle, volume, ma5, ma10, ma30, ma60, rsi } = seriesRef.current;
    if (!candle || !volume || !ma5 || !ma10 || !ma30 || !ma60 || !rsi) return;

    const validCandles = candles.filter((c) => !isNaN(c.time));

    candle.setData(validCandles);

    const volumeData = validCandles.map((c) => ({
      time: c.time,
      value: c.volume,
      color:
        c.close >= c.open
          ? "rgba(46, 189, 133, 0.5)"
          : "rgba(246, 70, 93, 0.5)",
    }));

    if (activeIndicators.VOL) volume.setData(volumeData);
    else volume.setData([]);

    if (activeIndicators.MA) {
      ma5.setData(calcMA(validCandles, 5));
      ma10.setData(calcMA(validCandles, 10));
      ma30.setData(calcMA(validCandles, 30));
      ma60.setData(calcMA(validCandles, 60));
    } else {
      ma5.setData([]);
      ma10.setData([]);
      ma30.setData([]);
      ma60.setData([]);
    }

    if (activeIndicators.RSI) {
      rsi.setData(calcRSI(validCandles, 14));
    } else {
      rsi.setData([]);
    }

    // Update latest legend
    if (validCandles.length > 0) {
      const last = validCandles[validCandles.length - 1];
      const m5Data = calcMA(validCandles, 5);
      const m10Data = calcMA(validCandles, 10);
      const m30Data = calcMA(validCandles, 30);
      const m60Data = calcMA(validCandles, 60);
      const rsiData = calcRSI(validCandles, 14);

      const latest = {
        price: last,
        vol: last.volume,
        ma5: m5Data[m5Data.length - 1]?.value,
        ma10: m10Data[m10Data.length - 1]?.value,
        ma30: m30Data[m30Data.length - 1]?.value,
        ma60: m60Data[m60Data.length - 1]?.value,
        rsi: rsiData[rsiData.length - 1]?.value,
      };
      latestDataRef.current = latest;
      if (!isHoveringRef.current) {
        requestAnimationFrame(() => {
          setLegendData(latest);
        });
      }
    }
  }, [
    candles,
    activeIndicators.VOL,
    activeIndicators.RSI,
    activeIndicators.MA,
  ]);

  const fmt = (v) => (typeof v === "number" ? v.toFixed(2) : "---");

  return (
    <div className={styles.chartWrapper}>
      <div className={styles.chartContainer} ref={chartContainerRef} />

      {/* Main Pane Legend */}
      {legendData && legendData.price && (
        <div
          className={styles.legendContainer}
          style={{ top: "12px", zIndex: 6 }}
        >
          <div className={styles.legendRow}>
            <span>
              O{" "}
              <span className={styles.legendVal}>
                {fmt(legendData.price.open)}
              </span>
            </span>
            <span>
              H{" "}
              <span className={styles.legendVal}>
                {fmt(legendData.price.high)}
              </span>
            </span>
            <span>
              L{" "}
              <span className={styles.legendVal}>
                {fmt(legendData.price.low)}
              </span>
            </span>
            <span>
              C{" "}
              <span className={styles.legendVal}>
                {fmt(legendData.price.close)}
              </span>
            </span>
          </div>
          {activeIndicators.MA && (
            <div className={styles.legendRow}>
              {legendData.ma5 !== undefined && (
                <span className={styles.ma5}>MA(5) {fmt(legendData.ma5)}</span>
              )}
              {legendData.ma10 !== undefined && (
                <span className={styles.ma10}>
                  MA(10) {fmt(legendData.ma10)}
                </span>
              )}
              {legendData.ma30 !== undefined && (
                <span className={styles.ma30}>
                  MA(30) {fmt(legendData.ma30)}
                </span>
              )}
              {legendData.ma60 !== undefined && (
                <span className={styles.ma60}>
                  MA(60) {fmt(legendData.ma60)}
                </span>
              )}
            </div>
          )}
        </div>
      )}

      {/* RSI Pane Legend */}
      {activeIndicators.RSI && legendData && (
        <div
          className={styles.legendContainer}
          style={{ top: "60%", zIndex: 6 }}
        >
          <div className={styles.legendRow}>
            <span>
              RSI(14) <span className={styles.ma30}>{fmt(legendData.rsi)}</span>
            </span>
          </div>
        </div>
      )}

      {/* Volume Pane Legend */}
      {activeIndicators.VOL && legendData && (
        <div
          className={styles.legendContainer}
          style={{ top: "85%", zIndex: 6 }}
        >
          <div className={styles.legendRow}>
            <span>
              VOL{" "}
              <span className={styles.legendVal}>{fmt(legendData.vol)}</span>
            </span>
          </div>
        </div>
      )}

      <div className={styles.indicatorsRow}>
        <div className={styles.indicatorLeft}>
          <button
            className={`${styles.indicatorPill} ${
              activeIndicators.MA ? styles.active : ""
            }`}
            onClick={() => toggleIndicator("MA")}
          >
            MA
          </button>
          <button
            className={`${styles.indicatorPill} ${
              activeIndicators.VOL ? styles.active : ""
            }`}
            onClick={() => toggleIndicator("VOL")}
          >
            VOL
          </button>
          <button
            className={`${styles.indicatorPill} ${
              activeIndicators.RSI ? styles.active : ""
            }`}
            onClick={() => toggleIndicator("RSI")}
          >
            RSI(14)
          </button>
          {/* <button
            className={`${styles.indicatorPill} ${
              activeIndicators.OBV ? styles.active : ""
            }`}
            onClick={() => toggleIndicator("OBV")}
          >
            OBV
          </button> */}
        </div>
        <button className={styles.expandBtn}>
          <MoveDiagonal size={14} />
        </button>
      </div>

      {loading && (
        <div className={styles.overlay}>
          <div className={styles.spinner} />
          <span>Loading candles…</span>
        </div>
      )}

      {error && !loading && (
        <div className={styles.overlay}>
          <span className={styles.errorText}>{error}</span>
          <button className={styles.retryBtn} onClick={onRetry}>
            Retry
          </button>
        </div>
      )}
    </div>
  );
}
