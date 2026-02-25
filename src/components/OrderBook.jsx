import React, { useState, useEffect, useRef } from "react";
import styles from "./OrderBook.module.css";
import { useOrderBook } from "../hooks/useOrderBook";

import { formatPrice } from "../lib/formatters";

const OrderRow = ({ price, qty, total, type, maxTotal }) => {
  const [flash, setFlash] = useState(false);
  const prevQty = useRef(qty);

  useEffect(() => {
    if (qty !== prevQty.current) {
      setFlash(true);
      prevQty.current = qty;
      const t = setTimeout(() => setFlash(false), 150);
      return () => clearTimeout(t);
    }
  }, [qty]);

  const priceClass = type === "ask" ? styles.priceDown : styles.priceUp;
  const flashClass = flash
    ? type === "ask"
      ? styles.flashRed
      : styles.flashGreen
    : "";

  // Guard against Infinity or NaN width
  const percent = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
  const depthWidth = Math.min(Math.max(percent, 0), 100);

  const depthColor =
    type === "ask" ? "rgba(246, 70, 93, 0.1)" : "rgba(46, 189, 133, 0.1)";

  return (
    <div className={`${styles.row} ${flashClass}`}>
      <span className={priceClass}>{formatPrice(price)}</span>
      <span>{qty.toFixed(4)}</span>
      <span>{total.toFixed(4)}</span>
      <div
        className={styles.depthBar}
        style={{ width: `${depthWidth}%`, backgroundColor: depthColor }}
      />
    </div>
  );
};

export default function OrderBook() {
  const { orderBook } = useOrderBook("ETHUSDT", 20);

  const asks = orderBook.asks.slice(0, 20);
  const bids = orderBook.bids.slice(0, 20);

  // Determine the max total for scaling the depth bars
  const maxAskTotal = asks.length > 0 ? asks[asks.length - 1].total : 0;
  const maxBidTotal = bids.length > 0 ? bids[bids.length - 1].total : 0;
  const maxTotal = Math.max(maxAskTotal, maxBidTotal);

  // Asks are sorted ascending from the hook, so the lowest ask is asks[0].
  // We want the lowest ask at the bottom of the top half, so we reverse it for rendering.
  const displayAsks = [...asks].reverse();
  const displayBids = bids;

  // Not using dirClass/displayPrice for the single middle anymore, displaying explicit Buy/Sell
  // asks[0] is the lowest ask (best sell price)
  // bids[0] is the highest bid (best buy price)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.title}>Order Book</div>
      </div>
      <div className={styles.tableHead}>
        <span>Price(USD)</span>
        <span>Amount(ETH)</span>
        <span>Total</span>
      </div>

      <div className={styles.bookArea}>
        <div className={styles.asks}>
          {displayAsks.map((ask) => (
            <OrderRow
              key={`ask-${ask.price}`}
              price={ask.price}
              qty={ask.qty}
              total={ask.total}
              type="ask"
              maxTotal={maxTotal}
            />
          ))}
        </div>

        <div className={styles.middlePrice}>
          <div className={styles.spreadItem}>
            <span className={styles.spreadLabel}>Buy Price</span>
            <span className={`${styles.spreadVal} ${styles.priceUp}`}>
              {bids[0] ? formatPrice(bids[0].price) : "---"}
            </span>
          </div>
          <div className={`${styles.spreadItem} ${styles.spreadAlignRight}`}>
            <span className={styles.spreadLabel}>Sell Price</span>
            <span className={`${styles.spreadVal} ${styles.priceDown}`}>
              {asks[0] ? formatPrice(asks[0].price) : "---"}
            </span>
          </div>
        </div>

        <div className={styles.bids}>
          {displayBids.map((bid) => (
            <OrderRow
              key={`bid-${bid.price}`}
              price={bid.price}
              qty={bid.qty}
              total={bid.total}
              type="bid"
              maxTotal={maxTotal}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
