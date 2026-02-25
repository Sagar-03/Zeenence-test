import styles from "./Header.module.css";
import {
  ChevronDown,
  Bell,
  Star,
  Share,
  RefreshCcw,
  ArrowRight,
} from "lucide-react";

export default function Header() {
  return (
    <header className={styles.header}>
      {/* Icons on the LEFT */}
      <div className={styles.leftIcons}>
        <button className={styles.iconBtn}>
          <Star size={20} />
        </button>
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>
        <button className={styles.iconBtn}>
          <RefreshCcw size={20} />
        </button>
        <button className={styles.iconBtn}>
          <Share size={20} />
        </button>
      </div>

      {/* Symbol on the RIGHT */}
      <div className={styles.rightGroup}>
        <div className={styles.symbolGroup}>
          <span className={styles.badge}>Spot</span>
          <span className={styles.symbol}>ETHUSDT</span>
          <ChevronDown size={16} className={styles.chevron} />
        </div>
        <button className={styles.iconBtn}>
          <ArrowRight size={24} />
        </button>
      </div>
    </header>
  );
}
