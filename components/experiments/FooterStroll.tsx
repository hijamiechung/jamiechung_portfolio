"use client";

import { useEffect, useRef, useState } from "react";
import { ACCESSORIES, FaceAccessory } from "@/components/FaceAccessory";
import { DancingCharacter } from "@/components/DancingCharacter";
import styles from "./FooterStroll.module.css";

type Action = "walk" | "dance" | "coffee" | "sit";

export function FooterStroll() {
  const root = useRef<HTMLDivElement>(null);
  const [visitor, setVisitor] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [action, setAction] = useState<Action>("walk");
  const activity = useRef<Action | "menu" | "focus">("walk");
  const character = useRef<HTMLButtonElement>(null);
  const choices = useRef<HTMLDivElement>(null);

  function closeMenu() {
    setMenuOpen(false);
    activity.current = "focus";
    character.current?.focus({ preventScroll: true });
  }

  function choose(next: Action) {
    activity.current = next;
    setMenuOpen(false);
    setAction(next);
    character.current?.focus({ preventScroll: true });
  }

  useEffect(() => {
    if (action === "walk") return;
    const timer = window.setTimeout(() => {
      activity.current = "walk";
      setAction("walk");
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [action]);

  useEffect(() => {
    if (!menuOpen) return;
    choices.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const dismiss = (event: PointerEvent) => {
      if (event.target instanceof Node && !choices.current?.contains(event.target) && !character.current?.contains(event.target)) {
        setMenuOpen(false);
        activity.current = "walk";
      }
    };
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMenuOpen(false);
        activity.current = "focus";
        character.current?.focus({ preventScroll: true });
      }
    };
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", escape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let pointer: { x: number; y: number } | null = null;
    let x = -76;
    let last = 0;
    let raf = 0;
    let jumpStart = -Infinity;
    let nextJump = 0;
    let facing = 1;
    let faceX = 4;
    let faceY = 0;
    let gait = 0;
    const cursor = element.querySelector<HTMLElement>("[data-cursor]");
    const update = () => {
      const running = visible && !document.hidden && !reduced.matches;
      element.dataset.running = String(running);
      cancelAnimationFrame(raf);
      last = 0;
      if (running) raf = requestAnimationFrame(frame);
      else if (cursor) cursor.hidden = true;
    };
    function frame(now: number) {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      const rect = element!.getBoundingClientRect();
      const target = pointer ? Math.max(0, Math.min(rect.width - 56, pointer.x - rect.left - 28)) : rect.width + 76;
      const distance = target - x;
      const free = activity.current === "walk";
      if (!free && element!.contains(document.activeElement)) x = Math.max(12, Math.min(rect.width - 68, x));
      const moving = free && Math.abs(distance) > 3;
      if (moving) facing = Math.sign(distance);
      if (moving) {
        // One phase is one 14px footfall. The torso advances between plants;
        // feet and arms use the same phase instead of independent CSS clocks.
        const advance = (phase: number) => phase - Math.sin(phase * Math.PI * 2) / (Math.PI * 2);
        const next = gait + (pointer ? 22 : 14) * dt / 14;
        const travel = (advance(next) - advance(gait)) * 14;
        x += facing * Math.min(Math.abs(distance), travel);
        gait = next;
      }
      const swing = moving ? -Math.cos(gait * Math.PI) * 22 * facing : 0;
      const lift = moving ? Math.sin(gait * Math.PI) : 0;
      element!.style.setProperty("--gait-swing", `${swing}deg`);
      element!.style.setProperty("--gait-left-lift", `${-Math.max(0, -lift) * 3}px`);
      element!.style.setProperty("--gait-right-lift", `${-Math.max(0, lift) * 3}px`);
      element!.style.setProperty("--gait-bob", `${-lift * lift * 1.5}px`);
      if (free && !pointer && x >= rect.width + 70) {
        x = -76;
        setVisitor(value => (value + 1) % ACCESSORIES.length);
      }
      const headY = rect.top + 92;
      const close = pointer && Math.abs(distance) < 44 && Math.abs(pointer.y - headY) < 110;
      if (free && close && now > nextJump) {
        jumpStart = now;
        nextJump = now + 2600;
      }
      const progress = (now - jumpStart) / 700;
      const jump = free && progress < 1 ? Math.sin(progress * Math.PI) * 30 : 0;
      element!.style.setProperty("--stroll-x", `${x.toFixed(3)}px`);
      element!.style.setProperty("--stroll-jump", `${(-jump).toFixed(3)}px`);
      const dx = pointer ? pointer.x - (rect.left + x + 28) : facing * 80;
      const dy = pointer ? pointer.y - (headY - jump) : 0;
      const dist = Math.hypot(dx, dy) || 1;
      // Same normalized gaze as ProfileFace; move the whole face as it turns.
      const reach = Math.min(dist / 40, 1) * 2.2;
      const gazeX = (dx / dist) * reach;
      const gazeY = (dy / dist) * reach;
      const smoothing = 1 - Math.exp(-dt * 10);
      faceX += ((pointer ? gazeX * 2 : facing * 4) - faceX) * smoothing;
      faceY += ((pointer ? gazeY * 1.5 : 0) - faceY) * smoothing;
      element!.style.setProperty("--face-x", `${faceX}px`);
      element!.style.setProperty("--face-y", `${faceY}px`);
      element!.style.setProperty("--look-x", `${pointer ? gazeX : 0}px`);
      element!.style.setProperty("--look-y", `${pointer ? gazeY : 0}px`);
      element!.dataset.moving = String(moving);
      element!.dataset.jumping = String(free && progress < 1);
      if (cursor && pointer) {
        cursor.hidden = !(pointer.x >= rect.left && pointer.x <= rect.right && pointer.y >= rect.top && pointer.y <= rect.bottom);
        cursor.style.transform = `translate(${pointer.x - 3}px, ${pointer.y - 3}px)`;
      }
      raf = requestAnimationFrame(frame);
    }
    const move = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      pointer = { x: event.clientX, y: event.clientY };
    };
    const leave = () => { pointer = null; if (cursor) cursor.hidden = true; };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      update();
    }, { threshold: 0.25 });
    observer.observe(element);
    window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    window.addEventListener("blur", leave);
    document.addEventListener("visibilitychange", update);
    reduced.addEventListener("change", update);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      window.removeEventListener("blur", leave);
      document.removeEventListener("visibilitychange", update);
      reduced.removeEventListener("change", update);
    };
  }, []);

  return <div ref={root} className={styles.stroll} data-running="false" data-action={action}>
    <span data-cursor className={styles.cursor} hidden />
    <div className={styles.traveler}>
      <button ref={character} type="button" className={styles.character}
        aria-label="Choose a character activity" aria-expanded={menuOpen} aria-controls={menuOpen ? "footer-activities" : undefined}
        onFocus={() => { if (activity.current === "walk") activity.current = "focus"; }}
        onBlur={event => { if (!root.current?.contains(event.relatedTarget as Node | null) && activity.current === "focus") activity.current = "walk"; }}
        onClick={() => {
          if (action !== "walk") { setAction("walk"); activity.current = "focus"; }
          if (menuOpen) closeMenu();
          else { activity.current = "menu"; setMenuOpen(true); }
        }}>
        {action === "dance" ? <DancingCharacter pose="idle" accessory={ACCESSORIES[visitor]} /> : <>
        {action === "sit" && <svg className={styles.chair} viewBox="0 0 80 80" fill="none" aria-hidden="true"><path d="M15 12V51H65M22 51V76M59 51V76" stroke="currentColor" strokeWidth="4" /></svg>}
        <div className={styles.head}>
          <svg className={styles.face} viewBox="0 0 40 40" fill="none">
            <g className={styles.eyes}>
            <rect x="12.4" y="14.2" width="2.4" height="2.4" rx=".5" fill="currentColor" />
            <rect x="24.4" y="14.2" width="2.4" height="2.4" rx=".5" fill="currentColor" />
            </g>
            <path d="M22.79 20.47V30.31C22.79 32.47 21.23 34.03 19.07 34.03C17.51 34.03 16.31 33.31 15.71 32.11" transform="rotate(90 19.25 27.25)" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <FaceAccessory accessory={ACCESSORIES[visitor]} />
          {action === "coffee" && <svg className={styles.cup} viewBox="0 0 30 42" fill="none" aria-hidden="true">
            <path className={styles.steam} d="M8 14V11H5V7H8V3M17 14V10H14V6H17V2" strokeWidth="1.5" />
            <path d="M21 22H27V31H21" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
            <path className={styles.mug} d="M3 20H22V33L19 37H6L3 33Z" stroke="currentColor" strokeWidth="2" />
            <path d="M6 22H19V25H6Z" fill="currentColor" />
            <path d="M6 28V32L8 34" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
          </svg>}
          <span className={`${styles.limb} ${styles.armLeft}`}><span /><span /></span>
          <span className={`${styles.limb} ${styles.armRight}`}><span /><span /></span>
        </div>
        <div className={styles.feet}>
          <span className={styles.limb}><span /><span /><span /></span>
          <span className={styles.limb}><span /><span /><span /></span>
        </div>
        </>}
      </button>
    </div>
    {menuOpen && <div ref={choices} id="footer-activities" className={styles.choices} role="group" aria-label="Character activities"
      onBlur={event => { if (!root.current?.contains(event.relatedTarget as Node | null)) { setMenuOpen(false); activity.current = "walk"; } }}>
      <button type="button" onClick={() => choose("dance")}>Dance</button>
      <button type="button" onClick={() => choose("coffee")}>Coffee</button>
      <button type="button" onClick={() => choose("sit")}>Sit down</button>
    </div>}
    <span className={styles.srOnly} role="status">{action === "dance" ? "Dancing" : action === "coffee" ? "Taking a coffee break" : action === "sit" ? "Sitting down to rest" : ""}</span>
  </div>;
}
