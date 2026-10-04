"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./GuidelightProblemFlow.module.css";

const steps = ["Classroom observation", "Support need identified", "Support discussed", "Guardian consent", "Referral & booking", "Service access", "Follow-up"];
const findings = [
  {title: "Staff had to keep each step moving", stages: [3, 4], detail: "Once a student’s need was identified, staff still had to contact guardians, obtain consent, and coordinate appointments. These steps involved separate online and offline interactions, each requiring staff follow-up.", range: "04–05 · Consent and booking"},
  {title: "Limited visibility into booking and service use", stages: [4, 5, 6], detail: "Staff depended on guardian updates to know whether a family had booked or used a service. Ms. T explained that she could not contact providers directly to confirm attendance.", range: "05–07 · Booking, service access, and follow-up"},
];
const roles = [
  {name: "Teacher", start: 1, end: 3, row: 1},
  {name: "HCV site manager", start: 3, end: 6, row: 1},
  {name: "Student", start: 6, end: 7, row: 1},
  {name: "HCV site manager", start: 7, end: 8, row: 1},
  {name: "Support team", start: 3, end: 4, row: 2},
  {name: "Guardian", start: 4, end: 8, row: 2},
  {name: "Service provider", start: 5, end: 7, row: 3},
];

export function GuidelightProblemFlow() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync(); media.addEventListener("change", sync);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {threshold: 0.25});
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener("change", sync); };
  }, []);
  useEffect(() => {
    if (paused || reduced || !visible) return;
    const timer = setInterval(() => { if (!document.hidden) setActive(value => 1 - value); }, 6000);
    return () => clearInterval(timer);
  }, [paused, reduced, visible]);
  const highlighted = findings[active].stages;
  return <div ref={root} className={styles.root} data-problem={active}>
    <figure className={styles.figure} id="guidelight-current-workflow">
      <figcaption>From classroom concern to community support <span>AS-IS</span></figcaption>
      <p className={styles.meta}>Overlapping roles at each stage · based on the site-manager interview</p>
      <div className={styles.scroll} tabIndex={0} aria-label="Support stages and participating roles">
        <div className={styles.chart}>
          <ol className={styles.steps}>{steps.map((title, index) => <li key={title} data-highlighted={highlighted.includes(index)} data-limited={index >= 4}><span>0{index + 1}</span><strong>{title}</strong></li>)}</ol>
          <div className={styles.roles} aria-label="Roles participating in the stages above">{roles.map(role => <div key={`${role.name}-${role.start}`} data-role={role.name === "HCV site manager" ? "manager" : role.name === "Guardian" || role.name === "Student" ? "family" : role.name === "Service provider" ? "provider" : "school"} style={{gridColumn: `${role.start} / ${role.end}`, gridRow: role.row}}>{role.name}</div>)}</div>
          <div className={styles.bands}>
            <span data-problem="0" data-active={active === 0} style={{gridColumn: "4 / 6"}}>01 · Manual coordination</span>
            <span data-problem="1" data-active={active === 1} style={{gridColumn: "5 / 8"}}>02 · Limited visibility</span>
          </div>
        </div>
      </div>
      <p className={styles.meta}>Dashed stages indicate limited visibility for the site manager. Role bars show participation, not confirmed progress.</p>
    </figure>
    <div className={styles.findings}>{findings.map((finding, index) => <div key={finding.title} className={styles.finding} data-problem={index} data-active={active === index}>
      <div className={styles.findingTop}><span>0{index + 1}</span><small className={styles.range}>{finding.range}</small></div>
      <h3>{finding.title}</h3><p>{finding.detail}</p>
    </div>)}</div>
    {!reduced && <div className={styles.playback}><span>Two gaps in the support process · 0{active + 1} / 02</span><button type="button" onClick={() => setPaused(value => !value)}>{paused ? "Play highlights" : "Pause highlights"}</button></div>}
    <p>We focused on HCV site managers, who needed a way to see each case’s progress and identify the steps still requiring attention.</p>
  </div>;
}
