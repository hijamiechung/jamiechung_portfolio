import Link from "next/link";
import { OfflineStatus } from "@/components/OfflineStatus";
import { LostCharacter } from "@/components/LostCharacter";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <section className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <p className={styles.copy}>Looks like you found something I haven’t made yet.</p>
        <OfflineStatus />
        <div className={styles.actions}>
          <Link className={styles.secondary} href="/">Back home</Link>
        </div>
      </div>
      <div className={styles.footer}>
        <LostCharacter />
      </div>
    </section>
  );
}
