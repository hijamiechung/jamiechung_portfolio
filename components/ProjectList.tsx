import { projects } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./ProjectList.module.css";

export function ProjectList() {
  return (
    <div className={styles.list}>
      {projects.slice(0, 2).map((project) => (
        <ProjectCard key={project.id} project={project} featured />
      ))}
    </div>
  );
}
