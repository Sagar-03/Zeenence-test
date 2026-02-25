import styles from "./TopNav.module.css";

export default function TopNav() {
  return (
    <div className={styles.navRow}>
      <div className={styles.navLinks}>
        <button className={`${styles.navItem} ${styles.active}`}>
          Markets
        </button>
        <button className={styles.navItem}>
          AI Analysis <span className={styles.aiBadge}>AI</span>
        </button>
        <button className={styles.navItem}>Info</button>
        <button className={styles.navItem}>Trading Rules</button>
      </div>
    </div>
  );
}
