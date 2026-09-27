"use client";
import { useOnline } from "@/lib/useOnline";
import styles from "./IdentityMark.module.css";
export const IDENTITY_MARK_ENABLED = true;
export function IdentityMark() {
  const online = useOnline();
  // Offline: the two colon dots (already read as the mark's "eyes") flatten into a
  // sleepy, dozing squint instead of an alarm — no connection, taking a nap. Drawn as
  // distinct rect geometry rather than a CSS scale, since a scaled 2.4px square
  // anti-aliases into near-nothing at this size.
  const eye = online
    ? { width: 2.4, height: 2.4, rx: 0.4 }
    : { width: 3.2, height: 0.9, rx: 0.45, dy: 0.75 };
  return <svg className={`${styles.mark} ${online ? "" : styles.offline}`} aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
    <rect className={styles.top} x={online ? 4 : 3.6} y={5 + (eye.dy ?? 0)} width={eye.width} height={eye.height} rx={eye.rx} fill="currentColor"/>
    <rect className={styles.bottom} x={online ? 4 : 3.6} y={10 + (eye.dy ?? 0)} width={eye.width} height={eye.height} rx={eye.rx} fill="currentColor"/>
    <path d="M15.6 4.4V12.6C15.6 14.4 14.3 15.7 12.5 15.7C11.2 15.7 10.2 15.1 9.7 14.1" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square"/>
  </svg>;
}
