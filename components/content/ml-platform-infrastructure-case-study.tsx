import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  mlPlatformInfrastructureBoundaryRows,
  mlPlatformInfrastructureCapabilities,
  mlPlatformInfrastructureDeepDiveLinks,
  mlPlatformInfrastructureEngineeringDecisions,
  mlPlatformInfrastructureEvidence,
  mlPlatformInfrastructureFailureScenarios,
  mlPlatformInfrastructureLimitations,
  mlPlatformInfrastructureStackGroups,
  mlPlatformInfrastructureWorkflow,
} from "@/data/ml-platform-infrastructure";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

// Reuses the modelops-* visual system: both projects are the same "release
// control loop, measured against the real system" shape at a different layer
// — ModelOps is the application-level rollout policy, this is the Kubernetes
// substrate (GitOps reconciliation, autoscaling, failure recovery) beneath it.
type MlPlatformInfrastructureCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["workflow", "Reconciliation loop"],
  ["boundaries", "Security boundary"],
  ["architecture", "Architecture"],
  ["decisions", "Defects found and fixed"],
  ["failures", "Failure engineering"],
  ["evidence", "Evidence"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

export function MlPlatformInfrastructureCaseStudy({ project }: MlPlatformInfrastructureCaseStudyProps) {
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
          A local ML platform reference implementation on Kubernetes: an inference service, its full
          MLflow/PostgreSQL/MinIO lifecycle, GitOps, autoscaling, security hardening and observability,
          validated with real failure drills instead of descriptions.
        </p>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>local-v1.0.0 · Kubernetes implementation frozen · AWS design-only, not yet applied</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section">
            <h2>A diagram is a claim. A drill is evidence.</h2>
            <p>
              Every headline number here comes from running the cluster and breaking it on purpose, not
              from documenting intent: GitOps reconciliation speed, autoscaling under load, pod recovery
              time, a NetworkPolicy deny rule, and eight injected faults were all measured against a live
              kind cluster.
            </p>
            <p>
              AWS is designed as code — Terraform, a cost model, a migration doc — but is explicitly
              marked not-yet-applied, so local evidence is never mistaken for a cloud deployment claim.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the platform does</h2>
            <p>
              An inference service, its full ML lifecycle, and the GitOps, autoscaling, security and
              observability layers around it, all running inside one Kubernetes cluster.
            </p>
            <div className="modelops-capability-grid">
              {mlPlatformInfrastructureCapabilities.map((group) => (
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
            <h2>Two reconciliation loops, running at different speeds</h2>
            <p>
              Argo CD watches live cluster state continuously and also polls Git independently. The
              two paths have very different latency, which is why a Git commit lands slower than a
              manual edit gets reverted.
            </p>
            <ol className="modelops-workflow">
              {mlPlatformInfrastructureWorkflow.map((step, index) => (
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
              Argo CD’s live-state watch self-heals drift in about 1.4 seconds; its independent Git poll
              defaults to roughly every 3 minutes.
            </p>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>A NetworkPolicy deny rule, verified rather than assumed</h2>
            <p>
              A default-deny NetworkPolicy plus an explicit allow-list governs which pods may reach
              which services. The inference → PostgreSQL direct path was actually attempted against the
              running cluster and confirmed denied, not inferred from the policy file.
            </p>
            <div className="modelops-comparison" role="region" aria-label="ML Platform Infrastructure NetworkPolicy boundary" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {mlPlatformInfrastructureBoundaryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {mlPlatformInfrastructureBoundaryRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="modelops-inline-note">
              Pod Security Standards: restricted is enforced cluster-wide. On its first run the security
              drill rejected its own probe pods under that same policy, which was initially misread as a
              NetworkPolicy denial rather than a Pod Security Standards rejection.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Git is the only source of truth; Argo CD applies it into the cluster. Client traffic
                reaches only the inference Service, governed by an HPA and a PodDisruptionBudget. A
                default-deny NetworkPolicy allows inference → MLflow → PostgreSQL/MinIO while denying
                inference from reaching PostgreSQL directly. Prometheus feeds Grafana and a
                promtool-tested Alertmanager.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Defects found by running automation, not written around</h2>
            <div className="modelops-decision-list">
              {mlPlatformInfrastructureEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="failures" className="detail-section">
            <h2>Eight faults injected against the running cluster</h2>
            <p>
              Not simulated: each scenario below was actually triggered against the live cluster, with
              detection and recovery observed and timed.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Failure engineering scenarios" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Scenario</th><th scope="col">Observed</th><th scope="col">Recovery</th></tr>
                </thead>
                <tbody>
                  {mlPlatformInfrastructureFailureScenarios.map((item) => (
                    <tr key={item.scenario}><th scope="row">{item.scenario}</th><td>{item.observed}</td><td>{item.recovery}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected platform evidence</h2>
            <p>
              Load, autoscaling, recovery, reproducibility, failure engineering and the security
              boundary describe different parts of the system. They stay separate instead of being
              compressed into one score.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="ML Platform Infrastructure evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {mlPlatformInfrastructureEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="modelops-stack-table">
              {mlPlatformInfrastructureStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section modelops-posture-section">
            <h2>Local reference implementation with explicit limits</h2>
            <p>
              This is a validated local Kubernetes reference implementation, not a production
              certification and not a cloud deployment. AWS is designed as code and has not been applied.
            </p>
            <ul>
              {mlPlatformInfrastructureLimitations.map((limitation) => <li key={limitation}>{limitation}</li>)}
            </ul>
          </section>

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="modelops-deep-dive">
              {mlPlatformInfrastructureDeepDiveLinks.map((link) => (
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
