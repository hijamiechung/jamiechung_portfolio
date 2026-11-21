"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./GuidelightSystemMap.module.css";

function Person({ x, y }: { x: number; y: number }) {
  return <g transform={`translate(${x} ${y})`} fill="none" stroke="currentColor" strokeWidth="1.5"><circle cy="-8" r="6"/><path d="M-12 13v-5a12 12 0 0 1 24 0v5M-6 5v8M6 5v8"/></g>;
}

export function GuidelightSystemMap() {
  const root = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    if (root.current) observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  return <div ref={root} className={styles.root} data-paused={paused || !visible}>
    <figure className={styles.figure}>
      <figcaption><span>THE CURRENT SUPPORT PROCESS</span><span>AS-IS · INTERVIEW FINDINGS</span></figcaption>
      <h3>One person keeps the connections moving.</h3>
      <div className={styles.scroll} tabIndex={0} aria-label="Support network diagram; scroll horizontally if needed">
        <svg className={styles.map} viewBox="0 0 840 470" role="img" aria-labelledby="guidelight-map-title guidelight-map-description">
          <title id="guidelight-map-title">Manual coordination and limited visibility in the support network</title>
          <desc id="guidelight-map-description">Teachers identify needs and discuss support with the school team. The HCV site manager contacts guardians for consent and coordinates referrals and booking. Guardians and students access community services. The site manager relies on guardian updates and cannot directly confirm service attendance with providers. Moving dots illustrate communication, not actual case progress.</desc>
          <g className={styles.connections} fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M195 150H290"/><path d="M420 105V69H195"/>
            <path d="M550 150H650"/><path d="M650 177H550"/>
            <path d="M745 218V324H650"/>
            <path className={styles.uncertain} d="M550 324H420V218"/>
          </g>
          <g className={styles.node}>
            <rect x="25" y="28" width="170" height="80" rx="8"/><Person x={53} y={66}/><text x="77" y="62">Support team</text><text x="77" y="82" className={styles.small}>Discuss needs</text>
            <rect x="25" y="120" width="170" height="98" rx="8"/><Person x={53} y={163}/><text x="77" y="155">Teacher</text><text x="77" y="176" className={styles.small}>Identify a need</text><text x="77" y="193" className={styles.small}>in the classroom</text>
          </g>
          <g className={styles.manager}>
            <rect x="290" y="105" width="260" height="113" rx="8"/>
            <Person x={322} y={145}/><text x="349" y="143">HCV site manager</text>
            <path d="M310 165H530"/>
            <text x="310" y="187" className={styles.small}>Contact · Consent · Referral</text><text x="310" y="204" className={styles.small}>Booking · Follow-up</text>
          </g>
          <g className={styles.node}>
            <rect x="650" y="105" width="170" height="113" rx="8"/><Person x={676} y={144}/><text x="698" y="142">Guardian</text><text x="670" y="179" className={styles.small}>Give consent</text><text x="670" y="198" className={styles.small}>Share updates</text>
            <rect x="650" y="277" width="170" height="100" rx="8"/><Person x={676} y={314}/><text x="698" y="312">Student +</text><text x="698" y="331">provider</text><text x="670" y="358" className={styles.small}>Access services</text>
          </g>
          <g className={styles.annotations}>
            <text x="225" y="137">Need</text><text x="575" y="137">Contact</text><text x="575" y="199">Reply</text>
            <text x="735" y="250" textAnchor="end">Booking &amp; service access</text>
            <rect x="277" y="292" width="286" height="64" rx="6"/>
            <text x="295" y="316">?  Attendance not directly visible</text>
            <text x="295" y="338" className={styles.small}>Staff rely on guardian updates.</text>
          </g>
          <g className={styles.signals} aria-hidden="true"><circle r="4" className={styles.need}/><circle r="4" className={styles.contact}/><circle r="4" className={styles.reply}/></g>
          <g className={styles.caption}><path d="M25 409H820"/><text x="25" y="438">01 / MANUAL COORDINATION</text><text x="420" y="438">02 / LIMITED VISIBILITY</text></g>
        </svg>
      </div>
      <div className={styles.legend}><span><i/>Communication</span><span><i className={styles.dashed}/>Limited visibility</span><button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused}>{paused ? "Play motion" : "Pause motion"}</button></div>
      <p className={styles.note}>Illustrative communication only · not a live case or confirmed progress.</p>
    </figure>
    <div className={styles.findings}>
      <div><span>01</span><h3>Staff had to keep each step moving</h3><p>Contacting guardians, obtaining consent, and coordinating appointments involved separate online and offline interactions, each requiring staff follow-up.</p></div>
      <div><span>02</span><h3>Limited visibility into service use</h3><p>Staff depended on guardian updates to know whether a family had booked or used a service. Ms. T could not contact providers directly to confirm attendance.</p></div>
    </div>
    <p>We focused on HCV site managers, who needed a way to see each case’s progress and identify the steps still requiring attention.</p>
  </div>;
}
