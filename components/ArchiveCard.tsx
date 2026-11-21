import Link from "next/link";
import Image from "next/image";
import type { ArchiveEntry } from "@/lib/archive";
import { ProjectTransition } from "./ProjectTransition";
import styles from "./ProjectCard.module.css";
import local from "./ArchiveCard.module.css";

export function ArchiveCard({ entry }: { entry: ArchiveEntry }) {
  return (
    <Link className={`${styles.card} ${local.card}`} href={`/archive/${entry.id}`} aria-label={`View ${entry.title}`}>
      <ProjectTransition id={`archive-${entry.id}`}><div className={`${styles.thumbnail} ${local.thumbnail}`}>
        <Image className={local.image} src={entry.hero.src} alt="" fill sizes="(max-width: 1024px) 50vw, 320px" />
      </div></ProjectTransition>
      <div className={styles.meta}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>{entry.title}</h2>
          <span className={styles.year}>{entry.year}</span>
        </div>
      </div>
      <ul className={local.kinds} aria-label="Type">{entry.kinds.map(kind => <li key={kind}>{kind}</li>)}</ul>
    </Link>
  );
}
