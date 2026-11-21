"use client";
import {useEffect,useState} from "react";
import {ReadAloud} from "./ReadAloud";
import styles from "./ProjectContents.module.css";
export function ProjectContents({sections}: {sections:{id:string;label:string}[]}) {
  const [active,setActive]=useState("overview");
  useEffect(()=>{
    const track=()=>{
      let next=sections[0].id;
      for(const section of sections) if((document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity)<=160) next=section.id;
      setActive(next);
    };
    window.addEventListener("scroll",track,{passive:true});return ()=>window.removeEventListener("scroll",track);
  },[sections]);
  return <nav className={styles.toc} aria-label="On this page"><ul>{sections.map(s=><li key={s.id}><a href={`#${s.id}`} aria-current={active===s.id ? "location" : undefined}>{s.label}</a></li>)}</ul><ReadAloud/></nav>;
}
