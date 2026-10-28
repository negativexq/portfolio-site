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
  agenticScreenshots,
  agenticStackGroups,
  agenticWalkthroughSlides,
  agenticWorkflow,
} from "@/data/agentic-customer-service-platform";
import { AgenticArchitecture } from "./agentic-architecture";
import { AgenticSectionIndex } from "./agentic-section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";

type AgenticProjectCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["workflow", "Workflow story"],
  ["evidence", "Results"],
  ["control-plane", "Who decides"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["showcase", "Console"],
  ["observability", "Observability"],
  ["stack", "Stack"],
  ["in-short", "In short"],
  ["related", "Related"],
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
        </div>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          A customer-support agent that looks up orders, handles refunds and cancellations and
          escalates to a human. The model reads the request and suggests the action; server code
          checks the customer, applies the policy, asks for confirmation and runs it exactly once.
        </p>
        <blockquote className="agentic-hero-principle">
          The LLM proposes. Deterministic software decides what may execute.
        </blockquote>
        <div className="agentic-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
        </div>
      </header>

      <div className="container detail-layout agentic-detail-layout">
        <AgenticSectionIndex sections={sections} />

        <div className="detail-content">
          <section id="principle" className="detail-section agentic-principle-section">
            <h2>What the model can and cannot do</h2>
            <p>
              The model reads what the customer wants and proposes an action. It cannot pick which
              customer it is serving, make up an order number, approve its own refund or change
              account data. Those decisions live in code that can be tested.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>Support work, end to end</h2>
            <p>
              The agent answers policy questions from a knowledge base and carries out account
              actions through a separate, controlled path.
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
            <h2>One refund, interrupted halfway</h2>
            <p>
              The agent asks the customer to confirm a refund, and the customer replies with a
              question instead. This is how the platform handles it.
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
          </section>

          <section id="evidence" className="detail-section">
            <h2>Results</h2>
            <p>
              Safety, operations, resilience and answer quality are tested separately, so each
              result stands on its own.
            </p>
            <div className="agentic-evidence-table" role="region" aria-label="Selected evaluation evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Test</th><th scope="col">Result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {agenticEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="agentic-evidence-note">
              Across the release test runs: no safety check failed, and there were no
              unauthorized changes, skipped confirmations, duplicate actions, memory writes that
              granted permission or customer-data leaks.
            </p>
          </section>

          <section id="control-plane" className="detail-section">
            <h2>Who decides what</h2>
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
            <p>
              In a typical agent, the order number the model writes goes straight into the tool.
              Here the server checks it first:
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
              <h2>From request to action</h2>
              <p>
                The server knows who the customer is before the agent runs. Knowledge and memory
                help the answer, but only the server&apos;s checks can let an action through.
              </p>
              <AgenticArchitecture architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Three reliability decisions</h2>
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
            <h2>The operator console</h2>
            <p>
              Screens from the running demo. Open any image for the full-size view.
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
                  </figcaption>
                </figure>
              ))}
            </div>
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

          <section id="observability" className="detail-section">
            <h2>What the operator sees</h2>
            <p>
              For every request, the console shows what the system decided, whether it was allowed,
              whether it ran and which evidence supported it.
            </p>
            <div className="agentic-observability-flow" aria-label="Operator investigation sequence">
              <span>Decision</span><ArrowRight aria-hidden="true" size={16} />
              <span>Authority</span><ArrowRight aria-hidden="true" size={16} />
              <span>Execution</span>
            </div>
            <p className="detail-muted">
              Workflow steps, policy results, retrieved evidence and traces are all there. Raw
              prompts, hidden reasoning and secrets are not.
            </p>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="agentic-stack-table">
              {agenticStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <ProjectInShort project={project} />

          <ProjectRelated project={project} showWriting={false} />

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
              <span>Related writing</span>
              {agenticRelatedWriting.slice(0, 4).map((article) => (
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
