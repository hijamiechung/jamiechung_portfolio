type Name = "project" | "archive" | "connect" | "panel" | "chevron" | "arrow" | "back" | "send"
  | "sun" | "moon" | "soundOn" | "soundOff" | "briefcase" | "pencil" | "envelope" | "document";
const paths: Record<Name, string> = {
  project: "M1.5 3.2c0-.6.5-1 1-1h2l1 1.2h3.9c.6 0 1 .4 1 1v4.4c0 .6-.4 1-1 1H2.5c-.5 0-1-.4-1-1V3.2z",
  archive: "M1.6 4.4h8.8M2.4 4.4v5.2c0 .5.4.9.9.9h5.4c.5 0 .9-.4.9-.9V4.4M1.6 4.4l1-2.4h6.8l1 2.4",
  connect: "M5.25 6.75a2.5 2.5 0 003.77.27l1.5-1.5a2.5 2.5 0 00-3.54-3.54l-.86.86M6.75 5.25a2.5 2.5 0 00-3.77-.27l-1.5 1.5a2.5 2.5 0 003.54 3.54l.86-.86",
  panel: "M1.5 2.6c0-.6.5-1.1 1.1-1.1h6.8c.6 0 1.1.5 1.1 1.1v6.8c0 .6-.5 1.1-1.1 1.1H2.6c-.6 0-1.1-.5-1.1-1.1V2.6z M4.4 1.7v8.6",
  chevron: "M4 2l4 4-4 4",
  arrow: "M2.2 8.6L8.6 2.2M4.4 2.2h4.2v4.2", back: "M9.4 6H2.6M5.4 3.2L2.6 6l2.8 2.8", send: "M6 10V2M2.6 5.4L6 2l3.4 3.4",
  sun: "M8.5 6a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z M6 .8v1.2M6 10v1.2M.8 6h1.2M10 6h1.2",
  moon: "M10.5 6.4a4.5 4.5 0 11-4.9-4.9 3.5 3.5 0 004.9 4.9z",
  soundOn: "M5.5 2.5L3 4.5H1v3h2l2.5 2V2.5z M6.7 4.3a2.4 2.4 0 010 3.4M8.4 2.9a5 5 0 010 6.2",
  soundOff: "M5.5 2.5L3 4.5H1v3h2l2.5 2V2.5z M7 4.4l3 3.2M10 4.4l-3 3.2",
  briefcase: "M2 4.4c0-.6.5-1 1-1h6c.5 0 1 .4 1 1v4.2c0 .6-.5 1-1 1H3c-.5 0-1-.4-1-1V4.4z M4.6 3.4V2.7c0-.4.3-.7.7-.7h1.4c.4 0 .7.3.7.7v.7M2 6.5h8",
  pencil: "M2.3 9.7l.4-2.1 5-5a1 1 0 011.4 0l.3.3a1 1 0 010 1.4l-5 5-2.1.4z M6.7 3.6l1.7 1.7",
  envelope: "M1.5 3.3c0-.5.4-.9.9-.9h7.2c.5 0 .9.4.9.9v5.4c0 .5-.4.9-.9.9H2.4c-.5 0-.9-.4-.9-.9V3.3z M1.7 3.5L6 6.6l4.3-3.1",
  document: "M3.4 1.8h3.4L8.6 3.6v6a.7.7 0 01-.7.7H3.4a.7.7 0 01-.7-.7V2.5a.7.7 0 01.7-.7z M6.8 1.8v1.8h1.8"
};
export function LineIcon({name, className}: {name: Name; className?: string}) {
  return <svg aria-hidden="true" className={className} width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={paths[name]} stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
