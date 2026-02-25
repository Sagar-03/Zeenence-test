import { useEffect, useState } from "react";
import styles from "./MobileStatsBar.module.css";
import { formatPrice, formatPercent, formatVolume } from "../lib/formatters";
import { ChevronDown } from "lucide-react";

export default function MobileStatsBar({ ticker, lastPrice, priceDir, error }) {
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

  const changePercent = ticker ? ticker.priceChangePercent : 0;
  const changeClass =
    changePercent < 0 ? styles.down : changePercent > 0 ? styles.up : "";

  const dirClass =
    priceDir === "down" ? styles.down : priceDir === "up" ? styles.up : "";
  const flashClass =
    flash === "down" ? styles.flashDown : flash === "up" ? styles.flashUp : "";

  return (
    <div className={`${styles.statsBar} ${isStale ? styles.stale : ""}`}>
      <div className={styles.mainPriceContainer}>
        <div className={styles.lastPriceHeader}>
          <span>Last Price</span>
          <ChevronDown size={14} />
        </div>
        <div className={`${styles.lastPrice} ${dirClass} ${flashClass}`}>
          {displayPrice}
        </div>
        <div className={styles.subPrice}>
          <span>≈ {displayPrice} USD</span>
          {ticker && (
            <span className={`${styles.change} ${changeClass}`}>
              {formatPercent(changePercent)}
            </span>
          )}
        </div>
        <div className={styles.fairPriceRow}>
          <span className={styles.fairPriceLabel}>Fair Price</span>
          <span className={styles.fairPriceVal}>{displayPrice}</span>
        </div>
      </div>

      <div className={styles.gridContainer}>
        <div className={styles.gridScroll}>
          <div className={styles.statCol}>
            <div className={styles.statItem}>
              <span className={styles.label}>24h High</span>
              <span className={styles.val}>
                {ticker ? formatPrice(ticker.highPrice) : "---"}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>24h Low</span>
              <span className={styles.val}>
                {ticker ? formatPrice(ticker.lowPrice) : "---"}
              </span>
            </div>
          </div>
          <div className={styles.statCol}>
            <div className={styles.statItem}>
              <span className={styles.label}>24h Vol(ETH)</span>
              <span className={styles.val}>
                {ticker ? formatVolume(ticker.volume) : "---"}
              </span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.label}>24h Vol(USDT)</span>
              <span className={styles.val}>
                {ticker ? formatVolume(ticker.quoteVolume) : "---"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
