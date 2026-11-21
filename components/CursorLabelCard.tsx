"use client";

import { useRef, type ReactNode } from "react";
import styles from "./ProjectCard.module.css";

// A non-navigating card whose label trails the pointer. Position is written straight to the DOM
// so mousemove never triggers a React render.
export function CursorLabelCard({ label, ariaLabel, className, children }: { label: string; ariaLabel: string; className?: string; children: ReactNode }) {
  const tag = useRef<HTMLSpanElement>(null);
  const move = (event: React.PointerEvent) => {
    if (event.pointerType === "touch" || !tag.current) return;
    tag.current.style.transform = `translate(${event.clientX + 14}px, ${event.clientY + 16}px)`;
    tag.current.dataset.visible = "true";
  };
  const hide = () => { if (tag.current) tag.current.dataset.visible = "false"; };
  return (
    <div className={className} tabIndex={0} aria-label={ariaLabel} onPointerMove={move} onPointerLeave={hide}>
      {children}
      <span ref={tag} className={styles.cursorTag} data-visible="false" aria-hidden="true">{label}</span>
    </div>
  );
}
