"use client";
import { useOnline } from "@/lib/useOnline";
import styles from "./OfflineStatus.module.css";

export function OfflineStatus() {
  const online = useOnline();
  if (online) return null;
  return <span className={styles.offlinePill} role="status">Offline</span>;
}
