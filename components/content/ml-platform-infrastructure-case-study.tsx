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
  ["showcase", "Web workspace"],
  ["capabilities", "Capabilities"],
  ["architecture", "Target architecture"],
  ["workflow", "Model lifecycle"],
  ["boundaries", "Access and traffic"],
  ["decisions", "Design decisions"],
  ["evidence", "Infrastructure foundation"],
  ["stack", "Stack"],
  ["deployment", "Deployment design"],
  ["in-short", "In short"],
  ["related", "Related"],
  ["deep-dive", "Deep dive"],
] as const;

export function MlPlatformInfrastructureCaseStudy({ project }: { project: Project }) {
  const architecture = getProjectArchitecture(project.id);
  return (
    <main className="modelops-case-study">
      <header className="project-detail-hero modelops-hero container">
        <Link className="back-link" href="/projects"><ArrowLeft aria-hidden="true" size={14} /> All projects</Link>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">{project.summary}</p>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <a className="button button-secondary" href="#architecture">Explore the architecture</a>
        </div>
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />
        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section">
            <h2>One lifecycle, two planes</h2>
            <p>
              ML Platform organizes training, evaluation, promotion and serving around a shared project
              workspace. Its target architecture gives each project identity, roles, quotas and a durable
              record of the changes requested by its users.
            </p>
            <p>
              PostgreSQL holds lifecycle intent. Reconcilers drive Kubernetes, Argo Workflows, MLflow
              and KServe toward it. A separate inference gateway governs model predictions, streaming
              chat and container-function calls, allowing management and serving traffic to scale independently.
            </p>
          </section>

          <section id="showcase" className="detail-section">
            <h2>The web workspace</h2>
            <p>Repository captures from the local demo show the platform overview, project navigation and the Credit Risk workspace.</p>
            <div className="agentic-screenshot-grid">
              {mlPlatformInfrastructureScreenshots.map((image) => (
                <figure key={image.src}>
                  <a className="agentic-screenshot-frame" href={image.src} target="_blank" rel="noreferrer" aria-label={`${image.caption}. Open full-size image`}>
                    <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(max-width: 820px) 100vw, 800px" />
                  </a>
                  <figcaption><strong>{image.caption}</strong><span>Local demo · open the image for the full-size view</span></figcaption>
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
              <h2>Target architecture</h2>
              <p>
                The control plane records intent and returns; background reconciliation handles infrastructure.
                The data plane checks caller access and endpoint state before forwarding traffic. External
                systems sit behind adapters, keeping lifecycle rules independent of their SDKs.
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
            {project.heroMetrics?.length ? <MetricGrid metrics={project.heroMetrics} /> : null}
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
            <h2>Local and cloud deployment design</h2>
            <p>The same lifecycle contracts map onto local development services and an AWS deployment design. Infrastructure provisioning stays separate from model and serving intent.</p>
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
