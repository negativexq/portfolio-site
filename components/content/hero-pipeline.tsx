import type { CSSProperties } from "react";

/**
 * Ambient hero visual: a request span tree, decided by a deterministic policy
 * boundary and observed throughout.
 *
 * Deliberately CSS-only — no GSAP, no client component, no hydration. The
 * tree and its labels are the static base state and the animation only adds a
 * travelling highlight on top, so the global `prefers-reduced-motion` rule in
 * globals.css can flatten every animation without leaving the visual
 * half-drawn or invisible.
 *
 * Shape carries meaning here, so two structural choices are deliberate:
 *
 * - Retrieval and model serving are siblings, because the agent runtime fans
 *   out to them rather than calling them in sequence.
 * - Guardrail is a sibling of the agent runtime, not its child. The agent
 *   does not own its own authorisation — that is the whole thesis, and the
 *   indentation states it without a caption.
 *
 * Timing: a 36s master period made of four 9s runs, one per policy outcome.
 * CSS has no randomness, so the outcome rotates rather than being drawn at
 * random — which also guarantees all four branches are seen. Only the outcome
 * rows are gated to the 36s master; every stage row, Response included, runs
 * on the 9s period. Response is not conditional on `allow`: the boundary
 * decides whether the action executes, not whether the caller gets an answer
 * — a denied or escalated request still returns one.
 *
 * Every row maps to real work represented elsewhere in the site data (FastAPI
 * boundaries, LangGraph agent runtime, Qdrant retrieval, ModelOps serving,
 * OpenTelemetry). The four outcomes are the real policy branches in
 * data/architectures.ts. Do not add a row here that no project or experience
 * entry can back.
 */
type Guide = "space" | "line" | "tee" | "elbow";

type Row = {
  label: string;
  step: number;
  guides: readonly Guide[];
  outcome?: number;
};

const stages: readonly Row[] = [
  { label: "Request", step: 0, guides: [] },
  { label: "AI Platform API", step: 1, guides: ["elbow"] },
  { label: "Agent Runtime", step: 2, guides: ["space", "tee"] },
  { label: "RAG Retrieval", step: 3, guides: ["space", "line", "tee"] },
  { label: "Model Serving", step: 3, guides: ["space", "line", "elbow"] },
  { label: "Guardrail", step: 4, guides: ["space", "tee"] },
];

const outcomeRows: readonly Row[] = [
  { label: "allow", step: 5, guides: ["space", "line", "tee"], outcome: 0 },
  { label: "confirm", step: 5, guides: ["space", "line", "tee"], outcome: 1 },
  { label: "human", step: 5, guides: ["space", "line", "tee"], outcome: 2 },
  { label: "deny", step: 5, guides: ["space", "line", "elbow"], outcome: 3 },
];

const responseRow: Row = { label: "Response", step: 6, guides: ["space", "elbow"] };

const outcomeTones = ["allow", "confirm", "human", "deny"] as const;

function Guides({ guides }: { guides: readonly Guide[] }) {
  return (
    <>
      {guides.map((guide, index) => (
        <span
          key={index}
          className={`hero-pipeline-guide hero-pipeline-guide-${guide}`}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

export function HeroPipeline() {
  return (
    <div className="hero-pipeline">
      <p className="hero-pipeline-caption">Request lifecycle</p>
      <ol className="hero-pipeline-nodes">
        {stages.map((row) => (
          <li key={row.label} style={{ "--i": row.step } as CSSProperties}>
            <Guides guides={row.guides} />
            <span className="hero-pipeline-dot" aria-hidden="true" />
            <span className="hero-pipeline-label">{row.label}</span>
          </li>
        ))}

        {outcomeRows.map((row) => (
          <li
            key={row.label}
            className="hero-pipeline-branch"
            style={{ "--k": row.outcome } as CSSProperties}
          >
            <Guides guides={row.guides} />
            <span
              className={`hero-pipeline-outcome hero-pipeline-tone-${outcomeTones[row.outcome ?? 0]}`}
            >
              {row.label}
            </span>
          </li>
        ))}

        <li style={{ "--i": responseRow.step } as CSSProperties}>
          <Guides guides={responseRow.guides} />
          <span className="hero-pipeline-dot" aria-hidden="true" />
          <span className="hero-pipeline-label">{responseRow.label}</span>
        </li>
      </ol>
      <p className="hero-pipeline-trace">
        <span className="hero-pipeline-trace-dot" aria-hidden="true" />
        Trace + Metrics
      </p>
    </div>
  );
}
