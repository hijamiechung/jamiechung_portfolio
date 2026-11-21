import Link from "next/link";
import { LineIcon } from "@/components/LineIcon";
import { ResumeNavigation } from "@/components/ResumeNavigation";
import { ResumeIdentity } from "@/components/ResumeIdentity";
import styles from "./page.module.css";

export const metadata = { title: "Resume — Jamie Chung" };

const education = [
  {
    school: "Carnegie Mellon University",
    meta: "Pittsburgh, PA",
    degrees: ["Master of Design in Design for Interactions | Aug 2026 – May 2028", "Master of Arts in Design (Merit Scholarship) | Aug 2025 – May 2026"],
  },
  {
    school: "Kookmin University",
    meta: "Seoul, South Korea",
    degrees: ["Bachelor of Arts in Korean History and Advertising (Double Major) | Mar 2013 – Feb 2018"],
  },
];

const experience = [
  {
    role: "UX Designer, COOCON",
    meta: "Financial data platform · Seoul, South Korea | May 2022 – Oct 2024",
    bullets: [
      { text: "Restructured the home screen of Checkpay, a 100K+ MAU consumer finance app, as sole designer for its 2023 relaunch, integrating new MyData, loan comparison, and insurance comparison services into clear primary entry points.", link: { href: "https://play.google.com/store/apps/details?id=com.cp.checkpay&hl=ko", label: "Checkpay" } },
      { text: "Led UX for a multi-bank savings comparison service, turning complex interest rates into simple filtering and comparison flows with transparent partner-bank labeling to protect user trust; passed the technical compliance review with Korea’s Financial Supervisory Service." },
      { text: "Designed MyData asset screens aggregating data from 80+ financial institutions, adapted across the apps of 6+ clients including Samsung Card and Hanwha Life." },
      { text: "Drove the team’s migration from Photoshop/Zeplin to Figma with reusable components and templates, enabling real-time collaboration with an offshore engineering team in Cambodia and cutting handoff-to-implementation from 3–4 days to under 1 day." },
    ],
  },
  {
    role: "Product Manager, AdPick",
    meta: "Influencer marketing platform · South Korea | Jan 2018 – Aug 2019",
    bullets: [
      { text: "Launched a blog review campaign service from 0 to 1 on a 700K+ member platform, growing it from 120 beta reviewers to 260 and turning pilot feedback into flow improvements with UX designers and planners." },
      { text: "Matched influencers to advertiser campaigns by audience fit on a two-sided marketplace, running ~10 of ~40 monthly campaigns." },
    ],
  },
];

const projects = [
  {
    role: "Squiggle",
    meta: "Product Design Project (team of 3) · Design Hackathon | Oct 2026",
    bullets: [
      "Led design for a tool that turns scattered AI conversations into a searchable timeline of key project decisions, helping teams trace and retell how a project evolved; shipped as a live demo.",
    ],
  },
  {
    role: "Mellon",
    meta: "Product Design Project (team of 3) · Carnegie Mellon University | Sep 2026 – Present",
    bullets: [
      "Interviewed 3 graduate students and 1 advisor, identifying the need for two-way communication between students and academic staff rather than one-way announcements.",
      "Designed a Gmail sidebar for surfacing relevant school information and an advisor dashboard for identifying recurring student questions; built an interactive student-sidebar prototype with Claude Code in HTML/CSS/JavaScript.",
    ],
  },
];

const research = [
  {
    role: "UX Researcher, Toyota Research Institute (R2i)",
    meta: "Carnegie Mellon University · Pittsburgh, PA | Sep 2026 – Present",
    topic: "Conversational AI to Support Meal Preparation for Older Adults with Cognitive Decline",
    bullets: [
      "Led in-home interviews, meal-prep observations, and 2-week photo check-ins with older adults, surfacing how they balance independence with family help during cooking.",
      "Introduced a 3D scanning workflow the team adopted and authored the home-visit protocol, standardizing data collection across 4 RAs and 4 households.",
    ],
  },
];

