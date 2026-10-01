import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  agenticSreBoundaryRows,
  agenticSreCalibration,
  agenticSreCapabilities,
  agenticSreConnectorFacts,
  agenticSreCoverageDimensions,
  agenticSreDeepDiveLinks,
  agenticSreEngineeringDecisions,
  agenticSreEvidence,
  agenticSreLimitations,
  agenticSreMeasurements,
  agenticSreStackGroups,
  agenticSreStreamComparison,
  agenticSreTestbedSlices,
  agenticSreWorkflow,
} from "@/data/agentic-sre";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";

// Reuses the modelops-* visual system: like ModelOps and ML Platform
// Infrastructure, this is a "proposes / decides" control loop measured against
// the real system — here the investigator proposes reads and a deterministic
// engine owns the root-cause judgment.
type AgenticSreCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["architecture", "Architecture"],
  ["connector", "Connector boundary"],
  ["workflow", "Evidence loop"],
  ["boundaries", "Investigator vs judge"],
  ["coverage", "Coverage"],
  ["decisions", "Engineering decisions"],
  ["measurements", "Two measurements"],
  ["testbed", "Testbed"],
  ["evidence", "Evidence"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["in-short", "In short"],
  ["related", "Related"],
  ["deep-dive", "Deep dive"],
] as const;

