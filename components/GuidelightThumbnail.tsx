"use client";
import { useEffect, useRef } from "react";
import styles from "./GuidelightThumbnail.module.css";

export function GuidelightThumbnail({ paused = false }: { paused?: boolean }) {
  const video = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (preference.matches) { element.pause(); element.removeAttribute("src"); element.load(); }
      else {
        if (!element.getAttribute("src")) element.src = "/images/guidelight/onboarding-loop.webm";
        if (paused) element.pause();
        else void element.play().catch(() => {});
      }
    };
    sync(); preference.addEventListener("change", sync);
    return () => { preference.removeEventListener("change", sync); element.pause(); };
  }, [paused]);
  return <div className={styles.crop} aria-hidden="true"><div className={styles.screen}><video ref={video} className={styles.video} muted loop playsInline preload="metadata" poster="/images/guidelight/onboarding-poster.png"/></div></div>;
}
