type Props = { code: string; phase: string; weatherCode?: number; unavailable?: boolean; className?: string };

export function WeatherIcon({ code, phase, weatherCode, unavailable, className }: Props) {
  const night = phase === "night";
  const cloudy = ["clouds", "rain", "snow", "storm"].includes(code);
  const partly = weatherCode === 2;
  const sun = <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>;
  const moon = <path d="M20.4 14.1A8.5 8.5 0 0 1 9.9 3.6 8.5 8.5 0 1 0 20.4 14.1Z"/>;
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {unavailable ? <><circle cx="12" cy="12" r="8"/><path d="M9.5 9a2.5 2.5 0 0 1 5 .5c0 1.5-2.5 1.5-2.5 3M12 16h.01"/></>
      : code === "wind" ? <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2 2 0 1 1-2 2M4 17h8a2 2 0 1 1-2 2"/>
      : weatherCode === 45 || weatherCode === 48 ? <path d="M5 7h14M3 12h18M5 17h14"/>
      : cloudy ? <>
        {partly && <g transform="translate(3 -1) scale(.65)">{night ? moon : sun}</g>}
        <path d="M6 16a4 4 0 1 1 .3-8A5.5 5.5 0 0 1 17 9a3.5 3.5 0 1 1 1 7H6Z"/>
        {code === "rain" && <path d="m8 19-1 2m6-2-1 2m6-2-1 2"/>}
        {code === "storm" && <path d="m13 16-3 4h4l-2 3"/>}
        {code === "snow" && <path d="M8 20h.01M12 22h.01M17 20h.01"/>}
      </> : night ? moon : sun}
  </svg>;
}
