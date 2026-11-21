"use client";

import { useEffect, useRef } from "react";
import styles from "./MellonThumbnail.module.css";

export function MellonThumbnail() {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { if (preference.matches) element.pause(); else void element.play().catch(() => {}); };
    sync();
    preference.addEventListener("change", sync);
    return () => preference.removeEventListener("change", sync);
  }, []);

  return <div className={styles.stage} aria-hidden="true">
    <video ref={video} className={styles.video} src="/images/mellon/mellon-00-hero-transparent.webm" muted loop playsInline autoPlay />
  </div>;
}
