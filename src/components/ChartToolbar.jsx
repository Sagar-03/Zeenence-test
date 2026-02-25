import styles from "./ChartToolbar.module.css";
import { Settings2, MoveDiagonal } from "lucide-react";

const TIMEFRAMES = [
  { label: "Time", value: "line" },
  { label: "1s", value: "1s" },
  { label: "15m", value: "15m" },
  { label: "1H", value: "1h" },
  { label: "4H", value: "4h" },
  { label: "1D", value: "1d" },
];

export default function ChartToolbar({ interval, setInterval }) {
  return (
    <div className={styles.container}>
      {/* Top Chart Navigation row */}
      <div className={styles.chartNavRow}>
        <div className={styles.navLinks}>
          <button className={`${styles.navBtn} ${styles.activeNavBtn}`}>
            Chart
          </button>
          <button className={styles.navBtn}>Analysis</button>
          <button className={styles.navBtn}>
            AI <span className={styles.aiBadge}>AI</span>
          </button>
          <button className={styles.navBtn}>Info</button>
          <button className={styles.navBtn}>Trading Rules</button>
          <button className={styles.navBtn}>Risk Limit</button>
        </div>
      </div>

      {/* Timeframes and Modes row */}
      <div className={styles.toolsRow}>
        <div className={styles.timeframes}>
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.label}
              className={`${styles.tfBtn} ${interval === tf.value ? styles.activeTf : ""}`}
              onClick={() => {
                if (tf.value !== "line" && tf.value !== "1s")
                  setInterval(tf.value);
              }}
            >
              {tf.label}
            </button>
          ))}
          <button className={styles.tfBtn}>...</button>
        </div>

        <div className={styles.modes}>
          <button className={`${styles.modeBtn} ${styles.activeModeBtn}`}>
            Original
          </button>
          {/* User specifically asked to remove TradingView button */}
          <button className={styles.modeBtn}>Depth</button>

          <div className={styles.divider}></div>
          <button className={styles.iconBtn}>
            <Settings2 size={14} />
          </button>
          <button className={styles.iconBtn}>
            <MoveDiagonal size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
