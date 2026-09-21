export const agenticSreProjectUrl = "https://omerfkoc.dev/projects/agentic-sre";

export const agenticSreMeta = {
  title: "Agentic SRE",
  description:
    "Evidence-driven root-cause analysis engine for Kubernetes incidents: a bounded, read-only investigator gathers evidence while a deterministic RCA engine — not the model — makes the final root-cause judgment, measured on a frozen blind ITBench-Lite holdout with zero model calls.",
  keywords: [
    "Agentic SRE",
    "root cause analysis",
    "Kubernetes incidents",
    "deterministic RCA",
    "read-only investigation",
    "ITBench",
    "incident intelligence",
    "observability",
    "LangGraph",
  ],
} as const;

export const agenticSreCapabilities = [
  {
    title: "Deterministic RCA engine",
    items: [
      "Typed causal signals over changes, events, dependencies and topology",
      "Hypothesis rebuild, verification, confidence and resolution owned in code",
      "Root-entity selection with an explicit causal path, not an opaque answer",
    ],
  },
  {
    title: "Bounded investigation runtime",
    items: [
      "One validated read at a time from a legal observation surface",
      "Explicit turn, tool, wall-time, per-gap and no-progress limits",
      "Optional LLM policy chooses among already-legal reads — never creates evidence",
    ],
  },
  {
    title: "Observation and control plane",
    items: [
      "Kubernetes object versions and Events, Alertmanager, Loki, traces, snapshots",
      "Incident lifecycle, persistence, API, CLI and HTML/UI reporting",
      "Read-only access; remediation is proposed for an operator, never executed",
    ],
  },
] as const;

export const agenticSreWorkflow = [
  {
    label: "Alert and observation cutoff",
    detail: "Investigation starts from an alert and an explicit observation cutoff, reconstructing the changes and symptoms visible at the incident boundary.",
  },
  {
    label: "Deterministic RCA forms hypotheses",
    detail: "The engine identifies candidate causal actors and open information gaps from typed Findings — before any bounded read is spent.",
  },
  {
    label: "Investigator selects one legal read",
    detail: "A bounded state machine picks a single validated, read-only observation for the most valuable gap, checks scope and budget, then executes exactly one read.",
  },
  {
    label: "Evidence becomes a typed Finding",
    detail: "The observation enters the EvidenceStore and is normalized into a typed Finding; nothing can move a diagnosis until it has crossed this boundary.",
  },
  {
    label: "Hypotheses rebuilt, then verified",
    detail: "The same deterministic RCA and normalization code rebuilds hypotheses and re-runs verification and resolution — remaining gaps loop back for another bounded read.",
  },
  {
    label: "Root cause, confidence and proposal",
    detail: "The run finalizes a root entity, confidence, resolution state, evidence and causal path, plus a proposed remediation that is returned to an operator and never executed.",
  },
] as const;

export const agenticSreBoundaryRows = [
  {
    side: "Investigator may (read-only)",
    items: [
      "select one legal, in-scope observation at a time",
      "read Kubernetes object versions, Events and configured snapshots",
      "read bounded Loki logs, traces and Alertmanager context",
      "an optional LLM may choose among already-legal reads",
    ],
  },
  {
    side: "Deterministic judge owns · model never does",
    items: [
      "normalizing observations into typed Findings",
      "rebuilding hypotheses, verification, confidence and resolution",
      "selecting the root entity and its causal path",
      "Secrets are not read; remediation is proposed, never executed",
    ],
  },
] as const;

export const agenticSreEngineeringDecisions = [
  {
    title: "The investigator and the judge are separate",
    description:
      "An LLM can turn a plausible answer into an unverified diagnosis, so the model is confined to selecting already-legal reads. Deterministic normalization, hypothesis rebuilding, verification and root-cause resolution stay authoritative, and the measured benchmark path runs with zero model calls.",
  },
  {
    title: "Evidence is typed before it can move a hypothesis",
    description:
      "A raw observation should not silently shift a root cause. Every observation flows through EvidenceStore → normalization → typed Finding before hypotheses are rebuilt; on the frozen run 2,226 new evidence references became 244 Findings along an auditable path.",
  },
  {
    title: "NO_DATA is neutral, not evidence for a theory",
    description:
      "A missing signal is reported as missing rather than counted against a hypothesis. The frozen run recorded 95 NO_DATA observations that were held as neutral, keeping absent telemetry from being turned into false support.",
  },
  {
    title: "Causal topology, not graph proximity",
    description:
      "Being near a symptom in a graph does not make an entity the cause. Ownership, configuration use, declared dependencies, policies, fault targets, scaling relationships and workload topology are interpreted as explicit directional relations, so a diagnosis carries a real causal path.",
  },
  {
    title: "The architecture was frozen before it was graded",
    description:
      "A benchmark the system was tuned against measures fit, not capability. The architecture was frozen at a pinned commit, TEST25 was held out, and all 25 bounded predictions were persisted and SHA256-hashed before any full-source diagnosis was opened — no code changed after holdout results were visible.",
  },
] as const;

