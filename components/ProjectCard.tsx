import Link from "next/link";
import type { Project } from "@/lib/projects";
import { ProjectStamp } from "./ProjectStamp";
import styles from "./ProjectCard.module.css";

export function ProjectCard({ project, featured }: { project: Project; featured?: boolean }) {
  return (
    <Link className={styles.card} href={`/projects/${project.id}`} aria-label={`View ${project.title}`}>
      <ProjectStamp id={project.id} />
      <div className={styles.thumbnail}>
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
