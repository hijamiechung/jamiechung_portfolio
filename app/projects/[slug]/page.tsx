import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import { LineIcon } from "@/components/LineIcon";
import { BackPixelIcon } from "@/components/BackPixelIcon";
import { ProjectContents } from "@/components/ProjectContents";
import styles from "./page.module.css";
import { SquiggleThumbnail } from "@/components/SquiggleThumbnail";
import { MellonCaseStudy } from "@/components/MellonCaseStudy";
import artwork from "@/components/ProjectArtwork.module.css";
import { MemorythreadCaseStudy } from "@/components/MemorythreadCaseStudy";
import { GuidelightCaseStudy } from "@/components/GuidelightCaseStudy";
import { ProjectTransition } from "@/components/ProjectTransition";
import { MellonVideo } from "@/components/MellonVideo";
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
  if (slug === "mellon") return <MellonCaseStudy next={next}/>;
  if (slug === "memorythread") return <MemorythreadCaseStudy next={next}/>;
  const sections=[{id:"overview",label:"Overview"},...project.sections.map((s,i)=>({id:`section-${i}`,label:s.label})),{id:"next-project",label:"Next project"}];
  return <section className={styles.page}><div className={styles.body} data-reading-content>
    <Link className={styles.back} href="/"><LineIcon name="back" />Projects</Link>
    <div className={styles.overview} id="overview"><span className={styles.label}>{project.tag}</span><h1>{project.title}</h1><p className={styles.lede}>{project.lede}</p></div>
    <dl className={styles.metadata}>{project.meta.map(m=><div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}</dl>
    <ProjectTransition id={slug}><div className={`${styles.hero} ${(artwork as Record<string, string>)[slug] ?? ""}`} aria-hidden="true">{slug==="squiggle" && <SquiggleThumbnail/>}</div></ProjectTransition><p className={styles.caption}>Prototype content — project details and final imagery pending verification.</p>
    {slug==="squiggle" && <figure className={styles.recording}><video controls playsInline preload="metadata" poster="/images/squiggle/squiggle-poster.jpg" src="/images/squiggle/squiggle.mp4" aria-label="Squiggle screen recording"/><figcaption>Squiggle screen recording</figcaption></figure>}
    {slug==="squiggle" && <div className={styles.beats}>{[
      {file:"line_thoughts.mp4", label:"Designers leave the reasons for their choices behind in AI chats", text:["Today, designers use AI to explore ideas and make decisions. We ask questions, test possibilities, and figure out what works.","But in the process, we often leave behind the reasons for the choices we made in the chats with AI."]},
      {file:"line_ai_map.mp4", label:"Ideas and decisions spread across different AI chats", text:["If you ask AI why you made a decision, it might give you an answer, but not the actual reason behind it.","As you switch between AI tools, your ideas and decisions get spread across different chats."]},
    ].map(b=><div key={b.file} className={styles.beat}><div className={styles.beatText}>{b.text.map(t=><p key={t}>{t}</p>)}</div><MellonVideo src={`/images/squiggle/${b.file}`} label={b.label}/></div>)}</div>}
    <div className={styles.sections}>{project.sections.map((s,i)=><section key={s.label} id={`section-${i}`} className={styles.section}><span className={styles.label}>{s.label}</span><div><h2>{s.heading}</h2><p>{s.body}</p></div></section>)}</div>
    <div className={styles.images} aria-hidden="true"><div/><div/></div>
    <Link href={`/projects/${next.id}`} className={styles.next} id="next-project"><span><small>Next project</small><strong>{next.title}</strong></span><span className={styles.nextArrow}><BackPixelIcon/></span></Link>
  </div><ProjectContents key={slug} sections={sections}/>
  </section>;
}
