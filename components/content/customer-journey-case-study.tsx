import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { journeyCapabilities, journeyContracts, journeyDecisions, journeyDeepDive, journeyScreenshots, journeySource } from "@/data/customer-journey-composer";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectProof } from "./project-proof";
import { ProjectInShort, ProjectRelated } from "./project-related";
import { TagList } from "./tag-list";
import { MotionController } from "@/components/motion/motion-controller";
import { ArchitectureDiagram } from "./architecture-diagram";
import { getProjectArchitecture } from "@/data/architectures";

const sections = [
  ["principle", "The problem"],
  ["capabilities", "Product capabilities"],
  ["workflow", "Journey workflow"],
  ["architecture", "Architecture"],
  ["contracts", "Runtime guarantees"],
  ["decisions", "Design decisions"],
  ["recovery", "Provider failures"],
  ["performance", "Performance"],
  ["showcase", "Product proof"],
  ["evidence", "Evidence"],
  ["stack", "Stack"],
  ["in-short", "In short"],
  ["deep-dive", "Deep dive"],
] as const;

const shotPath = (file: string) => `/projects/customer-journey-composer/${file}`;

export function CustomerJourneyCaseStudy({ project }: { project: Project }) {
  const architecture = getProjectArchitecture(project.id);
  return (
    <main className="campaign-case-study">
      <MotionController />
      <header className="project-detail-hero container">
        <Link className="back-link" href="/projects"><ArrowLeft aria-hidden="true" size={14} /> All projects</Link>
        <p className="modelops-hero-category">{project.category}</p>
        <h1>{project.title}</h1>
        <p className="project-detail-summary">{project.summary}</p>
        <div className="modelops-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight aria-hidden="true" size={15} /></a>
          <a className="text-link" href="#workflow">Follow a journey from brief to live</a>
        </div>
        <MetricGrid metrics={project.heroMetrics ?? []} />
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />
        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section" data-reveal>
            <h2>A campaign sends once. A journey keeps going.</h2>
            <p>A customer leaves a cart. An hour later they get an email; if they still have not bought after a day, a push; if they have, the journey stops. Each customer moves through the same steps at their own pace, and a journey can run for days.</p>
            <p>Customer Journey Composer lets a marketer describe that journey in plain language and get it drawn on a canvas: the entry event, the waits, the conditions and branches, the email, SMS and push steps, and the goal that ends it. Claude or OpenAI writes the proposal; a person reviews it, edits it and decides when it goes live.</p>
            <p>Once published, the journey belongs to the runtime. A Go worker on PostgreSQL carries every customer through the exact version they entered, survives restarts, and sends each message once. It is the sister project of <Link href="/projects/smart-campaign-composer">Smart Campaign Composer</Link>, which handles one-off campaigns.</p>
          </section>

          <section id="capabilities" className="detail-section" data-reveal>
            <h2>Built for the person running the journey.</h2>
            <p>Every journey goes through the same five steps: describe, review, test, publish and follow.</p>
            <div className="campaign-capabilities">
              {journeyCapabilities.map((capability) => (
                <article key={capability.title} data-reveal>
                  <h3>{capability.title}</h3>
                  <div><p>{capability.description}</p><p className="campaign-benefit">{capability.benefit}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section id="workflow" className="detail-section" data-reveal>
            <h2>From brief to live journey.</h2>
            <p>The demo workspace, Northstar Commerce, has a published Abandoned Cart Recovery journey, 14 fictional customers and five Test Lab scenarios. The path below is the one every journey takes.</p>
            <ol className="campaign-workflow">
              <li><strong>Describe.</strong> Write the brief and confirm the behavior contract: what must happen when the customer buys, when they do not, and who is eligible.</li>
              <li><strong>Review.</strong> The proposal arrives as a diagram with a summary of each change. Ask for edits in your own words, then apply it as a draft.</li>
              <li><strong>Edit and test.</strong> Adjust any step on the canvas. Run the Test Lab scenarios on a virtual clock and read every message in the test inbox.</li>
              <li><strong>Publish.</strong> An Admin publishes a fixed version once a full sandbox run of that exact workflow has passed.</li>
              <li><strong>Follow.</strong> The live monitor and analytics show entries, waits, sends, goals and each customer&apos;s path.</li>
            </ol>
          </section>

          <section id="architecture" className="detail-section" data-reveal>
            <h2>The model proposes. The runtime executes.</h2>
            <p>The model is only involved before publishing. Its answer is checked against a versioned schema, the behavior contract and the brief, then shown to a person. Nothing it returns is saved or sent without that person applying it.</p>
            <p>After publishing, PostgreSQL is the single source of truth. Steps, jobs, waits and the outbox are rows; workers claim due work with <code>FOR UPDATE SKIP LOCKED</code>, leases and fencing tokens. The API and worker share state through the database rather than calling each other.</p>
            {architecture ? <ArchitectureDiagram architecture={architecture} /> : null}
            <a className="text-link" href={journeySource("docs/ARCHITECTURE.md")} target="_blank" rel="noreferrer">Read the architecture <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="contracts" className="detail-section" data-reveal>
            <h2>What the runtime guarantees.</h2>
            <p>A journey outlives the browser tab that published it and the worker that started it. These rules keep each customer&apos;s path predictable across edits, restarts and provider trouble.</p>
            <div className="campaign-contracts">
              {journeyContracts.map((contract) => (
                <article key={contract.title} data-reveal>
                  <h3>{contract.title}</h3>
                  <p>{contract.description}</p>
                  <a className="text-link" href={journeySource(contract.source)} target="_blank" rel="noreferrer">Read the design <ArrowUpRight aria-hidden="true" size={14} /></a>
                </article>
              ))}
            </div>
          </section>

          <section id="decisions" className="detail-section" data-reveal>
            <h2>Keep the AI before the publish button.</h2>
            <div className="campaign-decisions">
              {journeyDecisions.map((decision) => <article key={decision.title} data-reveal><h3>{decision.title}</h3><p>{decision.description}</p></article>)}
            </div>
          </section>

          <section id="recovery" className="detail-section" data-reveal>
            <h2>Provider trouble is not a failed customer.</h2>
            <p>Each message has five attempts. A busy or locked channel costs no attempt, so a provider outage holds messages instead of failing them. Every rule is a column on the channel&apos;s PostgreSQL row, shared by all workers.</p>
            <div className="campaign-performance" role="region" aria-label="Provider failure handling" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">What happened</th><th scope="col">What the worker does</th><th scope="col">Uses an attempt</th></tr></thead>
                <tbody>
                  <tr><th scope="row">429 from the provider</th><td>Every worker pauses the channel for Retry-After, between 1 and 30 s.</td><td>No</td></tr>
                  <tr><th scope="row">401 or SMTP login refused</th><td>Lock the channel; one call every 30 s tests the credentials.</td><td>No</td></tr>
                  <tr><th scope="row">5xx, 408 or connection failure</th><td>Retry after 2, 4, 8, 16, 32 s with jitter, under the same idempotency key.</td><td>Yes</td></tr>
                  <tr><th scope="row">Half of recent calls failing</th><td>Open the circuit breaker for the workspace and channel, then probe.</td><td>No, while open</td></tr>
                  <tr><th scope="row">No answer after a possible send</th><td>Mark SMTP outcomes UNKNOWN for an operator; never resend blindly.</td><td>Yes</td></tr>
                </tbody>
              </table>
            </div>
            <a className="text-link" href={journeySource("docs/DELIVERY-RESILIENCE.md")} target="_blank" rel="noreferrer">Read the delivery rules <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="performance" className="detail-section" data-reveal>
            <h2>Twice as fast, without new infrastructure.</h2>
            <p>The benchmark puts 10,000 customers in one published journey, moves all their timers to the same deadline and lets real workers run timer, condition, SMS and exit. Reordering the queue SQL halved the time to drain every send.</p>
            <div className="campaign-performance" role="region" aria-label="Measured performance before and after" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Metric</th><th scope="col">Before</th><th scope="col">After</th></tr></thead>
                <tbody>
                  <tr><th scope="row">All 10,000 mock sends accepted</th><td>176.7 s</td><td>87.5 to 89.5 s</td></tr>
                  <tr><th scope="row">Timer step lateness, p95</th><td>15.75 s</td><td>9.25 to 9.41 s</td></tr>
                </tbody>
              </table>
            </div>
            <p>No index, cache, connection pool increase or Redis was added. The worker&apos;s claims now walk the ordered pending indexes first and filter after, and drains continue from where they left off instead of rescanning the queue.</p>
            <p className="detail-muted">PostgreSQL 17 in Docker, limited to 2 CPU and 2 GiB, two final repetitions. Ingestion latency did not improve, because the faster producer meets the per-workspace request limiter.</p>
            <a className="text-link" href={journeySource("docs/PERFORMANCE.md")} target="_blank" rel="noreferrer">Read the measurements <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="showcase" className="detail-section" data-reveal>
            <h2>The working product.</h2>
            <p>Every screen below is the running application with the demo workspace. Open any screenshot to see it full size.</p>
            <div className="campaign-screenshots">
              {journeyScreenshots.map((shot) => (
                <figure key={shot.file} data-reveal>
                  <a href={shotPath(shot.file)} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${shot.title}`}>
                    <Image src={shotPath(shot.file)} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 820px) 100vw, 70vw" />
                  </a>
                  <figcaption><strong>{shot.title}</strong><p>{shot.description}</p></figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section" data-reveal>
            <h2>Measured runs.</h2>
            <p>Generation quality and runtime behavior are measured separately. Each figure links back to a dated report in the repository.</p>
            <div className="proof-grid">{project.proofPoints.map((proof) => <ProjectProof key={proof.label} proof={proof} />)}</div>
          </section>

          <section id="stack" className="detail-section" data-reveal>
            <h2>Run it locally.</h2>
            <TagList items={project.technologies} label="Customer Journey Composer technology stack" />
            <p>Docker Compose starts the web app, API, worker, PostgreSQL and Mailpit; SMS and push go to mock providers. The demo reset prepares Northstar Commerce with its journey, customers and scenarios.</p>
            <pre className="campaign-commands"><code>{"git clone https://github.com/negativexq/customer-journey-composer.git\ncd customer-journey-composer\nmake up\nnpm run demo:reset\n# Open http://localhost:5173"}</code></pre>
            <p>OpenTelemetry traces, Prometheus metrics with tested alert rules, Grafana and Tempo cover the runtime; Playwright tests run the main flows on desktop and mobile.</p>
          </section>

          <ProjectInShort project={project} />
          <ProjectRelated project={project} />
          <section id="deep-dive" className="detail-section" data-reveal>
            <h2>Follow the implementation.</h2>
            <div className="dbt-deep-dive">{journeyDeepDive.map(([label, path]) => <a key={path} href={journeySource(path)} target="_blank" rel="noreferrer"><span>{label}</span><ArrowUpRight aria-hidden="true" size={15} /></a>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
