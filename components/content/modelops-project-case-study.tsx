import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  modelOpsCapabilities,
  modelOpsControlPlaneRows,
  modelOpsDeepDiveLinks,
  modelOpsEngineeringDecisions,
  modelOpsEvidence,
  modelOpsRelatedWriting,
  modelOpsScreenshots,
  modelOpsStackGroups,
  modelOpsWorkflow,
} from "@/data/modelops-control-plane";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

type ModelOpsProjectCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["workflow", "Promotion story"],
  ["boundaries", "Control boundaries"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["showcase", "Product proof"],
  ["evidence", "Evidence"],
  ["observability", "Observability"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

export function ModelOpsProjectCaseStudy({ project }: ModelOpsProjectCaseStudyProps) {
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
          Policy-driven ML release control plane for progressive canary traffic, delayed
          ground-truth quality gates, automated promotion and rollback, and continuous
          desired-versus-observed router reconciliation.
        </p>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Production-oriented control-plane reference implementation · local Compose scope</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section">
            <h2>Model promotion is a control loop, not a deploy button.</h2>
            <p>
              A model can be healthy as a process and still be wrong for production traffic. This
              platform exposes a candidate gradually, waits for the evidence that can actually
              judge it, and records the decision that follows.
            </p>
            <p>
              Reliability signals and model-quality signals are deliberately different. Delayed
              labels are allowed to mature, insufficient data stays INCONCLUSIVE, and the worker
              acts through the same control-plane API that an operator uses.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the platform does</h2>
            <p>
              ModelOps Control Plane turns a model release into an inspectable, policy-driven
              rollout with real traffic, real label ingestion and an explicit recovery path.
            </p>
            <div className="modelops-capability-grid">
              {modelOpsCapabilities.map((group) => (
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
            <h2>One rollout, judged when the evidence is ready</h2>
            <p>
              The quality-failure scenario makes the control loop concrete. A deliberately weak
              canary receives real routed traffic, but the worker does not call its result decisive
              until delayed ground truth is sufficient.
            </p>
            <ol className="modelops-workflow">
              {modelOpsWorkflow.map((step, index) => (
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
              The important distinction is between “not enough evidence yet” and “this candidate
              failed.” A policy engine that collapses them will either promote too early or roll
              back a healthy model on a thin sample.
            </p>
          </section>

          <section id="boundaries" className="detail-section">
            <h2>Control plane vs serving plane</h2>
            <p>
              The control plane decides the desired traffic state. The router owns its static
              version-to-host mapping and reports what it actually observes. Model serving runs
              predictions; it does not decide whether a version deserves more traffic.
            </p>
            <div className="modelops-comparison" role="region" aria-label="ModelOps control and serving responsibilities" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {modelOpsControlPlaneRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {modelOpsControlPlaneRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="modelops-inline-note">
              Desired state is durable intent. Observed router state is a cache that can drift. The
              reconciliation loop exists because a successful decision and a successful push are
              not the same event.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Client traffic enters a weighted router, while the control plane collects metrics
                and delayed labels. A stateless worker evaluates fresh reliability and matured
                quality windows, then advances or resolves the rollout through the same API as a
                human. Reconciliation closes the gap between database intent and router reality.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Four reliability patterns</h2>
            <div className="modelops-decision-list">
              {modelOpsEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="showcase" className="detail-section">
            <h2>Product proof from the current dashboard</h2>
            <p>
              These are curated repository screenshots from the public `origin/main` walkthrough.
              Each image links back to the source file so the full-size timeline remains available
              on desktop and mobile.
            </p>
            <div className="modelops-screenshot-grid">
              {modelOpsScreenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <a
                    className="modelops-screenshot-frame"
                    href={screenshot.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${screenshot.caption} Open full-size image on GitHub`}
                  >
                    <Image
                      src={screenshot.src}
                      alt={screenshot.alt}
                      width={screenshot.width}
                      height={screenshot.height}
                      sizes="(max-width: 820px) 100vw, 68vw"
                    />
                  </a>
                  <figcaption>
                    <strong>{screenshot.caption}</strong>
                    <a className="modelops-screenshot-link" href={screenshot.sourceUrl} target="_blank" rel="noreferrer">
                      Open full-size image on GitHub <ArrowUpRight aria-hidden="true" size={13} />
                    </a>
                    <span>Source: {screenshot.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected release evidence</h2>
            <p>
              The evidence below describes different parts of the control loop: automated rollout,
              quality rollback, restart recovery and deterministic verification. They are not
              merged into one synthetic score.
            </p>
            <div className="modelops-evidence-table" role="region" aria-label="Selected ModelOps release evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {modelOpsEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="observability" className="detail-section">
            <h2>Operator observability</h2>
            <p>
              The dashboard does not stop at “promoted” or “rolled back.” It shows traffic
              allocation, latency and error-rate comparisons, label coverage, positive-label
              counts, policy explanations, desired and observed router revisions, and one merged
              deployment timeline.
            </p>
            <div className="modelops-observability-flow" aria-label="ModelOps evidence sequence">
              <span>Traffic</span><ArrowRight aria-hidden="true" size={16} />
              <span>Labels</span><ArrowRight aria-hidden="true" size={16} />
              <span>Policy</span><ArrowRight aria-hidden="true" size={16} />
              <span>Action</span><ArrowRight aria-hidden="true" size={16} />
              <span>Reconciliation</span>
            </div>
            <p className="detail-muted">
              Each policy evaluation snapshots the window and data it used, so an old decision does
              not silently change its explanation when traffic moves later.
            </p>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="modelops-stack-table">
              {modelOpsStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section modelops-posture-section">
            <h2>Reference implementation with explicit limits</h2>
            <p>
              This is a production-oriented local control-plane reference implementation, not a
              production certification. The current scope intentionally uses SQLite, one router,
              Docker Compose and open demo endpoints.
            </p>
            <p>
              Kubernetes, PostgreSQL at deployment scale, Kafka-backed metrics, MLflow, OIDC/RBAC,
              multi-router reconciliation and longer soak testing are documented production
              evolution steps, not claims about the current implementation.
            </p>
          </section>

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="modelops-deep-dive">
              {modelOpsDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <div className="modelops-related-writing">
              <span>Related writing</span>
              {modelOpsRelatedWriting.map((article) => (
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
