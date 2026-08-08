import Link from "next/link";
import type { LearningItem } from "@/lib/content/types";
import { StatusBadge } from "./status-badge";
import { TagList } from "./tag-list";

type LearningCardProps = {
  item: LearningItem;
  projectLinks: readonly { slug: string; title: string }[];
};

export function LearningCard({ item, projectLinks }: LearningCardProps) {
  return (
    <article className={`learning-card learning-card-${item.status}`}>
      <div className="learning-card-heading">
        <h3>{item.title}</h3>
        <StatusBadge status={item.status} />
      </div>
      <p>{item.rationale}</p>
      <TagList items={item.themes} label={`${item.title} themes`} />
      {projectLinks.length > 0 ? (
        <div className="learning-connections">
          <span>Connects to</span>
          {projectLinks.map((project) => (
            <Link key={project.slug} href={`/projects/${project.slug}`}>
              {project.title}
            </Link>
          ))}
        </div>
      ) : null}
    </article>
  );
}
