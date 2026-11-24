"use client";
import {useEffect,useMemo} from "react";
import {publishPageContents,setActivePageSection} from "@/lib/pageContents";

/* Renders nothing itself: publishes this page's sections to the sidebar tree and tracks which one is being read.
   The "Next project" link is a page-to-page jump, not a section, so it stays out of the tree. */
export function ProjectContents({sections}: {sections:{id:string;label:string}[]}) {
  const tree=useMemo(()=>sections.filter(s=>s.id!=="next-project"),[sections]);
  const key=tree.map(s=>s.id).join("|");
  useEffect(()=>{
    publishPageContents({sections:tree,active:tree[0].id});
    const track=()=>{
      let next=tree[0].id;
      for(const section of tree) if((document.getElementById(section.id)?.getBoundingClientRect().top ?? Infinity)<=window.innerHeight*0.4) next=section.id;
      setActivePageSection(next);
    };
    track();
    window.addEventListener("scroll",track,{passive:true});
    return ()=>{window.removeEventListener("scroll",track);publishPageContents(null);};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[key]);
  return null;
}
