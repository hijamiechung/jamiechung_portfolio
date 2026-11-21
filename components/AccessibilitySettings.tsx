"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import styles from "./AccessibilitySettings.module.css";

let memory: string | null = null;
function snapshot() {
  try { return localStorage.getItem("jc-reading") ?? memory ?? (localStorage.getItem("jc-a11y") === "boost" ? "large:high" : "default:normal"); }
  catch { return memory ?? "default:normal"; }
}
function subscribe(update: () => void) {
  window.addEventListener("storage", update);
  window.addEventListener("reading-preferences", update);
  return () => { window.removeEventListener("storage", update); window.removeEventListener("reading-preferences", update); };
}
export function AccessibilitySettings() {
  const value = useSyncExternalStore(subscribe, snapshot, () => "default:normal");
  const [size, contrast] = value.split(":");
  const dialog = useRef<HTMLDialogElement>(null);
  function save(next: string) {
    memory = next;
    try { localStorage.setItem("jc-reading", next); } catch {}
    window.dispatchEvent(new Event("reading-preferences"));
  }
  useEffect(() => {
    document.documentElement.dataset.textSize = ["large", "larger"].includes(size) ? size : "default";
    document.documentElement.dataset.contrast = contrast === "high" ? "high" : "normal";
  }, [size, contrast]);
  return <div className={styles.root}>
    <button className={styles.trigger} aria-label="Accessibility settings" title="Accessibility settings" aria-haspopup="dialog" onClick={() => dialog.current?.showModal()}><span aria-hidden="true">Aa</span></button>
    <dialog ref={dialog} className={styles.panel} aria-labelledby="reading-title" onClick={event => { if (event.target === dialog.current) dialog.current.close(); }}>
      <div className={styles.heading}><h2 id="reading-title">Accessibility</h2><button autoFocus onClick={() => dialog.current?.close()}>Close</button></div>
      <fieldset><legend>Text size</legend><div className={styles.options}>{[["default", "Default"], ["large", "Large · 125%"], ["larger", "Larger · 150%"]].map(([id, label]) => <button key={id} aria-pressed={size === id} onClick={() => save(`${id}:${contrast}`)}>{label}</button>)}</div></fieldset>
      <button className={styles.contrast} role="switch" aria-checked={contrast === "high"} onClick={() => save(`${size}:${contrast === "high" ? "normal" : "high"}`)}>High contrast <span>{contrast === "high" ? "On" : "Off"}</span></button>
      <p>Applies across the portfolio. Use “Listen to this page” on project pages to hear the written content.</p>
      <button onClick={() => save("default:normal")}>Reset settings</button>
    </dialog>
  </div>;
}
