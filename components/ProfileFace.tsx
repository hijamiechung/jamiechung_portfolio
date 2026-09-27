"use client";
import { useEffect, useRef, useState } from "react";
import { LineIcon } from "@/components/LineIcon";
import { ACCESSORIES, ACCESSORY_LABEL, FaceAccessory, type Accessory } from "@/components/FaceAccessory";
import styles from "./ProfileFace.module.css";

// Every expression maps to something you could actually type: :J (this site's own
// mark), ;) a wink, :| neutral, :0 surprised. Cycles forward on each click.
const EXPRESSIONS = ["mark", "wink", "neutral", "surprised"] as const;
type Expression = typeof EXPRESSIONS[number];

export function ProfileFace() {
  const [index, setIndex] = useState(0);
  const expression: Expression = EXPRESSIONS[index];
  const [accessoryIndex, setAccessoryIndex] = useState(0);
  const accessory: Accessory = ACCESSORIES[accessoryIndex];
  const containerRef = useRef<HTMLButtonElement>(null);
  const eyesRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    function onMove(e: PointerEvent) {
      const el = containerRef.current;
      const eyes = eyesRef.current;
      if (!el || !eyes) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const reach = Math.min(dist / 40, 1) * 2.2;
      eyes.style.transform = `translate(${(dx / dist) * reach}px, ${(dy / dist) * reach}px)`;
    }
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  function cycleAccessory(step: 1 | -1) {
    setAccessoryIndex(i => (i + step + ACCESSORIES.length) % ACCESSORIES.length);
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.faceStack}>
        <button
          type="button"
          ref={containerRef}
          className={styles.face}
          aria-label="Say hi"
          onClick={() => setIndex(i => (i + 1) % EXPRESSIONS.length)}
        >
          <svg viewBox="0 0 40 40" width="100%" height="100%" aria-hidden="true" shapeRendering="crispEdges">
            <g ref={eyesRef} className={styles.eyes}>
              {expression === "wink" ? (
                <path d="M11.7 16.6q2.4-1.8 4.8 0" className={styles.stroke} />
              ) : (
                <rect x="12.4" y="14.2" width={expression === "surprised" ? 3.4 : 2.4} height={expression === "surprised" ? 3.4 : 2.4} rx=".5" className={styles.fillShape} />
              )}
              <rect x="24.4" y="14.2" width={expression === "surprised" ? 3.4 : 2.4} height={expression === "surprised" ? 3.4 : 2.4} rx=".5" className={styles.fillShape} />
            </g>
            {expression === "mark" && (
              <path d="M22.79 20.47V30.31C22.79 32.47 21.23 34.03 19.07 34.03C17.51 34.03 16.31 33.31 15.71 32.11" transform="rotate(90 19.25 27.25)" className={styles.markMouth} />
            )}
            {expression === "wink" && (
              <path d="M13.5 25.5q6.5 5.5 13 0" className={styles.stroke} />
            )}
            {expression === "neutral" && (
              <line x1="14" y1="26.5" x2="26" y2="26.5" className={styles.stroke} />
            )}
            {expression === "surprised" && (
              <circle cx="20" cy="27" r="3" className={styles.mouthOpen} />
            )}
          </svg>
        </button>

        <FaceAccessory accessory={accessory}/>
      </div>

      <div className={styles.accessoryBar}>
        <button type="button" className={styles.arrowButton} aria-label="Previous accessory" onClick={() => cycleAccessory(-1)}>
          <LineIcon name="chevron" className={styles.arrowLeft} />
        </button>
        <button type="button" className={styles.arrowButton} aria-label="Next accessory" onClick={() => cycleAccessory(1)}>
          <LineIcon name="chevron" />
        </button>
        <span className={styles.srOnly} aria-live="polite">{ACCESSORY_LABEL[accessory]}</span>
      </div>
    </div>
  );
}
