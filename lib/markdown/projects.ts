import type { Project, SupportingLabGroup } from "../content/types";
import { escapeMarkdown, heading, joinBlocks, renderBulletList, renderTechList } from "./helpers.ts";

export function renderProjectEntry(project: Project, headingLevel = 2): string {
  return joinBlocks([
    heading(headingLevel, escapeMarkdown(project.title)),
    escapeMarkdown(project.summary),
    `**Category:** ${escapeMarkdown(project.category)}  \n**Status:** ${escapeMarkdown(project.status)}`,
    renderTechList("Technologies", project.technologies),
    project.concepts.length > 0
      ? `**Engineering topics:**\n${renderBulletList(project.concepts.map(escapeMarkdown))}`
      : undefined,
    project.proofPoints.length > 0
      ? `**Evidence:**\n${renderBulletList(
          project.proofPoints.map((proof) => {
            const scope = proof.scope ? ` — ${escapeMarkdown(proof.scope)}` : "";
            return `${escapeMarkdown(proof.label)}: ${escapeMarkdown(proof.value)}${scope}`;
          }),
        )}`
      : undefined,
    `**Repository:** ${project.githubUrl}`,
  ]);
}

export function renderProjectsSection(projects: readonly Project[], headingLevel = 2): string {
  return projects.map((project) => renderProjectEntry(project, headingLevel)).join("\n\n");
}

/** SupportingLabGroup is intentionally not a Project (see lib/content/types.ts)
 * so it gets its own small renderer rather than being forced through
 * renderProjectEntry. */
export function renderSupportingLabGroup(group: SupportingLabGroup, headingLevel = 2): string {
  const header = joinBlocks([
    heading(headingLevel, escapeMarkdown(group.title)),
    escapeMarkdown(group.summary),
    `_${escapeMarkdown(group.theme)}_`,
  ]);
  const labs = group.labs
    .map(
      (lab, index) =>
        `${index + 1}. **${escapeMarkdown(lab.label)} — ${escapeMarkdown(lab.repo)}**  \n   ${escapeMarkdown(lab.description)}  \n   ${lab.githubUrl}`,
    )
    .join("\n\n");
  return joinBlocks([header, labs]);
}
