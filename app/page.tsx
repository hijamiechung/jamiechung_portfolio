import {ProjectList} from "@/components/ProjectList";
import styles from "./page.module.css";
export default function HomePage(){return <section className={styles.home}><div className={styles.content}>
  <header className={styles.header}><div className={styles.introduction}>
    <h1 className={styles.heading}>I untangle complex systems for the people living inside them.</h1>
    <p className={styles.description}>I&rsquo;m especially interested in the parts of human life those systems struggle to represent.</p>
  </div></header>
  <ProjectList/>
</div></section>;}
