import styles from "./MellonCaseStudy.module.css";

export function MellonChapter({label}: {label:string}) {
  return <span className={styles.chapter}>{label}</span>;
}
