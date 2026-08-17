import type {
  EngineeringArea,
  Experience,
  LearningAreaMeta,
  LearningItem,
  Profile,
  Project,
} from "../content/types";
import { renderExperienceSection } from "./experience.ts";
import { escapeMarkdown, heading, joinBlocks, renderBulletList } from "./helpers.ts";
import { renderLearningSection } from "./learning.ts";
import { renderProjectsSection } from "./projects.ts";
import { renderSkillsSection } from "./skills.ts";

type RenderResumeInput = {
  profile: Profile;
  experiences: readonly Experience[];
  flagshipProjects: readonly Project[];
  engineeringAreas: readonly EngineeringArea[];
  learningAreas: readonly LearningAreaMeta[];
  learningItems: readonly LearningItem[];
  getProjectById: (id: string) => Project | undefined;
};

/** Composes the other serializers into one aggregate view — not a second
 * resume source. Every section below is the same data /experience.md,
 * /projects.md, /skills.md and /learning.md render, just recomposed and
 * (for skills/learning) shown in a shorter form. */
export function renderResumeMarkdown({
  profile,
  experiences,
  flagshipProjects,
  engineeringAreas,
  learningAreas,
  learningItems,
  getProjectById,
}: RenderResumeInput): string {
  const base = profile.links.website;

  const links = renderBulletList([
    `Website: ${base}`,
    `GitHub: ${profile.links.github}`,
    `LinkedIn: ${profile.links.linkedin}`,
    `Email: ${profile.links.email.replace(/^mailto:/, "")}`,
  ]);

  return joinBlocks([
    heading(1, escapeMarkdown(profile.name)),
    `${escapeMarkdown(profile.title)} — ${escapeMarkdown(profile.summary)}`,
    heading(2, "Experience"),
    renderExperienceSection(experiences, 3),
    heading(2, "Selected Projects"),
    renderProjectsSection(flagshipProjects, 3),
    heading(2, "Technical Skills"),
    renderSkillsSection(engineeringAreas, { compact: true }),
    heading(2, "Current Engineering Focus"),
    renderLearningSection(learningAreas, learningItems, getProjectById, base, { compact: true }),
    heading(2, "Links"),
    links,
  ]);
}
