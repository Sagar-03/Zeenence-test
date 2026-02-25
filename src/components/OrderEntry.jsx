import styles from "./OrderEntry.module.css";

export default function OrderEntry() {
  return (
    <div className={styles.container}>
      <div className={styles.headerTabs}>
        <button className={`${styles.tab} ${styles.activeTab}`}>Buy</button>
        <button className={styles.tab}>Sell</button>
      </div>

      <div className={styles.marginInfo}>
        <span className={styles.marginType}>Isolated</span>
        <span className={styles.leverage}>20X</span>
      </div>

      <div className={styles.orderTypes}>
        <span className={styles.type}>Limit</span>
        <span className={`${styles.type} ${styles.typeActive}`}>Market</span>
        <span className={styles.type}>Chase Limit Order</span>
      </div>

      <div className={styles.balanceRow}>
        <span className={styles.label}>Available</span>
        <div style={{ display: "flex", gap: "12px" }}>
          <span className={styles.balance}>0.00 USDT</span>
          <span className={styles.balance}>0.00 ETH</span>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.prefix}>Price (USDT)</span>
        <input
          type="text"
          placeholder="Market"
          className={styles.input}
          disabled
        />
      </div>

      <div className={styles.inputGroup}>
        <span className={styles.prefix}>Amount (ETH)</span>
        <input type="text" placeholder="Quantity" className={styles.input} />
      </div>

      <div className={styles.slider}>
        <div className={styles.track}></div>
        <div className={styles.thumb}></div>
        <div className={styles.marks}>
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      <div className={styles.actionBtns}>
        <button className={`${styles.actionBtn} ${styles.buyBtn}`}>Buy</button>
        <button className={`${styles.actionBtn} ${styles.sellBtn}`}>
          Sell
        </button>
      </div>

      <div className={styles.feeInfo}>
        <span>Fee rate</span>
        <span className={styles.feeVal}>Maker 0% / Taker 0.01%</span>
      </div>

      <div className={styles.walletBtn}>Wallet</div>
    </div>
  );
}
