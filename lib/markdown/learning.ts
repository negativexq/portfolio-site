import type { LearningAreaMeta, LearningItem, Project } from "../content/types";
import { escapeMarkdown, heading, joinBlocks, renderBulletList } from "./helpers.ts";

type RenderLearningOptions = {
  headingLevel?: number;
  /** One "**Title** (status): summary" bullet per item instead of a full
   * heading + rationale + exploring/evidence/related block — used by the
   * resume aggregate's "Current Engineering Focus" section. */
  compact?: boolean;
};

export function renderLearningSection(
  areas: readonly LearningAreaMeta[],
  items: readonly LearningItem[],
  getProjectById: (id: string) => Project | undefined,
  websiteBase: string,
  options: RenderLearningOptions = {},
): string {
  const headingLevel = options.headingLevel ?? 2;
  const compact = options.compact ?? false;

  return areas
    .map((area) => {
      const areaItems = items.filter((item) => item.area === area.name);
      const header = joinBlocks([
        heading(headingLevel, `${escapeMarkdown(area.index)} — ${escapeMarkdown(area.name)}`),
        escapeMarkdown(area.description),
        `**Current foundation:** ${escapeMarkdown(area.foundation)}  \n**Next direction:** ${escapeMarkdown(area.direction)}`,
      ]);

      if (compact) {
        const bullets = areaItems.map((item) => {
          const status = escapeMarkdown(item.maturityLabel ?? item.status);
          const summary = escapeMarkdown(item.previewSummary ?? item.rationale);
          return `**${escapeMarkdown(item.title)}** (${status}): ${summary}`;
        });
        return joinBlocks([header, renderBulletList(bullets)]);
      }

      const itemBlocks = areaItems.map((item) => {
        const status = escapeMarkdown(item.maturityLabel ?? item.status);
        const relatedProjects = item.connectedProjectIds
          .map((id) => getProjectById(id))
          .filter((project): project is Project => Boolean(project))
          .map((project) => `[${escapeMarkdown(project.title)}](${websiteBase}/projects/${project.slug})`);

        return joinBlocks([
          heading(headingLevel + 1, `${escapeMarkdown(item.title)} (${status})`),
          escapeMarkdown(item.rationale),
          item.topics.length > 0 ? `**Exploring:** ${item.topics.map(escapeMarkdown).join(", ")}` : undefined,
          `**Evidence target:** ${escapeMarkdown(item.evidenceTarget)}`,
          relatedProjects.length > 0 ? `**Related projects:** ${relatedProjects.join(", ")}` : undefined,
        ]);
      });

      return joinBlocks([header, itemBlocks.join("\n\n")]);
    })
    .join("\n\n");
}
