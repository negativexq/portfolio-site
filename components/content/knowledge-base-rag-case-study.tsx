import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  knowledgeBaseRagBoundaryRows,
  knowledgeBaseRagCapabilities,
  knowledgeBaseRagDeepDiveLinks,
  knowledgeBaseRagEngineeringDecisions,
  knowledgeBaseRagEvidence,
  knowledgeBaseRagLimitations,
  knowledgeBaseRagQueryFlow,
  knowledgeBaseRagRelatedWriting,
  knowledgeBaseRagRerankerComparison,
  knowledgeBaseRagScreenshots,
  knowledgeBaseRagStackGroups,
} from "@/data/knowledge-base-rag";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

type KnowledgeBaseRagCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["query-path", "Query path"],
  ["boundaries", "Trust boundaries"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["showcase", "Product proof"],
  ["benchmark", "Reranker decision"],
  ["evidence", "Evidence"],
  ["evolution", "Evolution"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

export function KnowledgeBaseRagCaseStudy({ project }: KnowledgeBaseRagCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="rag-case-study">
      <header className="project-detail-hero rag-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <div className="rag-hero-meta">
          <p>{project.category}</p>
          <span className="rag-release-badge">Working reference system</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          A local-first multilingual RAG platform with tenant-scoped retrieval, measured
          reranking, strict answer validation, versioned index operations and a console that
          keeps the evidence path visible.
        </p>
        <blockquote className="rag-hero-principle">
          Retrieval evidence is useful only when access, provenance and release policy remain
          explicit.
        </blockquote>
        <div className="rag-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Local-first reference implementation with documented deployment limits</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout rag-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section rag-principle-section">
            <h2>The answer is the end of a controlled evidence path</h2>
            <p>
              A relevant chunk is not automatically authorized, trustworthy or safe to release.
              The server resolves identity and tenant scope first, retrieval stays inside that
              boundary, and generated text is checked before the production path returns it.
            </p>
            <p>
              The console exposes those decisions beside the answer. It is an operating and
              debugging surface for RAG, not a chat transcript with hidden infrastructure.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the platform does</h2>
            <p>
              Knowledge Base RAG covers the path from source synchronization to an authorized,
              cited response, with the index and evaluation state available to operators.
            </p>
            <div className="rag-capability-grid">
              {knowledgeBaseRagCapabilities.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="query-path" className="detail-section">
            <h2>One query, eight inspectable stages</h2>
            <p>
              The production path keeps authorization, relevance and answer validation separate.
              This matters most when an authorized document contains instructions that the model
              should read as data, not follow as policy.
            </p>
            <ol className="rag-query-flow">
              {knowledgeBaseRagQueryFlow.map((step, index) => (
                <li key={step.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>Server controls stay outside retrieved content</h2>
            <p>
              Access control answers which chunks a user may retrieve. Prompt trust answers what
              the model may do with an authorized chunk. The system treats them as different
              boundaries and records both in the response projection.
            </p>
            <div className="rag-comparison" role="region" aria-label="Knowledge Base RAG trust boundaries" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {knowledgeBaseRagBoundaryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {knowledgeBaseRagBoundaryRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="rag-inline-note">
              Strict mode uses buffer, validate, release. Fast mode streams first and checks later,
              so it is a server-side opt-in for development and latency experiments, not a hidden
              frontend switch.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                The query path starts with server-owned identity and tenant scope, then moves
                through dense and sparse retrieval, RRF fusion, multilingual reranking, untrusted
                context construction and strict validation. A separate sync path builds compatible
                index versions before switching the active alias.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Four reliability decisions</h2>
            <div className="rag-decision-list">
              {knowledgeBaseRagEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="showcase" className="detail-section">
            <h2>Product proof from the operations console</h2>
            <p>
              These captures come from the public repository. Each one links to its source file so
              the interface and the evidence shown inside it can be inspected at full size.
            </p>
            <div className="rag-screenshot-grid">
              {knowledgeBaseRagScreenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <a
                    className="rag-screenshot-frame"
                    href={screenshot.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${screenshot.caption} Open full-size image on GitHub`}
                  >
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={1249}
                      height={690}
                      sizes="(max-width: 820px) 100vw, 68vw"
                    />
                  </a>
                  <figcaption>
                    <strong>{screenshot.caption}</strong>
                    <a className="rag-screenshot-link" href={screenshot.sourceUrl} target="_blank" rel="noreferrer">
                      Open full-size image on GitHub <ArrowUpRight aria-hidden="true" size={13} />
                    </a>
                    <span>Source: {screenshot.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="benchmark" className="detail-section">
            <h2>The reranker changed because the measurement changed</h2>
            <p>
              A paired 220-query multilingual set compared the production choices on the same
              retrieval task. The selected BGE model improved cross-lingual recall and MRR, but its
              local CPU latency is much higher. The console shows both sides of that decision.
            </p>
            <div className="rag-benchmark-table" role="region" aria-label="Reranker comparison" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Configuration</th>
                    <th scope="col">Cross Recall@5</th>
                    <th scope="col">Cross MRR</th>
                    <th scope="col">Total p95</th>
                    <th scope="col">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagRerankerComparison.map((row) => (
                    <tr key={row.configuration}>
                      <th scope="row">{row.configuration}</th>
                      <td>{row.recall}</td>
                      <td>{row.mrr}</td>
                      <td>{row.latency}</td>
                      <td><span data-decision={row.decision.toLowerCase()}>{row.decision}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              The selected configuration recorded 63 cross-lingual rescues and 0 drops in this
              benchmark. It is evidence for this dataset and runtime, not a universal ranking of
              rerankers.
            </p>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected repository evidence</h2>
            <p>
              Test counts, retrieval quality, prompt security and generation sanity describe
              different failure surfaces. They remain separate instead of being compressed into
              one project score.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="Knowledge Base RAG evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it covers</th></tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="evolution" className="detail-section">
            <h2>From a retrieval pipeline to an operated knowledge system</h2>
            <p>
              <Link className="text-link rag-inline-project-link" href="/projects/production-rag-platform">
                Production RAG Platform <ArrowRight aria-hidden="true" size={14} />
              </Link>{" "}
              established the original PDF retrieval, hybrid search, reranking, citations,
              evaluation and tracing path. This project kept that foundation and expanded the
              system boundary.
            </p>
            <div className="rag-evolution-grid">
              <div>
                <span>Earlier boundary</span>
                <strong>One corpus and a focused retrieval path</strong>
                <p>Single-source ingestion, no tenant ACL and no operated index lifecycle.</p>
              </div>
              <ArrowRight aria-hidden="true" size={18} />
              <div>
                <span>Current boundary</span>
                <strong>Tenant-scoped knowledge operations</strong>
                <p>Multi-source sync, versioned activation, security controls, benchmark artifacts and an operator console.</p>
              </div>
            </div>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="rag-stack-table">
              {knowledgeBaseRagStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section rag-posture-section">
            <div className="rag-posture-heading">
              <div>
                <h2>Working system with explicit limits</h2>
                <p>
                  The repository is a local-first engineering reference. Its measurements belong
                  to the committed fixtures, models, hardware path and validation configuration.
                </p>
              </div>
              <span className="rag-release-badge">Limits documented</span>
            </div>
            <ul>
              {knowledgeBaseRagLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="rag-deep-dive">
              {knowledgeBaseRagDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <div className="rag-related-writing">
              <span>Related writing</span>
              {knowledgeBaseRagRelatedWriting.map((article) => (
                <Link key={article.href} href={article.href}>
                  <strong>{article.title}</strong>
                  <small>{article.description}</small>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
