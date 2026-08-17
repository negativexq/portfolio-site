import type { EngineeringArea } from "../content/types";
import { escapeMarkdown, heading, joinBlocks, renderBulletList } from "./helpers.ts";

type RenderSkillsOptions = {
  headingLevel?: number;
  /** One "**Area:** tech, tech, tech" bullet per area instead of a full
   * heading + description + list block — used by the resume aggregate. */
  compact?: boolean;
};

export function renderSkillsSection(areas: readonly EngineeringArea[], options: RenderSkillsOptions = {}): string {
  const headingLevel = options.headingLevel ?? 2;

  if (options.compact) {
    return renderBulletList(
      areas.map((area) => `**${escapeMarkdown(area.title)}:** ${area.technologies.map(escapeMarkdown).join(", ")}`),
    );
  }

  return areas
    .map((area) =>
      joinBlocks([
        heading(headingLevel, escapeMarkdown(area.title)),
        escapeMarkdown(area.description),
        renderBulletList(area.technologies.map(escapeMarkdown)),
      ]),
    )
    .join("\n\n");
}
