import {ProjectList} from "@/components/ProjectList";
import styles from "./page.module.css";
import {FooterStroll} from "@/components/experiments/FooterStroll";
const ENABLE_FOOTER_STROLL = true;
export default function HomePage(){return <><section className={styles.home}><div className={styles.content}>
  <header className={styles.header}><div className={styles.introduction}>
    <h1 className={styles.heading}>I untangle complex systems<br/>for the people living inside them.</h1>
    <p className={styles.description}>I&rsquo;m drawn to the moments when system logic stops matching how&nbsp;people actually work, decide, remember, and relate to one another.</p>
  </div></header>
  <ProjectList/>
</div></section>
  {ENABLE_FOOTER_STROLL && <FooterStroll/>}
  <footer className={styles.footer}>© {new Date().getFullYear()} Jamie Chung</footer>
</>;}
