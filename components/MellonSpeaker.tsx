// Small static portraits of the two characters from the Problem animations (advisor: blue, glasses;
// student: green, graduation cap), used as the speaker beside an interview quote.
export function MellonSpeaker({ who, className, size = 64 }: { who: "student" | "advisor"; className?: string; size?: number }) {
  const advisor = who === "advisor";
  const id = `mellon-speaker-${who}`;
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor={advisor ? "#A9D9F9" : "#DCEFA2"} />
          <stop offset="1" stopColor={advisor ? "#4A98DF" : "#8CB454"} />
        </linearGradient>
      </defs>
      <circle cx="24" cy="25" r="21" fill={`url(#${id})`} />
      <ellipse cx="17" cy="26" rx="6.2" ry="7" fill="#fff" />
      <ellipse cx="31" cy="26" rx="6.2" ry="7" fill="#fff" />
      <ellipse cx="18" cy="28" rx="3.2" ry="4" fill="#111" />
      <ellipse cx="32" cy="28" rx="3.2" ry="4" fill="#111" />
      {advisor ? (
        <g fill="none" stroke="#232C45" strokeWidth="1.6" strokeLinecap="round">
          <path d="M10.5 27.5h12.5c0 4-2.8 6.5-6.2 6.5s-6.3-2.5-6.3-6.5z" />
          <path d="M25 27.5h12.5c0 4-2.8 6.5-6.2 6.5S25 31.5 25 27.5z" />
          <path d="M23 27.5h2M10.5 27l-3-1.2M37.5 27l3-1.2" />
        </g>
      ) : (
        <g>
          <path d="M11 21l6-1.5M37 21l-6-1.5" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" />
          <g transform="translate(0 -3.5)">
          <path d="M17.5 8.5v4.5c0 1.8 2.9 3 6.5 3s6.5-1.2 6.5-3V8.5z" fill="#1A1A1A" />
          <path d="M10.5 8L24 3l13.5 5L24 13z" fill="#1A1A1A" />
          <path d="M24 8l11.5.5V16" fill="none" stroke="#F2B544" strokeWidth="1.400" strokeLinecap="round" />
          <circle cx="35.5" cy="17.5" r="1.5" fill="#F2B544" />
        </g>
        </g>
      )}
    </svg>
  );
}
