"use client";

import { ArrowDown, ArrowRight, ChevronDown, CornerDownRight } from "lucide-react";
import type { MouseEvent } from "react";
import { agenticArchitectureBoundaries, agenticPolicyRoutes } from "@/data/agentic-architecture";
import type { ArchitectureDefinition, ArchitecturePath } from "./architecture-diagram";
import styles from "./agentic-architecture.module.css";

const detailId = (id: string) => `agent-architecture-${id}`;

// Links still reach native disclosure summaries without JavaScript. With JS,
// open the destination before anchor navigation and move keyboard focus to it.
function revealBoundary(event: MouseEvent<HTMLAnchorElement>) {
  const id = event.currentTarget.hash.slice(1);
  const detail = document.getElementById(id);
  if (!(detail instanceof HTMLDetailsElement)) return;
  event.preventDefault();
  detail.open = true;
  detail.scrollIntoView({
    block: "start",
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
  });
  detail.querySelector("summary")?.focus({ preventScroll: true });
}

function TechnicalPath({ path, stageIds, title }: {
  path: ArchitecturePath;
  stageIds?: readonly string[];
  title: string;
}) {
  const stages = stageIds ? path.stages.filter((stage) => stageIds.includes(stage.id)) : path.stages;
  return (
    <section className={styles.technicalPath}>
      <h4>{title}</h4>
      <p>{path.summary}</p>
      <ol className={styles.technicalSteps}>
        {stages.map((stage) => (
          <li key={stage.id}>
            {stage.nodes.length > 1 ? <p className={styles.parallelHint}>Separate components</p> : null}
            <dl>
              {stage.nodes.map((node) => (
                <div key={node.id}>
                  <dt>{node.label}</dt>
                  <dd>
                    {node.subtitle ? <p>{node.subtitle}</p> : null}
                    {node.items ? <ul>{node.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}
                  </dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function AgenticArchitecture({ architecture }: { architecture: ArchitectureDefinition }) {
  const paths = new Map(architecture.paths.map((path) => [path.id, path]));

  return (
    <div className={styles.explorer}>
      <figure className={styles.overview} aria-labelledby="agent-architecture-caption">
        <figcaption id="agent-architecture-caption">
          <h3>From proposal to permission.</h3>
          <p>Follow a business-action request. Select a boundary to inspect its controls.</p>
        </figcaption>

        <ol className={styles.journey} aria-label="Business-action request overview">
          {agenticArchitectureBoundaries.map((boundary, index) => (
            <li key={boundary.id} data-boundary={boundary.id}>
              {index > 0 ? <span className={styles.journeyConnector} aria-hidden="true"><ArrowRight size={18} /></span> : null}
              <a className={styles.boundary} href={`#${detailId(boundary.id)}`} onClick={revealBoundary} aria-controls={detailId(boundary.id)}>
                <strong>{boundary.title}</strong>
                <span>{boundary.summary}</span>
                <span className={styles.inspect}>Inspect <CornerDownRight size={14} aria-hidden="true" /></span>
              </a>
            </li>
          ))}
        </ol>

        <aside className={styles.context} aria-label="Context boundary">
          <strong>Knowledge & memory</strong>
          <p>Support answers and proposals. They cannot grant permission or bypass policy.</p>
          <a href={`#${detailId("proposal")}`} onClick={revealBoundary}>Inspect context <ArrowRight size={15} aria-hidden="true" /></a>
        </aside>

        <section className={styles.policy} aria-labelledby="agent-policy-title">
          <header>
            <h4 id="agent-policy-title">Policy chooses one route.</h4>
            <p>These are alternatives, not a sequence.</p>
          </header>
          <ul className={styles.routes}>
            {agenticPolicyRoutes.map((route) => (
              <li key={route.id} data-route={route.id} data-continues={route.destination !== null}>
                <div className={styles.routeName}><strong>{route.label}</strong><span>{route.condition}</span></div>
                <ArrowRight className={styles.routeArrow} size={17} aria-hidden="true" />
                <p>{route.outcome}</p>
                {route.destination ? (
                  <a href={`#${detailId(route.destination)}`} onClick={revealBoundary}>{route.link}<ArrowDown size={14} aria-hidden="true" /></a>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </figure>

      <section className={styles.details} aria-labelledby="agent-boundaries-title">
        <div className={styles.detailsHeading}>
          <h3 id="agent-boundaries-title">Inside each boundary</h3>
          <p>Open the implementation details you need.</p>
        </div>
        {agenticArchitectureBoundaries.map((boundary) => (
          <details className={styles.disclosure} id={detailId(boundary.id)} key={boundary.id}>
            <summary>
              <span><strong>{boundary.title}</strong><span>{boundary.summary}</span></span>
              <ChevronDown size={20} aria-hidden="true" />
            </summary>
            <div className={styles.disclosureBody}>
              <p className={styles.boundaryDescription}>{boundary.description}</p>
              {boundary.groups.map((group) => {
                const path = paths.get(group.pathId);
                return path ? <TechnicalPath key={group.pathId} path={path} title={group.title} stageIds={"stageIds" in group ? group.stageIds : undefined} /> : null;
              })}
            </div>
          </details>
        ))}
        {(["state-boundaries", "observation"] as const).map((pathId) => {
          const path = paths.get(pathId);
          return path ? (
            <details className={styles.disclosure} key={path.id} id={detailId(path.id)}>
              <summary><span><strong>{path.label}</strong><span>{pathId === "state-boundaries" ? "Durable state and retrieval stay separate" : "Evidence observes; it does not authorize"}</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
              <div className={styles.disclosureBody}><TechnicalPath path={path} title={path.label} /></div>
            </details>
          ) : null;
        })}
        <details className={styles.disclosure}>
          <summary><span><strong>Engineering notes</strong><span>Contracts, evaluation and deployment limits</span></span><ChevronDown size={20} aria-hidden="true" /></summary>
          <div className={styles.disclosureBody}><ul className={styles.notes}>{architecture.notes.map((note) => <li key={note}>{note}</li>)}</ul></div>
        </details>
      </section>
    </div>
  );
}
