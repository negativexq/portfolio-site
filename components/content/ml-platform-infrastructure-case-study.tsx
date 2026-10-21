import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  mlPlatformInfrastructureBoundaryRows,
  mlPlatformInfrastructureCapabilities,
  mlPlatformInfrastructureDeepDiveLinks,
  mlPlatformInfrastructureDeploymentTargets,
  mlPlatformInfrastructureDesignDecisions,
  mlPlatformInfrastructureEvidence,
  mlPlatformInfrastructureFailureScenarios,
  mlPlatformInfrastructureScreenshots,
  mlPlatformInfrastructureStackGroups,
  mlPlatformInfrastructureWorkflow,
} from "@/data/ml-platform-infrastructure";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";

const sections = [
  ["principle", "Platform design"],
  ["acceptance", "Current validation"],
  ["data-lifecycle", "Scheduled scoring"],
  ["showcase", "Web workspace"],
  ["capabilities", "Capabilities"],
  ["architecture", "System architecture"],
  ["workflow", "Model lifecycle"],
  ["boundaries", "Access and traffic"],
  ["decisions", "Design decisions"],
  ["evidence", "Infrastructure foundation"],
  ["stack", "Stack"],
  ["deployment", "Deployment"],
  ["in-short", "In short"],
  ["related", "Related"],
  ["deep-dive", "Deep dive"],
] as const;

