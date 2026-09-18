"use client";
import { useSyncExternalStore } from "react";
import styles from "./OfflineStatus.module.css";

function subscribeToConnectivity(callback: () => void) {
  window.addEventListener("offline", callback);
  window.addEventListener("online", callback);
  return () => {
    window.removeEventListener("offline", callback);
    window.removeEventListener("online", callback);
  };
}

export function OfflineStatus() {
  const offline = useSyncExternalStore(
    subscribeToConnectivity,
    () => !navigator.onLine,
    () => false,
  );

  if (!offline) return null;
  return <span className={styles.offlinePill} role="status">Offline</span>;
}
