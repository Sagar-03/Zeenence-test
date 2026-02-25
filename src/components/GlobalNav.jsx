import styles from "./GlobalNav.module.css";
import { Search, Settings, Download, Globe } from "lucide-react";

export default function GlobalNav() {
  return (
    <div className={styles.globalNav}>
      <div className={styles.left}>
        <div className={styles.logo}>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M12 2L2 22H22L12 2Z" fill="var(--text-primary)" />
            <path d="M12 8L6 18H18L12 8Z" fill="var(--bg-primary)" />
          </svg>
          <span className={styles.brand}>ZENENCE</span>
        </div>
        <div className={styles.navLinks}>
          <a href="#" className={styles.link}>
            Exchange
          </a>
          <a href="#" className={styles.link}>
            DEX+
          </a>
          <a href="#" className={styles.link}>
            Futures
          </a>
          <a href="#" className={styles.link}>
            Information
          </a>
          <a href="#" className={styles.link}>
            Events
          </a>
          <a href="#" className={styles.link}>
            Futures M-Day
          </a>
          <a href="#" className={styles.link}>
            More
          </a>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.searchBar}>
          <Search size={14} className={styles.searchIcon} />
          <input type="text" placeholder="BTC" className={styles.searchInput} />
        </div>
        <a href="#" className={styles.link}>
          Log In
        </a>
        <button className={styles.signUpBtn}>Sign Up</button>
        <div className={styles.icons}>
          <Download size={16} />
          <Settings size={16} />
          <Globe size={16} />
        </div>
      </div>
    </div>
  );
}
