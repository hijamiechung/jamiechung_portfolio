"use client";

import { useEffect, useRef, useState } from "react";
import artwork from "./ProjectArtwork.module.css";
import styles from "./GuidelightHero.module.css";
import preview from "./MemorythreadHero.module.css";

export function MemorythreadHero() {
  const screen = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(preference.matches);
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const element = screen.current;
    if (!element || reducedMotion) return;
    let visible = false;
    const sync = () => {
      if (paused || !visible || document.hidden) element.pause();
      else void element.play().catch(() => setPaused(true));
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(element);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
      element.pause();
    };
  }, [paused, reducedMotion]);

  return <div className={`${styles.hero} ${artwork.memorythread}`}>
    <div className={preview.frame} aria-hidden="true">
      <video ref={screen} className={preview.screen} muted loop playsInline preload="metadata" poster="/images/memorythread/photo-flow-screen-poster.png">
        {!reducedMotion && <source src="/images/memorythread/photo-flow-screen.mp4" type="video/mp4"/>}
      </video>
    </div>
    {!reducedMotion && <button type="button" className={styles.control} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play animation" : "Pause animation"}>
      {paused ? "Play motion" : "Pause motion"}
    </button>}
  </div>;
}
