import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/content/types";
import { getProjectArchitecture } from "@/data/architectures";
import {
  dbtFeatureLineageCommands,
  dbtFeatureLineageDecisions,
  dbtFeatureLineageDeepDiveLinks,
  dbtFeatureLineageHighlights,
  dbtFeatureLineageMetrics,
  dbtFeatureLineageModes,
  dbtFeatureLineageScreenshots,
  dbtFeatureLineageStack,
  dbtFeatureLineageSurfaces,
} from "@/data/dbt-feature-lineage";
import { ArchitectureDiagram } from "./architecture-diagram";
import { MetricGrid } from "./metric-grid";
import { MotionController } from "@/components/motion/motion-controller";
import { SectionIndex } from "./section-index";
import { StatusBadge } from "./status-badge";

type DbtFeatureLineageCaseStudyProps = {
  project: Project;
};

const sections = [
  ["overview", "The problem"],
  ["inputs", "Input boundary"],
  ["surfaces", "Product surface"],
  ["impact", "Impact semantics"],
  ["architecture", "Architecture"],
  ["decisions", "Design decisions"],
  ["evidence", "Reproducible path"],
  ["showcase", "Product proof"],
  ["stack", "Stack"],
  ["posture", "Limitations"],
  ["deep-dive", "Deep dive"],
] as const;

