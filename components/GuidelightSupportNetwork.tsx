import styles from "./GuidelightSupportNetwork.module.css";

export function GuidelightSupportNetwork() {
  return <figure className={styles.network} aria-labelledby="support-network-title">
    <figcaption id="support-network-title"><span>HCV · Full-Service Community Schools</span><strong>A network of support around each school</strong></figcaption>
    <div className={styles.schoolLabel}>HCV partner schools</div>
    <div className={styles.schools}><span>Lincoln</span><span>Faison</span><span>Westinghouse</span></div>
    <div className={styles.link} aria-hidden="true">↓</div>
    <div className={styles.school}>
      <div className={styles.schoolHeading}><strong>Inside each school</strong><span>Example: Faison K–5</span></div>
      <div className={styles.manager}><span>Coordinates support</span><strong>HCV Site Manager</strong></div>
      <div className={styles.branches} aria-hidden="true"><span/><span/><span/></div>
      <div className={styles.partners}>
        <div><span className={styles.number}>01</span><strong>School staff</strong><small>Identify student needs</small></div>
        <div><span className={styles.number}>02</span><strong>HCV programs</strong><small>Provide direct support</small></div>
        <div><span className={styles.number}>03</span><strong>Community partners</strong><small>Provide external services</small></div>
      </div>
      <div className={`${styles.branches} ${styles.converge}`} aria-hidden="true"><span/><span/><span/></div>
      <div className={styles.families}><strong>Students & families</strong><span>Access support through their school</span></div>
    </div>
    <p className={styles.note}>Site managers connect school staff, HCV programs, and community partners with students and families.</p>
  </figure>;
}
