import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { ProjectProof } from "./project-proof";
import { StatusBadge } from "./status-badge";
import { TagList } from "./tag-list";

type ProjectCardProps = {
  project: Project;
  compact?: boolean;
};

export function ProjectCard({ project, compact = false }: ProjectCardProps) {
  return (
    <article
      className={`project-card${compact ? " project-card-compact" : ""}${project.cardImage && !compact ? " project-card-media" : ""}`}
      data-reveal
      data-hover-lift
    >
      <div className="project-card-body">
        <p className="project-category">
          {project.category}
          {project.status !== "current" ? <StatusBadge status={project.status} /> : null}
        </p>
        <h3>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h3>
        <p className="project-summary">{project.summary}</p>
        <TagList
          items={project.technologies}
          limit={compact ? 4 : 5}
          label={`${project.title} technologies`}
        />
        {project.showCardProof !== false && (project.cardProof ?? project.proofPoints[0]) ? (
          <ProjectProof proof={project.cardProof ?? project.proofPoints[0]} compact />
        ) : null}
      </div>
      {project.cardImage && !compact ? (
        <Link
          className="project-card-shot"
          href={`/projects/${project.slug}`}
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={project.cardImage.src}
            alt={project.cardImage.alt}
            width={project.cardImage.width}
            height={project.cardImage.height}
            sizes="(max-width: 1020px) 100vw, 40vw"
          />
        </Link>
      ) : null}
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
