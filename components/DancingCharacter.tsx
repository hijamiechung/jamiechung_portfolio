import { FaceAccessory, type Accessory } from "@/components/FaceAccessory";
import styles from "./DancingCharacter.module.css";

export type DancePose = "idle" | "left" | "right";

// The resume page's ":J" mark face (and its accessory cast), given simple pixel
// limbs so left/right can read as a little dance rather than just a head tilt —
// same characters as ProfileFace, just standing up.
export function DancingCharacter({ pose, accessory = "none" }: { pose: DancePose; accessory?: Accessory }) {
  return (
    <div className={`${styles.character} ${pose !== "idle" ? styles[pose] : ""}`}>
      <div className={styles.body}>
        <svg className={styles.faceSvg} viewBox="0 0 40 40" aria-hidden="true" shapeRendering="crispEdges">
          <rect x="12.4" y="14.2" width="2.4" height="2.4" rx=".5" fill="currentColor"/>
          <rect x="24.4" y="14.2" width="2.4" height="2.4" rx=".5" fill="currentColor"/>
          <path d="M22.79 20.47V30.31C22.79 32.47 21.23 34.03 19.07 34.03C17.51 34.03 16.31 33.31 15.71 32.11" transform="rotate(90 19.25 27.25)" className={styles.mouth}/>
        </svg>
        <FaceAccessory accessory={accessory}/>
        <span className={`${styles.limb} ${styles.armLeft}`}><span/><span/></span>
        <span className={`${styles.limb} ${styles.armRight}`}><span/><span/></span>
      </div>
      <div className={styles.legs}>
        <span className={`${styles.limb} ${styles.legLeft}`}><span/><span/><span/></span>
        <span className={`${styles.limb} ${styles.legRight}`}><span/><span/><span/></span>
      </div>
    </div>
  );
}
