"use client";

import { useEffect, useRef, useState } from "react";
import { GuidelightThumbnail } from "./GuidelightThumbnail";
import artwork from "./ProjectArtwork.module.css";
import styles from "./GuidelightHero.module.css";

export function GuidelightHero() {
  const video = useRef<HTMLVideoElement>(null);
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

  return <div className={`${styles.hero} ${artwork.guidelight}`}>
    {!reducedMotion && <video ref={video} className={styles.video} muted loop playsInline preload="metadata" poster="/images/guidelight/background.webp" aria-hidden="true">
      <source src="/images/guidelight/hero-gradient.webm" type="video/webm"/>
    </video>}
    <GuidelightThumbnail paused={paused || reducedMotion}/>
    {!reducedMotion && <button type="button" className={styles.control} onClick={() => setPaused(value => !value)} aria-label={paused ? "Play animation" : "Pause animation"}>
      {paused ? "Play motion" : "Pause motion"}
    </button>}
  </div>;
}
