"use client";

import { useEffect } from "react";
import styles from "./MellonEntrance.module.css";

export function MellonEntrance() {
  useEffect(() => {
    const root = document.querySelector("[data-mellon-study]");
    if (!root) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-entrance], h2, p"))
      .filter(element => !element.parentElement?.closest("[data-entrance]"));
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove(styles.pending);
        observer.unobserve(entry.target);
      });
    }, {threshold: 0, rootMargin: "0px 0px -20px 0px"});
    targets.forEach(element => {
      if (element.getBoundingClientRect().bottom < 0) return;
      element.classList.add(styles.reveal, styles.pending);
      observer.observe(element);
    });
    const showAll = () => {
      if (!motion.matches) return;
      observer.disconnect();
      targets.forEach(element => element.classList.remove(styles.pending));
    };
    const showFocused = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      target.closest(`.${styles.pending}`)?.classList.remove(styles.pending);
    };
    motion.addEventListener("change", showAll);
    root.addEventListener("focusin", showFocused as EventListener);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", showAll);
      root.removeEventListener("focusin", showFocused as EventListener);
      targets.forEach(element => element.classList.remove(styles.pending, styles.reveal));
    };
  }, []);
  return null;
}
