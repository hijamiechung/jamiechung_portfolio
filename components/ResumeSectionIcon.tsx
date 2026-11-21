import { LineIcon } from "./LineIcon";

const icons = {
  education: "education",
  experience: "briefcase",
  research: "search",
  projects: "project",
  leadership: "people",
  skills: "sparkle",
} as const;

export function ResumeSectionIcon({ name, className }: { name: keyof typeof icons; className?: string }) {
  return <LineIcon name={icons[name]} className={className} />;
}
