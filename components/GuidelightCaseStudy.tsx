import { GuidelightProblemFlow } from "./GuidelightProblemFlow";
import { GuidelightSupportNetwork } from "./GuidelightSupportNetwork";
import Link from "next/link";
import Image from "next/image";
import interviewPhoto1 from "@/public/images/guidelight/interview_photo1.png";
import interviewPhoto2 from "@/public/images/guidelight/interview_photo2.png";
import type { Project } from "@/lib/projects";
import { BackPixelIcon } from "./BackPixelIcon";
import { ProjectContents } from "./ProjectContents";
import shared from "@/app/projects/[slug]/page.module.css";
import { GuidelightHomeCarousel } from "./GuidelightHomeCarousel";
import { GuidelightHero } from "./GuidelightHero";
import styles from "./GuidelightCaseStudy.module.css";

const sections = ["Overview", "Background", "Research", "Problem", "Solution", "Reflection"].map(label => ({id: label.toLowerCase(), label}));



function DiagramCard({title, children}: {title: string; children: React.ReactNode}) {
  return <div className={styles.diagramCard}><strong>{title}</strong><p>{children}</p></div>;
}

export function GuidelightCaseStudy({next}: {next: Project}) {
  return <section className={`${shared.page} ${styles.page}`}><article className={styles.body}>
    <Link className={shared.back} href="/"><BackPixelIcon/>Projects</Link>
    <header id="overview" className={styles.header}>
      <h1>Guidelight</h1><p>A mobile-first tool connecting students and families with community support.</p>
    </header>
    <GuidelightHero/>
    <div className={styles.intro}>
      <div className={styles.lede}><p>School staff coordinated support across<br/>separate systems, phone calls, and emails.</p><p>We designed a mobile prototype that brings<br/>support requests, guardian consent,<br/>and appointment coordination together<br/>so staff can see where each case stands<br/>and what to do next.</p></div>
      <dl className={styles.metadata}>
        <div><dt>Timeline</dt><dd>2026</dd></div>
        <div><dt>For</dt><dd>Homewood Children’s Village (HCV)<br/>CMU design studio · 0→1 product design</dd></div>
        <div><dt>Team</dt><dd>2 designers · 1 researcher</dd></div>
        <div><dt>My role</dt><dd>Product designer<br/>Wireframes, information architecture, final UI</dd></div>
        <div><dt>Status</dt><dd>Interactive prototype · Not launched</dd></div>
      </dl>
    </div>

    <section id="background" className={styles.section}>
      <span className={styles.label}>Background</span><div className={styles.reading}><h2>Supporting students beyond the classroom</h2><p>Students need more than academic support to participate fully in school. Through the Full-Service Community Schools (FSCS) model, HCV connects schools with community organizations to help students and families access these resources.</p></div>
    </section>
    <section id="research" className={styles.section}>
      <span className={styles.label}>Research</span><div className={styles.sectionBody}>
        <h2>Understanding the current support network</h2>
        <div className={styles.researchLayout}><div className={styles.researchIntro}><p>We first researched the FSCS model to understand HCV’s role. Schools serve as hubs for student and family support, while HCV site managers coordinate resources and services between school staff and community organizations.</p></div>
        <GuidelightSupportNetwork/></div>
        <div className={styles.interview}><div className={styles.reading}><h3>Learning from the site manager</h3><p>We interviewed Ms. T, an HCV site manager at Pittsburgh Faison K–5. We asked how students’ needs were identified, how families were connected with services, and how staff contacted guardians and followed up.</p></div>
          <figure className={styles.interviewPhotos}>
            <div className={styles.photoPair}>
              <Image src={interviewPhoto1} alt="The team interviewing Ms. T at Pittsburgh Faison K–5" sizes="360px"/>
              <Image src={interviewPhoto2} alt="Three project team members outside Pittsburgh Faison K–5" sizes="300px"/>
            </div>
            <figcaption>Field research at Pittsburgh Faison K–5.</figcaption>
          </figure>
        </div>
      </div>
    </section>
    <section id="problem" className={styles.section}>
      <span className={styles.label}>Problem</span><div className={styles.sectionBody}>
        <h2>Fragmented steps, limited visibility</h2><p>The interview revealed two difficulties in connecting students with support.</p>
        <GuidelightProblemFlow/>
      </div>
    </section>
    <section id="solution" className={`${styles.section} ${styles.solution}`}>
      <span className={styles.label}>Solution</span><div className={styles.sectionBody}>
        <div className={styles.reading}><h2>Bring support steps together and keep cases moving</h2><p>The prototype brings service matching, guardian contact, consent, and appointment coordination into one place. Status summaries, cases without recent updates, and checklists help staff keep track of what needs to happen next.</p><p>Following the mobile-first brief, we designed for staff working away from their desks. Confirming actual service use remained future work.</p></div>
        <div className={styles.decision}><div className={styles.decisionIntro}><span>01</span><h2>Make the home screen a starting point for action</h2><p>Home helps staff decide what to do next, while Case List provides a complete view of their cases.</p></div><GuidelightHomeCarousel/></div>
        <div className={`${styles.decision} ${styles.pair}`}>
          <figure className={styles.diagram}><figcaption>One student, separate support cases</figcaption><small>Information structure · illustrative records</small><div className={styles.entryPaths}><DiagramCard title="Student list">Find a student</DiagramCard><DiagramCard title="Service’s student list">Select a linked student</DiagramCard></div><div className={styles.arrows} aria-hidden="true">↓　　　　　　　 ↓</div><DiagramCard title="Same student profile">Name, grade, guardian contact</DiagramCard><span aria-hidden="true">↓ Individual support cases</span><DiagramCard title="Case A · Counseling">Service selected · Consent required</DiagramCard><DiagramCard title="Case B · Transport support">Service not selected · Service unassigned</DiagramCard><small>Each case holds its own status, assigned staff member, and latest update.</small></figure>
          <div className={styles.decisionIntro}><span>02</span><h2>Track each support need as its own case</h2><p>A student could be waiting for consent for one service and an appointment for another. We gave each support case its own status so staff could track them independently.</p><p>I kept shared student information in the profile and support-specific details in each case. Both the student list and a service’s student list lead to the same profile.</p><p className={styles.note}>Unassigned students need support but have not yet been connected to a service.</p></div>
        </div>
        <div className={`${styles.decision} ${styles.pair}`}>
          <div className={styles.decisionIntro}><span>03</span><h2>Connect guardian communication, consent, and scheduling</h2><p>I wanted guardians to keep using familiar calls and messages without downloading another app. With the team, I brought those steps together for site managers.</p><p>Staff choose Call, Text, or Email from a case. Once the guardian agrees, the manager selects “Confirm consent,” moving the case to “Scheduling required.” Staff can then coordinate a time and share appointment details.</p></div>
          <figure className={styles.diagram}><figcaption>From contact to confirmed consent</figcaption><small>Example: the guardian gives consent</small><DiagramCard title="1 · Contact guardian">Site manager chooses Call, Text, or Email</DiagramCard><span aria-hidden="true">↓</span><DiagramCard title="2 · Guardian gives consent">Respond by phone, text, or email</DiagramCard><span aria-hidden="true">↓</span><DiagramCard title="3 · Confirm consent">Site manager reviews and confirms consent</DiagramCard><span aria-hidden="true">↓</span><DiagramCard title="Scheduling required">Coordinate an appointment → Share details</DiagramCard><small>Contact alone does not confirm consent. Actual service use remains outside this prototype.</small></figure>
        </div>
      </div>
    </section>
    <section id="reflection" className={styles.section}><span className={styles.label}>Reflection</span><div className={styles.reflections}>
      <div><h2>Deciding what belonged to the student and what belonged to the case</h2><p>The harder part was deciding which information belonged in a student profile and which belonged in an individual case. I learned to review how staff would reach that information from different screens, alongside the content of each screen.</p></div>
      <div><h2>Guardians did not need to use the staff’s app</h2><p>Centralizing staff coordination did not mean moving every participant into the same tool. We designed a shared place for staff to manage consent and appointments while guardians continued using familiar calls and messages.</p></div>
      <div><h2>Client feedback</h2><p>At the final presentation, Walter Lewis valued letting guardians participate by text, starting a connection from either a student or a service, and recording informal requests as cases or tasks. He also noted that different services require different consent and documentation checks.</p></div>
      <div><h2>What remains to be tested</h2><p>The project ended at the prototype stage. We did not test whether it reduced workload or made the guardian flow easier to use.</p><p>Next, I would test whether staff can find the right case and complete consent and scheduling tasks, whether they confuse statuses across services, and whether guardians understand the messages. Recurring and resumed cases, service-specific consent, and confirmation of actual service use remain open questions.</p></div>
    </div></section>
    <Link href={`/projects/${next.id}`} className={shared.next} id="next-project"><span><small>Next project</small><strong>{next.title}</strong></span><span className={shared.nextArrow}><BackPixelIcon/></span></Link>
  </article><ProjectContents sections={sections}/></section>;
}
