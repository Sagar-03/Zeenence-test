import { Plus } from "lucide-react";
import styles from "./ActionBar.module.css";

export default function ActionBar() {
  return (
    <div className={styles.actionBar}>
      <button className={`${styles.btn} ${styles.closeBtn}`}>Buy</button>
      <button className={`${styles.btn} ${styles.openBtn}`}>Sell</button>
      <div className={styles.plusContainer}>
        <button className={styles.plusBtn}>
          <Plus size={18} />
        </button>
        <span className={styles.plusLabel}>Quick</span>
      </div>
    </div>
  );
}
