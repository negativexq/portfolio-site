import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ComponentType } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import {
  KnowledgeBaseRagDiagram,
  RealTimeCommerceDiagram,
} from "@/components/content/architecture-diagram";
import { JsonLd } from "@/components/content/json-ld";
import { ProjectProof } from "@/components/content/project-proof";
import { StatusBadge } from "@/components/content/status-badge";
import { TagList } from "@/components/content/tag-list";
import { getProjectById, getProjectBySlug, projects } from "@/data/projects";

const architectureDiagrams: Record<string, ComponentType> = {
  "real-time-commerce-platform": RealTimeCommerceDiagram,
  "knowledge-base-rag": KnowledgeBaseRagDiagram,
};

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const outgoing = project.relationships
    .map((relationship) => {
      const relatedProject = getProjectById(relationship.targetProjectId);
      return relatedProject ? { project: relatedProject, label: relationship.label } : null;
    })
    .filter((item) => item !== null);

  const incoming = projects.flatMap((candidate) =>
    candidate.relationships
      .filter((relationship) => relationship.targetProjectId === project.id)
      // Already told as a full narrative in the Evolution section above —
      // skip it here so the case study doesn't say the same thing twice.
      .filter(() => candidate.id !== project.evolvedFrom?.fromProjectId)
      .map((relationship) => ({
        project: candidate,
        label: relationship.type === "evolved-into" ? "Evolved from" : relationship.label,
      })),
  );

  const relatedProjects = [...outgoing, ...incoming];
  const evolvedFromProject = project.evolvedFrom
    ? getProjectById(project.evolvedFrom.fromProjectId)
    : undefined;

  const ArchitectureDiagram = architectureDiagrams[project.slug];
  const projectUrl = `https://omerfkoc.dev/projects/${project.slug}`;
  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    "@id": `${projectUrl}#software-source-code`,
    name: project.title,
    description: project.directAnswer,
    url: projectUrl,
    codeRepository: project.githubUrl,
    programmingLanguage: project.technologies,
    author: {
      "@type": "Person",
      "@id": "https://omerfkoc.dev/#person",
      name: "Ömer Faruk Koç",
    },
  };

  const sections = [
    { id: "overview", navLabel: "Overview", kickerText: "Overview" },
    ...(ArchitectureDiagram
      ? [{ id: "architecture", navLabel: "Architecture", kickerText: "Architecture" }]
      : []),
    ...(project.evolvedFrom
      ? [{ id: "evolution", navLabel: "Evolution", kickerText: "Project evolution" }]
      : []),
    { id: "concepts", navLabel: "Concepts", kickerText: "Engineering concepts" },
    { id: "evidence", navLabel: "Evidence", kickerText: "Proof & evidence" },
    { id: "stack", navLabel: "Stack", kickerText: "Technology stack" },
    ...(project.roadmap.length > 0
      ? [{ id: "roadmap", navLabel: "Roadmap", kickerText: "Next phase" }]
      : []),
  ];
  const kicker = (id: string) => {
    const index = sections.findIndex((section) => section.id === id);
    const section = sections[index];
    return `${String(index + 1).padStart(2, "0")} / ${section.kickerText}`;
  };

  return (
    <main>
      <JsonLd data={projectJsonLd} />
      <header className="project-detail-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <div className="project-detail-meta">
          <p>{project.category}</p>
          <StatusBadge status={project.status} />
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">{project.summary}</p>
        <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
          View repository <ArrowUpRight aria-hidden="true" size={15} />
        </a>
      </header>

      <div className="container detail-layout">
        <aside className="detail-index" aria-label="Page sections">
          <span>Case study</span>
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.navLabel}
            </a>
          ))}
        </aside>

        <div className="detail-content">
          <section id="overview" className="detail-section">
            <p className="detail-kicker">{kicker("overview")}</p>
            <h2>Why it exists</h2>
            <p>{project.directAnswer}</p>
            <p>{project.whyItExists}</p>
          </section>

          {ArchitectureDiagram ? (
            <section id="architecture" className="detail-section">
              <p className="detail-kicker">{kicker("architecture")}</p>
              <h2>System flow</h2>
              <p>
                A high-level view of the request/event path — not every internal
                component, just the pieces that determine correctness and failure
                behavior.
              </p>
              <div className="architecture-diagram">
                <ArchitectureDiagram />
              </div>
            </section>
          ) : null}

          {project.evolvedFrom && evolvedFromProject ? (
            <section id="evolution" className="detail-section">
              <p className="detail-kicker">{kicker("evolution")}</p>
              <h2>
                {evolvedFromProject.title} → {project.title}
              </h2>
              <p>{project.evolvedFrom.narrative}</p>
              <ul className="evolution-limitations">
                {project.evolvedFrom.limitations.map((limitation) => (
                  <li key={limitation}>{limitation}</li>
                ))}
              </ul>
              <Link className="text-link" href={`/projects/${evolvedFromProject.slug}`}>
                View {evolvedFromProject.title} <ArrowRight aria-hidden="true" size={15} />
              </Link>
            </section>
          ) : null}

          <section id="concepts" className="detail-section">
            <p className="detail-kicker">{kicker("concepts")}</p>
            <h2>System concerns made explicit</h2>
            <TagList items={project.concepts} label={`${project.title} engineering concepts`} />
          </section>

          <section id="evidence" className="detail-section">
            <p className="detail-kicker">{kicker("evidence")}</p>
            <h2>Measured or reproducible signals</h2>
            {project.proofPoints.length > 0 ? (
              <div className="proof-grid">
                {project.proofPoints.map((proof) => (
                  <ProjectProof key={`${proof.label}-${proof.value}`} proof={proof} />
                ))}
              </div>
            ) : (
              <p className="detail-muted">Evidence is represented through implemented capabilities and source-grounded repository behavior.</p>
            )}
          </section>

          <section id="stack" className="detail-section">
            <p className="detail-kicker">{kicker("stack")}</p>
            <h2>Current implementation</h2>
            <TagList items={project.technologies} label={`${project.title} technology stack`} />
          </section>

          {project.roadmap.length > 0 ? (
            <section id="roadmap" className="detail-section roadmap-section">
              <div className="roadmap-heading">
                <div>
                  <p className="detail-kicker">{kicker("roadmap")}</p>
                  <h2>Infrastructure evolution</h2>
                </div>
                <StatusBadge status="planned" />
              </div>
              <ul className="roadmap-list">
                {project.roadmap.map((item) => <li key={item.title}>{item.title}</li>)}
              </ul>
              <p className="detail-muted">These items are roadmap directions and are not part of the project&apos;s current stack.</p>
            </section>
          ) : null}

          {relatedProjects.length > 0 ? (
            <section className="detail-section">
              <p className="detail-kicker">Related work</p>
              <h2>Project evolution</h2>
              <div className="related-projects">
                {relatedProjects.map(({ project: relatedProject, label }) => (
                  <Link key={relatedProject.id} href={`/projects/${relatedProject.slug}`}>
                    <span>{label}</span>
                    <strong>{relatedProject.title}</strong>
                    <ArrowRight aria-hidden="true" size={16} />
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