export function DbtFeatureLineageCaseStudy({ project }: DbtFeatureLineageCaseStudyProps) {
  const architecture = getProjectArchitecture(project.id);

  return (
    <main className="dbt-case-study">
      <MotionController />
      <header className="project-detail-hero dbt-hero container">
        <Link className="back-link" href="/projects">
          <ArrowLeft aria-hidden="true" size={14} strokeWidth={1.6} /> All projects
        </Link>
        <div className="dbt-hero-meta">
          <p>{project.category}</p>
          <StatusBadge status={project.status} />
        </div>
        <h1>{project.title}</h1>
        <p className="dbt-hero-principle">
          Lineage is useful when it explains the blast radius of a change, not only when it draws a graph.
        </p>
        <p className="project-detail-summary">{project.summary}</p>
        <div className="dbt-hero-actions">
          <a className="button button-primary" href={project.githubUrl} target="_blank" rel="noreferrer">
            View repository <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.6} />
          </a>
          <a className="text-link" href="#architecture">
            Read the architecture <ArrowRight aria-hidden="true" size={15} strokeWidth={1.6} />
          </a>
        </div>
        <MetricGrid metrics={dbtFeatureLineageMetrics} />
      </header>

      <div className="container detail-layout dbt-detail-layout">
        <SectionIndex sections={sections} label="Case study" />

        <div className="detail-content">
          <section id="overview" className="detail-section dbt-overview-section" data-reveal>
            <p className="detail-kicker">The problem</p>
            <h2>Make a dbt project explain itself.</h2>
            <div className="dbt-overview-grid">
              <div>
                <p>
                  A large dbt project can make a simple question expensive: where did this column come from,
                  and what changes if I touch it? The answer is spread across model SQL, YAML metadata, joins,
                  CTEs and indirect consumers.
                </p>
                <p>
                  This tool turns that repository structure into a local exploration loop. It reads the project,
                  normalizes what it finds, then exposes the same representation to a CLI and an interactive UI.
                </p>
              </div>
              <aside className="dbt-boundary-note">
                <span>Boundary</span>
                <strong>No warehouse. No SaaS account.</strong>
                <p>The demo and static-analysis path work from project files on disk and leave the source project unchanged.</p>
              </aside>
            </div>
            <div className="dbt-highlight-grid" data-reveal>
              {dbtFeatureLineageHighlights.map((highlight) => (
                <article key={highlight.title}>
                  <span>{highlight.title}</span>
                  <p>{highlight.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section id="inputs" className="detail-section" data-reveal>
            <p className="detail-kicker">Input boundary</p>
            <h2>Two inputs. One domain model.</h2>
            <p>
              The tool prefers the artifacts dbt already understands, but does not make artifact generation a
              hard prerequisite. Both paths converge before graph construction and user-facing analysis.
            </p>
            <div className="dbt-mode-grid">
              {dbtFeatureLineageModes.map((mode, index) => (
                <article key={mode.label}>
                  <div className="dbt-mode-heading">
                    <span>0{index + 1}</span>
                    <h3>{mode.label}</h3>
                  </div>
                  <code>{mode.input}</code>
                  <p>{mode.detail}</p>
                </article>
              ))}
            </div>
            <p className="detail-muted">
              In both modes, `ref()` and `source()` dependencies are extracted, Jinja relations are replaced with
              SQL-safe placeholders, and the resulting SQL is parsed with sqlglot.
            </p>
          </section>

          <section id="surfaces" className="detail-section" data-reveal>
            <p className="detail-kicker">Product surface</p>
            <h2>From project scan to feature comparison.</h2>
            <p>
              The Next.js web app keeps the project and optional model-group selection stable while each view answers
              a different inspection question.
            </p>
            <div className="dbt-surface-list">
              {dbtFeatureLineageSurfaces.map((surface, index) => (
                <article key={surface.name}>
                  <span>0{index + 1}</span>
                  <h3>{surface.name}</h3>
                  <p>{surface.purpose}</p>
                </article>
              ))}
            </div>
            <p className="detail-muted dbt-surface-note">
              A global ⌘K command palette provides the fast path across models, columns and pages. Each selection
              is represented by a shareable query-string URL rather than client-only state.
            </p>
          </section>

          <section id="impact" className="detail-section dbt-impact-section" data-reveal>
            <p className="detail-kicker">Impact semantics</p>
            <h2>Direct and transitive impact stay separate.</h2>
            <p>
              A column change does not affect every downstream node in the same way. The downstream report groups
              the chain by model and preserves the distinction between a consumer that references the column and a
              model that inherits the change later in the graph.
            </p>
            <div className="dbt-impact-table" role="region" aria-label="Lineage questions and answers" tabIndex={0}>
              <table>
                <thead>
                  <tr><th scope="col">Question</th><th scope="col">Answer surface</th><th scope="col">Why it matters</th></tr>
                </thead>
                <tbody>
                  <tr><th scope="row">Where did this column come from?</th><td>Upstream lineage</td><td>Walk joins, coalesces and renames back to raw sources.</td></tr>
                  <tr><th scope="row">Who consumes it directly?</th><td>Direct impact</td><td>Prioritize the models that reference the changed column themselves.</td></tr>
                  <tr><th scope="row">What inherits the change?</th><td>Transitive chain</td><td>See the complete downstream reach without treating every node as an equal review target.</td></tr>
                  <tr><th scope="row">Where is the same feature produced?</th><td>Feature Explorer</td><td>Compare model, layer, owner, description, tags and test count side by side.</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          {architecture ? (
            <section id="architecture" className="detail-section" data-reveal>
              <p className="detail-kicker">Architecture</p>
              <h2>Load once. Analyze everywhere.</h2>
              <p>
                Loaders resolve the project into shared domain models. Services then build model DAGs, column
                lineage, traces, impact summaries, query-flow steps and model health for both the Typer CLI and the
                FastAPI-backed Next.js web app.
              </p>
              <ArchitectureDiagram architecture={architecture} />
            </section>
          ) : null}

          <section id="decisions" className="detail-section" data-reveal>
            <p className="detail-kicker">Design decisions</p>
            <h2>The system keeps uncertainty visible.</h2>
            <div className="dbt-decision-list">
              {dbtFeatureLineageDecisions.map((decision, index) => (
                <article key={decision.title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{decision.title}</h3>
                    <p>{decision.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="showcase" className="detail-section" data-reveal>
            <p className="detail-kicker">Product proof</p>
            <h2>See the working surface, not just the architecture.</h2>
            <p>
              These screenshots come from the repository&apos;s current Next.js walkthrough. Each image links back
              to its original GitHub file so the full-size source remains available on desktop and mobile.
            </p>
            <div className="dbt-screenshot-grid">
              {dbtFeatureLineageScreenshots.map((screenshot) => (
                <figure key={screenshot.src}>
                  <a
                    className="dbt-screenshot-frame"
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
                    <a className="dbt-screenshot-link" href={screenshot.sourceUrl} target="_blank" rel="noreferrer">
                      Open full-size source on GitHub <ArrowUpRight aria-hidden="true" size={13} strokeWidth={1.6} />
                    </a>
                    <span>Source: {screenshot.source}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section id="evidence" className="detail-section" data-reveal>
            <p className="detail-kicker">Reproducible path</p>
            <h2>Short path from clone to inspection.</h2>
            <p>
              The repository documents a Docker-first development loop. Build the image, run the test suite, start
              the FastAPI backend, then run the Next.js frontend against the included sample project.
            </p>
            <div className="dbt-command-block" aria-label="dbt Feature Lineage quick start commands">
              <div className="dbt-command-bar"><span>QUICK START</span><span>FASTAPI + NEXT.JS</span></div>
              <pre><code>{dbtFeatureLineageCommands.join("\n")}</code></pre>
            </div>
            <div className="dbt-evidence-row">
              <div><span>Release history</span><strong>v0.1 → v0.8 complete</strong><p>Core input, lineage, impact, visualization and explorer milestones are marked complete in the repository roadmap.</p></div>
              <div><span>Quality loop</span><strong>Build · test · lint</strong><p>Docker, pytest and Ruff are first-class Makefile commands in the documented development path.</p></div>
            </div>
          </section>

          <section id="stack" className="detail-section" data-reveal>
            <p className="detail-kicker">Stack</p>
            <h2>Small surface, clear responsibilities.</h2>
            <div className="dbt-stack-table">
              {dbtFeatureLineageStack.map(([area, stack]) => (
                <div key={area}><span>{area}</span><strong>{stack}</strong></div>
              ))}
            </div>
          </section>

          <section id="posture" className="detail-section dbt-limits-section" data-reveal>
            <p className="detail-kicker">Limits</p>
            <h2>Useful because the boundary is explicit.</h2>
            <p>
              This is a local exploration tool, not a replacement for dbt Cloud, observability or a transformation
              engine. The repository is direct about where analysis can diverge from a fully compiled project.
            </p>
            <ul>
              <li>No dbt Cloud, Airflow or warehouse integration.</li>
              <li>Private git imports rely on the host&apos;s configured credential helper or SSH agent; the app does not store tokens.</li>
              <li>Complex custom macros may not parse correctly.</li>
              <li>Static analysis can differ from compiled dbt SQL when no manifest is available.</li>
              <li>Projects that depend on generated or unavailable files may produce incomplete analysis.</li>
            </ul>
          </section>

          <section id="deep-dive" className="detail-section" data-reveal>
            <p className="detail-kicker">Deep dive</p>
            <h2>Follow the implementation.</h2>
            <div className="dbt-deep-dive">
              {dbtFeatureLineageDeepDiveLinks.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                  <span>{link.label}</span><ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.6} />
                </a>
              ))}
            </div>
            <div className="dbt-final-links">
              <a className="text-link" href={project.githubUrl} target="_blank" rel="noreferrer">
                Open the full repository <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.6} />
              </a>
            </div>
            <div className="dbt-related-writing">
              <span>Related writing</span>
              <Link href="/writing/one-definition-per-feature">
                <strong>One definition per feature</strong>
                <small>Why shared definitions need lineage that distinguishes direct consumers from the transitive tail.</small>
                <ArrowRight aria-hidden="true" size={16} strokeWidth={1.6} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
