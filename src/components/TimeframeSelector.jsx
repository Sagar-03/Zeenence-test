import styles from "./TimeframeSelector.module.css";
import { Settings2, Copy } from "lucide-react";

const TIMEFRAMES = [
  { label: "Line", value: "line" },
  { label: "15m", value: "15m" },
  { label: "1h", value: "1h" },
  { label: "4h", value: "4h" },
  { label: "1D", value: "1d" },
  { label: "1W", value: "1w" },
  { label: "5m", value: "5m" },
];

export default function TimeframeSelector({ interval, setInterval }) {
  return (
    <div className={styles.container}>
      <div className={styles.tabsArea}>
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.label}
            className={`${styles.tab} ${interval === tf.value ? styles.active : ""}`}
            onClick={() => {
              if (tf.value !== "line") setInterval(tf.value);
            }}
          >
            {tf.label}
          </button>
        ))}
        <button className={styles.iconBtn}>
          <Settings2 size={16} />
        </button>
        <button className={styles.iconBtn}>
          <Copy size={16} />
        </button>
      </div>
      <div className={styles.maArea}>
        {/* MA labels are drawn on the chart in lightweight-charts natively in some setups, but here we keep them if needed, or hide them. The screenshot shows MAs overlaid on the chart top left. Let's hide this maArea because the screenshot shows MA labels INSIDE the chart, not on the right of the timeframe selector. Actually, the prompt says "Timeframe selector row (5m, 1D...)" */}
      </div>
    </div>
  );
}
