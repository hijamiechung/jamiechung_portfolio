"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./MellonResearch.module.css";

// [video, finding, short step label]
const findings = [
  ["mellon-research-map2.mp4", "The advisor relays most of the information", "Advisor relay"],
  ["mellon-research-map3.mp4", "Students get the same email twice", "Duplicate emails"],
  ["mellon-research-map4.mp4", "Students have to open several links to find what they need", "Scattered links"],
  ["mellon-research-map5.mp4", "With this much to sort through, students don’t always act on it", "Little action"],
];

// A pinned panel advances one step per slice of scroll. All steps sit on a vertical rail from the start and can be clicked;
// a highlight slides to the current one while the map beside it plays that step's animation.
export function MellonResearch() {
  const root = useRef<HTMLDivElement>(null);
  const videos = useRef<Array<HTMLVideoElement | null>>([]);
  const [active, setActive] = useState(0);
  const lastPlayed = useRef(-1);

  useEffect(() => {
    const element = root.current;
    const panel = element?.querySelector<HTMLElement>("[data-map-panel]");
    if (!element || !panel) return;
    const measure = () => element.style.setProperty("--measured-panel-height", `${panel.offsetHeight}px`);
    measure();
    const resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(panel);
    let frame = 0;
    const update = () => {
      frame = 0;
      const top = parseFloat(getComputedStyle(panel).top) || 0;
      const travel = Math.max(1, element.offsetHeight - panel.offsetHeight);
      const progress = Math.max(0, Math.min(.9999, (top - element.getBoundingClientRect().top) / travel));
      setActive(Math.floor(progress * findings.length));
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    addEventListener("scroll", onScroll, {passive: true});
    addEventListener("resize", onScroll);
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frame);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => videos.current.forEach((video, index) => {
      if (!video) return;
      if (index === active && !motion.matches && !document.hidden) {
        // Each step's animation starts from frame 0 when it comes into view.
        if (lastPlayed.current !== active) video.currentTime = 0;
        void video.play().catch(() => {});
      } else if (index !== active) {
        window.setTimeout(() => { if (lastPlayed.current !== index) video.pause(); }, 260);
      } else video.pause();
    });
    sync();
    lastPlayed.current = active;
    motion.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [active]);

  const goTo = (index: number) => {
    const element = root.current;
    const panel = element?.querySelector<HTMLElement>("[data-map-panel]");
    if (!element || !panel) return;
    const top = parseFloat(getComputedStyle(panel).top) || 0;
    const travel = Math.max(1, element.offsetHeight - panel.offsetHeight);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top: scrollY + element.getBoundingClientRect().top - top + travel * ((index + .5) / findings.length), behavior: reduce ? "instant" : "smooth"});
  };

  return <div ref={root} className={styles.scrollRegion}><div className={styles.panel} data-map-panel>
    <ol className={styles.steps} style={{"--active": active} as React.CSSProperties} aria-label="How information reaches students, step by step"><span className={styles.indicator} aria-hidden="true"/>{findings.map(([,caption,label], index) => <li key={label} className={styles.step} data-current={index === active} data-linked={index < active}>
      <button type="button" onClick={() => goTo(index)} aria-current={index === active ? "step" : undefined} aria-label={`${index + 1}. ${caption}`}><span className={styles.number} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><span className={styles.label} aria-hidden="true">{label}</span></button>
    </li>)}</ol>
    <div className={styles.stage}>
      <div className={styles.captions}>{findings.map(([,caption], index) => <h3 key={caption} data-active={index === active} aria-hidden={index !== active}>{caption}</h3>)}</div>
      <figure className={styles.map}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.layer} src="/images/mellon/mellon-research-map1.png" alt="Research map of how school information reaches students"/>
        {findings.map(([file,caption], index) => <video key={file} ref={video => {videos.current[index] = video;}} className={`${styles.layer} ${styles.animation}`} data-active={index === active} aria-hidden={index !== active} aria-label={caption} src={`/images/mellon/${file}`} muted loop playsInline preload="auto"/>)}
      </figure>
    </div>
  </div></div>;
}
