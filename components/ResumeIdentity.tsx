"use client";
import { track } from "@vercel/analytics";
import { LineIcon } from "@/components/LineIcon";
import { ProfileFace } from "@/components/ProfileFace";
import styles from "@/app/resume/page.module.css";

export function ResumeIdentity() {
  return (
    <>
      <div className={styles.header}>
        <div className={styles.identity}>
          <ProfileFace />
          <div className={styles.nameBlock}>
            <h1>Jamie Chung</h1>
            <p className={styles.role}>Product Designer</p>
          </div>
        </div>
        <a className={styles.download} href="/resume/jamie-chung-resume.pdf" download onClick={() => track("resume_download")}><LineIcon name="download" />Download PDF</a>
      </div>

      <div className={styles.contact}>
        <a href="mailto:hi.jamiechung@gmail.com" onClick={() => track("resume_contact_click", { target: "Email" })}><LineIcon name="envelope" />hi.jamiechung@gmail.com</a>
        <a href="https://jamiechung.design" target="_blank" rel="noopener noreferrer" onClick={() => track("resume_contact_click", { target: "Website" })}><LineIcon name="connect" />jamiechung.design</a>
        <a href="https://www.linkedin.com/in/hijamiechung/" target="_blank" rel="noopener noreferrer" onClick={() => track("resume_contact_click", { target: "LinkedIn" })}><LineIcon name="briefcase" />linkedin.com/in/hijamiechung</a>
      </div>
    </>
  );
}
