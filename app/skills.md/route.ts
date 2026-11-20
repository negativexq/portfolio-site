import { engineeringAreas } from "@/data/engineering-areas";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { recruiterBrief } from "@/data/recruiter-brief";
import { joinBlocks } from "@/lib/markdown/helpers";
import { renderSkillsSection } from "@/lib/markdown/skills";

export const dynamic = "force-static";

export function GET() {
  const body = joinBlocks([
    `# ${profile.name} — Technical Skills`,
    renderSkillsSection(engineeringAreas),
    "## Skills by résumé category",
    recruiterBrief.skills
      .map((group) => {
        const usedIn = group.evidence
          .map((id) => projects.find((project) => project.id === id))
          .filter((project) => project !== undefined)
          .map((project) => `[${project.title}](${profile.links.website}/projects/${project.slug})`)
          .join(", ");
        return `- **${group.area}:** ${group.items.join(", ")}. Used in ${usedIn}.`;
      })
      .join("\n"),
  ]);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
