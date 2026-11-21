import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectList.module.css";

const FEATURED_IDS = new Set(["squiggle", "mellon"]);
// Case studies not ready to open: the card stays visible but shows "Coming soon" on hover.
const COMING_SOON_IDS = new Set(["squiggle", "memorythread"]);

export function ProjectList() {
  return (
    <div className={styles.list}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} featured={FEATURED_IDS.has(project.id)} comingSoon={COMING_SOON_IDS.has(project.id)} />
      ))}
    </div>
  );
}
