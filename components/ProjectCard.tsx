import Link from "next/link";
import type { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";
import artwork from "./ProjectArtwork.module.css";
import { GuidelightThumbnail } from "./GuidelightThumbnail";
import { MemorythreadThumbnail } from "./MemorythreadThumbnail";

const GUIDELIGHT_THUMBNAIL_PREVIEW = true;
const MEMORYTHREAD_THUMBNAIL_PREVIEW = true;

export function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link className={styles.card} href={`/projects/${project.id}`} aria-label={`View ${project.title}`}>
      <div className={`${styles.thumbnail} ${project.id === 'guidelight' ? artwork.guidelight : project.id === 'memorythread' ? artwork.memorythread : ''}`}>
        {GUIDELIGHT_THUMBNAIL_PREVIEW && project.id === 'guidelight' && <GuidelightThumbnail/>}
        {MEMORYTHREAD_THUMBNAIL_PREVIEW && project.id === 'memorythread' && <MemorythreadThumbnail/>}
        <span className={styles.badge}>{project.tag}</span>
      </div>
      <div className={styles.meta}>
        {featured && <span className={styles.featured}>Featured</span>}
        <div className={styles.headerRow}>
          <h2 className={styles.title}>{project.title}</h2>
          <span className={styles.year}>{project.year}</span>
        </div>
      </div>
      <p className={styles.description}>{project.blurb}</p>
    </Link>
  );
}
