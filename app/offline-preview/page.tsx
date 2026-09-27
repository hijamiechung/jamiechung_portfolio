"use client";
import { useEffect, useRef, useState } from "react";
import { DancingCharacter, type DancePose } from "@/components/DancingCharacter";
import { DiscoBall } from "@/components/DiscoBall";
import type { Accessory } from "@/components/FaceAccessory";
import styles from "./page.module.css";

// The whole resume-page cast, dancing together.
const CREW: Accessory[] = ["none", "cap", "mohawk", "roundGlasses", "spoonSunglasses", "headphones"];

const SPEED = 140; // px/sec
const BOUND = 160; // px either side of center

// Concept check for the real offline page: ArrowLeft/ArrowRight held down drives the
// dance pose AND walks the whole crew sideways, in bounds. Not linked from anywhere;
// not yet wired up as the real offline fallback route.
export default function OfflinePreview() {
  const [pose, setPose] = useState<DancePose>("idle");
  const [offset, setOffset] = useState(0);
  const held = useRef({ left: false, right: false });
  const offsetRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") { e.preventDefault(); held.current.left = true; setPose("left"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); held.current.right = true; setPose("right"); }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") held.current.left = false;
      else if (e.key === "ArrowRight") held.current.right = false;
      if (!held.current.left && !held.current.right) setPose("idle");
      else setPose(held.current.left ? "left" : "right");
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
      const dt = (now - last) / 1000;
      last = now;
      let dx = 0;
      if (held.current.left) dx -= SPEED * dt;
      if (held.current.right) dx += SPEED * dt;
      if (dx !== 0) {
        offsetRef.current = Math.max(-BOUND, Math.min(BOUND, offsetRef.current + dx));
        setOffset(offsetRef.current);
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0A0A0A", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 28 }}>
      <DiscoBall/>
      <div className={styles.crew} style={{ transform: `translateX(${offset}px)` }}>
        {CREW.map(accessory => <DancingCharacter key={accessory} pose={pose} accessory={accessory}/>)}
      </div>
      <div className={styles.copy}>
        <p className={styles.message}>You&rsquo;re offline. Let&rsquo;s dance while we wait.</p>
        <p className={styles.hint}>← → to dance</p>
      </div>
    </div>
  );
}
