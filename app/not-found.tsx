import Link from "next/link";
import { OfflineStatus } from "@/components/OfflineStatus";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <p className={styles.face} role="img" aria-label="surprised face"><span className={styles.eyes}>:</span><span className={styles.mouth}>0</span></p>
        <p className={styles.code}>404</p>
        <p className={styles.copy}>Looks like you found something I haven’t made yet.</p>
        <OfflineStatus />
        <div className={styles.actions}>
          <span className={styles.primary} aria-disabled="true" title="Ask Jamie is being prepared">Ask Jamie</span>
          <Link className={styles.secondary} href="/">Back home</Link>
        </div>
      </div>
    </section>
  );
}
