"use client";
import { useEffect } from "react";

export function ProjectVisitTracker({ id }: { id: string }) {
  useEffect(() => {
    try {
      const raw = localStorage.getItem("visited-projects");
      const visited: string[] = raw ? JSON.parse(raw) : [];
      if (!visited.includes(id)) {
        visited.push(id);
        localStorage.setItem("visited-projects", JSON.stringify(visited));
        window.dispatchEvent(new Event("portfolio-visited-projects"));
      }
    } catch {}
  }, [id]);
  return null;
}
