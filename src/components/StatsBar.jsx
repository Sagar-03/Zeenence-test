import { useEffect, useState } from "react";
import styles from "./StatsBar.module.css";
import { formatPrice, formatPercent, formatVolume } from "../lib/formatters";

export default function StatsBar({ ticker, lastPrice, priceDir, error }) {
  const [flash, setFlash] = useState(null);

  useEffect(() => {
    if (priceDir) {
      setFlash(priceDir);
      const timer = setTimeout(() => setFlash(null), 500);
      return () => clearTimeout(timer);
    }
  }, [lastPrice, priceDir]);

  const isStale = !!error;

  const displayPrice =
    lastPrice !== null
      ? formatPrice(lastPrice)
      : ticker
        ? formatPrice(ticker.lastPrice)
        : "---";

  const change = ticker ? ticker.priceChange : 0;
  const changePercent = ticker ? ticker.priceChangePercent : 0;
  const changeClass =
    changePercent < 0 ? styles.down : changePercent > 0 ? styles.up : "";

  const dirClass =
    priceDir === "down" ? styles.down : priceDir === "up" ? styles.up : "";
  const flashClass =
    flash === "down" ? styles.flashDown : flash === "up" ? styles.flashUp : "";

  return (
    <div className={`${styles.statsBar} ${isStale ? styles.stale : ""}`}>
      <div className={styles.leftGroup}>
        <div className={styles.pairInfo}>
          <div className={styles.pairIconOuter}>
            <div className={styles.pairIconInner}>
              <span className={styles.ethIcon}>⟠</span>
            </div>
            <div className={styles.pairIconText}>
              <div className={styles.pairLeftBrand}>
                <span className={styles.star}>★</span>
                <span className={styles.pairTitle}>ETHUSDT</span>
              </div>
              <span className={styles.pairSub}>Perpetual 500X</span>
            </div>
          </div>
        </div>

        <div className={styles.mainPriceBlock}>
          <div className={`${styles.lastPrice} ${dirClass} ${flashClass}`}>
            {displayPrice}
          </div>
          <div className={styles.subPrice}>≈ {displayPrice}</div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCol}>
          <span className={styles.label}>Change</span>
          <span className={`${styles.val} ${changeClass}`}>
            {ticker ? formatPrice(change) : "---"} (
            {formatPercent(changePercent)})
          </span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>Index Price</span>
          <span className={styles.val}>{displayPrice}</span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>Fair Price</span>
          <span className={styles.val}>{displayPrice}</span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>Funding Rate / Countdown</span>
          <span className={styles.valAmount}>
            0.0050% / <span className={styles.countdown}>07:29:50</span>
          </span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>24h High</span>
          <span className={styles.val}>
            {ticker ? formatPrice(ticker.highPrice) : "---"}
          </span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>24h Low</span>
          <span className={styles.val}>
            {ticker ? formatPrice(ticker.lowPrice) : "---"}
          </span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>24h Volume(ETH)</span>
          <span className={styles.val}>
            {ticker ? formatVolume(ticker.volume) : "---"}
          </span>
        </div>
        <div className={styles.statCol}>
          <span className={styles.label}>24h Turnover(USDT)</span>
          <span className={styles.val}>
            {ticker ? formatVolume(ticker.quoteVolume) : "---"}
          </span>
        </div>
      </div>
    </div>
  );
}
