"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./WeatherScene.module.css";

const W = 34, H = 34;

function subscribeMotion(callback: () => void) {
  const media = matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function subscribeTheme(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

export function WeatherScene({code, phase}: {code: string; phase: string}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useSyncExternalStore(subscribeMotion, () => matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const theme = useSyncExternalStore(subscribeTheme, () => document.documentElement.dataset.theme, () => undefined);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const rain = Array.from({length: 7}, () => ({x: Math.random() * W, y: Math.random() * H, s: 0.9 + Math.random() * 0.5}));
    const snow = Array.from({length: 6}, () => ({x: Math.random() * W, y: Math.random() * H, s: 0.2 + Math.random() * 0.25}));
    const stars = Array.from({length: 4}, () => ({x: 4 + Math.random() * 26, y: 3 + Math.random() * 9, phase: Math.random() * 7}));
    const clouds = [{x: 12, y: 12, phase: 0}, {x: 22, y: 9, phase: 2.4}];
    let shootAt = 3000 + Math.random() * 7000;
    let shoot: {x: number; y: number; t: number} | null = null;
    let raf = 0, running = true, start = 0;

    function dot(x: number, y: number, size: number, alpha: number) {
      ctx!.globalAlpha = Math.max(0, Math.min(1, alpha));
      ctx!.fillRect(Math.round(x), Math.round(y), size, size);
    }

    function draw(now: number) {
      if (!running) return;
      if (!start) start = now;
      const t = now - start;
      const isNight = phase === "night";
      ctx!.clearRect(0, 0, W, H);
      const dotColor = getComputedStyle(document.documentElement).getPropertyValue("--color-dot").trim() || "#888";
      ctx!.fillStyle = dotColor;

      if (code === "storm" && !reduced) {
        const cyc = (t % 5200) / 5200;
        if (cyc > 0.93) {
          ctx!.globalAlpha = Math.sin(((cyc - 0.93) / 0.07) * Math.PI) * 0.4;
          ctx!.fillRect(0, 0, W, H);
          ctx!.fillStyle = dotColor;
        }
      }

      for (let x = 2; x < W - 1; x += 3) dot(x, H - 3, 1.4, isNight ? 0.3 : 0.5);

      if (code === "clear" && !isNight) {
        const cx = 17, cy = 13;
        const shimmer = reduced ? 0.75 : 0.55 + 0.45 * Math.sin(t / 900);
        dot(cx, cy, 2.2, 0.92);
        ([[-4, 0], [4, 0], [0, -4], [0, 4], [-3, -3], [3, -3], [-3, 3], [3, 3]] as const).forEach(([dx, dy], i) => {
          dot(cx + dx, cy + dy, 1.3, i % 2 === 0 ? shimmer : 0.5);
        });
      } else if (code === "storm" || code === "clouds" || code === "rain" || code === "snow" || code === "wind") {
        clouds.forEach(c => {
          const drift = reduced ? 0 : Math.sin(t / 3200 + c.phase) * 2.5;
          const cx = c.x + drift, cy = c.y;
          ([[-3, 0], [0, -1], [3, 0], [-1, 1], [2, 1], [5, 0], [-5, 1]] as const).forEach(([dx, dy]) => dot(cx + dx, cy + dy, 1.4, isNight ? 0.32 : 0.55));
        });
      }

      if (code === "rain" || code === "storm") {
        rain.forEach(d => {
          if (!reduced) { d.y += d.s * 1.4; if (d.y > H - 4) { d.y = 10; d.x = Math.random() * W; } }
          dot(d.x, d.y, 1, 0.4);
        });
      }

      if (code === "snow") {
        snow.forEach(d => {
          if (!reduced) {
            d.y += d.s; d.x += Math.sin(t / 800 + d.y) * 0.15;
            if (d.y > H - 4) { d.y = 10; d.x = Math.random() * W; }
          }
          dot(d.x, d.y, 1.2, 0.55);
        });
      }

      if (isNight) {
        stars.forEach(s => {
          const tw = reduced ? 0.6 : 0.3 + 0.7 * Math.abs(Math.sin(t / 1400 + s.phase));
          dot(s.x, s.y, 1, tw);
        });
        const mx = 24, my = 9;
        ([[0, -3], [1, -2], [-1, -1], [0, 0], [-1, 1], [1, 2], [0, 3]] as const).forEach(([dx, dy]) => dot(mx + dx, my + dy, 1.3, 0.78));
        if (!reduced) {
          if (!shoot && t > shootAt) shoot = {x: 3, y: 3 + Math.random() * 7, t: 0};
          if (shoot) {
            shoot.t += 16;
            const p = shoot.t / 420;
            if (p >= 1) { shoot = null; shootAt = t + 6000 + Math.random() * 9000; }
            else { const sx = shoot.x + p * 26, sy = shoot.y + p * 7; dot(sx, sy, 1.1, 1 - p); dot(sx - 2.5, sy - 0.8, 0.7, (1 - p) * 0.5); }
          }
        }
      }

      ctx!.globalAlpha = 1;
      if (!reduced) raf = requestAnimationFrame(draw);
    }

    draw(0);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, [code, phase, reduced, theme]);

  return <canvas ref={ref} className={styles.scene} aria-hidden="true" />;
}
