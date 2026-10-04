import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { AgenticProjectCaseStudy } from "@/components/content/agentic-project-case-study";
import { CommerceProjectCaseStudy } from "@/components/content/commerce-project-case-study";
import { DecisionSqlCaseStudy } from "@/components/content/decision-sql-case-study";
import { MlPlatformInfrastructureCaseStudy } from "@/components/content/ml-platform-infrastructure-case-study";
import { DbtFeatureLineageCaseStudy } from "@/components/content/dbt-feature-lineage-case-study";
import { KnowledgeBaseRagCaseStudy } from "@/components/content/knowledge-base-rag-case-study";
import { ModelOpsProjectCaseStudy } from "@/components/content/modelops-project-case-study";
import { AgenticSreCaseStudy } from "@/components/content/agentic-sre-case-study";
import { ArchitectureDiagram } from "@/components/content/architecture-diagram";
import { JsonLd } from "@/components/content/json-ld";
import { MetricGrid } from "@/components/content/metric-grid";
import { ProjectProof } from "@/components/content/project-proof";
import { SectionIndex } from "@/components/content/section-index";
import { StatusBadge } from "@/components/content/status-badge";
import { TagList } from "@/components/content/tag-list";
import { getProjectArchitecture } from "@/data/architectures";
import { dbtFeatureLineageMeta } from "@/data/dbt-feature-lineage";
import { decisionSqlMeta } from "@/data/decision-sql";
import { mlPlatformInfrastructureMeta } from "@/data/ml-platform-infrastructure";
import { agenticMeta } from "@/data/agentic-customer-service-platform";
import { commerceMeta } from "@/data/real-time-commerce-platform";
import { knowledgeBaseRagMeta } from "@/data/knowledge-base-rag";
import { modelOpsMeta } from "@/data/modelops-control-plane";
import { agenticSreMeta } from "@/data/agentic-sre";
import { profile } from "@/data/profile";
import { getProjectById, getProjectBySlug, projects } from "@/data/projects";
import {
  getProjectFaqs,
  getProjectRelatedWriting,
  getRelatedProjects,
  isPlatformProject,
} from "@/lib/content/project-links";
import { personId } from "@/lib/seo/person";

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

  const title = project.seoTitle ?? project.title;
  const description = project.metaDescription ?? project.summary;
  const canonical = `/projects/${project.slug}`;
  const image = `${canonical}/opengraph-image`;
  const keywordsByProject: Record<string, readonly string[]> = {
    "agentic-customer-service-platform": agenticMeta.keywords,
    "real-time-commerce-platform": commerceMeta.keywords,
    "modelops-control-plane": modelOpsMeta.keywords,
    "knowledge-base-rag": knowledgeBaseRagMeta.keywords,
    "decision-sql": decisionSqlMeta.keywords,
    "ml-platform-infrastructure": mlPlatformInfrastructureMeta.keywords,
    "agentic-sre": agenticSreMeta.keywords,
    "dbt-feature-lineage": dbtFeatureLineageMeta.keywords,
  };
  const keywords = keywordsByProject[project.id];

  return {
    title: { absolute: title },
    description,
    ...(keywords ? { keywords: [...keywords] } : {}),
    alternates: { canonical },
    openGraph: {
      type: "article",
      url: canonical,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${project.title} by ${profile.name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image, alt: `${project.title} by ${profile.name}` }],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) notFound();

  const relatedProjects = getRelatedProjects(project);
  const onPlatform = isPlatformProject(project);
  const evolvedFromProject = project.evolvedFrom
    ? getProjectById(project.evolvedFrom.fromProjectId)
    : undefined;

  const projectArchitecture = getProjectArchitecture(project.id);
  const relatedWriting = getProjectRelatedWriting(project.id);
  const projectUrl = `https://omerfkoc.dev/projects/${project.slug}`;

  const faqEntries = getProjectFaqs(project);

  const softwareSourceCodeJsonLd = {
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
          : project.id === "decision-sql"
            ? [...decisionSqlMeta.keywords]
          : project.id === "ml-platform-infrastructure"
            ? [...mlPlatformInfrastructureMeta.keywords]
          : project.id === "agentic-sre"
            ? [...agenticSreMeta.keywords]
          : undefined,
    author: {
      "@type": "Person",
      "@id": personId(profile),
      name: profile.name,
    },
  };

  const faqJsonLd = {
    "@type": "FAQPage",
    "@id": `${projectUrl}#faq`,
    mainEntity: faqEntries.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbJsonLd = {
    "@type": "BreadcrumbList",
    "@id": `${projectUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://omerfkoc.dev" },
      { "@type": "ListItem", position: 2, name: "Projects", item: "https://omerfkoc.dev/projects" },
      { "@type": "ListItem", position: 3, name: project.title, item: projectUrl },
    ],
  };

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@graph": [softwareSourceCodeJsonLd, faqJsonLd, breadcrumbJsonLd],
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

  if (project.id === "decision-sql") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <DecisionSqlCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "ml-platform-infrastructure") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <MlPlatformInfrastructureCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "agentic-sre") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <AgenticSreCaseStudy project={project} />
      </>
    );
  }

  if (project.id === "dbt-feature-lineage") {
    return (
      <>
        <JsonLd data={projectJsonLd} />
        <DbtFeatureLineageCaseStudy project={project} />
      </>
    );
  }

  // Section labels feed only the sidebar SectionIndex now. Every section used
  // to repeat its own numbered eyebrow ("01 / Overview") above its heading —
  // every bespoke case-study template on the site (DecisionSQL, ModelOps,
  // Knowledge Base RAG, dbt Feature Lineage) already skips that and goes
  // straight to a plain <h2>, and this template now matches them.
  const sections = [
    { id: "overview", navLabel: "Overview" },
    ...(project.highlights && project.highlights.length > 0
      ? [{ id: "highlights", navLabel: "Highlights" }]
      : []),
    ...(projectArchitecture
      ? [{ id: "architecture", navLabel: "Architecture" }]
      : []),
    ...(project.evolvedFrom
      ? [{ id: "evolution", navLabel: "Evolution" }]
      : []),
    { id: "concepts", navLabel: "Concepts" },
    { id: "evidence", navLabel: "Evidence" },
    { id: "stack", navLabel: "Stack" },
    ...(project.roadmap.length > 0
      ? [{ id: "roadmap", navLabel: "Roadmap" }]
      : []),
  ];
  const sectionIndex = sections.map((section) => [section.id, section.navLabel] as const);

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
            <h2>Why it exists</h2>
            <p>{project.directAnswer}</p>
            <p>{project.whyItExists}</p>
          </section>

          {project.highlights && project.highlights.length > 0 ? (
            <section id="highlights" className="detail-section">
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
              <h2>System architecture</h2>
              <p>{projectArchitecture.description}</p>
              <ArchitectureDiagram architecture={projectArchitecture} />
            </section>
          ) : null}

          {project.evolvedFrom && evolvedFromProject ? (
            <section id="evolution" className="detail-section">
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
            <h2>System concerns made explicit</h2>
            <TagList items={project.concepts} label={`${project.title} engineering concepts`} />
          </section>

          <section id="evidence" className="detail-section">
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
            <h2>Current implementation</h2>
            <TagList items={project.technologies} label={`${project.title} technology stack`} />
          </section>

          {project.roadmap.length > 0 ? (
            <section id="roadmap" className="detail-section roadmap-section">
              <div className="roadmap-heading">
                <div>
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

          {relatedProjects.length > 0 || onPlatform ? (
            <section className="detail-section">
              <h2>Related projects</h2>
              <div className="related-projects">
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
          ) : null}

          {relatedWriting.length > 0 ? (
            <section className="detail-section">
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
