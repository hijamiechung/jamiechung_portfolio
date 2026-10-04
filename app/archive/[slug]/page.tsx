import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { archive } from "@/lib/archive";
import { BackPixelIcon } from "@/components/BackPixelIcon";
import { ProjectContents } from "@/components/ProjectContents";
import styles from "./page.module.css";

export function generateStaticParams() { return archive.map(a => ({ slug: a.id })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return { title: `${archive.find(a => a.id === slug)?.title ?? "Archive"} — Jamie Chung` };
}

export default async function ArchivePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = archive.findIndex(a => a.id === slug);
  if (index < 0) notFound();
  const entry = archive[index];
  const next = archive[(index + 1) % archive.length];
  const sections = [{ id: "overview", label: "Overview" }, ...entry.sections.map((s, i) => ({ id: `section-${i}`, label: s.label }))];

  return <section className={styles.page}><div className={styles.body}>
    <Link className={styles.back} href="/"><BackPixelIcon/>Archive</Link>
    <div className={styles.overview} id="overview">
      <span className={styles.label}>{entry.tag}</span>
      <h1>{entry.title}</h1>
      <p className={styles.lede}>{entry.lede}</p>
    </div>
    <dl className={styles.metadata}>{entry.meta.map(m => <div key={m.k}><dt>{m.k}</dt><dd>{m.v}</dd></div>)}</dl>
    <div className={styles.hero}>
      <Image src={entry.hero.src} alt={entry.hero.alt} fill sizes="(max-width: 1024px) 100vw, 860px" style={{ objectFit: "cover" }}/>
    </div>
    <p className={styles.caption}>Coursework and personal work from Carnegie Mellon, originally published on a separate Framer site.</p>
    <div className={styles.sections}>{entry.sections.map((s, i) => <section key={s.label} id={`section-${i}`} className={styles.section}>
      <span className={styles.label}>{s.label}</span>
      <div>
        <h2>{s.heading}</h2>
        {s.body.map((paragraph, pi) => <p key={pi}>{paragraph}</p>)}
        {s.images && s.images.length > 0 && <div className={styles.sectionImages} data-count={s.images.length}>
          {s.images.map(img => <div key={img.src} className={styles.sectionImage}>
            <Image src={img.src} alt={img.alt} width={800} height={600} sizes="(max-width: 1024px) 100vw, 300px"/>
          </div>)}
        </div>}
        {s.video && <a className={styles.videoCard} href={s.video.href} target="_blank" rel="noopener noreferrer" aria-label={`Watch "${s.video.title}" on Vimeo (${s.video.duration})`}>
          <div className={styles.videoThumb}>
            <Image src={s.video.thumbnail} alt={s.video.alt} width={800} height={450} sizes="(max-width: 1024px) 100vw, 620px"/>
            <span className={styles.playButton} aria-hidden="true"><svg viewBox="0 0 24 24" width="22" height="22"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>
          </div>
          <span className={styles.videoMeta}><span>{s.video.title}</span><span className={styles.videoDuration}>{s.video.duration} · Watch on Vimeo</span></span>
        </a>}
      </div>
    </section>)}</div>
    {entry.externalLink && <a className={styles.externalLink} href={entry.externalLink.href} target="_blank" rel="noopener noreferrer">{entry.externalLink.label}</a>}
    <Link href={`/archive/${next.id}`} className={styles.next}><span><small>Next in archive</small><strong>{next.title}</strong></span><span className={styles.nextArrow}><BackPixelIcon/></span></Link>
  </div><ProjectContents key={slug} sections={sections}/>
  </section>;
}
