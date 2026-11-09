import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { campaignCapabilities, campaignContracts, campaignDecisions, campaignDeepDive, campaignScreenshots, campaignSource } from "@/data/smart-campaign-composer";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectProof } from "./project-proof";
import { ProjectInShort } from "./project-related";
import { TagList } from "./tag-list";
import { MotionController } from "@/components/motion/motion-controller";
import { ArchitectureDiagram } from "./architecture-diagram";
import { getProjectArchitecture } from "@/data/architectures";

const sections = [
  ["principle", "The problem"],
  ["capabilities", "Product capabilities"],
  ["workflow", "Campaign workflow"],
  ["performance", "Capacity and limits"],
  ["architecture", "Architecture"],
  ["contracts", "State and ownership"],
  ["decisions", "Reliability patterns"],
  ["recovery", "Failure recovery"],
  ["showcase", "Product proof"],
  ["evidence", "Evidence and limits"],
  ["stack", "Stack"],
  ["in-short", "In short"],
  ["deep-dive", "Deep dive"],
] as const;

export function SmartCampaignCaseStudy({ project }: { project: Project }) {
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
          <a className="text-link" href="#workflow">Watch the campaign flow</a>
        </div>
        <MetricGrid metrics={project.heroMetrics ?? []} />
      </header>

      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />
        <div className="detail-content">
          <section id="principle" className="detail-section modelops-principle-section" data-reveal>
            <h2>The whole campaign, together.</h2>
            <p>A marketer starts with an offer and an audience in mind. Getting that campaign out means translating the brief into filters, writing each channel and language, choosing a design, checking the final message and finding out who actually received it.</p>
            <p>Smart Campaign Composer brings those steps into one workspace. The brief becomes a proposed audience, reusable templates give the copy a home, and every campaign keeps its language versions, approval, schedule and delivery history together. The marketer can move from an idea to an inspectable result without handing each step to a separate tool.</p>
            <p>The AI helps with the writing and audience proposal. Backend checks, a reviewed revision and durable delivery protect the path to sending. The included provider simulates SMS and email delivery, so the complete workflow can be demonstrated locally.</p>
          </section>

          <section id="capabilities" className="detail-section" data-reveal>
            <h2>Built around the marketer.</h2>
            <p>Cart reminders, new arrivals and win-back offers use the same workflow. Choose the audience, shape the message and see the result with the campaign's context still in front of you.</p>
            <div className="campaign-capabilities">
              {campaignCapabilities.map((capability) => (
                <article key={capability.title} data-reveal>
                  <h3>{capability.title}</h3>
                  <div><p>{capability.description}</p><p className="campaign-benefit">{capability.benefit}</p></div>
                </article>
              ))}
            </div>
          </section>

          <section id="workflow" className="detail-section" data-reveal>
            <h2>From brief to test inbox.</h2>
            <p>The recorded walkthrough starts with a cart reminder for customers in İzmir: no purchase after adding to their cart in the last 14 days, 15% off, code SEPET15 and a destination link. It follows audience validation, message review, approval and 173 queued messages into the test inbox.</p>
            <video className="campaign-demo" controls playsInline preload="none" poster="/projects/smart-campaign-composer/campaign-live.png" aria-label="Smart Campaign Composer demonstration from brief to mock-provider inbox">
              <source src="/projects/smart-campaign-composer/demo-claude.mp4" type="video/mp4" />
              <a href="/projects/smart-campaign-composer/demo-claude.mp4">Download the campaign walkthrough</a>
            </video>
            <p className="detail-muted">Repository demo, 3:16. Model writing is sped up. Claude Haiku 5.5, seeded customers and a mock delivery provider.</p>
            <ol className="campaign-workflow">
              <li><strong>Describe and validate.</strong> Choose channels and a template; inspect the proposed filters, counts, assumptions and unsupported conditions.</li>
              <li><strong>Write and review.</strong> Generate and edit each language’s messages. Review binds approval to the audience, content and options shown.</li>
              <li><strong>Approve and queue.</strong> Send now or schedule a run. Workers claim durable deliveries, recheck consent and coordinate per-channel permits.</li>
              <li><strong>Follow the result.</strong> SSE carries progress; the report distinguishes acceptance, simulated delivery, bounces, skipped messages and unknown outcomes.</li>
            </ol>
          </section>

          <section id="performance" className="detail-section" data-reveal>
            <h2>Capacity and delivery policy.</h2>
            <p>The campaign list has measured throughput above 2,000 API requests per second on the local test machine. Sending follows a separate policy: a maximum of 100 provider calls per second for SMS and another 100 for email, shared across workers.</p>
            <div className="campaign-performance" role="region" aria-label="Measured capacity and configured delivery limits" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">What was measured</th><th scope="col">Result</th><th scope="col">Scope</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Campaign list, with previews</th><td>2,040 to 2,261 requests/s</td><td>Current measured read path, three alternating runs.</td></tr>
                  <tr><th scope="row">Earlier list, without previews</th><td>2,123 to 2,609 requests/s</td><td>The earlier result behind the roughly 2,500 RPS figure.</td></tr>
                  <tr><th scope="row">Six-endpoint API mix</th><td>800 requests/s served</td><td>Recorded on 494k deliveries; 600 requests/s with 10k campaigns.</td></tr>
                  <tr><th scope="row">Outbound provider calls</th><td>100/s per channel</td><td>Configured send ceiling across every worker, including retries.</td></tr>
                  <tr><th scope="row">Queue stress test</th><td>1.02 million waiting deliveries</td><td>Baseline test: 2.6 ms median claim time; one 180-second observation window.</td></tr>
                </tbody>
              </table>
            </div>
            <h3>Why sending stays at 100</h3>
            <p>The delivery budget keeps calls within the configured provider allowance. SMS and email have independent queues and limits, so trouble on one channel does not hold up the other. More workers can share the work while Redis coordinates the same channel budget. Provider latency, retries and pauses can reduce the accepted rate below that ceiling.</p>
            <p>The performance work focused on avoiding repeated history scans: snapshot approved audiences, keep finished-run counts, index progress reads and read list previews from generated columns. Twenty open campaign pages then needed four database queries a second instead of eighty, and hidden tabs stopped polling.</p>
            <p className="detail-muted">API, PostgreSQL and the load generator shared an 8-CPU Docker environment on one Mac. Read throughput and the configured send rate measure different operations; these tests do not establish a 2,500-message/s delivery capacity.</p>
            <a className="text-link" href={campaignSource("docs/performance.md#optimization-log")} target="_blank" rel="noreferrer">Read the measurements and optimization history <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="architecture" className="detail-section" data-reveal>
            <h2>Shared state, separate workers.</h2>
            <p>The API and worker communicate through PostgreSQL rather than calling each other. Campaign state, approval, recipient snapshots, runs, delivery attempts and the send queue live in the same durable store.</p>
            <p>PostgreSQL owns the durable business state; Redis holds the shared, short-lived delivery controls. This keeps a campaign's place in the queue and its recorded status in one transaction. The worker runs independent SMS and email loops with up to 32 calls in flight per channel, while the shared limiter determines how many calls may proceed.</p>
            {architecture ? <ArchitectureDiagram architecture={architecture} /> : null}
            <a className="text-link" href={campaignSource("docs/architecture.md")} target="_blank" rel="noreferrer">Read the architecture and data model <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="contracts" className="detail-section" data-reveal>
            <h2>State has an owner.</h2>
            <p>The campaign, generated content, approval, send run and individual delivery have different lifetimes. Explicit ownership keeps a late model answer, stale browser tab or restarted worker from changing a decision that has already moved on.</p>
            <div className="campaign-contracts">
              {campaignContracts.map((contract) => (
                <article key={contract.title} data-reveal>
                  <h3>{contract.title}</h3>
                  <p>{contract.description}</p>
                  <a className="text-link" href={campaignSource(contract.source)} target="_blank" rel="noreferrer">Read the design decision <ArrowUpRight aria-hidden="true" size={14} /></a>
                </article>
              ))}
            </div>
          </section>

          <section id="decisions" className="detail-section" data-reveal>
            <h2>Protect the send boundary.</h2>
            <div className="campaign-decisions">
              {campaignDecisions.map((decision) => <article key={decision.title} data-reveal><h3>{decision.title}</h3><p>{decision.description}</p></article>)}
            </div>
          </section>

          <section id="recovery" className="detail-section" data-reveal>
            <h2>Recovery is part of sending.</h2>
            <p>A transient provider problem should leave messages waiting for the right recovery action. The worker distinguishes a busy channel, refused credentials, a lost answer and an interrupted process instead of treating every unsuccessful call as a failed recipient.</p>
            <div className="campaign-performance" role="region" aria-label="Failure handling and recovery behavior" tabIndex={0}>
              <table>
                <thead><tr><th scope="col">Interruption</th><th scope="col">System response</th><th scope="col">What stays intact</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Provider returns 429</th><td>Pause the channel across workers for Retry-After, then retry.</td><td>The message keeps its attempt budget.</td></tr>
                  <tr><th scope="row">Credentials return 401</th><td>Hold the channel; allow one shared credential probe every 30 seconds.</td><td>Pending messages stay retryable; the other channel continues.</td></tr>
                  <tr><th scope="row">Worker crashes mid-send</th><td>Recover the delivery when its one-minute lease expires.</td><td>The retry uses the same idempotency key; a stale worker cannot record over the new claim.</td></tr>
                  <tr><th scope="row">Provider answer is lost</th><td>Retry with backoff and jitter. Exhausted attempts with a timeout end as UNKNOWN.</td><td>The report preserves uncertainty about whether the message was accepted.</td></tr>
                  <tr><th scope="row">Redis loses its window</th><td>Wait eight seconds before granting new permits.</td><td>The durable delivery queue remains in PostgreSQL.</td></tr>
                  <tr><th scope="row">Campaign stops progressing</th><td>After ten minutes with retries waiting and no deliveries finishing, pause for a person's Resume.</td><td>Queued messages and their keys survive the pause.</td></tr>
                </tbody>
              </table>
            </div>
            <p>A circuit breaker holds a failing channel and probes for recovery. The mock provider journals accepted keys and owed delivery reports before replying, so a restart can recognize a retry and resume reporting. Duplicate prevention depends on the provider honoring that key; a real integration must preserve the same contract.</p>
            <a className="text-link" href={campaignSource("docs/errors-and-retries.md")} target="_blank" rel="noreferrer">Read the failure and recovery rules <ArrowUpRight aria-hidden="true" size={15} /></a>
          </section>

          <section id="showcase" className="detail-section" data-reveal>
            <h2>The working product.</h2>
            <p>The product carries the campaign through authoring, audience review, branded content, scheduling and reporting. Open any screenshot to inspect the full interface.</p>
            <div className="campaign-screenshots">
              {campaignScreenshots.map((shot) => (
                <figure key={shot.file} data-reveal>
                  <a href={`/projects/smart-campaign-composer/${shot.file}`} target="_blank" rel="noreferrer" aria-label={`Open full-size image: ${shot.title}`}>
                    <Image src={`/projects/smart-campaign-composer/${shot.file}`} alt={shot.alt} width={shot.width} height={shot.height} sizes="(max-width: 820px) 100vw, 70vw" />
                  </a>
                  <figcaption><strong>{shot.title}</strong><p>{shot.description}</p></figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section" data-reveal>
            <h2>Evidence with its limits.</h2>
            <p>Model behavior and delivery reliability are measured separately. The figures below describe recorded repository runs, with source reports linked in the deep dive.</p>
            <div className="proof-grid">{project.proofPoints.map((proof) => <ProjectProof key={proof.label} proof={proof} />)}</div>
            <div className="campaign-limits">
              <h3>What remains open</h3>
              <p>The deterministic validator has known cases where a model can drop a condition without being caught. The latest recorded model run had no silently wrong outcomes, but does not prove the validator complete.</p>
              <p>The load report records rate overshoot when workers are deliberately configured above the provider limit or Redis’s clock jumps beyond 100 ms. Default tested scenarios recorded no duplicate acceptance.</p>
              <p>Sign-in records a claimed identity using an unsigned cookie; it is not authentication. Missing security headers, no API request rate limit and default development secrets remain documented deployment limitations.</p>
            </div>
          </section>

          <section id="stack" className="detail-section" data-reveal>
            <h2>Run the complete path locally.</h2>
            <TagList items={project.technologies} label="Smart Campaign Composer technology stack" />
            <p>Docker Compose starts the frontend, API, worker, PostgreSQL, Redis, mock provider and setup job. The first install seeds 6,000 fake customers, eight email templates and an example brand kit. Mock AI needs no API key.</p>
            <pre className="campaign-commands"><code>{"git clone https://github.com/negativexq/smart-campaign-composer.git\ncd smart-campaign-composer\ndocker compose up --build -d --wait\n# Open http://localhost:8080"}</code></pre>
            <p>Prometheus metrics, JSON logs with trace IDs, OpenTelemetry spans and the audit trail expose both operational failures and campaign decisions.</p>
          </section>

          <ProjectInShort project={project} />
          <section id="deep-dive" className="detail-section" data-reveal>
            <h2>Follow the implementation.</h2>
            <div className="dbt-deep-dive">{campaignDeepDive.map(([label, path]) => <a key={path} href={campaignSource(path)} target="_blank" rel="noreferrer"><span>{label}</span><ArrowUpRight aria-hidden="true" size={15} /></a>)}</div>
          </section>
        </div>
      </div>
    </main>
  );
}
