import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  knowledgeBaseRagAgentRoles,
  knowledgeBaseRagBoundaryRows,
  knowledgeBaseRagCapabilities,
  knowledgeBaseRagCoverage,
  knowledgeBaseRagCoverageExamples,
  knowledgeBaseRagDeepDiveLinks,
  knowledgeBaseRagEngineeringDecisions,
  knowledgeBaseRagEvidence,
  knowledgeBaseRagLimitations,
  knowledgeBaseRagRelatedWriting,
  knowledgeBaseRagRerankerComparison,
  knowledgeBaseRagResearchFlow,
  knowledgeBaseRagScreenshots,
  knowledgeBaseRagStackGroups,
  knowledgeBaseRagTools,
} from "@/data/knowledge-base-rag";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";

type KnowledgeBaseRagCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["research-flow", "Research graph"],
  ["tools", "Scoped tools"],
  ["agents", "Agent roles"],
  ["boundaries", "Trust boundaries"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["showcase", "Product proof"],
  ["coverage", "120 questions"],
  ["benchmark", "Reranker decision"],
  ["evidence", "Evidence"],
  ["evolution", "Evolution"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["in-short", "In short"],
  ["related", "Related"],
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
          <span className="rag-release-badge">Agentic research workspace</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          An agentic document research workspace. PydanticAI agents work through a typed research
          graph over an application-owned ResearchState: they search authorized sources, read
          original PDF pages, extract values and hand the arithmetic to code, then answer with
          citations you can open.
        </p>
        <blockquote className="rag-hero-principle">
          Agents decide what to look for. The application owns the state, the tools, the maths and
          the release.
        </blockquote>
        <div className="rag-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>PydanticAI · typed research graph · ResearchState · local-first reference system</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout rag-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section rag-principle-section">
            <h2>Research is a controlled loop, not a longer prompt</h2>
            <p>
              Questions over complex tables, charts and scanned PDFs need evidence that is found,
              read from the right place and computed correctly. Agents handle the semantic work:
              interpreting the question, naming what is missing, choosing source regions, extracting
              data and judging whether a result answers what was asked.
            </p>
            <p>
              Everything that has to be trustworthy stays in application code: the typed research
              state, authorization, tool permissions, request, token and time budgets, arithmetic,
              stopping rules and the checks that gate a release. The model is called where a semantic
              decision is needed, not for what code can do.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the workspace does</h2>
            <p>
              Ask across documents, tables, charts and scanned pages. The workflow finds the sources,
              collects missing evidence, reads original page images when it has to and computes in
              application code, inside explicit budgets.
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

          <section id="research-flow" className="detail-section">
            <h2>One question through the typed research graph</h2>
            <p>
              The graph is application-controlled: PydanticAI makes typed agent calls, and the
              application owns every transition between them. Prepared calculations and known
              transitions execute directly, so the model is only called where a semantic decision is
              needed.
            </p>
            <ol className="rag-query-flow">
              {knowledgeBaseRagResearchFlow.map((step, index) => (
                <li key={step.label}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="detail-muted">
              ResearchState is a typed Pydantic structure created and updated by application code, not
              a model-written summary. It holds the task, evidence needs, source selections, checked
              observations, calculations, coverage, unresolved issues and execution events, and each
              agent receives only a projection of it.
            </p>
          </section>

          <section id="tools" className="detail-section">
            <h2>Narrow tools, clear responsibilities</h2>
            <p>
              Each operation exposes only its own fields. The application validates tool arguments and
              source access before anything runs, and numeric sources and contextual sources are
              tracked separately so a table value travels with the evidence explaining which entity
              or definition it belongs to.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="Research tools and their boundaries" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Operation</th><th scope="col">Responsibility</th><th scope="col">Boundary</th></tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagTools.map((tool) => (
                    <tr key={tool.operation}><th scope="row">{tool.operation}</th><td>{tool.responsibility}</td><td>{tool.boundary}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="agents" className="detail-section">
            <h2>Ten agent roles, each with its own reasoning effort</h2>
            <p>
              The semantic work is split across small, typed roles rather than one large agent.
              Reasoning effort is set per stage: lighter for reading and extraction, medium for the
              decisions that interpret the question, select sources, judge quantities and verify scope.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="Agent roles and default reasoning effort" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Stage</th><th scope="col">What it does</th><th scope="col">Reasoning</th></tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagAgentRoles.map((agent) => (
                    <tr key={agent.role}><th scope="row">{agent.role}</th><td>{agent.job}</td><td>{agent.reasoning}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              Defaults for OpenAI reasoning effort, configurable server-side: the Reader inherits one
              setting, extraction and its checker share a lighter one, and the final interpretation,
              source selection, quantity and scope stages share another.
            </p>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>The application owns what must be right</h2>
            <p>
              Access control answers which sources a user may reach. Model trust answers what an
              agent may do with them. The application treats these as different boundaries, and a
              typed proposal only becomes state or work after it is validated.
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
              Retrieved content is untrusted data and gold answers never reach runtime generation or
              verification. Normal telemetry carries bounded metadata; raw questions, answers and
              model outputs need explicit forensic capture settings.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Scoped retrieval produces an authorized evidence ledger. A typed research graph reads
                it through ResearchState, gates each tool call on authorization and budget, reads
                values from text or the original page image, calculates in code and releases only
                after source, value and scope checks. A separate path builds compatible index versions
                before switching the active alias.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Six reliability decisions</h2>
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
            <h2>Product proof from the research workspace</h2>
            <p>
              These captures come from the public repository. Each one links to its source file so the
              interface and the evidence shown inside it can be inspected at full size.
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
                      width={1800}
                      height={1125}
                      sizes="(max-width: 820px) 100vw, 50vw"
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

          <section id="coverage" className="detail-section">
            <h2>What 120 questions showed</h2>
            <p>
              The answered-question ledger tracks 120 distinct questions over long documents: 10-K
              filings, annual reports, research papers, manuals and survey releases. Each result is
              recorded once, with its run, answer, latency and model-call count. 96 of the 120 reached
              an accepted outcome.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="Outcomes across 120 questions" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Outcome</th><th scope="col">Questions</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagCoverage.map((row) => (
                    <tr key={row.outcome}><th scope="row">{row.outcome}</th><td>{row.count}</td><td>{row.meaning}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>A few recorded answers show the range, from a single read to a checked calculation:</p>
            <div className="rag-evidence-table" role="region" aria-label="Example answered questions" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Question</th><th scope="col">Source-supported answer</th><th scope="col">Run</th></tr>
                </thead>
                <tbody>
                  {knowledgeBaseRagCoverageExamples.map((row) => (
                    <tr key={row.question}><th scope="row">{row.question}</th><td>{row.answer}</td><td>{row.effort}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              This is a historical success ledger across development revisions, not a claim that every
              answer passes on the latest code or that a complete benchmark was run. Reruns do not add
              to the count, failed runs stay on the record, and runs are scoped to the question&apos;s
              source document, so open-corpus discovery needs its own evaluation.
            </p>
          </section>

          <section id="benchmark" className="detail-section">
            <h2>The reranker changed because the measurement changed</h2>
            <p>
              A paired 220-query multilingual set compared the retrieval choices on the same task, with
              the adoption rule fixed before the full run. The selected BGE model improved
              cross-lingual recall and MRR, but its local CPU latency is much higher, and both sides of
              that decision are recorded.
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
              The selected configuration recorded 63 cross-lingual rescues and 0 drops. It is evidence
              for this dataset and runtime, not a universal ranking of rerankers, and it measures
              retrieval rather than answer accuracy.
            </p>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected evidence</h2>
            <p>
              Question coverage, retrieval quality, budgets and test counts describe different
              surfaces. They stay separate instead of being compressed into one project score.
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
            <h2>From a retrieval pipeline to an agentic research workspace</h2>
            <p>
              <Link className="text-link rag-inline-project-link" href="/projects/production-rag-platform">
                Production RAG Platform <ArrowRight aria-hidden="true" size={14} />
              </Link>{" "}
              established the original PDF retrieval, hybrid search, reranking, citations, evaluation
              and tracing path. This project kept that foundation, added tenant-scoped knowledge
              operations, and then put a typed research graph on top of it.
            </p>
            <div className="rag-evolution-grid">
              <div>
                <span>Earlier boundary</span>
                <strong>One corpus and a fixed answer path</strong>
                <p>Retrieve, rerank, generate and cite, with no tenant ACL and no operated index lifecycle.</p>
              </div>
              <ArrowRight aria-hidden="true" size={18} />
              <div>
                <span>Current boundary</span>
                <strong>Agentic research over authorized evidence</strong>
                <p>Scoped tools, page-image reading, calculation in code, independent checks and a workspace that opens every citation.</p>
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
                  The repository is a local-first engineering reference. Its results belong to the
                  documented questions, models and budgets, and the limits are listed rather than
                  implied away.
                </p>
              </div>
              <span className="rag-release-badge">Limits documented</span>
            </div>
            <ul>
              {knowledgeBaseRagLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

          <ProjectInShort project={project} />

          <ProjectRelated project={project} showWriting={false} />

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
