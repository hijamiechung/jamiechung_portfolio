import {ProjectList} from "@/components/ProjectList";
import styles from "./page.module.css";
export default function HomePage(){return <section className={styles.home}><div className={styles.content}>
  <header className={styles.header}><div className={styles.introduction}><h1 className={styles.heading}>Projects</h1></div></header>
  <ProjectList/>
</div></section>;}
