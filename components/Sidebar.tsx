"use client";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LineIcon } from "./LineIcon";
import { SidebarNavSection } from "./SidebarNavSection";
import { ProfileFooter } from "./ProfileFooter";
import styles from "./Sidebar.module.css";
export function Sidebar({brand}: {brand?: ReactNode}) {
  const [collapsed, setCollapsed] = useState(false);
  return <aside className={styles.sidebar} aria-label="Primary" data-collapsed={collapsed}>
    <div className={styles.header}>
      <Link href="/" className={styles.logo} aria-label="Jamie Chung — home" aria-hidden={collapsed} tabIndex={collapsed ? -1 : undefined}>{brand ?? "J"}<span className={styles.logoName}>Jamie Chung</span></Link>
      <button className={styles.tabButton} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}><LineIcon name="panel" /></button>
    </div>
    <nav className={styles.nav}><SidebarNavSection /></nav>
    <ProfileFooter />
    <div id="appearance-controls" />
  </aside>;
}
