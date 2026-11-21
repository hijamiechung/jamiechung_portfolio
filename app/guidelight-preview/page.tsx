import { notFound } from "next/navigation";
import { GuidelightCaseStudy } from "@/components/GuidelightCaseStudy";
import { projects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default function GuidelightPreview() {
  if (process.env.NODE_ENV !== "development") notFound();
  return <GuidelightCaseStudy next={projects[0]} />;
}
