"use client";

import { useEffect, useRef } from "react";
import styles from "./MemorythreadThumbnail.module.css";

export function MemorythreadThumbnail() {
  const root = useRef<HTMLDivElement>(null);
  const background = useRef<HTMLVideoElement>(null);
  const screen = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = root.current;
    const link = element?.closest("a");
    const bg = background.current;
    const screenVideo = screen.current;
    if (!element || !link) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    // Background gradient runs continuously once on screen, same as Guidelight's
    // card preview — only the phone-screen detail stays hover-gated, as a peek.
    const sync = () => {
      const hovering = link.matches(":hover, :focus-within");
      const canPlay = visible && !document.hidden && !preference.matches;

      if (bg) {
        if (canPlay) {
          if (!bg.getAttribute("src")) bg.src = bg.dataset.src!;
          void bg.play().catch(() => {});
        } else bg.pause();
      }

      if (screenVideo) {
        if (canPlay && hovering) {
          if (!screenVideo.getAttribute("src")) screenVideo.src = screenVideo.dataset.src!;
          void screenVideo.play().catch(() => {});
        } else screenVideo.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    for (const event of ["pointerenter", "pointerleave", "focusin", "focusout"]) link.addEventListener(event, sync);
    document.addEventListener("visibilitychange", sync);
    preference.addEventListener("change", sync);
    return () => {
      observer.disconnect();
      for (const event of ["pointerenter", "pointerleave", "focusin", "focusout"]) link.removeEventListener(event, sync);
      document.removeEventListener("visibilitychange", sync);
      preference.removeEventListener("change", sync);
      bg?.pause();
      screenVideo?.pause();
    };
  }, []);

  return <div ref={root} className={styles.stage} aria-hidden="true">
    <video ref={background} className={styles.background} data-src="/images/memorythread/hero-gradient.webm" poster="/images/memorythread/background.webp" muted loop playsInline preload="none" />
    <div className={styles.window}>
      <video ref={screen} className={styles.screen} data-src="/images/memorythread/photo-flow-screen.mp4" poster="/images/memorythread/photo-flow-screen-poster.png" muted loop playsInline preload="none" />
    </div>
  </div>;
}
