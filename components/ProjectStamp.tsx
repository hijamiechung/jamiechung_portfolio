"use client";
import { useSyncExternalStore } from "react";
import styles from "./ProjectStamp.module.css";

function subscribeVisited(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("portfolio-visited-projects", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("portfolio-visited-projects", callback);
  };
}

function readVisited(id: string) {
  try {
    const raw = localStorage.getItem("visited-projects");
    const visited: string[] = raw ? JSON.parse(raw) : [];
    return visited.includes(id);
  } catch { return false; }
}

// Small deterministic wobble so the stamp looks hand-pressed, not identical on every card.
function rotationFor(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (Math.abs(hash) % 13) - 6;
}

export function ProjectStamp({ id }: { id: string }) {
  const visited = useSyncExternalStore(subscribeVisited, () => readVisited(id), () => false);
  if (!visited) return null;
  return (
    <svg
      className={styles.stamp}
      style={{ transform: `rotate(${rotationFor(id)}deg)` }}
      viewBox="0 0 64 64"
      aria-label="Read"
    >
      <circle cx="32" cy="32" r="27" className={styles.outerRing} />
      <circle cx="32" cy="32" r="21" className={styles.innerRing} />
      <text x="32" y="35.5" textAnchor="middle" className={styles.label}>READ</text>
    </svg>
  );
}
