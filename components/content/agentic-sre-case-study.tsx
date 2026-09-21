import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  agenticSreBoundaryRows,
  agenticSreCalibration,
  agenticSreCapabilities,
  agenticSreDeepDiveLinks,
  agenticSreEngineeringDecisions,
  agenticSreEvidence,
  agenticSreLimitations,
  agenticSreStackGroups,
  agenticSreWorkflow,
} from "@/data/agentic-sre";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

// Reuses the modelops-* visual system: like ModelOps and ML Platform
// Infrastructure, this is a "proposes / decides" control loop measured against
// the real system — here the model proposes reads and a deterministic engine
// owns the root-cause judgment.
type AgenticSreCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["workflow", "Evidence loop"],
  ["boundaries", "Trust boundary"],
  ["architecture", "Architecture"],
  ["decisions", "Engineering decisions"],
  ["calibration", "Calibration"],
  ["evidence", "Evidence"],
  ["methodology", "Blind methodology"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
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
          An evidence-driven root-cause analysis engine for Kubernetes incidents. A bounded,
          read-only investigator gathers evidence over changes, events, logs, traces, dependencies
          and topology, while a deterministic RCA engine — not the model — makes the final
          root-cause judgment.
        </p>
        <blockquote className="modelops-hero-principle">
          The investigator gathers evidence. It does not decide the root cause.
        </blockquote>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Frozen blind ITBench-Lite holdout · deterministic path · 0 model calls</span>
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
              evidence, normalizes that evidence into typed Findings, and rebuilds a deterministic
              diagnosis. An LLM is optional and the measured benchmark path used zero model calls; the
              model may choose among already-legal reads but can never create evidence, Findings,
              hypotheses or the final root cause.
            </p>
            <p>
              Accuracy, calibration and safety are measured as distinct evidence: 21/25 exact-root
              agreement on a frozen blind holdout is reported separately from confidence calibration
              and from the read-only trust boundary, rather than compressed into one score.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the system does</h2>
            <p>
              A deterministic RCA engine, a bounded investigation runtime around it, and the
              observation and control plane that feed and surface an incident.
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

          <section id="workflow" className="detail-section">
            <h2>One observation, normalized before it can move a diagnosis</h2>
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
            <p className="detail-muted">
              observation → EvidenceStore → normalization → Finding → hypothesis rebuild → verification
              → resolution. The same RCA and normalization code runs for initial observations and new
              investigation evidence.
            </p>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>A read-only trust boundary, judgment kept out of the model</h2>
            <p>
              The investigator can acquire evidence but never owns the diagnosis, and the whole system
              can observe a cluster but never change it. Both boundaries are explicit.
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
            <p className="modelops-inline-note">
              Kubernetes observation is read-only and Secrets are deliberately not read. Invalid
              actions, duplicate reads, tool errors, NO_DATA and exhausted budgets terminate safely with
              the current deterministic diagnosis rather than forcing an answer.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Deterministic RCA sits at the center: it forms hypotheses and information gaps, the
                bounded investigator spends one legal read at a time, and every observation is
                normalized into a Finding before hypotheses are rebuilt and resolved. Kubernetes access
                stays read-only and remediation is proposed, never executed.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

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

          <section id="calibration" className="detail-section">
            <h2>Calibration, not just accuracy</h2>
            <p>
              A confidently wrong diagnosis is worse than an honest abstention, so confidence tiers are
              reported as measured on the blind TEST25 run rather than collapsed into one accuracy
              figure.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE confidence calibration on TEST25" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Confidence</th><th scope="col">Correct</th><th scope="col">Total</th></tr>
                </thead>
                <tbody>
                  {agenticSreCalibration.map((row) => (
                    <tr key={row.confidence}><th scope="row">{row.confidence}</th><td>{row.correct}</td><td>{row.total}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="detail-muted">
              NO_DATA is treated as neutral rather than proof against a hypothesis; the graded run
              recorded 95 NO_DATA observations that were held as neutral instead of forced into a theory.
            </p>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected benchmark evidence</h2>
            <p>
              Blind accuracy, the development split, calibration, bounded investigation and the trust
              boundary describe different claims. They stay separate instead of being compressed into
              one number.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Agentic SRE benchmark evidence" tabIndex={0}>
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

          <section id="methodology" className="detail-section">
            <h2>A blind holdout, hashed before grading</h2>
            <p>
              TEST25 was held out until the architecture was frozen. For the holdout, all 25 bounded
              predictions were persisted and SHA256-hashed before any full-source diagnosis was opened,
              and grading then compared exact canonical root entities by scenario ID — a same-workload
              or nearby entity does not count as a match.
            </p>
            <p className="detail-muted">
              The run used the pinned ITBench-Lite revision d0916b0 with manifest 08a5e56, the
              architecture was frozen at commit 8ccce16, and the prediction artifact was hashed
              (879cab5…), so the 21/25 result is reproducible rather than a one-off claim. It is
              evidence on this pinned 25-scenario set, not a universal production accuracy guarantee.
            </p>
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
              workflows, with a real kind lifecycle gate and a frozen blind benchmark. It is not a
              universal replacement for an experienced SRE.
            </p>
            <ul>
              {agenticSreLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

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
