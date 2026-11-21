"use client";
import { useEffect, useRef, useState } from "react";
import { DancingCharacter, type DancePose } from "@/components/DancingCharacter";
import { DiscoBall } from "@/components/DiscoBall";
import type { Accessory } from "@/components/FaceAccessory";
import styles from "./OfflineScene.module.css";

// The whole resume-page cast, dancing together.
const CREW: Accessory[] = ["none", "cap", "mohawk", "roundGlasses", "spoonSunglasses", "headphones"];

const SPEED = 140; // px/sec
const BOUND = 160; // px either side of center

export function OfflineScene() {
  const [pose, setPose] = useState<DancePose>("idle");
  const [offset, setOffset] = useState(0);
  const held = useRef({ left: false, right: false });
  const offsetRef = useRef(0);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      if (e.key === "ArrowLeft") { e.preventDefault(); held.current.left = true; setPose("left"); }
      else if (e.key === "ArrowRight") { e.preventDefault(); held.current.right = true; setPose("right"); }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") held.current.left = false;
      else if (e.key === "ArrowRight") held.current.right = false;
      if (!held.current.left && !held.current.right) setPose("idle");
      else setPose(held.current.left ? "left" : "right");
    }
    function reset() {
      held.current = { left: false, right: false };
      setPose("idle");
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
    };
  }, []);

  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = performance.now();
    function loop(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      let dx = 0;
      if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (held.current.left) dx -= SPEED * dt;
        if (held.current.right) dx += SPEED * dt;
      }
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
    <div className={styles.scene} role="status" tabIndex={-1} aria-label="You’re offline">
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
