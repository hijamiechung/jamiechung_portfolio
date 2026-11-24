"use client";
import { useSyncExternalStore } from "react";

export type PageSection = { id: string; label: string };
export type PageContents = { sections: PageSection[]; active: string } | null;

/* A case-study page publishes its sections here; the sidebar renders them as a tree under the current
   project, so the page itself no longer needs a second, floating table of contents. */
let state: PageContents = null;
const listeners = new Set<() => void>();

export function publishPageContents(next: PageContents) {
  state = next;
  listeners.forEach(listener => listener());
}

export function setActivePageSection(active: string) {
  if (!state || state.active === active) return;
  publishPageContents({ ...state, active });
}

export function usePageContents(): PageContents {
  return useSyncExternalStore(
    listener => { listeners.add(listener); return () => { listeners.delete(listener); }; },
    () => state,
    () => null,
  );
}
