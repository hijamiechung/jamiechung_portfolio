"use client";
import { useEffect, useRef, useState } from "react";
import { createPixelField } from "@/components/experiments/pixelWeather";

// Dev-only preview so weather states can be checked directly without waiting on real
// weather to change. Not linked from anywhere; remove once the tuning is settled.
const CODES = ["clear", "clouds", "rain", "snow", "wind"] as const;
const PHASES = ["morning", "day", "evening", "night"] as const;

export default function WeatherPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ReturnType<typeof createPixelField> | null>(null);
  const [code, setCode] = useState<typeof CODES[number]>("clear");
  const [phase, setPhase] = useState<typeof PHASES[number]>("day");

  useEffect(() => {
    fieldRef.current = createPixelField(() => canvasRef.current, {
      reduced: false, density: 1, thinning: true, integration: "ground", rects: () => ({ cards: [] }),
    });
    const onResize = () => fieldRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { fieldRef.current?.stop(); window.removeEventListener("resize", onResize); };
  }, []);

  useEffect(() => {
    fieldRef.current?.setEnv({ label: "PREVIEW", cond: code, code, phase, windDir: 270, windSpeed: 6 });
  }, [code, phase]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "var(--color-surface-app)" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }} />
      <div style={{ position: "fixed", top: 16, left: 320, zIndex: 999, display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "sans-serif" }}>
        {CODES.map(c => (
          <button key={c} onClick={() => setCode(c)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: c === code ? "#fff" : "#2a2a2a", color: c === code ? "#000" : "#fff", cursor: "pointer" }}>{c}</button>
        ))}
      </div>
      <div style={{ position: "fixed", top: 60, left: 320, zIndex: 999, display: "flex", gap: 8, flexWrap: "wrap", fontFamily: "sans-serif" }}>
        {PHASES.map(p => (
          <button key={p} onClick={() => setPhase(p)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", background: p === phase ? "#fff" : "#2a2a2a", color: p === phase ? "#000" : "#fff", cursor: "pointer" }}>{p}</button>
        ))}
      </div>
    </div>
  );
}
