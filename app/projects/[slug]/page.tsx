import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { BackPixelIcon } from "@/components/BackPixelIcon";
import { ProjectContents } from "@/components/ProjectContents";
import styles from "./page.module.css";
import { MemorythreadCaseStudy } from "@/components/MemorythreadCaseStudy";
import { GuidelightCaseStudy } from "@/components/GuidelightCaseStudy";
export function generateStaticParams() {return projects.map(p=>({slug:p.id}));}
export async function generateMetadata({params}: {params:Promise<{slug:string}>}) {
  const {slug}=await params;
  return {title:`${projects.find(p=>p.id===slug)?.title ?? "Project"} — Jamie Chung`};
}
export default async function ProjectPage({params}: {params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const index=projects.findIndex(p=>p.id===slug);
  if(index<0) notFound();
  const project=projects[index], next=projects[(index+1)%projects.length];
  if (slug === "guidelight") return <GuidelightCaseStudy next={next}/>;
  if (slug === "memorythread") return <MemorythreadCaseStudy next={next}/>;
  const sections=[{id:"overview",label:"Overview"},...project.sections.map((s,i)=>({id:`section-${i}`,label:s.label})),{id:"next-project",label:"Next project"}];
  return <section className={styles.page}><div className={styles.body}>
    <Link className={styles.back} href="/"><BackPixelIcon/>Projects</Link>
    <div className={styles.overview} id="overview"><span className={styles.label}>{project.tag}</span><h1>{project.title}</h1><p className={styles.lede}>{project.lede}</p></div>
    <dl className={styles.metadata}>{project.meta.map(m=><div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}</dl>
    <div className={styles.hero} aria-hidden="true"/><p className={styles.caption}>Prototype content — project details and final imagery pending verification.</p>
    <div className={styles.sections}>{project.sections.map((s,i)=><section key={s.label} id={`section-${i}`} className={styles.section}><span className={styles.label}>{s.label}</span><div><h2>{s.heading}</h2><p>{s.body}</p></div></section>)}</div>
    <div className={styles.images} aria-hidden="true"><div/><div/></div>
    <Link href={`/projects/${next.id}`} className={styles.next} id="next-project"><span><small>Next project</small><strong>{next.title}</strong></span><span className={styles.nextArrow}><BackPixelIcon/></span></Link>
  </div><ProjectContents key={slug} sections={sections}/>
  </section>;
}
