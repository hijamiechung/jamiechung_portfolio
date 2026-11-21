import styles from "./LostCharacter.module.css";

export function LostCharacter() {
  return <svg className={styles.character} viewBox="0 0 96 106" role="img" aria-label="A puzzled character looking at 404 with one hand over its mouth">
    <circle className={styles.head} cx="48" cy="42" r="28" />
    <g transform="rotate(-8 48 42)" fill="currentColor">
      <rect x="35" y="28" width="3" height="3" rx=".5" />
      <rect x="47" y="28" width="3" height="3" rx=".5" />
      <path d="M35 41v3q0 4 5 4h5" fill="none" stroke="currentColor" strokeWidth="2" />
    </g>
    <g fill="currentColor">
      <rect x="76" y="43" width="5" height="5" />
      <rect x="76" y="49" width="5" height="5" />
      <rect x="39" y="70" width="5" height="5" />
      <rect x="39" y="76" width="5" height="5" />
      <rect x="39" y="82" width="5" height="5" />
      <rect x="54" y="70" width="5" height="5" />
      <rect x="54" y="76" width="5" height="5" />
      <rect x="54" y="82" width="5" height="5" />
      <rect x="15" y="43" width="5" height="5" />
      <rect x="15" y="49" width="5" height="5" />
      <rect x="21" y="55" width="5" height="5" />
      <rect x="27" y="49" width="5" height="5" />
      <rect x="33" y="43" width="5" height="5" />
    </g>
  </svg>;
}
