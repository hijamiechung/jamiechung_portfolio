"use client";

import { useEffect, useRef } from "react";
import styles from "./MellonVideo.module.css";

export function MellonVideo({src, label, active = true, preload = "metadata"}: {src:string; label:string; active?:boolean; preload?:"metadata" | "auto"}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    const sync = () => {
      if (active && visible && !document.hidden && !motion.matches) {
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    }, {threshold: 0});
    observer.observe(video);
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      video.pause();
    };
  }, [active]);

  return <video className={styles.video} ref={ref} autoPlay={active} muted loop playsInline controls={active} preload={preload} src={src} aria-label={label}/>;
}
