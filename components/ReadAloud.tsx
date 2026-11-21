"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styles from "./ReadAloud.module.css";
const subscribe = () => () => {};
export function ReadAloud() {
  const available = useSyncExternalStore(subscribe, () => "speechSynthesis" in window, () => false);
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "playing" | "paused">("idle");
  const [message, setMessage] = useState("");
  const generation = useRef(0);
  const current = useRef<SpeechSynthesisUtterance | null>(null);
  useEffect(() => () => {
    generation.current++;
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [pathname]);
  function stop() {
    generation.current++;
    window.speechSynthesis.cancel();
    current.current = null;
    setState("idle");
    setMessage("");
  }
  function start() {
    const container = document.querySelector("[data-reading-content]");
    if (!container) return;
    // Read visible content in document order, excluding controls and navigation.
    const copy = container.cloneNode(true) as HTMLElement;
    copy.querySelectorAll('nav, button, video, audio, [data-read-aloud], [aria-hidden="true"], [hidden], #next-project').forEach(el => el.remove());
    copy.querySelectorAll("br").forEach(el => el.replaceWith(document.createTextNode(" ")));
    const blocks = Array.from(copy.querySelectorAll("h1, h2, h3, p, dt, dd, li, figcaption, blockquote"))
      .filter(el => !el.parentElement?.closest("p, li, blockquote, figcaption"))
      .map(el => el.textContent?.replace(/\s+/g, " ").trim() ?? "").filter(Boolean);
    const chunks = blocks.flatMap(text => text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text]);
    if (!chunks.length) { setMessage("No written content is available to read."); return; }
    stop();
    const run = generation.current;
    const synth = window.speechSynthesis;
    setState("playing"); setMessage("Reading written content. Videos are not narrated.");
    function speak(index: number) {
      if (run !== generation.current) return;
      if (index >= chunks.length) { setState("idle"); setMessage("Finished reading."); return; }
      const utterance = new SpeechSynthesisUtterance(chunks[index]);
      utterance.lang = "en-US";
      const voice = synth.getVoices().find(voice => voice.lang.startsWith("en") && voice.localService) ?? synth.getVoices().find(voice => voice.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      current.current = utterance;
      utterance.onend = event => {
        if (run !== generation.current) return;
        if (event.elapsedTime === 0 && chunks[index].trim().length > 10) {
          setState("idle"); setMessage("Your browser could not play a voice. Try another browser or use your screen reader.");
          return;
        }
        speak(index + 1);
      };
      utterance.onerror = () => { if (run === generation.current) { setState("idle"); setMessage("Audio is unavailable. Try again or use your screen reader."); } };
      synth.speak(utterance);
    }
    speak(0);
  }
  const icon = (d: string) => <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true"><path d={d} fill="currentColor" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/></svg>;
  const PLAY = "M3 1.5v9l7.5-4.5z", PAUSE = "M2.5 1.5h2.5v9H2.5zM7 1.5h2.5v9H7z", STOP = "M2 2h8v8H2z";
  return <div className={styles.reader} data-read-aloud="true">
    {state === "idle" ? <button disabled={!available} onClick={start}>{icon(PLAY)}Listen to this page</button> : <>
      <button onClick={() => { if (state === "playing") { window.speechSynthesis.pause(); setState("paused"); setMessage("Paused."); } else { window.speechSynthesis.resume(); setState("playing"); setMessage("Reading."); } }}>{state === "playing" ? <>{icon(PAUSE)}Pause</> : <>{icon(PLAY)}Resume</>}</button>
      <button onClick={stop}>{icon(STOP)}Stop</button>
    </>}
    <span role="status">{available ? message : "Read aloud is unavailable in this browser. You can use a screen reader."}</span>
  </div>;
}
