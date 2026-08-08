import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { ProjectProof } from "./project-proof";
import { StatusBadge } from "./status-badge";
import { TagList } from "./tag-list";

type ProjectCardProps = {
  project: Project;
  index?: number;
  compact?: boolean;
};

export function ProjectCard({ project, index, compact = false }: ProjectCardProps) {
  return (
    <article className={`project-card${compact ? " project-card-compact" : ""}`}>
      <div className="project-card-meta">
        <span>{typeof index === "number" ? `Project / ${String(index).padStart(2, "0")}` : "Supporting work"}</span>
        <StatusBadge status={project.status} />
      </div>
      <div className="project-card-body">
        <p className="project-category">{project.category}</p>
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="project-summary">{project.summary}</p>
        <TagList
          items={project.technologies}
          limit={compact ? 4 : 5}
          label={`${project.title} technologies`}
        />
        {project.proofPoints[0] ? (
          <ProjectProof proof={project.proofPoints[0]} compact />
        ) : null}
      </div>
      <div className="project-card-actions">
        <Link href={`/projects/${project.slug}`}>
          View case study <ArrowRight aria-hidden="true" size={15} />
        </Link>
        <a href={project.githubUrl} target="_blank" rel="noreferrer">
          GitHub <ArrowUpRight aria-hidden="true" size={14} />
          <span className="sr-only"> for {project.title} (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