export const agenticSreCalibration = [
  {
    confidence: "VERIFIED",
    correct: "9",
    total: "9",
  },
  {
    confidence: "LIKELY",
    correct: "11",
    total: "12",
  },
  {
    confidence: "UNVERIFIED",
    correct: "1",
    total: "4",
  },
] as const;

export const agenticSreEvidence = [
  {
    area: "Blind TEST25 holdout",
    result: "21/25 (84%) exact root · 0 model calls",
    detail: "Predictions persisted and SHA256-hashed before grading; only an exact canonical root entity counts. Synthetic 25-scenario benchmark, not production accuracy.",
  },
  {
    area: "Development split",
    result: "10/10 exact root",
    detail: "DEV10 is the split used while building the frozen architecture, reported apart from the blind holdout so development evidence is never confused with it.",
  },
  {
    area: "Combined",
    result: "31/35 (88.6%)",
    detail: "DEV10 + TEST25 together, kept as a separate line rather than a headline that hides the blind-vs-development distinction.",
  },
  {
    area: "Confidence calibration",
    result: "VERIFIED 9/9 · LIKELY 11/12 · UNVERIFIED 1/4",
    detail: "Confidence tiers carry measured meaning; a confident label is not decorative and NO_DATA stays neutral.",
  },
  {
    area: "Bounded investigation",
    result: "150 reads · 0 tool errors",
    detail: "Six validated reads per incident across 25 incidents: 2,226 new evidence references, 244 normalized Findings, 37 decision-relevant calls, 95 NO_DATA observations.",
  },
  {
    area: "Trust boundary",
    result: "0 cluster writes",
    detail: "Read-only observation with Secrets excluded and allowlisted capabilities only; remediation is proposed but never executed, and there is no arbitrary shell path.",
  },
] as const;

export const agenticSreStackGroups = [
  ["RCA engine", "Deterministic signals · causal topology · verification · resolution"],
  ["Investigation runtime", "Bounded LangGraph state machine · validated read-only tools"],
  ["Observation sources", "Kubernetes objects + Events · Alertmanager · Loki · traces · snapshots"],
  ["Control plane", "FastAPI + SQLAlchemy + Alembic + PostgreSQL · CLI · HTML/UI reporting"],
  ["Live validation", "kind + Prometheus + Alertmanager + Chaos Mesh lifecycle gate"],
  ["Benchmark", "ITBench-Lite · frozen revision + manifest · hashed predictions"],
  ["Quality gates", "Ruff · Mypy · pytest · pre-commit · OpenTelemetry"],
] as const;

export const agenticSreLimitations = [
  "Current generalization evidence is the frozen 25-scenario blind TEST25 run; larger and more diverse production datasets are still needed. 84% is a measured benchmark result, not a universal accuracy guarantee.",
  "The diagnosis is deterministic, but bounded query windows and captured telemetry can miss older or unavailable decisive evidence.",
  "Captured Loki data is replayable evidence, not a complete historical log archive, and investigation runs under fixed turn, read, wall-time and per-gap budgets.",
  "Some diagnoses depend on the configured read APIs and their authentication; built-in read endpoints are unauthenticated by default and are an operator responsibility.",
  "The supported deployment is single-process / single-replica rather than highly available.",
  "It is evidence-driven RCA, not formal causal inference, and there is no autonomous remediation, arbitrary shell execution or cluster write capability.",
] as const;

export const agenticSreDeepDiveLinks = [
  {
    label: "Architecture details",
    href: "https://github.com/negativexq/agentic-sre/blob/main/docs/architecture.md",
  },
  {
    label: "Evaluation methodology",
    href: "https://github.com/negativexq/agentic-sre/blob/main/evals/README.md",
  },
  {
    label: "Frozen benchmark report",
    href: "https://github.com/negativexq/agentic-sre/blob/main/evals/results/v1.1.2/README.md",
  },
  {
    label: "Architecture decision records",
    href: "https://github.com/negativexq/agentic-sre/tree/main/docs/adr",
  },
  {
    label: "Release documentation",
    href: "https://github.com/negativexq/agentic-sre/tree/main/docs/releases",
  },
] as const;
