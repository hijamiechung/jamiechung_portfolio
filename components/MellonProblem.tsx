import { MellonVideo } from "./MellonVideo";
import { MellonCast } from "./MellonCast";
import styles from "./MellonProblem.module.css";

const scenes = [
  {file:"mellon-01-student-buried-transparent.webm", text:"Students lose track of their advisor’s emails\nin a crowded inbox."},
  {file:"mellon-03-little-comes-back.mp4", text:"Students rarely reach out with questions,\nso the advisor can’t tell what they need."},
];
export function MellonProblem() {
  return <><MellonCast/><div className={styles.grid}>{scenes.map((scene,index) => <div key={scene.file} className={styles.item} data-entrance>
    <div className={styles.card}><MellonVideo src={`/images/mellon/${scene.file}`} label={scene.text.replace("\n"," ")}/></div>
    <div className={styles.copy}><span className={styles.number}>{String(index + 1).padStart(2,"0")}</span><h2>{scene.text.split("\n").map((line,i) => <span key={line}>{i > 0 && <br/>}{line}</span>)}</h2></div>
  </div>)}</div></>;
}
