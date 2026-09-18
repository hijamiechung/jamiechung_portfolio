"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { LineIcon } from "../LineIcon";
import { WeatherIcon } from "./WeatherIcon";
import { createEnvField, fetchEnv, phaseFor, clockFor } from "./environment.mjs";
import styles from "./PrototypeExperience.module.css";

function subscribeDOM(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.body, {childList: true, subtree: true});
  return () => observer.disconnect();
}
function useTarget(id: string) {
  return useSyncExternalStore(subscribeDOM, () => document.getElementById(id), () => null);
}
function subscribePreferences(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("portfolio-preferences", callback);
  return () => {window.removeEventListener("storage", callback); window.removeEventListener("portfolio-preferences", callback);};
}
function read(key: string, fallback: string) {try {return localStorage.getItem(key) ?? fallback;} catch {return fallback;}}
function save(key: string, value: string) {try {localStorage.setItem(key,value);} catch {} window.dispatchEvent(new Event("portfolio-preferences"));}
type Source = "pittsburgh" | "mine";
export type Environment = {label: string; cond: string; code: string; phase: string; windDir: number; windSpeed: number; tz?: string; weatherCode?: number; solarDays?: {date: string; sunrise?: string; sunset?: string}[]};
export type FieldFactory = (canvas: () => HTMLCanvasElement | null, options: {reduced: boolean; density: number; thinning: boolean; integration: string; rects: () => {cards: DOMRect[]}}) => {
  setEnv: (env: Environment) => void; setMouse: (x: number, y: number) => void; resize: () => void; stop: () => void;
};
const initial: Environment = {label:"PITTSBURGH",cond:"—",code:"clear",phase:"day",windDir:270,windSpeed:4};

