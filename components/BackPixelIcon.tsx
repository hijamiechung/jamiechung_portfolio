import styles from "./BackPixelIcon.module.css";

// Left-pointing arrow, drawn as a 1px-thick pixel line (not a filled block), to match
// the pixel-grid language used elsewhere on the site (the weather background) — a
// true hollow diagonal for the head (not a filled triangle, which reads as a blunt
// block at this size), rendered large enough that the diagonal steps read as a taper
// rather than scattered dots.
const BITMAP = [
  "0000000",
  "0010000",
  "0100000",
  "1111111",
  "0100000",
  "0010000",
  "0000000",
];
const COLS = BITMAP[0].length;

const CELLS = BITMAP.flatMap((row, rowIndex) =>
  [...row].flatMap((value, col) => (value === "1" ? [{ col, row: rowIndex }] : []))
);

export function BackPixelIcon({ className }: { className?: string }) {
  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(" ")}
      width="21"
      height="21"
      viewBox={`0 0 ${COLS} ${BITMAP.length}`}
      aria-hidden="true"
    >
      {CELLS.map(({ col, row }) => (
        <rect
          key={`${col}-${row}`}
          className={styles.pixel}
          x={col}
          y={row}
          width="1"
          height="1"
          style={{ "--delay": COLS - 1 - col } as React.CSSProperties}
        />
      ))}
    </svg>
  );
}
