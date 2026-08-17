import { engineeringAreas } from "@/data/engineering-areas";
import { profile } from "@/data/profile";
import { joinBlocks } from "@/lib/markdown/helpers";
import { renderSkillsSection } from "@/lib/markdown/skills";

export const dynamic = "force-static";

export function GET() {
  const body = joinBlocks([
    `# ${profile.name} — Technical Skills`,
    renderSkillsSection(engineeringAreas),
  ]);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