export function AgenticSreCaseStudy({ project }: AgenticSreCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="modelops-case-study">
      <header className="project-detail-hero modelops-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <p className="modelops-hero-category">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          An evidence-driven root-cause analysis engine for Kubernetes incidents. A Connector inside
          the cluster streams changes and answers bounded read-only requests, an investigator spends
          one legal read at a time, and a deterministic RCA engine — not a model — makes the
          root-cause judgment.
        </p>
        <blockquote className="modelops-hero-principle">
          The investigator gathers evidence. It does not decide the root cause.
        </blockquote>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Deterministic judgment · in-cluster Connector · 0 model calls</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section">
            <h2>An LLM can guess. Only evidence can diagnose.</h2>
            <p>
              The engine does not ask a model what caused an incident. It acquires bounded, read-only
              evidence, normalizes it into typed Findings, and rebuilds a deterministic diagnosis. An
              LLM is optional and every reported measurement ran with zero model calls; a model may
              choose among already-legal reads but can never create evidence, Findings, hypotheses or
              the root cause.
            </p>
            <p>
              Correctness, abstention and safety are kept as separate evidence: ground-truth accuracy
              on ITBench-Lite, a live suite of faults staged on a running cluster, an instrumented
              testbed whose truth is recorded, and a read-only trust boundary — rather than one
              headline score.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the system does</h2>
            <p>
              A deterministic RCA engine, a bounded investigator around it, a Connector that is the only
              component touching the customer cluster, and a control plane that stores replayable
              diagnoses.
            </p>
            <div className="modelops-capability-grid">
              {agenticSreCapabilities.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Five layers: the RCA engine, the investigation runtime, the observation sources, the
                Connector and the control plane. In remote mode the control plane holds no customer
                credential; everything it knows about the cluster arrives through the Connector as
                typed requests and gap-aware streams, and every diagnosis is stored with its frozen
                evidence manifest.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="connector" className="detail-section">
            <h2>The control plane holds no customer credential</h2>
            <p>
              The Connector is the only component that touches the customer environment. That makes the
              trust boundary something you can deploy, not only describe.
            </p>
            <div className="modelops-decision-list">
              {agenticSreConnectorFacts.map((fact) => (
                <article key={fact.title}>
                  <h3>{fact.title}</h3>
                  <p>{fact.description}</p>
                </article>
              ))}
            </div>
            <p>
              Inside the stream mode the Connector no longer polls. It lists each scope once and then
              watches it, so a change is on the stream as soon as the API server announces it. When a
              watch cannot resume, only that scope gets a gap and is listed again.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE watch versus polling measurements" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Measured on the lab</th><th scope="col">Watch</th><th scope="col">Polling every 15 s</th></tr>
                </thead>
                <tbody>
                  {agenticSreStreamComparison.map((row) => (
                    <tr key={row.measure}><th scope="row">{row.measure}</th><td>{row.watch}</td><td>{row.polling}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              Lab measurements from 2026-09-30 and 10-01. The stream mode is opt-in, and the Connector
              still uses static 90-day certificates; enrollment and rotation are not built yet.
            </p>
          </section>

          <section id="workflow" className="detail-section">
            <h2>From a cluster change to a stored diagnosis</h2>
            <p>
              Investigation is a controlled loop, not an open-ended chat. Every new observation returns
              through the same deterministic path before it is allowed to change anything.
            </p>
            <ol className="modelops-workflow">
              {agenticSreWorkflow.map((step, index) => (
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
            <h2>The investigator chooses where to look, not what is true</h2>
            <p>
              The investigator can acquire evidence but never owns the diagnosis, and the system can
              observe a cluster but never change it.
            </p>
            <div className="modelops-comparison" role="region" aria-label="Agentic SRE investigation and judgment boundary" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {agenticSreBoundaryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {agenticSreBoundaryRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="coverage" className="detail-section">
            <h2>It records what it could not see</h2>
            <p>
              A diagnosis may use evidence the Connector observed by the cutoff, however late it arrived,
              and source times never decide membership. What it may conclude from absence is a separate
              question, so every diagnosis records two dimensions per scope.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE coverage dimensions" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Dimension</th><th scope="col">Values</th><th scope="col">What it records</th></tr>
                </thead>
                <tbody>
                  {agenticSreCoverageDimensions.map((row) => (
                    <tr key={row.dimension}><th scope="row">{row.dimension}</th><td>{row.values}</td><td>{row.meaning}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="modelops-inline-note">
              In live checks, delivery was proven in all 60 measured waits, at a median of about 2 s
              after the cutoff and at most 7.0 s. The record is provenance today: the rules that infer
              from absence do not read it yet and will adopt it one at a time, each measured on the
              testbed first. Continuity also survives a control-plane restart when the stream provably
              resumes where it stopped.
            </p>
          </section>

          <section id="decisions" className="detail-section">
            <h2>Engineering decisions that keep the diagnosis honest</h2>
            <div className="modelops-decision-list">
              {agenticSreEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="measurements" className="detail-section">
            <h2>Two measurements that answer different questions</h2>
            <p>
              The bounded investigator was first measured against the engine&apos;s own full-source
              diagnosis. That number shows how much a read budget loses, not whether the answer is
              right, so ground-truth accuracy is reported separately and leads.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE ITBench-Lite TEST25 measurements" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Measurement</th><th scope="col">TEST25</th><th scope="col">What it compares</th></tr>
                </thead>
                <tbody>
                  {agenticSreMeasurements.map((row) => (
                    <tr key={row.measurement}><th scope="row">{row.measurement}</th><td>{row.result}</td><td>{row.compares}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p>
              Confidence is calibrated against the same ground truth, not against agreement:
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE confidence against ground truth" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Confidence</th><th scope="col">TEST25</th><th scope="col">All 31 scoreable</th></tr>
                </thead>
                <tbody>
                  {agenticSreCalibration.map((row) => (
                    <tr key={row.confidence}><th scope="row">{row.confidence}</th><td>{row.test25}</td><td>{row.all}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              TEST25 was blind when the architecture was frozen, and no production code changed after
              its results were visible. Since 2026-09-28 all 35 published scenarios are development data:
              they protect against regressions but no longer estimate generalization. Four labels that
              match nothing in their own scenario snapshot are excluded from the denominators.
            </p>
          </section>

          <section id="testbed" className="detail-section">
            <h2>Measured against a world whose truth is recorded</h2>
            <p>
              Published benchmarks cannot supply what a verified mechanism needs: the exact execution, the
              first effect at the target, the propagation and the recovery. The instrumented testbed
              injects faults on a kind cluster with Chaos Mesh, records a seven-field timeline and the
              causal chain from producers the engine never sees, and freezes its manifest before any run.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE testbed results" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Fault</th><th scope="col">Cause and instance named</th><th scope="col">Execution witness</th></tr>
                </thead>
                <tbody>
                  {agenticSreTestbedSlices.map((row) => (
                    <tr key={row.fault}><th scope="row">{row.fault}</th><td>{row.causeNamed}</td><td>{row.witness}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              Development tier, engine 2.1.0: 0 false strong authority and 0 false RESOLVED across every
              slice. These are small runs, not a benchmark, and there is no held-out testbed result yet.
              The testbed has already found real defects, including a rule that gave strong authority to
              an experiment that had ended 40 minutes before the incident.
            </p>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected evidence</h2>
            <p>
              Accuracy, abstention, latency, coverage and the trust boundary are different claims. They
              stay separate instead of being compressed into one number.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {agenticSreEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="modelops-stack-table">
              {agenticSreStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section modelops-posture-section">
            <h2>Controlled evaluation, with explicit limits</h2>
            <p>
              Agentic SRE is suitable for controlled evaluation and read-only incident-assistance
              workflows. It is not a universal replacement for an experienced SRE.
            </p>
            <ul>
              {agenticSreLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

          <ProjectInShort project={project} />

          <ProjectRelated project={project} />

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="modelops-deep-dive">
              {agenticSreDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowRight aria-hidden="true" size={15} />
            </a>
          </section>
        </div>
      </div>
    </main>
  );
}
