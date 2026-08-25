import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  agenticCapabilities,
  agenticControlPlaneRows,
  agenticDeepDiveLinks,
  agenticEngineeringDecisions,
  agenticEvidence,
  agenticRelatedWriting,
  agenticRelatedWritingFoundations,
  agenticScreenshots,
  agenticStackGroups,
  agenticWalkthroughSlides,
  agenticWorkflow,
} from "@/data/agentic-customer-service-platform";
import { ArchitectureDiagram } from "./architecture-diagram";
import { AgenticSectionIndex } from "./agentic-section-index";

type AgenticProjectCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["workflow", "Workflow story"],
  ["control-plane", "Control plane"],
  ["direct-tooling", "Direct tools"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["showcase", "Product proof"],
  ["walkthrough", "Workflow walkthrough"],
  ["evidence", "Evidence"],
  ["observability", "Observability"],
  ["stack", "Stack"],
  ["release", "Release posture"],
  ["deep-dive", "Deep dive"],
] as const;

export function AgenticProjectCaseStudy({ project }: AgenticProjectCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="agentic-case-study">
      <header className="project-detail-hero agentic-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <div className="agentic-hero-meta">
          <p>{project.category}</p>
          <span className="agentic-release-badge">Ready with warnings</span>
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          Production-oriented Agentic AI Control Plane for customer-support workflows. The LLM
          proposes semantic intent; deterministic software owns authentication, customer scope,
          target resolution, policy, confirmation, revalidation, idempotency and execution.
        </p>
        <blockquote className="agentic-hero-principle">
          The LLM proposes. Deterministic software decides what may execute.
        </blockquote>
        <div className="agentic-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Reference implementation · not unrestricted production certification</span>
        </div>
      </header>

      <div className="container detail-layout agentic-detail-layout">
        <AgenticSectionIndex sections={sections} />

        <div className="detail-content">
          <section id="principle" className="detail-section agentic-principle-section">
            <h2>Natural-language understanding and execution authority stay separate</h2>
            <p>
              The model can interpret a request and propose a semantic action. It cannot choose
              the trusted customer, invent an authoritative identifier, approve its own refund, or
              commit a business mutation.
            </p>
            <p>
              The model is intentionally treated as an untrusted semantic component, not an
              authorization or transaction engine.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the platform does</h2>
            <p>
              This is a customer-service agent platform with a bounded knowledge path and a
              controlled business-action path.
            </p>
            <div className="agentic-capability-grid">
              {agenticCapabilities.map((group) => (
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
            <h2>One workflow, interrupted safely</h2>
            <p>
              A refund request makes the authority boundary concrete. A question that sounds like
              approval still has to remain a question.
            </p>
            <ol className="agentic-workflow">
              {agenticWorkflow.map((step, index) => (
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
              This is why natural-language understanding and execution authority are separate:
              conversational fluency can interrupt a workflow without silently satisfying its
              approval boundary.
            </p>
          </section>

          <section id="control-plane" className="detail-section">
            <h2>Model vs deterministic control plane</h2>
            <div className="agentic-comparison" role="region" aria-label="Model and deterministic control plane responsibilities" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    <th scope="col">Model / probabilistic</th>
                    <th scope="col">Deterministic / server-owned</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {agenticControlPlaneRows.map((column) => (
                      <td key={column.side}>
                        <ul>
                          {column.items.map((item) => <li key={item}>{item}</li>)}
                        </ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="direct-tooling" className="detail-section">
            <h2>Why not direct tool calling?</h2>
            <p>
              A tool argument or identifier is not trusted simply because the model emitted it.
            </p>
            <div className="agentic-flow-compare">
              <div>
                <p>Typical direct path</p>
                <pre><code>{"LLM\n  → refund_order(order_id=123)\n  → execute"}</code></pre>
              </div>
              <div>
                <p>Controlled path</p>
                <pre><code>{"LLM → semantic proposal\nServer → auth / scope / target resolution\n      → validation / policy / confirmation\n      → revalidation → typed execution\n      → idempotency + database"}</code></pre>
              </div>
            </div>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Security checks precede semantic routing. The controlled business-action path
                keeps target resolution, typed validation, policy, confirmation, revalidation,
                idempotency and database ownership visible. Knowledge follows a separate bounded
                path: retrieval, grounding validation, then a bounded answer.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Three reliability patterns</h2>
            <div className="agentic-decision-list">
              {agenticEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="showcase" className="detail-section">
            <h2>Product proof from the current console</h2>
            <p>
              These are curated repository captures of the bounded runtime and operator
              projections, not live production telemetry or certification.
            </p>
            <div className="agentic-screenshot-grid">
              {agenticScreenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <a
                    className="agentic-screenshot-frame"
                    href={screenshot.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${screenshot.caption} Open full-size image on GitHub`}
                  >
                    <Image src={screenshot.src} alt={screenshot.alt} width={1440} height={900} sizes="(max-width: 820px) 100vw, 50vw" />
                  </a>
                  <figcaption>
                    <strong>{screenshot.caption}</strong>
                    <a className="agentic-screenshot-link" href={screenshot.sourceUrl} target="_blank" rel="noreferrer">
                      Open full-size image on GitHub <ArrowUpRight aria-hidden="true" size={13} />
                    </a>
                    <span>Source: {screenshot.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="walkthrough" className="detail-section">
            <h2>Workflow walkthrough</h2>
            <p>
              Three focused captures make the interruption, durable workflow state, and bounded
              RAG decision visible at a glance. Open any image for its full-size local view.
            </p>
            <div className="agentic-walkthrough-grid">
              {agenticWalkthroughSlides.map((slide) => (
                <figure key={slide.src}>
                  <a
                    className="agentic-walkthrough-frame"
                    href={slide.src}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${slide.caption} Open full-size image`}
                  >
                    <Image src={slide.src} alt={slide.alt} width={1080} height={1350} sizes="(max-width: 640px) 100vw, (max-width: 1020px) 50vw, 33vw" />
                  </a>
                  <figcaption>{slide.caption}</figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Selected evaluation evidence</h2>
            <p>
              The denominators stay separate: semantic safety, operational release behavior,
              deterministic resilience and real-LLM quality are different claims.
            </p>
            <div className="agentic-evidence-table" role="region" aria-label="Selected evaluation evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {agenticEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="agentic-evidence-note">
              Across the exercised release evidence: 0 safety invariant failures, 0 unauthorized
              mutations, 0 confirmation bypasses, 0 duplicate effects, 0 authority-bearing memory
              writes and 0 customer-data disclosures. The 82/18 split is a quality-outcome
              breakdown, not a safety rate.
            </p>
          </section>

          <section id="observability" className="detail-section">
            <h2>Operator observability</h2>
            <p>
              The operator console shows not just what the model said, but what the system
              decided, what authority existed, whether execution was attempted, and which evidence
              supported the outcome.
            </p>
            <div className="agentic-observability-flow" aria-label="Operator investigation sequence">
              <span>Decision</span><ArrowRight aria-hidden="true" size={16} />
              <span>Authority</span><ArrowRight aria-hidden="true" size={16} />
              <span>Execution</span>
            </div>
            <p className="detail-muted">
              It exposes workflow lifecycle, validation, policy, RAG evidence, replay/idempotency
              outcome and trace context through bounded projections without exposing hidden
              reasoning, raw prompts or secrets.
            </p>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="agentic-stack-table">
              {agenticStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
            <p className="detail-muted">
              Ollama remains optional/local compatibility tooling; it is not the main production
              provider story.
            </p>
          </section>

          <section id="release" className="detail-section agentic-release-section">
            <div className="agentic-release-heading">
              <div>
                <h2>Ready with warnings</h2>
                <p>
                  No Critical/High safety failures were found in the exercised release gates.
                  Bounded coverage, observability and quality warnings remain.
                </p>
              </div>
              <span className="agentic-release-badge">Ready with warnings</span>
            </div>
            <p>
              This is production-oriented reference-deployment evidence, not unrestricted
              production certification. It does not certify public-internet TLS, enterprise IdP
              provisioning, multi-region operation, regulatory compliance or unrestricted capacity.
            </p>
          </section>

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="agentic-deep-dive">
              {agenticDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <div className="agentic-related-writing">
              <span>Related writing series</span>
              {agenticRelatedWriting.map((article) => (
                <Link key={article.href} href={article.href}>
                  <strong>{article.title}</strong>
                  <small>{article.description}</small>
                  <ArrowRight aria-hidden="true" size={16} />
                </Link>
              ))}
              <span className="agentic-related-writing-subheading">Earlier foundations</span>
              {agenticRelatedWritingFoundations.map((article) => (
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
