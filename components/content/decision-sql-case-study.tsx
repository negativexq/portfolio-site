import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  decisionSqlBoundaryRows,
  decisionSqlCapabilities,
  decisionSqlDeepDiveLinks,
  decisionSqlEngineeringDecisions,
  decisionSqlEvidence,
  decisionSqlRuntimeFlow,
  decisionSqlScreenshots,
  decisionSqlStackGroups,
  decisionSqlWorkspaceScreenshots,
} from "@/data/decision-sql";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";

// Reuses the rag-* visual system: DecisionSQL is the structured-data sibling of
// Knowledge Base RAG — the same evidence, boundary and screenshot layout.
type DecisionSqlCaseStudyProps = {
  project: Project;
};

type Screenshot = { src: string; alt: string; caption: string; sourceUrl: string; height?: number };

const sections = [
  ["principle", "Principle"],
  ["showcase", "The workspace"],
  ["capabilities", "What it does"],
  ["runtime", "Checks"],
  ["evidence", "Results"],
  ["boundaries", "Who decides"],
  ["architecture", "Architecture"],
  ["grain", "Grain safety"],
  ["decisions", "Design decisions"],
  ["reports", "Reports and audit"],
  ["stack", "Stack"],
  ["in-short", "In short"],
  ["related", "Related"],
  ["deep-dive", "Deep dive"],
] as const;

