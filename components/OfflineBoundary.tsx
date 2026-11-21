"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useOnline } from "@/lib/useOnline";
import { OfflineScene } from "./OfflineScene";

export function OfflineBoundary({ children }: { children: ReactNode }) {
  const online = useOnline();
  const scene = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (online) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    scene.current?.querySelector<HTMLElement>("[tabindex]")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus({ preventScroll: true });
    };
  }, [online]);

  return <>
    <div style={{ visibility: online ? undefined : "hidden" }} aria-hidden={!online} inert={!online}>{children}</div>
    {!online && <div ref={scene}><OfflineScene /></div>}
  </>;
}
