import styles from "./PixelExclaim.module.css";

// Three pixel-square "!" marks that build up one at a time (1 -> 2 -> 3, then reset)
// with a blocky, snap-in reveal, each trembling on its own out-of-phase timing —
// reused wherever the site needs a startled/alarmed reaction (404 face, offline scene).
export function PixelExclaim() {
  return (
    <span className={styles.row} aria-hidden="true">
      <span className={styles.mark}>
        <span className={styles.bar}><span/><span/><span/></span>
        <span className={styles.dot}/>
      </span>
      <span className={`${styles.mark} ${styles.mark2}`}>
        <span className={styles.bar}><span/><span/><span/></span>
        <span className={styles.dot}/>
      </span>
      <span className={`${styles.mark} ${styles.mark3}`}>
        <span className={styles.bar}><span/><span/><span/></span>
        <span className={styles.dot}/>
      </span>
    </span>
  );
}
