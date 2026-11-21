"use client";

import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { ResumeSectionIcon } from "./ResumeSectionIcon";
import styles from "@/app/resume/page.module.css";

const sections = ["education", "experience", "projects", "research", "leadership", "skills"] as const;
type Section = typeof sections[number];

export function ResumeNavigation() {
  const [active, setActive] = useState<Section>("education");
  const navigation = useRef<HTMLElement>(null);
  const destination = useRef<Section | null>(null);

  useEffect(() => {
    const nav = navigation.current;
    if (!nav) return;
    let frame = 0;
    function update() {
      frame = 0;
      if (!nav) return;
      const firstHeading = document.getElementById("education-heading");
      const firstTab = nav.querySelector("a");
      if (!firstHeading || !firstTab || !nav.parentElement) return;
      const first = firstHeading.getBoundingClientRect();
      const tabHeight = firstTab.getBoundingClientRect().height;
      nav.style.marginTop = `${first.top + first.height / 2 - nav.parentElement.getBoundingClientRect().top - tabHeight / 2}px`;
      const inset = 24;
      const gap = parseFloat(getComputedStyle(nav).gap);
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      const hash = window.location.hash.slice(1);
      const requested = destination.current ?? sections.find(id => id === hash);
      const current = sections.filter((id, index) => {
        const heading = document.getElementById(`${id}-heading`)?.getBoundingClientRect();
        return heading && heading.top + heading.height / 2 <= inset + index * (tabHeight + gap) + tabHeight / 2 + 2;
      });
      const selected = atBottom && requested ? requested : current.at(-1) ?? "education";
      setActive(selected);
      // At the page end, move the rail to the heading instead of adding empty document space.
      const heading = document.getElementById(`${selected}-heading`)?.getBoundingClientRect();
      const alignedTop = heading ? heading.top + heading.height / 2 - sections.indexOf(selected) * (tabHeight + gap) - tabHeight / 2 : inset;
      nav.style.top = `${atBottom ? Math.max(inset, alignedTop) : inset}px`;
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(update); }
    function releaseDestination() { destination.current = null; }
    const observer = new ResizeObserver(schedule);
    if (nav.parentElement) observer.observe(nav.parentElement);
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("hashchange", schedule);
    window.addEventListener("wheel", releaseDestination, { passive: true });
    window.addEventListener("touchstart", releaseDestination, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("hashchange", schedule);
      window.removeEventListener("wheel", releaseDestination);
      window.removeEventListener("touchstart", releaseDestination);
    };
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>, id: Section, index: number) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const nav = navigation.current;
    const heading = document.getElementById(`${id}-heading`);
    if (!nav || !heading) return;
    event.preventDefault();
    destination.current = id;
    const rect = heading.getBoundingClientRect();
    const tabHeight = event.currentTarget.getBoundingClientRect().height;
    const gap = parseFloat(getComputedStyle(nav).gap);
    const targetCenter = 24 + index * (tabHeight + gap) + tabHeight / 2;
    window.history.pushState(null, "", `#${id}`);
    window.scrollTo({ top: window.scrollY + rect.top + rect.height / 2 - targetCenter, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    setActive(id);
    window.dispatchEvent(new Event("scroll"));
  }

  return <nav ref={navigation} className={styles.fileNavigation} aria-label="Resume sections">
    {sections.map((id, index) => <a key={id} href={`#${id}`} onClick={event => navigate(event, id, index)} className={styles.fileTab} aria-label={id[0].toUpperCase() + id.slice(1)} title={id[0].toUpperCase() + id.slice(1)} aria-current={active === id ? "location" : undefined} style={{ zIndex: active === id ? 10 : sections.length - index }}>
      <ResumeSectionIcon name={id} className={styles.sectionIcon} />
    </a>)}
  </nav>;
}
