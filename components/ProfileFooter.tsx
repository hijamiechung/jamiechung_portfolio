"use client";
import {useEffect,useRef,useState} from "react";
import {LineIcon} from "./LineIcon";
import {ConnectPopover} from "./ConnectPopover";
import styles from "./ProfileFooter.module.css";
export function ProfileFooter() {
  const [open,setOpen]=useState(false);
  const container=useRef<HTMLDivElement>(null);
  const trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    if(!open) return;
    function outside(e:PointerEvent) {if(!container.current?.contains(e.target as Node)) setOpen(false);}
    function escape(e:KeyboardEvent) {if(e.key==="Escape") {setOpen(false);trigger.current?.focus();}}
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[open]);
  return <div className={styles.footer} ref={container}>
    <div className={styles.connect}>
      <button ref={trigger} className={styles.connectButton} aria-label="Connect" aria-expanded={open} aria-controls="connect-links" onClick={()=>setOpen(!open)}><span className={styles.icon}><LineIcon name="connect"/></span><span className={styles.label}>Connect</span></button>
      {open && <ConnectPopover/>}
    </div>
    <div className={styles.identity} aria-disabled="true" title="Ask Jamie is being prepared">
      <span className={styles.avatar}>JC</span><span className={styles.identityText}><span className={styles.name}>Jamie Chung</span><span className={styles.role}>Product Designer</span></span>
    </div>
  </div>;
}
