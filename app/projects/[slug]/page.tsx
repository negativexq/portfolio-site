import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AgenticProjectCaseStudy } from "@/components/content/agentic-project-case-study";
import { CommerceProjectCaseStudy } from "@/components/content/commerce-project-case-study";
import { KnowledgeBaseRagCaseStudy } from "@/components/content/knowledge-base-rag-case-study";
import { ModelOpsProjectCaseStudy } from "@/components/content/modelops-project-case-study";
import { ArchitectureDiagram } from "@/components/content/architecture-diagram";
import { JsonLd } from "@/components/content/json-ld";
import { MetricGrid } from "@/components/content/metric-grid";
import { ProjectProof } from "@/components/content/project-proof";
import { SectionIndex } from "@/components/content/section-index";
import { StatusBadge } from "@/components/content/status-badge";
import { TagList } from "@/components/content/tag-list";
import { getProjectArchitecture } from "@/data/architectures";
import { agenticMeta, agenticProjectUrl } from "@/data/agentic-customer-service-platform";
import { commerceMeta, commerceProjectUrl } from "@/data/real-time-commerce-platform";
import { knowledgeBaseRagMeta, knowledgeBaseRagProjectUrl } from "@/data/knowledge-base-rag";
import { modelOpsMeta, modelOpsProjectUrl } from "@/data/modelops-control-plane";
import { profile } from "@/data/profile";
import { getProjectById, getProjectBySlug, projects } from "@/data/projects";
import { personId } from "@/lib/seo/person";
import { getPublishedArticles } from "@/lib/writing/articles";

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

  if (project.id === "agentic-customer-service-platform") {
    return {
      title: agenticMeta.title,
      description: agenticMeta.description,
      keywords: [...agenticMeta.keywords],
      alternates: { canonical: agenticProjectUrl },
      openGraph: {
        type: "article",
        url: agenticProjectUrl,
        title: agenticMeta.title,
        description: agenticMeta.description,
        images: [{ url: agenticMeta.image, width: 1440, height: 900, alt: agenticMeta.imageAlt }],
      },
      twitter: {
        card: "summary_large_image",
        title: agenticMeta.title,
        description: agenticMeta.description,
        images: [agenticMeta.image],
      },
    };
  }

  if (project.id === "real-time-commerce-platform") {
    return {
      title: commerceMeta.title,
      description: commerceMeta.description,
      keywords: [...commerceMeta.keywords],
      alternates: { canonical: commerceProjectUrl },
      openGraph: {
        type: "article",
        url: commerceProjectUrl,
        title: commerceMeta.title,
        description: commerceMeta.description,
        images: [{ url: commerceMeta.image, width: 920, height: 1690, alt: commerceMeta.imageAlt }],
      },
      twitter: {
        card: "summary_large_image",
        title: commerceMeta.title,
        description: commerceMeta.description,
        images: [commerceMeta.image],
      },
    };
  }

  if (project.id === "modelops-control-plane") {
    return {
      title: modelOpsMeta.title,
      description: modelOpsMeta.description,
      keywords: [...modelOpsMeta.keywords],
      alternates: { canonical: modelOpsProjectUrl },
      openGraph: {
        type: "article",
        url: modelOpsProjectUrl,
        title: modelOpsMeta.title,
        description: modelOpsMeta.description,
        images: [{ url: modelOpsMeta.image, width: 1280, height: 1500, alt: modelOpsMeta.imageAlt }],
      },
      twitter: {
        card: "summary_large_image",
        title: modelOpsMeta.title,
        description: modelOpsMeta.description,
        images: [modelOpsMeta.image],
      },
    };
  }

  if (project.id === "knowledge-base-rag") {
    return {
      title: knowledgeBaseRagMeta.title,
      description: knowledgeBaseRagMeta.description,
      keywords: [...knowledgeBaseRagMeta.keywords],
      alternates: { canonical: knowledgeBaseRagProjectUrl },
      openGraph: {
        type: "article",
        url: knowledgeBaseRagProjectUrl,
        title: knowledgeBaseRagMeta.title,
        description: knowledgeBaseRagMeta.description,
        images: [{
          url: knowledgeBaseRagMeta.image,
          width: 1249,
          height: 690,
          alt: knowledgeBaseRagMeta.imageAlt,
        }],
      },
      twitter: {
        card: "summary_large_image",
        title: knowledgeBaseRagMeta.title,
        description: knowledgeBaseRagMeta.description,
        images: [knowledgeBaseRagMeta.image],
      },
    };
  }

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

  const projectArchitecture = getProjectArchitecture(project.id);
  const relatedWriting = getPublishedArticles().filter((article) =>
    article.relatedProjects.includes(project.id),
  );
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
    keywords:
      project.id === "agentic-customer-service-platform"
        ? [...agenticMeta.keywords]
        : project.id === "real-time-commerce-platform"
          ? [...commerceMeta.keywords]
          : project.id === "modelops-control-plane"
            ? [...modelOpsMeta.keywords]
          : project.id === "knowledge-base-rag"
            ? [...knowledgeBaseRagMeta.keywords]
          : undefined,
    author: {
      "@type": "Person",
      "@id": personId(profile),
      name: profile.name,
    },
  };

  if (project.id === "agentic-customer-service-platform") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <AgenticProjectCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "real-time-commerce-platform") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <CommerceProjectCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "modelops-control-plane") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <ModelOpsProjectCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "knowledge-base-rag") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <KnowledgeBaseRagCaseStudy project={project} />
      </>
    );
  }

  const sections = [
    { id: "overview", navLabel: "Overview", kickerText: "Overview" },
    ...(project.highlights && project.highlights.length > 0
      ? [{ id: "highlights", navLabel: "Highlights", kickerText: "Engineering highlights" }]
      : []),
    ...(projectArchitecture
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
  const sectionIndex = sections.map((section) => [section.id, section.navLabel] as const);
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
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className={`container detail-layout${projectArchitecture ? " detail-layout--architecture" : ""}`}>
        <SectionIndex sections={sectionIndex} label="Case study" />

        <div className="detail-content">
          <section id="overview" className="detail-section">
            <p className="detail-kicker">{kicker("overview")}</p>
            <h2>Why it exists</h2>
            <p>{project.directAnswer}</p>
            <p>{project.whyItExists}</p>
          </section>

          {project.highlights && project.highlights.length > 0 ? (
            <section id="highlights" className="detail-section">
              <p className="detail-kicker">{kicker("highlights")}</p>
              <h2>What makes this different</h2>
              <div className="highlight-grid">
                {project.highlights.map((highlight) => (
                  <article key={highlight.title}>
                    <h3>{highlight.title}</h3>
                    <p>{highlight.description}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          {projectArchitecture ? (
            <section id="architecture" className="detail-section">
              <p className="detail-kicker">{kicker("architecture")}</p>
              <h2>System architecture</h2>
              <p>{projectArchitecture.description}</p>
              <ArchitectureDiagram architecture={projectArchitecture} />
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

          {relatedWriting.length > 0 ? (
            <section className="detail-section">
              <p className="detail-kicker">Related writing</p>
              <h2>Engineering notes</h2>
              <div className="related-projects">
                {relatedWriting.map((article) => (
                  <Link key={article.slug} href={`/writing/${article.slug}`}>
                    <span>{article.readingTime} min read</span>
                    <strong>{article.title}</strong>
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
