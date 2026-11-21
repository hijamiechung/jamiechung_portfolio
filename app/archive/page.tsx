import { archive } from "@/lib/archive";
import { ArchiveCard } from "@/components/ArchiveCard";
import styles from "./page.module.css";

export const metadata = { title: "Archive — Jamie Chung" };

export default function ArchiveIndexPage() {
  return <section className={styles.page}><div className={styles.content}>
    <header>
      <h1 className={styles.heading}>Archive</h1>
      <p className={styles.description}>100 days of drawing Pittsburgh, a flower that blooms in the light, a late-night vending machine.</p>
    </header>
    <div className={styles.grid}>{archive.map(entry => <ArchiveCard key={entry.id} entry={entry} />)}</div>
  </div></section>;
}
