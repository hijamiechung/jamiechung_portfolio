"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./MemorythreadCaseStudy.module.css";

export type MemorySlide = { src: string; title: string; caption: string; alt: string };

export function MemorythreadCarousel({slides, label}: {slides: MemorySlide[]; label: string}) {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: .3});
    if (root.current) observer.observe(root.current);
    return () => {observer.disconnect(); media.removeEventListener("change", sync);};
  }, []);
  useEffect(() => {
    if (paused || hovered || reduced || !visible) return;
    const timer = setInterval(() => {if (!document.hidden) setActive(i => (i + 1) % slides.length);}, 10000);
    return () => clearInterval(timer);
  }, [active, paused, hovered, reduced, visible, slides.length]);
  function select(index: number) {setPaused(true); setActive((index + slides.length) % slides.length);}
  return <div ref={root} className={styles.carousel} role="region" aria-roledescription="carousel" aria-label={label} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onFocusCapture={() => setPaused(true)} onKeyDown={e => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {e.preventDefault(); select(active + (e.key === "ArrowRight" ? 1 : -1));}
  }}>
    <div className={styles.slidePicker} aria-label="Choose a step">{slides.map((slide, i) => <button key={slide.src} aria-current={active === i ? "step" : undefined} onClick={() => select(i)} aria-label={`Step ${i+1}: ${slide.title}`}>0{i+1}</button>)}</div><div className={styles.viewport}>{slides.map((slide, i) => <div key={slide.src} className={styles.slide} data-active={active === i} aria-hidden={active !== i}><Image src={slide.src} alt={slide.alt} fill sizes="1200px"/></div>)}</div>
    <div className={styles.carouselFooter}><div aria-live={paused || reduced ? "polite" : "off"} aria-atomic="true"><span className={styles.eyebrow}>0{active + 1} / 0{slides.length}</span><h3>{slides[active].title}</h3><p>{slides[active].caption}</p><a className={styles.originalLink} href={slides[active].src} target="_blank" rel="noopener noreferrer">View full-size image ↗</a></div><div className={styles.controls}><button onClick={() => select(active - 1)} aria-label={`Previous ${label} slide`}>←</button><button onClick={() => select(active + 1)} aria-label={`Next ${label} slide`}>→</button>{!reduced && <button onClick={() => setPaused(v => !v)} aria-label={paused ? `Play ${label}` : `Pause ${label}`}>{paused ? "Play" : "Pause"}</button>}</div></div>
  </div>;
}

const steps = [
  {actor: "Me", title: "Define the interaction", body: "Photo → question → answer → memory map."},
  {actor: "Claude", title: "Turn the flow into a working app", body: "Help implement and debug the React prototype."},
  {actor: "Me", title: "Run it, judge it, request changes", body: "Questions stayed generic. I asked for person-focused follow-ups and more specific keywords."},
  {actor: "Claude", title: "Revise the implementation", body: "Update question instructions and keyword extraction in response to my feedback."},
  {actor: "Me", title: "Retest with the same inputs", body: "I observed more specific keywords. That observation did not establish better follow-up questions."},
];

export function MemorythreadBuildLoop() {
  const root = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (media.matches) {setActive(-1); return;}
        const items = [...(root.current?.children ?? [])];
        let next = -1;
        items.forEach((item, i) => {if (item.getBoundingClientRect().top < innerHeight * .6) next = i;});
        setActive(next);
      });
    };
    update(); window.addEventListener("scroll", update, {passive:true}); window.addEventListener("resize", update); media.addEventListener("change", update);
    return () => {cancelAnimationFrame(frame); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); media.removeEventListener("change", update);};
  }, []);
  return <div className={styles.buildDiagram}><div className={styles.laneHeaders}><span>Me · design judgment</span><span>Claude · implementation</span></div><ol ref={root} className={styles.buildLoop}>{steps.map((step, i) => <li key={step.title} data-active={active === i} data-actor={step.actor}><span className={styles.eyebrow}>{step.actor} · 0{i + 1}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol></div>;
}
