"use client";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore, type ReactNode } from "react";
import { LineIcon } from "./LineIcon";
import { SidebarNavSection } from "./SidebarNavSection";
import { ProfileFooter } from "./ProfileFooter";
import styles from "./Sidebar.module.css";

function subscribeTablet(callback: () => void) {
  const media = matchMedia("(max-width: 1024px) and (min-width: 641px)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

export function Sidebar({brand}: {brand?: ReactNode}) {
  const isTablet = useSyncExternalStore(
    subscribeTablet,
    () => matchMedia("(max-width: 1024px) and (min-width: 641px)").matches,
    () => false,
  );
  const [manualCollapsed, setManualCollapsed] = useState<boolean | null>(null);
  const collapsed = manualCollapsed ?? isTablet;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setMobileOpen(false); };
    document.addEventListener("keydown", escape);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", escape); document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return <>
    <div className={styles.mobileBar}>
      <button className={styles.hamburger} aria-label={mobileOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileOpen} aria-controls="primary-sidebar" onClick={() => setMobileOpen(!mobileOpen)}><LineIcon name={mobileOpen ? "close" : "hamburger"} /></button>
      <Link href="/" className={styles.mobileLogo} aria-label="Jamie Chung — home">{brand ?? "J"}<span>Jamie Chung</span></Link>
    </div>
    {mobileOpen && <div className={styles.backdrop} onClick={() => setMobileOpen(false)} aria-hidden="true" />}
    <aside id="primary-sidebar" className={styles.sidebar} aria-label="Primary" data-collapsed={collapsed} data-mobile-open={mobileOpen}>
      <div className={styles.header}>
        <Link href="/" className={styles.logo} aria-label="Jamie Chung — home" aria-hidden={collapsed} tabIndex={collapsed ? -1 : undefined}>{brand ?? "J"}<span className={styles.logoName}>Jamie Chung</span></Link>
        <button className={styles.tabButton} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} onClick={() => setManualCollapsed(!collapsed)}><LineIcon name="panel" /></button>
      </div>
      <nav className={styles.nav}><SidebarNavSection /></nav>
      <ProfileFooter />
      <div id="appearance-controls" />
    </aside>
  </>;
}
