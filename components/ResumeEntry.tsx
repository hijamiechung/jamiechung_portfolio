"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { LineIcon } from "./LineIcon";
import styles from "@/app/resume/page.module.css";

type Bullet = string | { text: string; link: { href: string; label: string } };

export type Entry = {
  org: string;
  dates: string;
  place: string;
  title: string;
  detail?: string;
  /** Path under /public to the organization's logo; leave unset to show the empty placeholder tile. */
  logo?: string;
  /** "contain" fits a wide logo to the tile width instead of cropping it; "inset" also adds breathing room (e.g. round seals). */
  logoFit?: "contain" | "inset";
  bullets?: Bullet[];
  body?: string;
};

function renderBullet(b: Bullet) {
  if (typeof b === "string") return b;
  const at = b.text.indexOf(b.link.label);
  return <>{b.text.slice(0, at)}<a className={styles.projectLink} href={b.link.href} target="_blank" rel="noopener noreferrer" aria-label={`${b.link.label} (opens in a new tab)`}>{b.link.label}<LineIcon name="arrow" /></a>{b.text.slice(at + b.link.label.length)}</>;
}

/* The page reads as a timeline; the evidence bullets stay collapsed until the row is opened. */
export function ResumeEntry({ entry }: { entry: Entry }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const expandable = Boolean(entry.bullets?.length || entry.body);

  return (
    <div className={styles.entry} data-open={open || undefined}>
      <div className={styles.entryOrg}>
        <span className={styles.logo} aria-hidden="true">{entry.logo && <Image src={entry.logo} alt="" width={44} height={44} unoptimized data-fit={entry.logoFit} />}</span>
        <div className={styles.orgText}>
          <h3>{entry.org}</h3>
          <span className={styles.meta}>{entry.dates}</span>
          {/* A long place ("Institution · City") is split onto separate lines so it never crowds the role column. */}
          {entry.place.split(" · ").map(part => <span key={part} className={styles.meta}>{part}</span>)}
        </div>
      </div>
      <div className={styles.entryRole}>
        {expandable ? (
          <button type="button" className={styles.entryToggle} aria-expanded={open} aria-controls={panel} onClick={() => setOpen(o => !o)}>
            <span className={styles.roleTitle}>{entry.title}</span>
            <svg className={styles.chevron} width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
          </button>
        ) : <p className={styles.roleTitle}>{entry.title}</p>}
        {entry.detail && <p className={styles.topic}>{entry.detail}</p>}
        {expandable && (
          <div id={panel} className={styles.entryPanel} inert={!open}>
            <div className={styles.entryPanelInner}>
              {entry.body && <p>{entry.body}</p>}
              {entry.bullets && <ul>{entry.bullets.map((b, i) => <li key={i}>{renderBullet(b)}</li>)}</ul>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
