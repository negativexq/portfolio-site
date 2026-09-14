import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { SupportingLabGroup } from "@/lib/content/types";
import { StatusBadge } from "./status-badge";

type SupportingLabGroupCardProps = {
  group: SupportingLabGroup;
};

export function SupportingLabGroupCard({ group }: SupportingLabGroupCardProps) {
  return (
    <article className="project-card project-card-compact lab-group-card" data-reveal data-hover-lift>
      <div className="project-card-meta">
        <span>Supporting work</span>
        <StatusBadge status="current" label="Completed series" />
      </div>
      <div className="project-card-body">
        <p className="project-category">{group.theme}</p>
        <h3>{group.title}</h3>
        <p className="project-summary">{group.summary}</p>
        <ol className="lab-progression" aria-label={`${group.title} progression`}>
          {group.labs.map((lab, index) => (
            <li className="lab-progression-item" key={lab.repo}>
              <span className="lab-progression-index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div>
                <div className="lab-progression-heading">
                  <span className="proof-scope">{lab.label}</span>
                  <strong>{lab.repo}</strong>
                </div>
                <p>{lab.description}</p>
                <a className="lab-progression-link" href={lab.githubUrl} target="_blank" rel="noreferrer">
                  GitHub <ArrowUpRight aria-hidden="true" size={13} />
                  <span className="sr-only"> for {lab.repo} (opens in a new tab)</span>
                </a>
              </div>
            </li>
          ))}
        </ol>
      </div>
      {group.githubUrl ? (
        <div className="project-card-actions">
          {/* Matches every other project card's first action in text and
              markup so it renders at the same width, holding GitHub at the
              same offset — see .lab-group-actions-spacer. */}
          <span className="lab-group-actions-spacer" aria-hidden="true">
            View case study <ArrowRight size={15} />
          </span>
          <a href={group.githubUrl} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight aria-hidden="true" size={14} />
            <span className="sr-only"> for {group.title} (opens in a new tab)</span>
          </a>
        </div>
      ) : null}
    </article>
  );
}
