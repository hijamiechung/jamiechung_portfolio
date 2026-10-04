"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {track} from "@vercel/analytics";
import {projects} from "@/lib/projects";
import {archive} from "@/lib/archive";
import {LineIcon} from "./LineIcon";
import styles from "./SidebarNavSection.module.css";

export function SidebarNavSection() {
  const [expanded,setExpanded] = useState(true);
  const [archiveExpanded,setArchiveExpanded] = useState(false);
  const pathname = usePathname();
  return <>
    <div className={styles.row}>
      <Link href="/" className={styles.rowLink} aria-label="Projects"><span className={styles.icon}><LineIcon name="project" /></span><span className={styles.label}>Projects</span></Link>
      <button className={styles.chevronButton} aria-label={expanded ? "Collapse Projects" : "Expand Projects"} aria-expanded={expanded} aria-controls="project-navigation" onClick={()=>setExpanded(!expanded)}><LineIcon name="chevron" className={expanded ? styles.chevronExpanded : undefined}/></button>
    </div>
    <div className={styles.childrenWrapper} data-expanded={expanded} inert={!expanded} id="project-navigation">
      <ul className={styles.children}>{projects.map(p=><li key={p.id}><Link href={`/projects/${p.id}`} aria-current={pathname===`/projects/${p.id}` ? "page" : undefined}>{p.title}</Link></li>)}</ul>
    </div>
    <button className={styles.row} aria-label="Archive" aria-expanded={archiveExpanded} aria-controls="archive-navigation" onClick={()=>setArchiveExpanded(!archiveExpanded)}>
      <span className={styles.rowLink}><span className={styles.icon}><LineIcon name="archive"/></span><span className={styles.label}>Archive</span></span>
      <span className={styles.chevronButton}><LineIcon name="chevron" className={archiveExpanded ? styles.chevronExpanded : undefined}/></span>
    </button>
    <div className={styles.childrenWrapper} data-expanded={archiveExpanded} inert={!archiveExpanded} id="archive-navigation">
      <ul className={styles.children}>{archive.map(a=><li key={a.id}><Link href={`/archive/${a.id}`} title={a.blurb} aria-current={pathname===`/archive/${a.id}` ? "page" : undefined} onClick={()=>track("archive_click",{target:a.title})}>{a.title}</Link></li>)}</ul>
    </div>
  </>;
}
