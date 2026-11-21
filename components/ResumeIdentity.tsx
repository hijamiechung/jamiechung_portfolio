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
            <p className={styles.availability}><span className={styles.availabilityLabel}>Available</span><span>Summer 2027 internships</span></p>
          </div>
        </div>
        <a className={styles.download} href="/resume/jamie-chung-resume.pdf" download onClick={() => track("resume_download")}><LineIcon name="download" />Download PDF</a>
      </div>

    </>
  );
}
