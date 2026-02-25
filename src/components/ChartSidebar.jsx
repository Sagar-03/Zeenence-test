import React from "react";
import styles from "./ChartSidebar.module.css";
import {
  MousePointer2,
  Minus,
  PenLine,
  Type,
  Magnet,
  Lock,
  Eye,
  Trash2,
} from "lucide-react";

export default function ChartSidebar() {
  return (
    <div className={styles.sidebar}>
      <button className={styles.toolBtn}>
        <MousePointer2 size={16} />
      </button>
      <button className={styles.toolBtn}>
        <Minus size={16} style={{ transform: "rotate(-45deg)" }} />
      </button>
      <button className={styles.toolBtn}>
        <PenLine size={16} />
      </button>
      <button className={styles.toolBtn}>
        <Type size={16} />
      </button>

      <div className={styles.divider} />

      <button className={styles.toolBtn}>
        <Magnet size={16} />
      </button>
      <button className={styles.toolBtn}>
        <Lock size={16} />
      </button>
      <button className={styles.toolBtn}>
        <Eye size={16} />
      </button>
      <button className={styles.toolBtn}>
        <Trash2 size={16} />
      </button>
    </div>
  );
}
