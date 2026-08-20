import Link from "next/link";
import type { LearningItem } from "@/lib/content/types";
import { StatusBadge } from "./status-badge";
import { TagList } from "./tag-list";

type LearningCardProps = {
  item: LearningItem;
  projectLinks: readonly { slug: string; title: string }[];
  writingLinks: readonly { slug: string; title: string }[];
};

export function LearningCard({ item, projectLinks, writingLinks }: LearningCardProps) {
  return (
    <article className={`learning-card learning-card-${item.status}`} data-hover-lift>
      <div className="learning-card-heading">
        <h3>{item.title}</h3>
        <StatusBadge status={item.status} label={item.maturityLabel} />
      </div>
      <div className="learning-card-layer">
        <span className="learning-card-label">Why this matters</span>
        <p>{item.rationale}</p>
      </div>
      <div className="learning-card-layer learning-card-topics">
        <span className="learning-card-label">What I&apos;m exploring</span>
        <TagList items={item.topics} label={`${item.title} exploration topics`} />
      </div>
      <div className="learning-card-layer learning-card-evidence">
        <span className="learning-card-label">Evidence target</span>
        <p>{item.evidenceTarget}</p>
      </div>
      {projectLinks.length > 0 ? (
        <div className="learning-connections">
          <span>Adjacent evidence</span>
          {projectLinks.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          ))}
        </div>
      ) : null}
      {writingLinks.length > 0 ? (
        <div className="learning-connections">
          <span>Related writing</span>
          {writingLinks.map((article) => (
            <Link key={article.slug} href={`/writing/${article.slug}`}>
              {article.title}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
