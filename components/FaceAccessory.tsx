import styles from "./FaceAccessory.module.css";

// Shared with ProfileFace (resume page) and DancingCharacter (offline page) — same
// accessory set, same pixel-art coordinates, so the crew reads as the same cast of
// characters in both places.
export const ACCESSORIES = ["none", "cap", "mohawk", "roundGlasses", "spoonSunglasses", "headphones"] as const;
export type Accessory = typeof ACCESSORIES[number];
export const ACCESSORY_LABEL: Record<Accessory, string> = {
  none: "Default", cap: "Cap", mohawk: "Mohawk", roundGlasses: "Round glasses",
  spoonSunglasses: "Spoon sunglasses", headphones: "Headphones",
};

export function FaceAccessory({ accessory }: { accessory: Accessory }) {
  if (accessory === "none") return null;
  return (
    <svg className={styles.layer} viewBox="0 0 40 40" aria-hidden="true" shapeRendering="crispEdges">
      {accessory === "cap" && (
        <g className={styles.fill}>
          <rect x="15" y="-7" width="10" height="3" />
          <rect x="11" y="-4" width="18" height="3" />
          <rect x="9" y="-1" width="22" height="3" />
          <rect x="4" y="1" width="10" height="2" />
        </g>
      )}
      {accessory === "mohawk" && (
        <g className={styles.fill}>
          <rect x="13" y="-2" width="5" height="3" />
          <rect x="14" y="-4" width="3" height="2" />
          <rect x="17" y="-3" width="6" height="4" />
          <rect x="18" y="-7" width="4" height="4" />
          <rect x="22" y="-2" width="5" height="3" />
          <rect x="24" y="-4" width="3" height="2" />
        </g>
      )}
      {accessory === "roundGlasses" && (
        <g className={styles.stroke}>
          <circle cx="13.5" cy="15.5" r="4" />
          <circle cx="26.5" cy="15.5" r="4" />
          <line x1="17.5" y1="15.5" x2="22.5" y2="15.5" />
          <line x1="9.5" y1="14" x2="5" y2="12" />
          <line x1="30.5" y1="14" x2="35" y2="12" />
        </g>
      )}
      {accessory === "spoonSunglasses" && (
        <g className={styles.fill}>
          <ellipse cx="13.5" cy="15.5" rx="5" ry="3.8" />
          <ellipse cx="26.5" cy="15.5" rx="5" ry="3.8" />
          <rect x="18.5" y="14.5" width="3" height="1.6" />
          <rect x="6" y="12" width="3.5" height="1.6" />
          <rect x="30.5" y="12" width="3.5" height="1.6" />
        </g>
      )}
      {accessory === "headphones" && (
        <g className={styles.fill}>
          <rect x="14" y="-6" width="12" height="3" />
          <rect x="9" y="-4" width="6" height="3" />
          <rect x="25" y="-4" width="6" height="3" />
          <rect x="6" y="-2" width="3" height="14" />
          <rect x="31" y="-2" width="3" height="14" />
          <rect x="1" y="10" width="6" height="10" rx="2" />
          <rect x="33" y="10" width="6" height="10" rx="2" />
        </g>
      )}
    </svg>
  );
}