export function PrototypeExperience({fieldFactory = createEnvField, fieldClassName = "", weatherRefreshMs}: {fieldFactory?: FieldFactory; fieldClassName?: string; weatherRefreshMs?: number}) {
  const controls = useTarget("appearance-controls");
  const header = useTarget("environment-control");
  const pathname = usePathname();
  const storedTheme = useSyncExternalStore(subscribePreferences, () => read("jc-theme","dark"), () => "dark");
  const theme = storedTheme === "light" ? "light" : "dark";
  const [source,setSource] = useState<Source>("pittsburgh");
  const [env,setEnv] = useState(initial);
  const [tray,setTray] = useState(false);
  const canvas = useRef<HTMLCanvasElement>(null);
  const trayRef = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const latestEnvironment = useRef(env);
  const field = useRef<ReturnType<FieldFactory> | null>(null);

  useEffect(() => {document.documentElement.dataset.theme = theme; field.current?.resize(); return () => {delete document.documentElement.dataset.theme;};}, [theme]);
  useEffect(() => {
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    function start() {
      field.current?.stop();
      field.current=fieldFactory(() => canvas.current, {reduced:media.matches,density:1,thinning:true,integration:"ground",rects:()=>({cards:Array.from(document.querySelectorAll('a[aria-label^="View "]')).map(el=>el.getBoundingClientRect())})});
      field.current.setEnv(latestEnvironment.current);
    }
    start();
    const move=(e:PointerEvent)=>field.current?.setMouse(e.clientX,e.clientY);
    const leave=()=>field.current?.setMouse(-9999,-9999);
    const resize=()=>field.current?.resize();
    window.addEventListener("pointermove",move); document.addEventListener("pointerleave",leave); window.addEventListener("resize",resize); media.addEventListener("change",start);
    return ()=>{field.current?.stop();field.current=null;window.removeEventListener("pointermove",move);document.removeEventListener("pointerleave",leave);window.removeEventListener("resize",resize);media.removeEventListener("change",start);};
  }, [fieldFactory]);
  useEffect(() => {latestEnvironment.current=env; field.current?.setEnv(env);}, [env]);
  useEffect(() => {
    let abort: AbortController | null = null, active=true;
    let timeout: ReturnType<typeof setTimeout> | undefined, refresh: ReturnType<typeof setTimeout> | undefined;
    const update=(next:Environment)=>{if(active) setEnv(next);};
    async function weather(lat:number,lon:number,tz:string|undefined,label:string) {
      abort = new AbortController();
      timeout = setTimeout(()=>abort?.abort(),10000);
      try {const result=await fetchEnv(lat,lon,tz,abort.signal);update({...result,label,phase:phaseFor(clockFor(result.tz).hour)});}
      catch {update({...initial,label,cond:"NO SIGNAL",code:"clouds",tz,phase:phaseFor(clockFor(tz).hour)});}
      finally {
        clearTimeout(timeout);
        if(active && weatherRefreshMs) refresh=setTimeout(()=>void weather(lat,lon,tz,label),weatherRefreshMs);
      }
    }
    if(source==="mine") {
      Promise.resolve().then(()=>update({...initial,label:"MY LOCATION",cond:"LOCATING"}));
      if(navigator.geolocation) navigator.geolocation.getCurrentPosition(p=>{if(active) void weather(p.coords.latitude,p.coords.longitude,undefined,"MY LOCATION");},()=>update({...initial,label:"MY LOCATION",cond:"PERMISSION DENIED",code:"clouds"}),{timeout:9000});
      else Promise.resolve().then(()=>update({...initial,label:"MY LOCATION",cond:"UNAVAILABLE"}));
    } else void weather(40.4406,-79.9959,"America/New_York","PITTSBURGH");
    const clock=setInterval(()=>setEnv(current=>({...current,phase:phaseFor(clockFor(current.tz).hour)})),20000);
    return ()=>{active=false;abort?.abort();clearTimeout(timeout);clearTimeout(refresh);clearInterval(clock);};
  },[source,weatherRefreshMs]);
  useEffect(()=>{
    if(!tray) return;
    trayRef.current?.querySelector<HTMLButtonElement>('[aria-pressed="true"]')?.focus();
    const outside=(e:PointerEvent)=>{if(!trayRef.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node))setTray(false);};
    const escape=(e:KeyboardEvent)=>{if(e.key==="Escape"){setTray(false);trigger.current?.focus();}};
    document.addEventListener("pointerdown",outside);document.addEventListener("keydown",escape);
    return ()=>{document.removeEventListener("pointerdown",outside);document.removeEventListener("keydown",escape);};
  },[tray]);
  const display = (value: string) => value.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  const unavailable = ["—", "LOCATING", "NO SIGNAL", "UNAVAILABLE", "PERMISSION DENIED"].includes(env.cond);
  return <>
    <canvas ref={canvas} className={`${styles.field} ${fieldClassName}`} aria-hidden="true"/>
    {controls && createPortal(<div className={styles.controls}>
      <button type="button" role="switch" aria-checked={theme==="dark"} aria-label="Appearance" title={theme==="dark" ? "Dark" : "Light"} className={styles.themeToggle} onClick={()=>save("jc-theme", theme==="dark" ? "light" : "dark")}>
        <span className={styles.themeThumb} aria-hidden="true"/>
        <span className={styles.themeTrackIcon} data-side="light"><LineIcon name="sun"/></span>
        <span className={styles.themeTrackIcon} data-side="dark"><LineIcon name="moon"/></span>
      </button>
    </div>,controls)}
    {header && pathname === "/" && createPortal(<div className={styles.environment}>
      <div className={styles.trayWrap}>
        <button ref={trigger} className={styles.cartridge} aria-label={`Change location: ${display(env.label)}, ${display(env.cond)}`} aria-expanded={tray} aria-controls="environment-options" onClick={()=>setTray(!tray)}>
          <WeatherIcon className={styles.weatherSymbol} code={env.code} phase={env.phase} weatherCode={env.weatherCode} unavailable={unavailable}/>
          <span className={styles.readout} aria-live="polite"><span>{display(env.label)}</span><span className={styles.separator} aria-hidden="true">·</span><span>{display(env.cond)}</span></span>
          <LineIcon name="chevron" className={styles.chevron}/>
        </button>
        {tray && <div ref={trayRef} className={styles.tray} id="environment-options" role="group" aria-label="Environment sources">{([['pittsburgh','PITTSBURGH'],['mine','MY LOCATION']] as const).map(([id,label])=><button key={id} aria-pressed={source===id} onClick={()=>{setSource(id);setTray(false);trigger.current?.focus();}}><span>{display(label)}</span><span className={styles.selectionMark} aria-hidden="true">{source===id ? "✓" : ""}</span></button>)}</div>}
      </div>
    </div>,header)}
  </>;
}
