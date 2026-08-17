import { learningAreas } from "@/data/learning-areas";
import { learningItems } from "@/data/learning";
import { profile } from "@/data/profile";
import { getProjectById } from "@/data/projects";
import { joinBlocks } from "@/lib/markdown/helpers";
import { renderLearningSection } from "@/lib/markdown/learning";

export const dynamic = "force-static";

export function GET() {
  const body = joinBlocks([
    `# ${profile.name} — Learning & Engineering Directions`,
    renderLearningSection(learningAreas, learningItems, getProjectById, profile.links.website),
  ]);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
