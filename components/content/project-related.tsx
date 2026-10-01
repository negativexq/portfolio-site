import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import {
  getProjectFaqs,
  getProjectRelatedWriting,
  getRelatedProjects,
  isPlatformProject,
} from "@/lib/content/project-links";

export function ProjectInShort({ project }: { project: Project }) {
  return (
    <section id="in-short" className="detail-section">
      <h2>In short</h2>
      <dl className="project-in-short">
        {getProjectFaqs(project).map((faq) => (
          <div key={faq.question}>
            <dt>{faq.question}</dt>
            <dd>{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

type ProjectRelatedProps = {
  project: Project;
  /** False on case studies that already curate their own related-writing list. */
  showWriting?: boolean;
};

export function ProjectRelated({ project, showWriting = true }: ProjectRelatedProps) {
  const writing = showWriting ? getProjectRelatedWriting(project.id) : [];
  const relatedProjects = getRelatedProjects(project, { includeEvolvedFrom: true });
  const onPlatform = isPlatformProject(project);

  if (writing.length === 0 && relatedProjects.length === 0 && !onPlatform) return null;

  return (
    <section id="related" className="detail-section">
      <h2>Related</h2>
      <div className="related-projects">
        {writing.map((article) => (
          <Link key={article.slug} href={`/writing/${article.slug}`}>
            <span>{article.readingTime} min read</span>
            <strong>{article.title}</strong>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        ))}
        {relatedProjects.map(({ project: relatedProject, label }) => (
          <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
            <span>{label}</span>
            <strong>{relatedProject.title}</strong>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        ))}
        {onPlatform ? (
          <Link href="/platform">
            <span>Platform architecture</span>
            <strong>Where {project.title} fits in the platform</strong>
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        ) : null}
      </div>
    </section>
  );
}