export function MlPlatformInfrastructureCaseStudy({ project }: { project: Project }) {
  const architecture = getProjectArchitecture(project.id);
  return (
    <main className="modelops-case-study">
      <header className="project-detail-hero modelops-hero mlp-hero container">
        <Link className="back-link" href="/projects"><ArrowLeft aria-hidden="true" size={14} /> All projects</Link>
        <div className="mlp-hero-layout">
          <div>
            <h1>{project.title}</h1>
            <p className="project-detail-summary">{project.summary}</p>
            <div className="modelops-hero-actions">
              <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
                View repository <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <a className="button button-secondary" href="#data-lifecycle">Explore the million-row workflow</a>
            </div>
          </div>
          <figure className="mlp-hero-media">
            <a className="agentic-screenshot-frame" href="/projects/ml-platform-infrastructure/01-home.png" target="_blank" rel="noreferrer" aria-label="Open the full-size ML Platform home screenshot">
              <Image src="/projects/ml-platform-infrastructure/01-home.png" alt="ML Platform home with health, scheduled work and model drift attention items, populated with synthetic demo data" width={1440} height={1236} sizes="(max-width: 800px) calc(100vw - 32px), 560px" preload loading="eager" />
            </a>
            <figcaption>Repository UI capture · synthetic demo data.</figcaption>
          </figure>
        </div>
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />
        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section">
            <h2>One lifecycle, two planes</h2>
            <p>
              ML Platform organizes training, scheduled scoring, data lineage, model quality and serving around a shared project
              workspace. Each project has identity, roles, quotas and a durable
              record of the changes requested by its users.
            </p>
            <p>
              PostgreSQL holds lifecycle intent. Reconcilers drive Kubernetes, Argo Workflows, MLflow
              and KServe toward it. A separate Go inference gateway governs model predictions, streaming
              chat and container-function calls, allowing management and serving traffic to scale independently.
            </p>
          </section>

          <section id="acceptance" className="detail-section">
            <h2>Current validation, with explicit boundaries</h2>
            <p>
              Reviewed against <a href="https://github.com/negativexq/ml-platform-infrastructure/commit/6d4e9a2947db222ada4646430c86332fb74ff917" target="_blank" rel="noreferrer">main at 6d4e9a2</a> (8 October 2026).
              These are distinct acceptance checks on a single-node ARM64 kind laboratory, not a unified benchmark or customer deployment.
              The committed reports record methods, identities and artifact hashes; some raw data and logs remain in external archives.
            </p>
            {project.heroMetrics?.length ? <MetricGrid metrics={project.heroMetrics} /> : null}
            <div className="modelops-evidence-table" role="region" aria-label="Current platform acceptance and measurement scope" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Evidence</th><th scope="col">What passed</th><th scope="col">Measurement boundary</th></tr></thead>
                <tbody>
                  <tr><th scope="row"><a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-06/serving-arm64/README.md" target="_blank" rel="noreferrer">CPU lifecycle</a></th><td>Training → registration/evaluation → real serving; healthy canary, candidate-only rollback and scale-to-zero/reactivation</td><td>Local ARM64 artifacts and local auth-none setup. GPU, real OIDC and multi-node resilience are separate gates.</td></tr>
                  <tr><th scope="row"><a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-08/million-row-acceptance/README.md" target="_blank" rel="noreferrer">Million-row replay</a></th><td>Scheduled scoring, versioned predictions, identical rerun bytes and independently checked quality report</td><td>Historical public data, warm images, one node. Model preparation and training happened locally before platform scoring.</td></tr>
                  <tr><th scope="row"><a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-08/monitoring-automation/README.md" target="_blank" rel="noreferrer">Monitoring automation</a></th><td>Output v3 triggered a report; reconciler restart created no duplicate execution. 12/12 control-plane image checks passed.</td><td>The first dispatch exposed a missing runtime INSERT grant. Owner repair allowed retry; current migration/provisioning includes the grant. Deployed image a3202e3 precedes that provisioning fix.</td></tr>
                  <tr><th scope="row"><a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-07/observability/gateway-go-migration.md" target="_blank" rel="noreferrer">Go gateway</a></th><td>Final-artifact soak: 150,000/150,000 requests; rolling restart: 200/200 real function responses; database outage/recovery</td><td>The 500 RPS soak returned 429 caller-debt rejections. Function probes were separate. Successful inference capacity and maximum throughput remain unmeasured.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="data-lifecycle" className="detail-section">
            <h2>From a processing date to an inspectable quality report</h2>
            <p>
              The NYC TLC case study uses one million cleaned, sampled taxi trips from each of January and February 2025.
              A fare model trains locally on 200,000 January rows, then enters MLflow with a frozen SHA-256 manifest.
              The platform owns the subsequent scheduled scoring and monitoring workflow.
            </p>
            <ol className="modelops-workflow">
              <li><span>01</span><div><h3>Freeze the execution inputs</h3><p>The schedule resolves processing date 2025-02-01 to taxi-features v2. Typed parameters, model and dataset identities persist in an immutable execution snapshot before Argo starts work.</p></div></li>
              <li><span>02</span><div><h3>Score within explicit resource bounds</h3><p>The worker verifies input integrity and the model manifest, then scores one million rows in 10,000-row batches. The recorded pipeline takes 18.95 s including Argo overhead, with a 1 CPU / 1 GiB main container and warm images.</p></div></li>
              <li><span>03</span><div><h3>Publish versioned predictions and lineage</h3><p>Outputs carry their producer run, pipeline step, input dataset and model identity. An independent rerun publishes v2 at a separate S3 location with identical bytes; replaying its creation key returns the same run.</p></div></li>
              <li><span>04</span><div><h3>Measure quality against recorded fares</h3><p>A separate monitoring Job joins every prediction by trip_id: 100% coverage, zero unmatched rows. MAE 2.082 USD, RMSE 4.466 USD and R² 0.920 agree with independent pandas/sklearn calculations. The Job takes 28.17 s in the recorded run.</p></div></li>
              <li><span>05</span><div><h3>Trigger future checks from publication</h3><p>A follow-up run publishes v3 and automatically creates monitoring. Publication and its outbox event commit together; a unique rule/dataset intent survives reconciler restart. Feedback is date-matched and frozen, or the execution waits within its deadline.</p></div></li>
            </ol>
            <p>
              All four selected features were STABLE at PSI threshold 0.2 (PSI 0.000405–0.007974).
              That describes these cleaned windows; no drift was injected and STABLE does not rule out every quality problem.
              Ground truth was withheld before scoring, not collected from live inference. The demonstration schedule is paused.
            </p>
            <p className="detail-muted">
              One platform intent per dataset occurrence is not exactly-once external side effects. Monitoring failure is independent of producer success.
              Same-DAG dynamic output binding, rolling monitoring windows, online prediction capture and a Feature Store remain outside the demonstrated scope.
              <a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/monitoring-automation.md" target="_blank" rel="noreferrer"> Read the automation contract.</a>
            </p>
          </section>

          <section id="showcase" className="detail-section">
            <h2>The web workspace</h2>
            <p>Current repository captures show schedules, versioned datasets, batch definitions and model-quality reports. The Credit Risk scenario uses synthetic demo data; these screens are separate from the real NYC acceptance evidence above.</p>
            <div className="agentic-screenshot-grid">
              {mlPlatformInfrastructureScreenshots.map((image) => (
                <figure key={image.src}>
                  <a className="agentic-screenshot-frame" href={image.src} target="_blank" rel="noreferrer" aria-label={`${image.caption}. Open full-size image`}>
                    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 820px) 100vw, 800px" />
                  </a>
                  <figcaption><strong>{image.caption}</strong><span>Synthetic demo · open the image for the full-size view</span></figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>From training to a governed endpoint</h2>
            <div className="modelops-capability-grid">
              {mlPlatformInfrastructureCapabilities.map((group) => (
                <article key={group.title}><h3>{group.title}</h3><ul>{group.items.map((item) => <li key={item}>{item}</li>)}</ul></article>
              ))}
            </div>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>System architecture</h2>
              <p>
                The control plane records intent and returns; background reconciliation handles infrastructure.
                The data plane checks caller access and endpoint state before forwarding traffic. External
                systems sit behind adapters, keeping lifecycle rules independent of their SDKs.
                The API/reconcilers remain Python; the chart defaults to a separate Go gateway with a Python rollback option.
                The CPU path is lab-verified; the vLLM path below represents implemented contracts awaiting GPU acceptance.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="workflow" className="detail-section">
            <h2>A model moves through explicit states</h2>
            <ol className="modelops-workflow">
              {mlPlatformInfrastructureWorkflow.map((step, index) => (
                <li key={step.label}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{step.label}</h3><p>{step.detail}</p></div></li>
              ))}
            </ol>
            <p className="detail-muted">Registration, evaluation, promotion, deployment readiness and canary success are separate decisions with their own state transitions.</p>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>Access follows the project; traffic follows its plane</h2>
            <p>
              OIDC supplies identity. Project membership and a fail-closed policy table govern management
              operations; the gateway applies caller scope to exposed endpoints. Namespace policy and quotas
              define the workload boundary behind those application rules.
            </p>
            <div className="modelops-comparison" role="region" aria-label="Control and inference plane boundaries" tabIndex={0}>
              <table><thead><tr>{mlPlatformInfrastructureBoundaryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}</tr></thead>
                <tbody><tr>{mlPlatformInfrastructureBoundaryRows.map((column) => <td key={column.side}><ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul></td>)}</tr></tbody>
              </table>
            </div>
          </section>

          <section id="decisions" className="detail-section">
            <h2>Design decisions</h2>
            <div className="modelops-decision-list">
              {mlPlatformInfrastructureDesignDecisions.map((decision) => <article key={decision.title}><h3>{decision.title}</h3><p>{decision.description}</p></article>)}
            </div>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Infrastructure foundation</h2>
            <p>
              The platform grew from a local Kubernetes inference service with MLflow, PostgreSQL, MinIO,
              GitOps and observability. The measurements below belong to that original infrastructure:
              they describe its load, autoscaling and recovery behavior, separately from the broader platform design.
            </p>
            <p className="detail-muted">Historical measurements remain scoped to the original service; the current Go gateway and expanded platform do not inherit its throughput. <a href="https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/history/milestones.md" target="_blank" rel="noreferrer">Original milestone record.</a></p>
            <div className="modelops-evidence-table" role="region" aria-label="Original infrastructure measurements" tabIndex={0}>
              <table><thead><tr><th scope="col">Evidence slice</th><th scope="col">Foundation result</th><th scope="col">Scope</th></tr></thead>
                <tbody>{mlPlatformInfrastructureEvidence.map((item) => <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>)}</tbody>
              </table>
            </div>
            <h3>Selected failure drills from the first infrastructure</h3>
            <div className="modelops-evidence-table" role="region" aria-label="Historical infrastructure failure drills" tabIndex={0}>
              <table><thead><tr><th scope="col">Scenario</th><th scope="col">Observed</th><th scope="col">Recovery</th></tr></thead>
                <tbody>{mlPlatformInfrastructureFailureScenarios.map((item) => <tr key={item.scenario}><th scope="row">{item.scenario}</th><td>{item.observed}</td><td>{item.recovery}</td></tr>)}</tbody>
              </table>
            </div>
          </section>

          <section id="stack" className="detail-section">
            <h2>Platform stack</h2>
            <div className="modelops-stack-table">{mlPlatformInfrastructureStackGroups.map(([area, stack]) => <div key={area}><span>{area}</span><strong>{stack}</strong></div>)}</div>
          </section>

          <section id="deployment" className="detail-section">
            <h2>Deployment</h2>
            <p>The control-plane Helm chart is deployed and runtime-verified on the local ARM64 lab. It defaults to two API, gateway and reconciler replicas, with PDBs and Lease-elected reconciliation. The AWS target is designed alongside it, backed by Terraform.</p>
            <div className="modelops-evidence-table" role="region" aria-label="Local and AWS architecture targets" tabIndex={0}>
              <table><thead><tr><th scope="col">Layer</th><th scope="col">Local target</th><th scope="col">AWS design target</th></tr></thead>
                <tbody>{mlPlatformInfrastructureDeploymentTargets.map((item) => <tr key={item.area}><th scope="row">{item.area}</th><td>{item.local}</td><td>{item.cloud}</td></tr>)}</tbody>
              </table>
            </div>
          </section>


          <ProjectInShort project={project} />
          <ProjectRelated project={project} />
          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="modelops-deep-dive">{mlPlatformInfrastructureDeepDiveLinks.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer"><span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} /></a>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
