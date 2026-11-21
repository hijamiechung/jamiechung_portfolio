import { Analytics } from "@vercel/analytics/next";
import { OfflineBoundary } from "@/components/OfflineBoundary";
import { IdentityMark, IDENTITY_MARK_ENABLED } from "@/components/experiments/IdentityMark";
import { PrototypeExperience } from "@/components/experiments/PrototypeExperience";
import { AtmosphereExperience } from "@/components/experiments/atmosphere/AtmosphereExperience";
import type { Metadata } from "next";
import { Sidebar } from "@/components/Sidebar";
import { neueMontreal } from "./fonts";
import "./globals.css";
import styles from "./layout.module.css";

const ENABLE_ENVIRONMENT_EXPERIMENT = true;
const ENABLE_ATMOSPHERE_EXPERIMENT = true;
const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (deploymentHost ? `https://${deploymentHost}` : "http://localhost:3001");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Jamie Chung — Product Designer",
  description: "Portfolio of Jamie Chung, Product Designer.",
  openGraph: {
    title: "Jamie Chung — Product Design Portfolio",
    description: "Portfolio of Jamie Chung, Product Designer.",
    type: "website",
    siteName: "Jamie Chung",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jamie Chung — Product Design Portfolio",
    description: "Portfolio of Jamie Chung, Product Designer.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={neueMontreal.variable} suppressHydrationWarning>
      <body>
        <OfflineBoundary>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <div className={styles.shell}>
          <Sidebar brand={IDENTITY_MARK_ENABLED ? <IdentityMark /> : undefined} />
          <main id="main-content" tabIndex={-1} className={styles.main}>
            <div className={styles.content}>{children}</div>
          </main>
        </div>
        <div id="environment-control" />
        {ENABLE_ENVIRONMENT_EXPERIMENT && (ENABLE_ATMOSPHERE_EXPERIMENT ? <AtmosphereExperience /> : <PrototypeExperience />)}
        <Analytics />
        </OfflineBoundary>
      </body>
    </html>
  );
}
