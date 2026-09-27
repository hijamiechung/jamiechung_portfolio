"use client";
import { useEffect, useRef } from "react";
import styles from "./DiscoBall.module.css";

const CELL = 4;
const SIZE = 64;

// Same deterministic-hash sparkle used by the pixel weather/sea fields — a grid of
// tiny facets, each twinkling independently. The ball itself never rotates; instead
// a brightness sweep keyed to each cell's angle from center rotates through the
// pattern, like a highlight scanning around a mirror ball's fixed facets.
function hash(x: number, y: number, seed = 7) {
  let n = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263) ^ Math.imul(seed, 1274126177);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
}

export function DiscoBall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cells = Math.ceil(SIZE / CELL);
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const cx = SIZE / 2, cy = SIZE / 2;
    function render(t: number) {
      ctx!.clearRect(0, 0, SIZE, SIZE);
      ctx!.fillStyle = "#ffffff";
      for (let row = 0; row < cells; row++) {
        for (let col = 0; col < cells; col++) {
          const hv = hash(col, row, 11);
          if (hv < 0.55) continue;
          const px = col * CELL + CELL / 2, py = row * CELL + CELL / 2;
          const angle = Math.atan2(py - cy, px - cx);
          const sweep = Math.max(0, Math.cos(angle - t * 0.0016));
          const twinkle = 0.5 + 0.5 * Math.sin(t * 0.004 + hv * 60);
          const a = (0.12 + 0.88 * sweep) * (0.35 + 0.65 * twinkle);
          if (a < 0.08) continue;
          ctx!.globalAlpha = a;
          ctx!.fillRect(col * CELL + 0.5, row * CELL + 0.5, CELL - 1, CELL - 1);
        }
      }
      ctx!.globalAlpha = 1;
    }

    if (reduced) { render(0); return; }
    function frame(now: number) { raf = requestAnimationFrame(frame); render(now); }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={styles.ball} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} width={SIZE} height={SIZE}/>
    </div>
  );
}
