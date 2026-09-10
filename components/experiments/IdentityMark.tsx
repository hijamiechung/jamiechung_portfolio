import styles from "./IdentityMark.module.css";
export const IDENTITY_MARK_ENABLED = true;
export function IdentityMark() {
  return <svg className={styles.mark} aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect className={styles.top} x="4" y="5" width="2.4" height="2.4" rx=".4" fill="currentColor"/>
    <rect className={styles.bottom} x="4" y="10" width="2.4" height="2.4" rx=".4" fill="currentColor"/>
    <path d="M15.6 4.4V12.6C15.6 14.4 14.3 15.7 12.5 15.7C11.2 15.7 10.2 15.1 9.7 14.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"/>
  </svg>;
}
