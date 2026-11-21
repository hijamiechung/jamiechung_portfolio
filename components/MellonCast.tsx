import Image from "next/image";
import styles from "./MellonCast.module.css";

const cast = [
  {src: "/images/mellon/advisor.png", width: 225, height: 224, name: "Graduate academic advisor", side: "advisor", thought: "I want to meet students’ needs, but the same questions keep coming in."},
  {src: "/images/mellon/student.png", width: 216, height: 250, name: "Student", side: "student", thought: "Why isn’t anyone giving me the information I need?"},
] as const;

// Each figure shows what it expects on hover or focus. The thought is an illustration, not an interview quote; it stays in
// the accessibility tree (described-by) so it is not hover-only.
export function MellonCast() {
  return <div className={styles.cast}>{cast.map(person => <figure key={person.side} className={`${styles.person} ${styles[person.side]}`} tabIndex={0} aria-describedby={`mellon-thought-${person.side}`}>
    <div className={styles.float}>
      <span id={`mellon-thought-${person.side}`} className={styles.thought} role="note">{person.thought}</span>
      <Image src={person.src} width={person.width} height={person.height} alt="" className={styles.avatar}/>
    </div>
    <figcaption>{person.name}</figcaption>
  </figure>)}</div>;
}
