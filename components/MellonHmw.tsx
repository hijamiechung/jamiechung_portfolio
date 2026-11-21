"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { MellonSpeaker } from "./MellonSpeaker";
import styles from "./MellonHmw.module.css";

// `icons` maps a word index to a character that pops in once that word has fully filled.
function Words({text, icons = {}}: {text:string; icons?: Record<number, ReactNode>}) {
  return <>{text.split(" ").map((word,index) => <span key={index}><span className={styles.segment}><span className={styles.word} data-hmw-word>{word}</span></span>{icons[index] && <span className={styles.icon} data-hmw-icon data-shown="false" aria-hidden="true">{icons[index]}</span>}{" "}</span>)}</>;
}
export function MellonHmw() {
  const ref = useRef<HTMLQuoteElement>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const words = Array.from(element.querySelectorAll<HTMLElement>("[data-hmw-word]"));
    const lengths = words.map(word => word.textContent?.length || 1);
    const total = lengths.reduce((sum,length) => sum + length, 0);
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const update = () => {
      frame = 0;
      // No pinning: the page scrolls normally and the fill follows the sentence itself, starting as its top
      // enters the lower part of the viewport and finishing once its bottom has passed the middle.
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * 0.85;
      const distance = Math.max(1, rect.height + window.innerHeight * 0.4);
      const progress = motion.matches ? 1 : Math.max(0, Math.min(1, (start - rect.top) / distance));
      let offset = 0;
      words.forEach((word,index) => {
        const fill = Math.max(0, Math.min(1, (progress * total - offset) / lengths[index]));
        word.parentElement?.style.setProperty("--word-fill", `${fill * 100}%`);
        const icon = word.parentElement?.nextElementSibling;
        if (icon instanceof HTMLElement && icon.hasAttribute("data-hmw-icon")) icon.dataset.shown = fill >= 1 ? "true" : "false";
        offset += lengths[index];
      });
    };
    // Each word draws its own slice of the dotted underline; offset every slice by its x position so the
    // dashes line up into one continuous line across words (and across the gaps between them).
    const period = 7;
    const align = () => {
      const origin = element.getBoundingClientRect().left;
      element.querySelectorAll<HTMLElement>("[class*=underline] [class*=segment]").forEach(segment => {
        const x = segment.getBoundingClientRect().left - origin;
        segment.style.setProperty("--dash-phase", `${((x % period) + period) % period}px`);
      });
    };
    void document.fonts?.ready.then(align);
    align();
    window.addEventListener("resize", align);
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    window.addEventListener("scroll", schedule, {passive:true});
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    update();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("resize", align);
      motion.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      words.forEach(word => word.parentElement?.style.removeProperty("--word-fill"));
    };
  }, []);

  const student = <MellonSpeaker who="student" size={40}/>;
  const advisor = <MellonSpeaker who="advisor" size={40}/>;
  return <div className={styles.stage}><div className={styles.pin}><blockquote ref={ref} className={styles.statement}><Words text="How might I help students" icons={{4: student}}/><span className={styles.underline} data-who="student"><Words text="recognize the school emails that matter to them,"/></span><Words text="and"/><span className={styles.underline} data-who="advisor"><Words text="make their needs visible"/></span><Words text="to the Graduate Academic Advisor?" icons={{4: advisor}}/></blockquote></div></div>;
}
