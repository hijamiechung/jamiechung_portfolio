"use client";
import {useRef,useState} from "react";
import {LineIcon} from "./LineIcon";
import styles from "./AskJamieComposer.module.css";
const suggestions=["How do you decide what to cut?","What happened on Mozu?","Are you available?"];
export function AskJamieComposer() {
  const [value,setValue]=useState("");
  const [attempted,setAttempted]=useState(false);
  const input=useRef<HTMLInputElement>(null);
  return <>
    <form className={styles.composer} onSubmit={e=>{e.preventDefault();setAttempted(true);}}>
      <input ref={input} className={styles.input} type="text" aria-label="Ask Jamie a question" aria-describedby="ask-status" placeholder="Ask about a project…" value={value} onChange={e=>setValue(e.target.value)}/>
      <button type="submit" className={styles.send} disabled={!value.trim()} aria-label="Send question"><LineIcon name="send"/></button>
    </form>
    <div className={styles.suggestions}>{suggestions.map(q=><button key={q} onClick={()=>{setValue(q);input.current?.focus();}}>{q}</button>)}</div>
    <p className={styles.note} id="ask-status" role="status">{attempted ? "Answers aren’t connected yet. You can reach Jamie through Connect." : "Preview only — answers aren’t connected yet. Nothing here is saved."}</p>
  </>;
}
