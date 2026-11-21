"use client";

import { useEffect, useRef } from "react";
import styles from "./SquiggleThumbnail.module.css";

// Card interior inside the 1600×1008 source, inset past its baked-in rounded corners.
const CROP = { x: 108, y: 88, w: 1384, h: 791 };

export function SquiggleThumbnail() {
  const video = useRef<HTMLVideoElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const source = video.current;
    const target = canvas.current?.getContext("2d");
    if (!source || !target) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const draw = () => target.drawImage(source, CROP.x, CROP.y, CROP.w, CROP.h, 0, 0, CROP.w, CROP.h);
    const loop = () => { draw(); raf = requestAnimationFrame(loop); };
    const sync = () => {
      cancelAnimationFrame(raf);
      if (preference.matches) { source.pause(); draw(); }
      else { void source.play().catch(() => {}); loop(); }
    };
    source.addEventListener("loadeddata", sync);
    if (source.readyState >= 2) sync();
    preference.addEventListener("change", sync);
    return () => {
      cancelAnimationFrame(raf);
      source.removeEventListener("loadeddata", sync);
      preference.removeEventListener("change", sync);
    };
  }, []);

  return <div className={styles.stage} aria-hidden="true">
    <canvas ref={canvas} className={styles.frame} width={CROP.w} height={CROP.h} />
    <video ref={video} className={styles.source} src="/images/squiggle/squiggle-thumbnail-loader.webm" muted loop playsInline autoPlay />
  </div>;
}
