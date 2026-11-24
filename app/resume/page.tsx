import Link from "next/link";
import { LineIcon } from "@/components/LineIcon";
import { ResumeEntry, type Entry } from "@/components/ResumeEntry";
import { ResumeIdentity } from "@/components/ResumeIdentity";
import styles from "./page.module.css";

export const metadata = { title: "Resume — Jamie Chung" };

const education: Entry[] = [
  { org: "Carnegie Mellon University", logo: "/logos/cmu.jpeg", dates: "Aug 2026 – May 2028", place: "Pittsburgh, PA", title: "Master of Design in Design for Interactions" },
  { org: "Carnegie Mellon University", logo: "/logos/cmu.jpeg", dates: "Aug 2025 – May 2026", place: "Pittsburgh, PA", title: "Master of Arts in Design", detail: "Merit Scholarship" },
  { org: "Kookmin University", logo: "/logos/kookmin.svg", logoFit: "inset", dates: "Mar 2013 – Feb 2018", place: "Seoul, South Korea", title: "Bachelor of Arts in Korean History and Advertising", detail: "Double Major" },
];

const experience: Entry[] = [
  {
    org: "COOCON", logo: "/logos/coocon.jpeg", dates: "May 2022 – Oct 2024", place: "Seoul, South Korea", title: "UX Designer", detail: "Financial data platform",
    bullets: [
      { text: "Restructured the home screen of Checkpay, a 100K+ MAU consumer finance app, as sole designer for its 2023 relaunch, integrating new MyData, loan comparison, and insurance comparison services into clear primary entry points.", link: { href: "https://play.google.com/store/apps/details?id=com.cp.checkpay&hl=ko", label: "Checkpay" } },
      "Led UX for a multi-bank savings comparison service, turning complex interest rates into simple filtering and comparison flows with transparent partner-bank labeling to protect user trust; passed the technical compliance review with Korea’s Financial Supervisory Service.",
      "Designed MyData asset screens aggregating data from 80+ financial institutions, adapted across the apps of 6+ clients including Samsung Card and Hanwha Life.",
      "Drove the team’s migration from Photoshop/Zeplin to Figma with reusable components and templates, enabling real-time collaboration with an offshore engineering team in Cambodia and cutting handoff-to-implementation from 3–4 days to under 1 day.",
    ],
  },
  {
    org: "ODDM", logo: "/logos/oddm.png", dates: "Jan 2018 – Aug 2019", place: "South Korea", title: "Product Manager", detail: "AdPick · Influencer marketing platform",
    bullets: [
      "Launched a blog review campaign service from 0 to 1 on a 700K+ member platform, growing it from 120 beta reviewers to 260 and turning pilot feedback into flow improvements with UX designers and planners.",
      "Matched influencers to advertiser campaigns by audience fit on a two-sided marketplace, running ~10 of ~40 monthly campaigns.",
    ],
  },
  { org: "National Museum of Korea", logo: "/logos/national-museum.svg", logoFit: "inset", dates: "Jul – Aug 2014", place: "Seoul, South Korea", title: "Intern", detail: "Department of Archaeology and History" },
];

const research: Entry[] = [
  {
    org: "Toyota Research Institute (R2i)", logo: "/logos/tri.png", dates: "Sep 2026 – Present", place: "Carnegie Mellon University · Pittsburgh, PA", title: "UX Researcher",
    detail: "Conversational AI to Support Meal Preparation for Older Adults with Cognitive Decline",
    bullets: [
      "Led in-home interviews, meal-prep observations, and 2-week photo check-ins with older adults, surfacing how they balance independence with family help during cooking.",
      "Introduced a 3D scanning workflow the team adopted and authored the home-visit protocol, standardizing data collection across 4 RAs and 4 households.",
    ],
  },
];

const leadership: Entry[] = [
  {
    org: "Carnegie Mellon University", logo: "/logos/cmu.jpeg", dates: "Sep 2026 – Present", place: "School of Design · Pittsburgh, PA", title: "Graduate Student Assembly Representative",
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
        <div className={styles.card}>
          <section aria-labelledby="education-heading" className={styles.section}>
            <h2 id="education-heading">Education</h2>
            <div id="education" className={styles.sectionBody}>
            {education.map(e => <ResumeEntry key={`${e.org}-${e.title}`} entry={e} />)}
            </div>
          </section>

          <section aria-labelledby="experience-heading" className={styles.section}>
            <h2 id="experience-heading">Experience</h2>
            <div id="experience" className={styles.sectionBody}>
            {experience.map(e => <ResumeEntry key={`${e.org}-${e.title}`} entry={e} />)}
            </div>
          </section>

          <section aria-labelledby="research-heading" className={styles.section}>
            <h2 id="research-heading">Research</h2>
            <div id="research" className={styles.sectionBody}>
            {research.map(e => <ResumeEntry key={`${e.org}-${e.title}`} entry={e} />)}
            </div>
          </section>

          <section aria-labelledby="leadership-heading" className={styles.section}>
            <h2 id="leadership-heading">Leadership</h2>
            <div id="leadership" className={styles.sectionBody}>
            {leadership.map(e => <ResumeEntry key={`${e.org}-${e.title}`} entry={e} />)}
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