const leadership = [
  {
    role: "Graduate Student Assembly Representative",
    meta: "School of Design, Carnegie Mellon University · Pittsburgh, PA | Sep 2026 – Present",
    body: "Represent ~58 graduate students and manage ~$2.9K in shared funds through a request and budget tracker I set up.",
  },
];

const skills = [
  { label: "Research", items: ["User Interviews", "Contextual Inquiry", "Field Observation", "Diary Studies", "Design Probes", "Literature Review", "Surveys", "Usability Testing", "Beta Testing", "Affinity Mapping", "Research Synthesis"] },
  { label: "Design", items: ["Product Design", "UX/UI Design", "Interaction Design", "User Flows", "Wireframing", "Prototyping", "Information Architecture", "Design Systems", "Service Design", "Product Development", "Cross-functional Collaboration", "User Feedback Analysis", "Stakeholder Management"] },
  { label: "Tools", items: ["Figma", "FigJam", "Adobe Creative Suite", "Miro", "Notion", "Claude", "Vercel"] },
];

export default function ResumePage() {
  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <Link className={styles.back} href="/"><LineIcon name="back" />Home</Link>

        <ResumeIdentity />

        <div className={styles.document}>
        <ResumeNavigation />
        <div className={styles.card}>
          <section aria-labelledby="education-heading" className={styles.section}>
            <h2 id="education-heading">Education</h2>
            <div id="education" className={styles.sectionBody}>
            {education.map(e => (
              <div key={e.school} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.school}</h3><span className={styles.meta}>{e.meta}</span></div>
                <ul className={styles.plainList}>{e.degrees.map(d => { const [name, date] = d.split(" | "); return <li key={d}>{name}&nbsp;| <span className={styles.nowrap}>{date}</span></li>; })}</ul>
              </div>
            ))}
            </div>
          </section>

          <section aria-labelledby="experience-heading" className={styles.section}>
            <h2 id="experience-heading">Experience</h2>
            <div id="experience" className={styles.sectionBody}>
            {experience.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <ul>{e.bullets.map(b => <li key={b.text}>{b.link ? <>{b.text.slice(0, b.text.indexOf(b.link.label))}<a className={styles.projectLink} href={b.link.href} target="_blank" rel="noopener noreferrer" aria-label={`${b.link.label} (opens in a new tab)`}>{b.link.label}<LineIcon name="arrow" /></a>{b.text.slice(b.text.indexOf(b.link.label) + b.link.label.length)}</> : b.text}</li>)}</ul>
              </div>
            ))}
            </div>
          </section>

          <section aria-labelledby="projects-heading" className={styles.section}>
            <h2 id="projects-heading">Projects</h2>
            <div id="projects" className={styles.sectionBody}>
            {projects.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <ul>{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
            </div>
          </section>

          <section aria-labelledby="research-heading" className={styles.section}>
            <h2 id="research-heading">Research</h2>
            <div id="research" className={styles.sectionBody}>
            {research.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <p className={styles.topic}>{e.topic}</p>
                <ul>{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
            </div>
          </section>

          <section aria-labelledby="leadership-heading" className={styles.section}>
            <h2 id="leadership-heading">Leadership</h2>
            <div id="leadership" className={styles.sectionBody}>
            {leadership.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <p>{e.body}</p>
              </div>
            ))}
            </div>
          </section>

          <section aria-labelledby="skills-heading" className={styles.section}>
            <h2 id="skills-heading">Skills</h2>
            <div id="skills" className={styles.sectionBody}>
            {skills.map(s => (
              <div key={s.label} className={styles.skillRow}>
                <span className={styles.skillLabel}>{s.label}</span>
                <div className={styles.pills}>{s.items.map(item => <span key={item} className={styles.pill}>{item}</span>)}</div>
              </div>
            ))}
            </div>
          </section>
        </div>
        </div>
      </div>
    </section>
  );
}
