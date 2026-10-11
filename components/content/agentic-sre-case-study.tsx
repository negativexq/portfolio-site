import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  agenticSreBenchmarks,
  agenticSreDeepDiveLinks,
  agenticSreFaultFamilies,
  agenticSreLimitations,
  agenticSreScreenshots,
  agenticSreSemantics,
  agenticSreSources,
  agenticSreWorkflow,
} from "@/data/agentic-sre";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { SectionIndex } from "./section-index";
import { ProjectInShort, ProjectRelated } from "./project-related";
import { AgenticSreRecording } from "./agentic-sre-recording";

const sections = [
  ["problem", "Engineering problem"],
  ["architecture", "Architecture"],
  ["workflow", "Investigation lifecycle"],
  ["console", "Operator console"],
  ["semantics", "Causal reasoning"],
  ["evaluation", "Evaluation"],
  ["limitations", "Tradeoffs & limits"],
  ["takeaways", "Takeaways"],
  ["in-short", "Project summary"],
  ["related", "Related writing"],
  ["deep-dive", "Sources"],
] as const;

function Source({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      {children} <ArrowUpRight size={13} aria-hidden="true" />
    </a>
  );
}

export function AgenticSreCaseStudy({ project }: { project: Project }) {
  const architecture = getProjectArchitecture(project.id);
  return (
    <main className="modelops-case-study sre-case-study">
      <header className="project-detail-hero modelops-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} /> All projects
        </Link>
        <div className="sre-hero-composition">
          <div>
            <h1>Agentic SRE</h1>
            <p className="sre-positioning">
              Evidence-Driven Kubernetes Incident Investigation
            </p>
            <p className="project-detail-summary">
              An evidence-driven SRE platform that investigates Kubernetes
              incidents through bounded, read-only observation and produces
              deterministic, replayable root-cause diagnoses.
            </p>
            <p>
              From an alert to an auditable explanation: an in-cluster Connector
              captures evidence, a deterministic engine tests causal claims, and
              an operator console makes the investigation inspectable. LLMs are
              optional and never own the final causal judgment.
            </p>
            <div className="modelops-hero-actions">
              <a
                className="button button-primary"
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
              >
                View repository <ArrowUpRight aria-hidden="true" size={15} />
              </a>
              <Link className="text-link" href="#console">
                Explore the console
              </Link>
            </div>
          </div>
          <figure className="sre-hero-preview">
            <a
              className="modelops-screenshot-frame"
              href="/projects/agentic-sre/investigation-canvas-dark.png"
              target="_blank"
              rel="noreferrer"
              aria-label="Open investigation canvas screenshot at full resolution"
            >
              <Image
                src="/projects/agentic-sre/investigation-canvas-dark.png"
                width={1440}
                height={1606}
                alt="Actual Agentic SRE console on seeded demo data: Causal X-Ray graph beside investigation and selected evidence"
                preload
                sizes="(max-width: 800px) 100vw, 600px"
              />
            </a>
            <figcaption>
              Actual React/TypeScript console · seeded demonstration, not
              production incident data.{" "}
              <Source href={agenticSreSources.screenshots}>
                Capture provenance
              </Source>
            </figcaption>
          </figure>
        </div>
        {project.heroMetrics && <MetricGrid metrics={project.heroMetrics} />}
        <p className="sre-metric-sources">
          Measurement sources:{" "}
          <Source href={agenticSreSources.holdout}>
            Nineteenth HOLDOUT · engine 2.8.0
          </Source>{" "}
          ·{" "}
          <Source href={agenticSreSources.watch}>WATCH lab measurement</Source>{" "}
          ·{" "}
          <Source href={agenticSreSources.measured}>
            Deterministic evaluation paths
          </Source>
        </p>
      </header>
      <div className="container detail-layout modelops-detail-layout">
        <SectionIndex sections={sections} label="Case study" />
        <div className="detail-content">
          <section
            id="problem"
            className="detail-section modelops-principle-section"
          >
            <h2>An alert shows what broke. It rarely proves why.</h2>
            <p>
              A payment dependency fault can surface as an order-service error.
              A Deployment rollout, a failing Pod and a NetworkChaos experiment
              can all sit near that symptom in the graph. Their temporal overlap
              and structural proximity do not establish which actor initiated
              it.
            </p>
            <p>
              The hard cases are incomplete: an execution witness arrives late,
              a recreated Pod reuses a name, a trace backend loses reads, or two
              independent faults affect different symptom groups. The testbed
              even exposed a rule that granted strong authority to an experiment
              that had ended 40 minutes before onset.
            </p>
            <p>
              The system therefore separates evidence acquisition from judgment.
              It asks whether a cause actually executed, whether its effect
              reached the affected instance and whether a competing explanation
              remains. Stale evidence and missing observations must limit an
              answer. Persisting that reasoning makes it reviewable and
              reproducible.
            </p>
            <Source href={agenticSreSources.how}>
              Engine and investigation design
            </Source>
          </section>
          {architecture && (
            <section id="architecture" className="detail-section">
              <h2>A deployable observation boundary</h2>
              <p>
                The independently deployable Connector stays inside the customer
                Kubernetes cluster with its Kubernetes and telemetry
                credentials. It dials out over gRPC with mutual TLS; the remote
                control plane holds no customer Kubernetes credentials.
                Read-only RBAC and an application deny list exclude Secrets from
                observation.
              </p>
              <ArchitectureDiagram architecture={architecture} />
              <dl className="sre-source-roles">
                <div>
                  <dt>Kubernetes API + Events</dt>
                  <dd>
                    Object versions, ownership, lifecycle and changes through
                    per-scope LIST + WATCH. Unresumable watches produce explicit
                    gaps.
                  </dd>
                </div>
                <div>
                  <dt>Alertmanager + Prometheus</dt>
                  <dd>
                    Alerts open incident episodes; bounded metric reads supply
                    symptom and resource-pressure context.
                  </dd>
                </div>
                <div>
                  <dt>Loki + Tempo</dt>
                  <dd>
                    Bounded logs and attributed traces supply observations of
                    execution, service effects and propagation. Unavailable
                    reads remain recorded limitations.
                  </dd>
                </div>
                <div>
                  <dt>PostgreSQL + console</dt>
                  <dd>
                    The control plane journals evidence and freezes diagnosis
                    inputs. The React/TypeScript console renders persisted
                    judgments and recorded causal edges.
                  </dd>
                </div>
              </dl>
              <p>
                WATCH ingestion measured about 1.2 s median / 1.9 s p90
                change-to-journal latency in the lab, versus 21.5 s / 27.1 s
                with 15-second polling (2026-09-30 / 10-01). This is ingestion
                latency, not time to diagnose an incident.
              </p>
              <p>
                Connector preflight, one-time enrollment, certificate rotation,
                revocation and Helm packaging are implemented and validated in
                the lab. Deployment maturity remains separate from protocol and
                causal correctness.
              </p>
              <Source href={agenticSreSources.roadmap}>
                Connector delivery and measurement record
              </Source>
            </section>
          )}
          <section id="workflow" className="detail-section">
            <h2>From incident intake to a replayable diagnosis</h2>
            <ol className="modelops-workflow">
              {agenticSreWorkflow.map((step, index) => (
                <li key={step.label}>
                  <span>{index + 1}</span>
                  <div>
                    <h3>{step.label}</h3>
                    <p>{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
            <dl className="sre-resolution-states">
              <div>
                <dt>RESOLVED</dt>
                <dd>
                  Evidence establishes the causal mechanism, covers declared
                  symptoms and disambiguates material alternatives. It describes
                  a diagnosis, not a remediated cluster.
                </dd>
              </div>
              <div>
                <dt>AMBIGUOUS</dt>
                <dd>
                  A supported explanation exists, but rivals, open frontier
                  questions or uncovered symptoms prevent a conclusive
                  attribution.
                </dd>
              </div>
              <div>
                <dt>INSUFFICIENT_EVIDENCE</dt>
                <dd>
                  Available observations cannot support an adequate causal
                  explanation. Budget exhaustion and NO_DATA cannot manufacture
                  certainty.
                </dd>
              </div>
            </dl>
            <p>
              Confidence (VERIFIED / LIKELY / UNVERIFIED) and resolution answer
              different questions. A correct leading actor can still be
              AMBIGUOUS. The investigator gathers evidence; deterministic rules
              own all three resolution outcomes.
            </p>
            <Source href={agenticSreSources.how}>
              Investigation and resolution semantics
            </Source>
          </section>
          <section id="console" className="detail-section sre-console-section">
            <h2>One investigation, connected views</h2>
            <p>
              The Causal X-Ray keeps the recorded causal path beside the
              Investigation, Evidence, Timeline and Diagnosis views. Selecting a
              resource, Finding or causal node highlights its context and scopes
              related evidence. The frontend draws persisted engine edges;
              disconnected graph components remain disconnected.
            </p>
            <AgenticSreRecording />
            <p className="modelops-inline-note">
              The static images below are captures of the actual production
              frontend build using repository-provided seeded data in a local
              database. They demonstrate the interface, not customer-production
              operation. Open any image for full-resolution inspection.
            </p>
            <div className="sre-console-gallery">
              {agenticSreScreenshots.map((shot) => (
                <figure key={shot.file}>
                  <a
                    className="modelops-screenshot-frame"
                    href={`/projects/agentic-sre/${shot.file}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${shot.title.toLowerCase()} screenshot at full resolution`}
                  >
                    <Image
                      src={`/projects/agentic-sre/${shot.file}`}
                      width={shot.width}
                      height={shot.height}
                      alt={shot.alt}
                      sizes="(max-width: 800px) 100vw, 1000px"
                    />
                  </a>
                  <figcaption>
                    <strong>{shot.title}</strong>
                    <p>{shot.detail}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
            <Source href={agenticSreSources.screenshots}>
              Screenshot gallery and provenance
            </Source>
          </section>
          <section id="semantics" className="detail-section">
            <h2>Causal claims have to earn their authority</h2>
            <p>
              The engineering progressed from ranking candidate roots to
              checking the evidence semantics of each claim: identity, temporal
              membership, execution, effect, propagation and the boundaries of
              what could have been observed.
            </p>
            <div className="modelops-decision-list">
              {agenticSreSemantics.map((item) => (
                <article key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
            <p>
              These are evidence-backed rules, not formal causal inference or a
              guarantee that every incident can be resolved. Current
              implementation is engine 2.10.0; dependency rules A and C have
              development and replay evidence, while their twentieth HOLDOUT is
              only pre-registered at the reviewed source revision.
            </p>
            <Source href={agenticSreSources.semantics}>
              Causal contract and rule-level measurements
            </Source>
          </section>
          <section id="evaluation" className="detail-section">
            <h2>Separate measurements for separate claims</h2>
            <p>
              Actor correctness, resolution safety, path agreement and ingestion
              latency have different denominators and protocols. None can stand
              in for a universal accuracy percentage.
            </p>
            <h3>Historical ITBench-Lite evidence</h3>
            <p className="detail-muted">
              On narrow screens, scroll the tables horizontally to read scope
              and sources.
            </p>
            <div
              className="modelops-evidence-table"
              role="region"
              aria-label="Historical benchmark measurements and engine scope"
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    <th scope="col">Measurement</th>
                    <th scope="col">Result</th>
                    <th scope="col">Scope and source</th>
                  </tr>
                </thead>
                <tbody>
                  {agenticSreBenchmarks.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      <td>{row.result}</td>
                      <td>
                        {row.detail} <Source href={row.href}>Report</Source>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="modelops-inline-note">
              All 35 scenarios became development data on 2026-09-28. Historical
              TEST25 blindness applies to the frozen architecture of its time.
              The 18/31 exact score belongs to engine 2.2.2; newer engines do
              not inherit it or the older 77.3% score. Later regression reports
              are not a newly established full-set accuracy measurement.
            </p>
            <details className="sre-methodology">
              <summary>
                Historical read budget and confidence calibration
              </summary>
              <p>
                The frozen bounded TEST25 path used six validated reads per
                incident: 150 total, with zero tool errors and zero model calls.
                This is an observed run configuration, not a universal budget or
                throughput result. DEV10 agreement was 10/10; combined agreement
                was 31/35 (88.6%). Both compare paths, not ground truth.
              </p>
              <p>
                Historical full-source calibration was VERIFIED 13/16 and LIKELY
                13/19 against ground truth (TEST25: 8/10 and 9/15). The current
                engine has not been re-calibrated on these scenarios. The
                bounded path’s own ground-truth accuracy is not established.
              </p>
              <Source href={agenticSreSources.benchmark}>
                Frozen report and hashes
              </Source>
            </details>
            <h3>Instrumented Kubernetes testbed</h3>
            <p>
              A single-node Kind cluster with Chaos Mesh and instrumented
              service traffic supplies six fault families. The injector and a
              separate oracle record creation, execution, target effect,
              propagation, symptom, alert and recovery. The engine never sees
              the harness’s ground truth. Self-contradictory runs are INVALID
              and never scored.
            </p>
            <p>
              Variant A is development data; different injections in held-out
              variants run with the engine commit, version and manifest hashes
              frozen. Each run gets a fresh control-plane database, Connector
              restart and target Pod. Acceptance is fixed in advance: at least
              90% valid runs, zero false RESOLVED, zero false strong authority
              and the isolated decoy never named.
            </p>
            <div className="sre-holdout-result">
              <h4>Nineteenth HOLDOUT · 2026-10-11 · engine 2.8.0</h4>
              <p>
                <strong>
                  24/24 valid runs. 12/99 scored diagnoses RESOLVED.
                </strong>{" "}
                All 12 identify their run’s true experiment. Zero false
                RESOLVED, zero false strong authority, and the decoy never
                named. Every pre-registered criterion holds.
              </p>
            </div>
            <div
              className="modelops-evidence-table"
              role="region"
              aria-label="Nineteenth HOLDOUT fault families and resolved diagnosis counts"
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    <th scope="col">Fault family</th>
                    <th scope="col">Held-out injection</th>
                    <th scope="col">RESOLVED / diagnoses</th>
                  </tr>
                </thead>
                <tbody>
                  {agenticSreFaultFamilies.map(([family, fault, result]) => (
                    <tr key={family}>
                      <th scope="row">{family}</th>
                      <td>{fault}</td>
                      <td>{result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="modelops-inline-note">
              Eight variants, three runs each; one run can produce several
              incident diagnoses. Cause, instance and execution-witness recall
              were 1.0 in every variant; competing symptom-group recall was
              0.81. Correctly naming an actor does not prove every symptom or
              eliminate every rival: 87/99 diagnoses remained unresolved. One
              run lost trace reads when Tempo was killed for memory.
            </p>
            <Source href={agenticSreSources.holdout}>
              Committed nineteenth HOLDOUT report and acceptance checks
            </Source>
            <h3>In-house live scenario suite</h3>
            <p>
              <strong>25/25 expected outcomes</strong> across 19 DEV and 6
              HOLDOUT scenarios in the historical live-suite protocol. It stages
              faults on a running cluster and grades stored diagnoses: 16/16
              actor identifications and 9/9 abstentions were correct, with zero
              fabricated RESOLVED. The resolution distribution was 0 RESOLVED,
              14 AMBIGUOUS and 11 INSUFFICIENT_EVIDENCE; the deterministic paths
              made zero model calls.
            </p>
            <p>
              The 2026-09-24 re-anchor and M16 rerun document this result. The
              labels are in-house and have no external validity; this is
              separate from ITBench-Lite and from the instrumented testbed.
            </p>
            <Source href={agenticSreSources.measured}>
              Live-suite provenance and methodology
            </Source>
          </section>
          <section
            id="limitations"
            className="detail-section modelops-posture-section"
          >
            <h2>Tradeoffs that define the operating envelope</h2>
            <ul>
              {agenticSreLimitations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Source href={agenticSreSources.readme}>
              Current repository limitations
            </Source>
          </section>
          <section id="takeaways" className="detail-section">
            <h2>Better evidence can justify less certainty</h2>
            <p>
              More telemetry can reveal a competing cause or an uncovered
              symptom. A trustworthy investigation has to preserve that
              uncertainty instead of turning every ranking into a verdict.
              Causal attribution needs evidence of execution and effect;
              operational correctness needs the ability to reproduce the
              investigation.
            </p>
            <p>
              The testbed matters as much as the engine. Fault isolation,
              independent witnesses, frozen protocols and honest denominators
              determine what a result actually proves. The outcome is an
              evidence-driven Kubernetes investigation platform with a
              deployable Connector, deterministic judgment, replayable evidence
              and an inspectable console—validated in controlled labs, with
              production hardening still ahead.
            </p>
          </section>
          <ProjectInShort project={project} />
          <ProjectRelated project={project} />
          <section id="deep-dive" className="detail-section">
            <h2>Inspect the engineering evidence</h2>
            <p className="detail-muted">
              Sources reviewed at commit 87fc192 · 2026-10-11. Measurement links
              are pinned to that revision; the repository continues to evolve.
            </p>
            <div className="modelops-deep-dive">
              {agenticSreDeepDiveLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
            <Source href={project.githubUrl!}>
              Open the current repository
            </Source>
          </section>
        </div>
      </div>
    </main>
  );
}
