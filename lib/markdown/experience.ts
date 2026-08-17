import type { Experience } from "../content/types";
import { escapeMarkdown, heading, joinBlocks, renderBulletList } from "./helpers.ts";

export function renderExperienceEntry(experience: Experience, headingLevel = 2): string {
  const technologies = Array.from(new Set(experience.impacts.flatMap((impact) => impact.topics)));
  const highlights = experience.impacts.map((impact) => {
    const proofPart = impact.proof ? ` (${escapeMarkdown(impact.proof.value)})` : "";
    return `**${escapeMarkdown(impact.title)}:** ${escapeMarkdown(impact.summary)}${proofPart}`;
  });

  return joinBlocks([
    heading(headingLevel, `${escapeMarkdown(experience.company)} — ${escapeMarkdown(experience.role)}`),
    `${escapeMarkdown(experience.period)} · ${escapeMarkdown(experience.location)}`,
    escapeMarkdown(experience.summary),
    highlights.length > 0
      ? joinBlocks([heading(headingLevel + 1, "Highlights"), renderBulletList(highlights)])
      : undefined,
    technologies.length > 0
      ? joinBlocks([heading(headingLevel + 1, "Technologies"), technologies.map(escapeMarkdown).join(", ")])
      : undefined,
  ]);
}

export function renderExperienceSection(experiences: readonly Experience[], headingLevel = 2): string {
  return experiences.map((experience) => renderExperienceEntry(experience, headingLevel)).join("\n\n");
}
