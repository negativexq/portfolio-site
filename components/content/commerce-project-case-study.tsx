import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  commerceCapabilities,
  commerceDeepDiveLinks,
  commerceDeliveryRows,
  commerceEngineeringDecisions,
  commerceEvidence,
  commerceFailureWorkflow,
  commerceRelatedWriting,
  commerceStackGroups,
  commerceVisuals,
} from "@/data/real-time-commerce-platform";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";

type CommerceProjectCaseStudyProps = {
  project: Project;
};

const sections = [
  ["principle", "Principle"],
  ["capabilities", "What it does"],
  ["failure", "Failure story"],
  ["delivery", "Delivery vs effects"],
  ["architecture", "Architecture"],
  ["decisions", "Reliability patterns"],
  ["proof", "Repository proof"],
  ["evidence", "Evidence"],
  ["observability", "Observability"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

export function CommerceProjectCaseStudy({ project }: CommerceProjectCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="commerce-case-study">
      <header className="project-detail-hero commerce-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <p className="commerce-hero-category">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">
          Production-oriented event-driven commerce platform for asynchronous customer journeys.
          Kafka may deliver an event more than once; the processor makes durable business effects
          safe to replay with layered idempotency, transactional persistence and bounded failure
          handling.
        </p>
        <div className="commerce-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} />
          </a>
          <span>Production-oriented reference implementation · local evidence, not a production SLA</span>
        </div>
        {project.heroMetrics && project.heroMetrics.length > 0 ? (
          <MetricGrid metrics={project.heroMetrics} />
        ) : null}
      </header>

      <div className="container detail-layout commerce-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="principle" className="detail-section commerce-principle-section">
            <h2>Delivery can repeat. Durable business effects must not.</h2>
            <p>
              The platform models registrations, browsing, carts, orders, payments and refunds as
              versioned events. The important guarantee is not that Kafka never redelivers. It is
              that a replay cannot create a second order effect, fraud evaluation or derived alert.
            </p>
            <p>
              PostgreSQL owns durable business truth. Redis coordinates active processing but is
              deliberately reconstructible. Kafka offsets advance only after terminal handling,
              so delivery semantics and business-effect semantics stay explicit instead of being
              collapsed into an &quot;exactly once&quot; slogan.
            </p>
          </section>

          <section id="capabilities" className="detail-section">
            <h2>What the platform does</h2>
            <p>
              This is a runnable commerce reference system with an interactive Demo Control Center,
              deterministic fraud evaluation and an inspectable event processor path.
            </p>
            <div className="commerce-capability-grid">
              {commerceCapabilities.map((group) => (
                <article key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.items.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </section>

          <section id="failure" className="detail-section">
            <h2>The write may have succeeded</h2>
            <p>
              Consider the uncomfortable but normal timing window: the PostgreSQL transaction
              commits, then the processor crashes before Redis completion and the Kafka offset
              commit. The caller sees an interruption, but the business effect already exists.
            </p>
            <ol className="commerce-failure-workflow">
              {commerceFailureWorkflow.map((step, index) => (
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
              An exception tells the caller what it observed, not necessarily what PostgreSQL
              committed. That is why writes use stable event identity, durable uniqueness and
              transaction boundaries rather than blind retries.
            </p>
          </section>

          <section id="delivery" className="detail-section">
            <h2>At-least-once delivery vs durable effects</h2>
            <div className="commerce-delivery-table" role="region" aria-label="Delivery semantics and application correctness" tabIndex={0}>
              <table>
                <thead>
                  <tr>
                    {commerceDeliveryRows.map((column) => <th key={column.side} scope="col">{column.side}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {commerceDeliveryRows.map((column) => (
                      <td key={column.side}>
                        <ul>{column.items.map((item) => <li key={item}>{item}</li>)}</ul>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="commerce-inline-note">
              The offset is a delivery cursor, not proof that the business transaction happened
              exactly once. The durable ledger and the database transaction provide the replay
              boundary.
            </p>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section">
              <h2>Architecture</h2>
              <p>
                Browser-driven scenarios use the same Kafka and processor path as generated
                commerce events. Redis coordinates active ownership; PostgreSQL commits business,
                fraud and outbox state; a separate publisher emits committed fraud alerts; the
                DLQ receives invalid or retry-exhausted records.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section">
            <h2>Four reliability patterns</h2>
            <div className="commerce-decision-list">
              {commerceEngineeringDecisions.map((decision) => (
                <article key={decision.title}>
                  <h3>{decision.title}</h3>
                  <p>{decision.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="proof" className="detail-section">
            <h2>Repository proof</h2>
            <p>
              The project keeps the mechanics visible in repository diagrams. These are the actual
              architecture artifacts, linked to their original GitHub files so the full-size detail
              remains available on smaller screens.
            </p>
            <div className="commerce-visual-grid">
              {commerceVisuals.map((visual) => (
                <figure key={visual.src}>
                  <a
                    className="commerce-visual-frame"
                    href={visual.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${visual.caption} Open full-size source on GitHub`}
                  >
                    <Image
                      src={visual.src}
                      alt={visual.alt}
                      width={visual.width}
                      height={visual.height}
                      sizes="(max-width: 820px) 100vw, 68vw"
                    />
                  </a>
                  <figcaption>
                    <strong>{visual.caption}</strong>
                    <a className="commerce-visual-link" href={visual.sourceUrl} target="_blank" rel="noreferrer">
                      Open full-size source on GitHub <ArrowUpRight aria-hidden="true" size={13} />
                    </a>
                    <span>Source: {visual.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section">
            <h2>Measured evidence</h2>
            <p>
              The numbers below come from different paths and experiments. They are kept separate
              so a local isolated capacity result is not mistaken for Demo Control throughput or
              a production SLA.
            </p>
            <div className="commerce-evidence-table" role="region" aria-label="Selected commerce platform evidence" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Evidence slice</th><th scope="col">Current result</th><th scope="col">What it means</th></tr>
                </thead>
                <tbody>
                  {commerceEvidence.map((item) => (
                    <tr key={item.area}><th scope="row">{item.area}</th><td>{item.result}</td><td>{item.detail}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="observability" className="detail-section">
            <h2>Observability for the actual system</h2>
            <p>
              The Demo Control Center exposes run progress, outcomes, infrastructure health, fraud
              decisions, retries and DLQ state. Prometheus and Grafana add platform-wide views for
              processed rates, latency, consumer lag, persistence outcomes, outbox state and
              exporter health.
            </p>
            <div className="commerce-observability-flow" aria-label="Operational evidence surfaces">
              <span>Run outcome</span><ArrowRight aria-hidden="true" size={16} />
              <span>Durable state</span><ArrowRight aria-hidden="true" size={16} />
              <span>Lag / latency</span><ArrowRight aria-hidden="true" size={16} />
              <span>Fraud / outbox / DLQ</span>
            </div>
            <p className="detail-muted">
              Metrics use bounded labels. Customer identifiers and run IDs are kept out of
              Prometheus labels; run-specific counts come from PostgreSQL-backed projections.
            </p>
          </section>

          <section id="stack" className="detail-section">
            <h2>Current implementation</h2>
            <div className="commerce-stack-table">
              {commerceStackGroups.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section commerce-posture-section">
            <h2>Reference implementation with explicit limits</h2>
            <p>
              This is a production-oriented reference implementation for inspecting streaming
              failure modes. It does not claim production availability, exactly-once delivery,
              cloud deployment, general Kafka/PostgreSQL capacity or a production fraud decision
              service.
            </p>
            <p>
              The measured results come from a local Docker environment with one Kafka broker and
              the documented workload. The disruptive outage test was not run, and the isolated
              benchmark must not be read as the throughput of the interactive Demo Control path.
            </p>
          </section>

          <section id="deep-dive" className="detail-section">
            <h2>Deep dive</h2>
            <div className="commerce-deep-dive">
              {commerceDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} />
                </a>
              ))}
            </div>
            <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
              Open the full repository <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            <div className="commerce-related-writing">
              <span>Related writing</span>
              {commerceRelatedWriting.map((article) => (
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
