"use client";
import { useEffect, useRef, useState } from "react";
import { LineIcon } from "@/components/LineIcon";
import styles from "./ProfileFace.module.css";

// Every expression maps to something you could actually type: :J (this site's own
// mark), ;) a wink, :| neutral, :0 surprised. Cycles forward on each click.
const EXPRESSIONS = ["mark", "wink", "neutral", "surprised"] as const;
type Expression = typeof EXPRESSIONS[number];

const ACCESSORIES = ["none", "cap", "mohawk", "roundGlasses", "spoonSunglasses", "headphones"] as const;
type Accessory = typeof ACCESSORIES[number];
const ACCESSORY_LABEL: Record<Accessory, string> = {
  none: "Default", cap: "Cap", mohawk: "Mohawk", roundGlasses: "Round glasses",
  spoonSunglasses: "Spoon sunglasses", headphones: "Headphones",
};

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

        {accessory !== "none" && (
          <svg className={styles.accessoryLayer} viewBox="0 0 40 40" aria-hidden="true" shapeRendering="crispEdges">
            {accessory === "cap" && (
              <g className={styles.accessoryFill}>
                <rect x="15" y="-7" width="10" height="3" />
                <rect x="11" y="-4" width="18" height="3" />
                <rect x="9" y="-1" width="22" height="3" />
                <rect x="4" y="1" width="10" height="2" />
              </g>
            )}
            {accessory === "mohawk" && (
              <g className={styles.accessoryFill}>
                <rect x="13" y="-2" width="5" height="3" />
                <rect x="14" y="-4" width="3" height="2" />
                <rect x="17" y="-3" width="6" height="4" />
                <rect x="18" y="-7" width="4" height="4" />
                <rect x="22" y="-2" width="5" height="3" />
                <rect x="24" y="-4" width="3" height="2" />
              </g>
            )}
            {accessory === "roundGlasses" && (
              <g className={styles.accessoryStroke}>
                <circle cx="13.5" cy="15.5" r="4" />
                <circle cx="26.5" cy="15.5" r="4" />
                <line x1="17.5" y1="15.5" x2="22.5" y2="15.5" />
                <line x1="9.5" y1="14" x2="5" y2="12" />
                <line x1="30.5" y1="14" x2="35" y2="12" />
              </g>
            )}
            {accessory === "spoonSunglasses" && (
              <g className={styles.accessoryFill}>
                <ellipse cx="13.5" cy="15.5" rx="5" ry="3.8" />
                <ellipse cx="26.5" cy="15.5" rx="5" ry="3.8" />
                <rect x="18.5" y="14.5" width="3" height="1.6" />
                <rect x="6" y="12" width="3.5" height="1.6" />
                <rect x="30.5" y="12" width="3.5" height="1.6" />
              </g>
            )}
            {accessory === "headphones" && (
              <g className={styles.accessoryFill}>
                <rect x="14" y="-6" width="12" height="3" />
                <rect x="9" y="-4" width="6" height="3" />
                <rect x="25" y="-4" width="6" height="3" />
                <rect x="6" y="-2" width="3" height="14" />
                <rect x="31" y="-2" width="3" height="14" />
                <rect x="1" y="10" width="6" height="10" rx="2" />
                <rect x="33" y="10" width="6" height="10" rx="2" />
              </g>
            )}
          </svg>
        )}
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
