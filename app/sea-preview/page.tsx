"use client";
import { useEffect, useRef } from "react";
import { createSeaField } from "@/components/experiments/pixelSea";

// Dev-only preview, same purpose as /weather-preview: judge the dolphin/splash/cloud
// timing directly without waiting on the real periodic interval. Not linked from
// anywhere; remove once the tuning is settled.
export default function SeaPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ReturnType<typeof createSeaField> | null>(null);

  useEffect(() => {
    fieldRef.current = createSeaField(() => canvasRef.current, { reduced: false });
    const onResize = () => fieldRef.current?.resize();
    window.addEventListener("resize", onResize);
    return () => { fieldRef.current?.stop(); window.removeEventListener("resize", onResize); };
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A0A0A" }}>
      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, width: "100%", height: "100%" }} />
    </div>
  );
}
