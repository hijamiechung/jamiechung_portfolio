import { IdentityMark, IDENTITY_MARK_ENABLED } from "@/components/experiments/IdentityMark";
import { PrototypeExperience } from "@/components/experiments/PrototypeExperience";
import { AtmosphereExperience } from "@/components/experiments/atmosphere/AtmosphereExperience";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";
import styles from "./layout.module.css";

const ENABLE_ENVIRONMENT_EXPERIMENT = true;
const ENABLE_ATMOSPHERE_EXPERIMENT = true;

export const metadata: Metadata = {
  title: "Jamie Chung — Product Designer",
  description: "Portfolio of Jamie Chung, Product Designer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className={styles.shell}>
          <Sidebar brand={IDENTITY_MARK_ENABLED ? <IdentityMark /> : undefined} />
          <main className={styles.main}>
            <div className={styles.content}>{children}</div>
          </main>
        </div>
        <div id="environment-control" />
        {ENABLE_ENVIRONMENT_EXPERIMENT && (ENABLE_ATMOSPHERE_EXPERIMENT ? <AtmosphereExperience /> : <PrototypeExperience />)}
      </body>
    </html>
  );
}
