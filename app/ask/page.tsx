import { AskJamieComposer } from "@/components/AskJamieComposer";
import { IdentityMark, IDENTITY_MARK_ENABLED } from "@/components/experiments/IdentityMark";
import frozenGlass from "@/components/experiments/frozenGlass/FrozenGlass.module.css";
import styles from "./page.module.css";

const ENABLE_FROZEN_GLASS_EXPERIMENT = true;

export default function AskJamiePage() {
  const composerClassName = ENABLE_FROZEN_GLASS_EXPERIMENT ? `${styles.composerWrap} ${frozenGlass.frozen}` : styles.composerWrap;
  return <section className={styles.chat}><div className={styles.welcome}>
    <div className={styles.emptyState}><span className={styles.badge}>{IDENTITY_MARK_ENABLED ? <span className={styles.badgeMark} aria-hidden="true"><IdentityMark/></span> : <span aria-hidden="true">▪▪▪</span>}Jamie’s answers are being prepared</span><h1 className={styles.heading}>Ask Jamie</h1><p className={styles.subheading}>Anything about the work, the process, or how a decision got made.</p></div>
  </div><div className={composerClassName}><AskJamieComposer/></div></section>;
}
