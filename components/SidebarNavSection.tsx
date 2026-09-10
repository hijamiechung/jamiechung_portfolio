"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {projects} from "@/lib/projects";
import {LineIcon} from "./LineIcon";
import styles from "./SidebarNavSection.module.css";
export function SidebarNavSection() {
  const [expanded,setExpanded] = useState(true);
  const pathname = usePathname();
  return <>
    <div className={styles.row}>
      <Link href="/" className={styles.rowLink} aria-label="Projects"><span className={styles.icon}><LineIcon name="project" /></span><span className={styles.label}>Projects</span></Link>
      <button className={styles.chevronButton} aria-label={expanded ? "Collapse Projects" : "Expand Projects"} aria-expanded={expanded} aria-controls="project-navigation" onClick={()=>setExpanded(!expanded)}><LineIcon name="chevron" className={expanded ? styles.chevronExpanded : undefined}/></button>
    </div>
    <div className={styles.childrenWrapper} data-expanded={expanded} inert={!expanded} id="project-navigation">
      <ul className={styles.children}>{projects.map(p=><li key={p.id}><Link href={`/projects/${p.id}`} aria-current={pathname===`/projects/${p.id}` ? "page" : undefined}>{p.title}</Link></li>)}</ul>
    </div>
    <div className={styles.row} aria-disabled="true" title="Archive is being prepared"><span className={styles.icon}><LineIcon name="archive"/></span><span className={styles.label}>Archive</span></div>
  </>;
}
