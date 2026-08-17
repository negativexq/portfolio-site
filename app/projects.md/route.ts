import { goReliabilityLabs } from "@/data/go-reliability-labs";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { joinBlocks } from "@/lib/markdown/helpers";
import { renderProjectsSection, renderSupportingLabGroup } from "@/lib/markdown/projects";

export const dynamic = "force-static";

export function GET() {
  const body = joinBlocks([
    `# ${profile.name} — Projects`,
    "Machine-readable project portfolio.",
    renderProjectsSection(projects),
    "## Supporting Work",
    renderSupportingLabGroup(goReliabilityLabs),
  ]);

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
