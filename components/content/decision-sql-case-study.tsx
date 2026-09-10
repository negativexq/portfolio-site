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
  decisionSqlGovernedModel,
  decisionSqlLimitations,
  decisionSqlRuntimeFlow,
  decisionSqlStackGroups,
} from "@/data/decision-sql";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

// Reuses the rag-* visual system: DecisionSQL is the structured-data sibling of
// Knowledge Base RAG — the same governed evidence, benchmark and boundary layout.
type DecisionSqlCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["runtime", "Admission path"],
  ["boundaries", "Trust boundaries"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["grain", "Grain safety"],
  ["governed-model", "Governed task model"],
  ["evidence", "Evidence"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

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
          <span className="rag-release-badge">Governed benchmark system</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          A governed one-shot Text-to-SQL system and execution-based benchmark where the model
          proposes a single typed decision and deterministic software owns SQL admission and
          read-only execution.
        </p>
        <blockquote className="rag-hero-principle">
          The model proposes. Deterministic software decides what may execute.
        </blockquote>
        <div className="rag-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Frozen synthetic governed benchmark, with documented limits</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout rag-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section rag-principle-section">
            <h2>A demo answers syntax; this answers whether the query may run</h2>
            <p>
              A model can produce SQL that is syntactically fine and still unauthorized, unbounded
              or semantically wrong. DecisionSQL keeps the model’s proposal and the authority to
              execute separate, and evaluates governance apart from query execution because some
              requests should refuse SQL entirely.
            </p>
            <p>
              Correctness is decided by running the query against changing database states, not by
              comparing it to a reference string. The benchmark measures first-pass behavior under
              a one-shot contract, so model decisions and server enforcement both stay visible.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the system does</h2>
            <p>
              DecisionSQL covers the path from a governed request to a bounded result: one typed
              decision, a deterministic admission chain, and execution-based scoring across
              counterfactual states.
            </p>
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
            <h2>One submission, a deterministic admission chain</h2>
            <p>
              Only an ANSWER + SQL submission enters the SQL runtime. The selected SQL then crosses
              each stage below before a restricted reader runs it, and the executor never accepts
              SQL directly from the model, the normalizer or the evaluator.
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

          <section id="boundaries" className="detail-section">
            <h2>Proposal and execution authority stay separate</h2>
            <p>
              The model owns the first-pass decision and, when it answers, the proposed SQL. It
              does not own authorization, physical schema truth, grain semantics or the right to
              execute. Deterministic software owns that half.
            </p>
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
            <p className="rag-inline-note">
              Runtime routing follows the parsed submission, not evaluator truth. An ANSWER + SQL
              runs even when the truth is AMBIGUOUS; the harness records that runtime outcome
              separately instead of skipping the branch.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                A governed context feeds one typed decision. Only ANSWER + SQL enters the admission
                chain — parse, policy, grain safety, narrow normalization, EXPLAIN, a cost gate and
                an accepted QueryPlan — before restricted read-only execution. A separate evaluator
                scores the outcome off the request path against counterfactual states.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Four reliability decisions</h2>
            <div className="rag-decision-list">
              {decisionSqlEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="grain" className="detail-section">
            <h2>Server-owned grain safety, made concrete</h2>
            <p>
              Joining one parent row to several child rows can silently multiply a parent measure.
              The model is not trusted to own this contract; server-owned metadata and a narrow
              deterministic normalizer are.
            </p>
            <div className="decision-grain">
              <div className="decision-grain-panel" data-state="unsafe">
                <header>
                  <span className="decision-grain-tag">Naive join</span>
                  <h3>Fanout multiplies the measure</h3>
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
                <span>normalizer</span>
              </div>
              <div className="decision-grain-panel" data-state="safe">
                <header>
                  <span className="decision-grain-tag">Grain-safe</span>
                  <h3>Child-side preaggregation</h3>
                </header>
                <div className="decision-grain-join">
                  <div className="decision-grain-node">
                    <span>lines → subtotal</span><strong>preaggregated</strong>
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
              Additive parent measure, a declared 1:N relationship and a supported LEFT JOIN fanout
              shape resolve to deterministic child-side preaggregation. Outside that shape the
              normalizer stays fail-closed, and normalized SQL still re-passes parse, policy,
              EXPLAIN and the cost gate before it can run.
            </p>
            <div className="decision-grain-stats">
              <span><strong>Server-owned</strong> grain contract</span>
              <span><strong>Narrow</strong> supported shape only</span>
              <span><strong>Fail-closed</strong> outside it</span>
              <span><strong>No</strong> raw unsafe fallback</span>
            </div>
          </section>

          <section id="governed-model" className="detail-section">
            <h2>Governance is scored apart from execution</h2>
            <p>
              The benchmark includes cases where producing SQL is the wrong behavior, so refusing
              is a measured outcome, not a failure. The four behaviors are scored separately rather
              than merged into one accuracy number.
            </p>
            <div className="rag-benchmark-table" role="region" aria-label="DecisionSQL governed task model" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Behavior</th>
                    <th scope="col">Cases</th>
                    <th scope="col">Expected decision</th>
                    <th scope="col">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {decisionSqlGovernedModel.map((row) => (
                    <tr key={row.behavior}>
                      <th scope="row">{row.behavior}</th>
                      <td>{row.cases}</td>
                      <td>{row.expected}</td>
                      <td>{row.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              The three governance residuals are all in the ambiguity category; authority held at
              15 / 15 with no unauthorized answers. These are frozen synthetic benchmark results,
              not production accuracy.
            </p>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected benchmark evidence</h2>
            <p>
              Governed decisions, runtime admission, grain safety and semantic discrimination
              describe different failure surfaces. They stay separate instead of collapsing into
              one project score.
            </p>
            <div className="rag-evidence-table" role="region" aria-label="DecisionSQL benchmark evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it covers</th></tr>
                </thead>
                <tbody>
                  {decisionSqlEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="rag-stack-table">
              {decisionSqlStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section rag-posture-section">
            <div className="rag-posture-heading">
              <div>
                <h2>Governed benchmark with explicit limits</h2>
                <p>
                  The repository is a governed one-shot benchmark and reference runtime. Its numbers
                  belong to the frozen contracts, synthetic packs and one-shot conditions they were
                  measured under.
                </p>
              </div>
              <span className="rag-release-badge">Limits documented</span>
            </div>
            <ul>
              {decisionSqlLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

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
