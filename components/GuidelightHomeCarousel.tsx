"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./GuidelightHomeCarousel.module.css";

const slides = [
  { title: "Status summaries", caption: "Select a status to view students awaiting service matching, consent, or scheduling.", offset: 40 },
  { title: "No updates in 7 days", caption: "Review cases with no updates in the past seven days.", offset: -310 },
  { title: "Personal checklist", caption: "Add follow-up tasks with deadlines and notes.", offset: -560 },
];

export function GuidelightHomeCarousel() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(media.matches);
    sync();
    media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.4 });
    if (root.current) observer.observe(root.current);
    return () => { media.removeEventListener("change", sync); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (paused || !visible || reducedMotion) return;
    const timer = setInterval(() => {
      if (!document.hidden) setActive(index => (index + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [paused, visible, reducedMotion, active]);

  function select(index: number) {
    setActive((index + slides.length) % slides.length);
  }

  return <div ref={root} className={styles.carousel} role="region" aria-roledescription="carousel" aria-label="Guidelight Home features" onKeyDown={event => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      select(active + (event.key === "ArrowRight" ? 1 : -1));
    }
  }}>
    <div className={styles.viewport}>
      <div className={styles.screen} style={{ transform: `translate(-50%, ${slides[active].offset}px)` }}>
        <Image src="/images/guidelight/home-screen.png" alt="Guidelight Home: status summaries, cases without recent updates, and a personal checklist" width={860} height={2502} sizes="350px"/>
      </div>
    </div>
    <div className={styles.controls}>
      <button type="button" onClick={() => select(active - 1)} aria-label="Previous Home feature">←</button>
      <div className={styles.dots}>{slides.map((slide, index) => <button type="button" key={slide.title} aria-label={`Show ${slide.title}`} aria-current={active === index ? "step" : undefined} onClick={() => select(index)}><span/></button>)}</div>
      <button type="button" onClick={() => select(active + 1)} aria-label="Next Home feature">→</button>
      {!reducedMotion && <button className={styles.play} type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Play Home carousel" : "Pause Home carousel"}>{paused ? "Play" : "Pause"}</button>}
    </div>
    <div className={styles.caption} aria-live={paused || reducedMotion ? "polite" : "off"} aria-atomic="true">
      <span className={styles.count}>0{active + 1} / 03</span>
      <h3>{slides[active].title}</h3>
      <p>{slides[active].caption}</p>
    </div>
  </div>;
}
