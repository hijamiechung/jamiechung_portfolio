"use client";
import Link from "next/link";
import { track } from "@vercel/analytics";
import {LineIcon} from "./LineIcon";
import styles from "./ConnectPopover.module.css";
const links=[
  {name:"LinkedIn",meta:"in/",href:"https://www.linkedin.com/in/hijamiechung/",icon:"briefcase"},
  {name:"Medium",meta:"@jc",href:"https://medium.com/@jamie_chung",icon:"pencil"},
  {name:"Email",meta:"hi@",href:"mailto:hi.jamiechung@gmail.com",icon:"envelope"},
] as const;
export function ConnectPopover(){return <div id="connect-links" className={styles.popover} aria-label="Connect links">
  {links.map(l=><a className={styles.item} key={l.name} href={l.href} onClick={()=>track("connect_click",{target:l.name})} {...(l.href.startsWith("https:")?{target:"_blank",rel:"noopener noreferrer"}:{})}><span className={styles.icon}><LineIcon name={l.icon}/></span><span className={styles.name}>{l.name}</span><span className={styles.meta}>{l.meta}</span></a>)}
  <Link className={styles.item} href="/resume" onClick={()=>track("connect_click",{target:"Resume"})}><span className={styles.icon}><LineIcon name="document"/></span><span className={styles.name}>Resume</span></Link>
</div>;}
