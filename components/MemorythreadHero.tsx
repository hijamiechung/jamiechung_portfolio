"use client";

import { useEffect, useRef, useState } from "react";
import artwork from "./ProjectArtwork.module.css";
import styles from "./GuidelightHero.module.css";
import preview from "./MemorythreadHero.module.css";

export function MemorythreadHero() {
  const video = useRef<HTMLVideoElement>(null);
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
    const element = video.current;
    if (!element || reducedMotion) return;
    const elements = [element, screen.current].filter((item): item is HTMLVideoElement => item !== null);
    let visible = false;
    const sync = () => {
      for (const item of elements) {
        if (paused || !visible || document.hidden) item.pause();
        else void item.play().catch(() => setPaused(true));
      }
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
      elements.forEach(item => item.pause());
    };
  }, [paused, reducedMotion]);

  return <div className={`${styles.hero} ${artwork.memorythread}`}>
    {!reducedMotion && <video ref={video} className={styles.video} muted loop playsInline preload="metadata" poster="/images/memorythread/background.webp" aria-hidden="true">
      <source src="/images/memorythread/hero-gradient.webm" type="video/webm"/>
    </video>}
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
