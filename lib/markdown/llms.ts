import type { Profile } from "../content/types";
import type { WritingArticleSummary } from "../writing/types.ts";
import { joinBlocks } from "./helpers.ts";

// Route paths are wiring, not content — the same kind of static route list
// app/sitemap.ts already maintains for the same URLs. Nothing here
// duplicates page copy; every description is a one-line label.
const MACHINE_READABLE_RESOURCES: readonly { path: string; description: string }[] = [
  { path: "/resume.md", description: "Aggregated professional profile" },
  { path: "/projects.md", description: "Engineering projects and evidence" },
  { path: "/experience.md", description: "Professional experience" },
  { path: "/skills.md", description: "Technical skills" },
  { path: "/learning.md", description: "Current learning and engineering directions" },
  { path: "/rss.xml", description: "Published engineering notes feed" },
];

const HUMAN_ROUTES: readonly { path: string; description: string }[] = [
  { path: "/", description: "Portfolio" },
  { path: "/projects", description: "Projects" },
  { path: "/experience", description: "Professional experience" },
  { path: "/learning", description: "Engineering learning map" },
  { path: "/writing", description: "Engineering writing" },
  { path: "/graph", description: "Engineering graph" },
  { path: "/resume", description: "Resume overview" },
];

export function renderLlmsTxt(profile: Profile, articles: readonly WritingArticleSummary[] = []): string {
  const base = profile.links.website.replace(/\/$/, "");
  const listOf = (routes: readonly { path: string; description: string }[]) =>
    routes.map((route) => `- ${base}${route.path} — ${route.description}`).join("\n");

  return joinBlocks([
    `# ${profile.name}`,
    profile.positioning,
    "## Machine-readable resources",
    listOf(MACHINE_READABLE_RESOURCES),
    "## Human-readable website",
    listOf(HUMAN_ROUTES),
    articles.length > 0 ? "## Published writing" : undefined,
    articles.length > 0
      ? articles.map((article) => `- ${base}/writing/${article.slug} — ${article.description}`).join("\n")
      : undefined,
    "## External profiles",
    [`- GitHub: ${profile.links.github}`, `- LinkedIn: ${profile.links.linkedin}`].join("\n"),
  ]);
}
