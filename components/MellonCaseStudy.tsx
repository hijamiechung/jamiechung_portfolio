import Link from "next/link";
import { MellonResearch } from "./MellonResearch";
import { MellonProblem } from "./MellonProblem";
import { MellonChapter } from "./MellonChapter";
import { MellonEntrance } from "./MellonEntrance";
import { MellonHmw } from "./MellonHmw";
import { MellonSpeaker } from "./MellonSpeaker";
import type { Project } from "@/lib/projects";
import { LineIcon } from "./LineIcon";
import { BackPixelIcon } from "./BackPixelIcon";
import { ProjectContents } from "./ProjectContents";
import { MellonThumbnail } from "./MellonThumbnail";
import { ProjectTransition } from "./ProjectTransition";
import artwork from "./ProjectArtwork.module.css";
import shared from "@/app/projects/[slug]/page.module.css";
import styles from "./MellonCaseStudy.module.css";
import brief from "./MellonBrief.module.css";

const sections = ["Overview", "Problem", "Research", "Insights", "Solution"].map(label => ({id:label.toLowerCase().replaceAll(" ", "-"), label}));
function Section({label, children}: {label:string; children:React.ReactNode}) {
  return <section id={label.toLowerCase().replaceAll(" ", "-")} className={styles.section}><MellonChapter label={label}/><div className={styles.sectionBody}>{children}</div></section>;
}
export function MellonCaseStudy({next}: {next:Project}) {
  return <section className={`${shared.page} ${styles.page}`}><article className={styles.body} data-reading-content data-mellon-study><MellonEntrance/>
    <Link href="/" className={shared.back}><LineIcon name="back"/>Projects</Link>
    <header id="overview" className={styles.header}><h1>Mellon</h1><div className={brief.introduction}><p className={styles.statementText}>Students miss their advisor’s emails, and their questions rarely reach her. Mellon, an AI assistant in Gmail, turns school emails into action cards and sends students’ questions to her dashboard.</p><ul className={brief.tags} aria-label="Project categories"><li>Service design</li><li>Human–AI interaction</li><li>Education</li></ul></div></header>
    <ProjectTransition id="mellon"><div className={`${shared.hero} ${artwork.mellon} ${styles.hero}`} aria-hidden="true"><MellonThumbnail/></div></ProjectTransition>
    <div className={brief.brief} data-entrance>
      <dl className={brief.details}>
        <div><dt>Timeline</dt><dd>11 weeks · Fall 2026</dd></div>
        <div><dt>Team</dt><dd>3-person team</dd></div>
        <div><dt>Tools</dt><dd>Figma, Claude for rapid prototyping</dd></div>
        <div className={brief.role}><dt>My role</dt><dd>UX research, System mapping, UI and prototype. Designed the advisor dashboard screens and logic.</dd></div>
      </dl>
    </div>

    <Section label="Problem"><MellonProblem/><MellonHmw/></Section>
    <Section label="Research"><div className={styles.researchLead}><h2>To find out why, I started by mapping one orientation event and interviewing three students and their academic advisor.</h2><div><p>I traced where each piece of information came from, how it reached students, and what they did with it.</p><dl className={styles.researchFacts}><div><dt>Student interviews</dt><dd>3</dd></div><div><dt>Advisor interview</dt><dd>1</dd></div><div><dt>Student survey responses</dt><dd>12</dd></div></dl></div></div><MellonResearch/></Section>
    <Section label="Insights"><div className={styles.insight}><div className={styles.insightIntro}><h2>Emailing the advisor feels like too much for a small question, so students let it go.</h2><p>In the survey, <strong>4&nbsp;of&nbsp;12</strong> students said their question wasn’t important enough, and <strong>4&nbsp;of&nbsp;12</strong> said they didn’t want to bother her.</p></div><blockquote className={`${styles.advisorQuote} ${styles.fromAdvisor}`}><div className={styles.bubble}><p>I’m never really sure if they understand my email responses.</p><cite>Academic advisor, Donna</cite></div><div className={styles.speakerGroup}><MellonSpeaker who="advisor" size={96}/><span>Advisor</span></div></blockquote></div><div className={styles.insight}><div className={styles.insightIntro}><h2>Students and the advisor judge an email’s importance differently.</h2><p>The advisor marks each email Important or FYI based on academic timing. But even with an Important label, students skipped emails that didn’t apply to them or didn’t need action right now.</p></div><blockquote className={`${styles.advisorQuote} ${styles.fromStudent}`}><div className={styles.bubble}><p>Honestly, when an email says ‘Important,’ I still can’t tell if it’s important to me.</p><cite>Student interviewee 2: Crystal, new student</cite></div><div className={styles.speakerGroup}><MellonSpeaker who="student" size={96}/><span>Student</span></div></blockquote></div></Section>
    <Section label="Solution"><h2>Where It Lives</h2><div className={styles.options}>{[
      ["A separate school hub", "Another place to check, more work for the advisor."],
      ["Slack", "Already existed, but it was barely used."],
      ["Q&A inside each email", "Students would have to open every email first."],
      ["Gmail inbox workspace", "Students already check email here"],
    ].map(([title, body]) => <div key={title} data-entrance><h3>{title}</h3><p>{body}</p></div>)}</div></Section>
    <figure className={styles.teamVideo}><iframe src="https://player.vimeo.com/video/1248267845?autopause=0&app_id=58479" title="Mellon project video by Team Shadyside" loading="lazy" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen/></figure>
    <Link href={`/projects/${next.id}`} className={shared.next} id="next-project"><span><small>Next project</small><strong>{next.title}</strong></span><span className={shared.nextArrow}><BackPixelIcon/></span></Link>
  </article><ProjectContents sections={[...sections,{id:"next-project",label:"Next project"}]}/></section>;
}
