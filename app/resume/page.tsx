import Link from "next/link";
import { LineIcon } from "@/components/LineIcon";
import { ResumeIdentity } from "@/components/ResumeIdentity";
import styles from "./page.module.css";

export const metadata = { title: "Resume — Jamie Chung" };

const education = [
  {
    school: "Carnegie Mellon University",
    meta: "Pittsburgh, PA, USA | Aug 2025 – Expected May 2028",
    degrees: ["Master of Design in Design for Interactions (MDes)", "Master of Arts in Design (MA)"],
  },
  {
    school: "Kookmin University",
    meta: "Seoul, South Korea | May 2013 – Feb 2018",
    degrees: ["Bachelor of Arts in Korean History", "Bachelor of Arts in Advertising and Public Relations"],
  },
];

const experience = [
  {
    role: "UX Designer, COOCON (B2B Fintech SaaS)",
    meta: "Seoul, South Korea | May 2022 – Oct 2024",
    bullets: [
      "Redesigned the main experience of Checkpay, a personal finance and payments app, for its 2023 relaunch, reorganizing multiple existing financial services into a clearer entry point and iterating in Figma with PMs and engineers for a product serving 100K+ monthly active users.",
      "Led product planning and design for a savings and deposit comparison service, defining requirements, structuring the comparison experience, and coordinating with PMs, regulatory stakeholders, and a Cambodia-based development team through final implementation.",
      "Adapted a shared design system across 2 of 6 client implementations, defining client-specific UI rules, color systems, and visual styles for Checkpay and BNK.",
    ],
  },
];

const research = [
  {
    role: "Graduate Researcher, Cooking Support Research",
    meta: "Human Computer Interaction Institute, Carnegie Mellon University, Pittsburgh, PA, USA | Aug 2026 – Present",
    body: "Contributing to a Toyota Research-sponsored study exploring how technology can help older adults with mild cognitive impairment or early-stage dementia continue cooking independently, combining qualitative research with the development of technology concepts informed by real-world cooking behavior.",
  },
  {
    role: "Research Assistant",
    meta: "School of Design, Carnegie Mellon University, Pittsburgh, PA, USA | Mar 2026 – May 2026",
    body: "Mapped complex civic systems and evolved service concepts for Neighboring With, a community-mapping platform, translating them into UX flow diagrams and wireframes for stakeholders and funders.",
  },
];

const leadership = [
  {
    role: "Graduate Student Assembly Representative",
    meta: "School of Design, Carnegie Mellon University, Pittsburgh, PA, USA | Sep 2026 – Present",
    body: "Represents School of Design graduate students within the Graduate Student Assembly, planning and running student events and relaying student feedback and concerns to GSA leadership.",
  },
  {
    role: "Fellow, Block Student Fellowship on AI and Society",
    meta: "Carnegie Mellon University, Pittsburgh, PA, USA | Sep 2026 – Present",
    body: "Member of the inaugural cohort of a CMU fellowship exploring the social, political, ethical, and civic dimensions of AI; participating in a faculty-led seminar series, with an interdisciplinary team project on AI & Society.",
  },
];

const skills = [
  { label: "Software & Tools", items: ["Adobe Creative Suite", "Figma", "Framer", "Sketch", "Microsoft Suite", "Zeplin", "Claude", "Cursor"] },
  { label: "Methods", items: ["User Research", "Competitive Analysis", "Accessibility Standards", "Usability Testing", "Information Architecture", "Wireframing", "User Experience", "Interaction Design", "Prototyping", "Design Systems", "Cross-functional Collaboration"] },
];

export default function ResumePage() {
  return (
    <section className={styles.page}>
      <div className={styles.body}>
        <Link className={styles.back} href="/"><LineIcon name="back" />Home</Link>

        <ResumeIdentity />

        <div className={styles.card}>
          <section className={styles.section}>
            <h2>Education</h2>
            {education.map(e => (
              <div key={e.school} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.school}</h3><span className={styles.meta}>{e.meta}</span></div>
                <ul className={styles.plainList}>{e.degrees.map(d => <li key={d}>{d}</li>)}</ul>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Professional Experience</h2>
            {experience.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <ul>{e.bullets.map(b => <li key={b}>{b}</li>)}</ul>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Research &amp; Academic Experience</h2>
            {research.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <p>{e.body}</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Leadership &amp; Fellowship</h2>
            {leadership.map(e => (
              <div key={e.role} className={styles.entry}>
                <div className={styles.entryHeader}><h3>{e.role}</h3><span className={styles.meta}>{e.meta}</span></div>
                <p>{e.body}</p>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Skills</h2>
            {skills.map(s => (
              <div key={s.label} className={styles.skillRow}>
                <span className={styles.skillLabel}>{s.label}</span>
                <div className={styles.pills}>{s.items.map(item => <span key={item} className={styles.pill}>{item}</span>)}</div>
              </div>
            ))}
          </section>
        </div>
      </div>
    </section>
  );
}
