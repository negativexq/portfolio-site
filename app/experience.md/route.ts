import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { joinBlocks } from "@/lib/markdown/helpers";
import { renderExperienceSection } from "@/lib/markdown/experience";

export const dynamic = "force-static";

export function GET() {
  const body = joinBlocks([
    `# ${profile.name} — Experience`,
    renderExperienceSection(experiences),
  ]);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
