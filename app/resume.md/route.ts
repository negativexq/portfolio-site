import { engineeringAreas } from "@/data/engineering-areas";
import { experiences } from "@/data/experience";
import { learningAreas } from "@/data/learning-areas";
import { learningItems } from "@/data/learning";
import { profile } from "@/data/profile";
import { flagshipProjects, getProjectById } from "@/data/projects";
import { renderResumeMarkdown } from "@/lib/markdown/resume";

export const dynamic = "force-static";

export function GET() {
  const body = renderResumeMarkdown({
    profile,
    experiences,
    flagshipProjects,
    engineeringAreas,
    learningAreas,
    learningItems,
    getProjectById,
  });

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