function ScreenshotGrid({ screenshots }: { screenshots: readonly Screenshot[] }) {
  return (
    <div className="rag-screenshot-grid">
      {screenshots.map((screenshot) => (
        <figure key={screenshot.src}>
          <a
            className="rag-screenshot-frame"
            href={screenshot.sourceUrl}
            target="_blank"
            rel="noreferrer"
            aria-label={`${screenshot.caption} Open full-size image on GitHub`}
          >
            <Image src={screenshot.src} alt={screenshot.alt} width={2880} height={screenshot.height ?? 1800} sizes="(max-width: 820px) 100vw, 50vw" />
          </a>
          <figcaption>
            <strong>{screenshot.caption}</strong>
            <a className="rag-screenshot-link" href={screenshot.sourceUrl} target="_blank" rel="noreferrer">
              Open full-size image on GitHub <ArrowUpRight aria-hidden="true" size={13} />
            </a>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function DecisionSqlCaseStudy({ project }: DecisionSqlCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="rag-case-study">
      <header className="project-detail-hero rag-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <div className="rag-hero-meta">
          <p>{project.category}</p>
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          Ask questions of your database in plain language and get the answer as a table and a
          chart, with the SQL that ran one click away. The model proposes one decision; code
          checks it and decides whether any SQL runs.
        </p>
        <blockquote className="rag-hero-principle">
          The model proposes. Deterministic code decides what runs.
        </blockquote>
        <div className="rag-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout rag-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section rag-principle-section">
            <h2>SQL that runs can still be wrong</h2>
            <p>
              A model can write SQL that runs and still reads a table the user should not see,
              counts an order once per line item, or filters on a value the column does not hold.
              DecisionSQL lets the model make one typed decision and leaves parsing, policy,
              authority, grain, cost and the read-only run to code the model cannot bypass.
            </p>
          </section>

          <section id="showcase" className="detail-section">
            <h2>Answers you can check</h2>
            <p>
              Every answer shows the SQL that ran, one line on what it counts and which rows it
              keeps, and the eleven checks it passed, filled in live while the question runs.
            </p>
            <ScreenshotGrid screenshots={decisionSqlScreenshots} />
          </section>

          <section id="capabilities" className="detail-section">
            <h2>From a question to a report</h2>
            <div className="rag-capability-grid">
              {decisionSqlCapabilities.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="runtime" className="detail-section">
            <h2>What happens before an answer</h2>
            <p>
              Only an answer with SQL goes past the model. A clarification or a refusal stops there,
              with its reason, and no SQL runs.
            </p>
            <ol className="rag-query-flow">
              {decisionSqlRuntimeFlow.map((step, index) => (
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

          <section id="evidence" className="detail-section">
            <h2>Results</h2>
            <p>
              Measured on 2026-10-29 and 2026-10-30 with gpt-6-luna. The field set checks behavior
              as well as rows: whether the system refuses a join nobody declared, asks when a
              question is ambiguous, and stays quiet about data it does not have.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="DecisionSQL results" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evaluation</th><th scope="col">Result</th><th scope="col">What it covers</th></tr>
                </thead>
                <tbody>
                  {decisionSqlEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>Who decides what</h2>
            <div className="rag-comparison" role="region" aria-label="DecisionSQL ownership boundaries" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {decisionSqlBoundaryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {decisionSqlBoundaryRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                The model never holds credentials, authority or an execution tool. Every stage is
                recorded in a run trace, and the UI shows eleven of them above each answer.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="grain" className="detail-section">
            <h2>A sum that counts the parent three times</h2>
            <p>
              Joining an order to its three line items and summing the order amount counts it three
              times. The query runs and the number looks plausible. The grain check stops it at
              planning time and gives the model one round to fix it.
            </p>
            <div className="decision-grain">
              <div className="decision-grain-panel" data-state="unsafe">
                <header>
                  <span className="decision-grain-tag">Naive join</span>
                  <h3>The join multiplies the measure</h3>
                </header>
                <div className="decision-grain-join">
                  <div className="decision-grain-node" data-role="parent">
                    <span>order #A1</span><strong>amount 100</strong>
                  </div>
                  <div className="decision-grain-children">
                    <div className="decision-grain-node"><span>line 1</span><strong>× 100</strong></div>
                    <div className="decision-grain-node"><span>line 2</span><strong>× 100</strong></div>
                    <div className="decision-grain-node"><span>line 3</span><strong>× 100</strong></div>
                  </div>
                </div>
                <div className="decision-grain-total">
                  <code>SUM(order.amount) = 300</code>
                  <span>counted 3×</span>
                </div>
              </div>
              <div className="decision-grain-arrow" aria-hidden="true">
                <ArrowRight size={18} />
                <span>refused</span>
              </div>
              <div className="decision-grain-panel" data-state="safe">
                <header>
                  <span className="decision-grain-tag">Repaired</span>
                  <h3>Totals per order first</h3>
                </header>
                <div className="decision-grain-join">
                  <div className="decision-grain-node">
                    <span>lines → subtotal</span><strong>one row per order</strong>
                  </div>
                  <div className="decision-grain-node" data-role="parent">
                    <span>order #A1</span><strong>joined once</strong>
                  </div>
                </div>
                <div className="decision-grain-total">
                  <code>SUM(order.amount) = 100</code>
                  <span>counted once</span>
                </div>
              </div>
            </div>
            <p className="decision-grain-shape">
              Grain facts come from the source catalog: tables with a primary key are entities,
              foreign keys are many-to-one edges, and numeric non-key columns are measures. The
              check follows a summed column through CTEs and derived tables, and also stops
              SUM(DISTINCT …) used to hide the repeated rows.
            </p>
          </section>

          <section id="decisions" className="detail-section">
            <h2>Four design decisions</h2>
            <div className="rag-decision-list">
              {decisionSqlEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="reports" className="detail-section">
            <h2>Reports, connections and the audit log</h2>
            <p>
              A report is a page of charts built from answered questions. Each chart keeps the SQL
              that passed the checks and reruns it through the same gates whenever the report
              opens or refreshes.
            </p>
            <ScreenshotGrid screenshots={decisionSqlWorkspaceScreenshots} />
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="rag-stack-table">
              {decisionSqlStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <ProjectInShort project={project} />

          <ProjectRelated project={project} />

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="rag-deep-dive">
              {decisionSqlDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowUpRight aria-hidden="true" size={15} />
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
