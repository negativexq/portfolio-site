import { platformNodes } from "../../data/platform.ts";
import { getProjectById, projects } from "../../data/projects.ts";
import { getPublishedArticles } from "../writing/articles.ts";
import type { FaqItem, Project } from "./types.ts";

// Shared by the FAQPage JSON-LD and the visible "In short" block, so the
// structured data always matches text that is actually on the page.
export function getProjectFaqs(project: Project): readonly FaqItem[] {
  if (project.faqs && project.faqs.length > 0) return project.faqs;
  return [
    { question: `What is ${project.title}?`, answer: project.directAnswer },
    { question: `What problem does ${project.title} solve?`, answer: project.whyItExists },
  ];
}

export function getProjectRelatedWriting(projectId: string) {
  return getPublishedArticles().filter((article) => article.relatedProjects.includes(projectId));
}

export function getRelatedProjects(project: Project, { includeEvolvedFrom = false } = {}) {
  const outgoing = project.relationships.flatMap((relationship) => {
    const target = getProjectById(relationship.targetProjectId);
    return target ? [{ project: target, label: relationship.label }] : [];
  });

  const incoming = projects.flatMap((candidate) =>
    candidate.relationships
      .filter((relationship) => relationship.targetProjectId === project.id)
      // Pages that tell the evolvedFrom story as a narrative skip the duplicate link.
      .filter(() => includeEvolvedFrom || candidate.id !== project.evolvedFrom?.fromProjectId)
      .map((relationship) => ({
        project: candidate,
        label: relationship.type === "evolved-into" ? "Evolved from" : relationship.label,
      })),
  );

  return [...outgoing, ...incoming];
}

export function isPlatformProject(project: Project): boolean {
  const caseStudyPath = `/projects/${project.slug}`;
  return platformNodes.some((node) =>
    node.links.some((link) => link.href === project.githubUrl || link.href === caseStudyPath),
  );
}
