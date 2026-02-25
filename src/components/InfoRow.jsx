import styles from "./InfoRow.module.css";
import { ChevronRight } from "lucide-react";

export default function InfoRow() {
  return (
    <div className={styles.infoRow}>
      <button className={styles.iconBtn}>
        <ChevronRight size={16} />
      </button>
      <div className={styles.textGroup}>
        <span className={styles.text}>Why ETH price increased ETH</span>
        <div className={styles.aiBadgeContainer}>
          <span className={styles.aiBadge}>Why ETH price increased?</span>
          <span className={styles.aiLogo}>AI</span>
        </div>
      </div>
    </div>
  );
}
