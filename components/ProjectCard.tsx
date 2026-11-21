import Link from "next/link";
import type { Project } from "@/lib/projects";
import styles from "./ProjectCard.module.css";
import artwork from "./ProjectArtwork.module.css";
import { GuidelightThumbnail } from "./GuidelightThumbnail";
import { MemorythreadThumbnail } from "./MemorythreadThumbnail";
import { SquiggleThumbnail } from "./SquiggleThumbnail";
import { MellonThumbnail } from "./MellonThumbnail";
import { ProjectTransition } from "./ProjectTransition";
import { CursorLabelCard } from "./CursorLabelCard";

const GUIDELIGHT_THUMBNAIL_PREVIEW = true;
const MEMORYTHREAD_THUMBNAIL_PREVIEW = true;

export function ProjectCard({ project, featured, comingSoon }: { project: Project; featured?: boolean; comingSoon?: boolean }) {
  const content = (<>
      <ProjectTransition id={project.id}><div className={`${styles.thumbnail} ${(artwork as Record<string, string>)[project.id] ?? ''}`}>
        {GUIDELIGHT_THUMBNAIL_PREVIEW && project.id === 'guidelight' && <GuidelightThumbnail/>}
        {MEMORYTHREAD_THUMBNAIL_PREVIEW && project.id === 'memorythread' && <MemorythreadThumbnail/>}
        {project.id === 'squiggle' && <SquiggleThumbnail/>}
        {project.id === 'mellon' && <MellonThumbnail/>}
        {featured && <span className={`${styles.badge} ${styles.featuredBadge}`}>Featured</span>}
      </div></ProjectTransition>
      <div className={styles.meta}>
        <div className={styles.headerRow}>
          <h2 className={styles.title}>{project.title}</h2>
          <span className={styles.year}>{project.year}</span>
        </div>
      </div>
      <p className={styles.description}>{project.blurb}</p>
  </>);
  if (comingSoon) return <CursorLabelCard className={`${styles.card} ${styles.locked}`} label="Coming soon" ariaLabel={`${project.title} — coming soon`}>{content}</CursorLabelCard>;
  return <Link className={styles.card} href={`/projects/${project.id}`} aria-label={`View ${project.title}`}>{content}</Link>;
}
