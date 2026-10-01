export const agenticSreProjectUrl = "https://omerfkoc.dev/projects/agentic-sre";

const repo = "https://github.com/negativexq/agentic-sre";

export const agenticSreMeta = {
  keywords: [
    "Agentic SRE",
    "root cause analysis",
    "Kubernetes incidents",
    "deterministic RCA",
    "read-only investigation",
    "Kubernetes connector",
    "mTLS",
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
      "Evidence becomes typed Findings before it can move a hypothesis",
      "Verification, confidence, resolution and root-cause selection owned in code",
      "Strong authority only from an observed execution and its incident effect",
    ],
  },
  {
    title: "Bounded investigation",
    items: [
      "One validated, read-only read at a time from a legal observation surface",
      "Explicit turn, tool, wall-time, per-gap and no-progress budgets",
      "An optional LLM may choose among legal reads — never evidence or the root",
    ],
  },
  {
    title: "Connector and evidence streams",
    items: [
      "In-cluster Connector holds every credential and dials out over mTLS",
      "Watch-driven change and alert streams with explicit per-scope gaps",
      "Each diagnosis records, per scope, what it could and could not see",
    ],
  },
  {
    title: "Control plane and console",
    items: [
      "Evidence journal and a manifest frozen per diagnosis revision",
      "Offline replay verifies manifests, read tapes and epistemic digests",
      "Operator console: single, competing or not-established leading actor",
    ],
  },
] as const;

export const agenticSreWorkflow = [
  {
    label: "The Connector streams the cluster",
    detail: "Inside the cluster, the Connector lists each scope once and then watches it. Changes and alerts reach the control plane as cursor-paged streams, and a scope that cannot resume gets an explicit gap instead of a silent hole.",
  },
  {
    label: "Intake freezes the evidence",
    detail: "An alert opens or continues an incident. The evidence journal records object versions and observation times, and each diagnosis revision freezes its own evidence manifest.",
  },
  {
    label: "Deterministic RCA forms hypotheses",
    detail: "The engine identifies candidate causal actors and open information gaps from typed Findings before any bounded read is spent.",
  },
  {
    label: "The investigator spends one legal read",
    detail: "A bounded state machine picks a single validated read for the most valuable gap and executes it through the Connector. Every read is recorded on an ordered tape.",
  },
  {
    label: "Evidence becomes a typed Finding",
    detail: "The observation is normalized into a Finding, hypotheses are rebuilt, and verification and resolution run again. A remaining gap loops back for another read within budget.",
  },
  {
    label: "A diagnosis revision is stored",
    detail: "The leader is chosen by the strength of its claim, the revision stores its coverage record and digests, and the console shows a single actor, competing actors or not established. Remediation is proposed, never executed.",
  },
] as const;

export const agenticSreBoundaryRows = [
  {
    side: "Investigator may (read-only)",
    items: [
      "select one legal, in-scope observation at a time",
      "read objects, Events, logs and traces through typed Connector requests",
      "stop safely on invalid actions, NO_DATA or an exhausted budget",
      "an optional LLM may choose among already-legal reads",
    ],
  },
  {
    side: "Deterministic engine owns · the model never does",
    items: [
      "normalizing observations into typed Findings",
      "rebuilding hypotheses, verification, confidence and resolution",
      "selecting the root entity and its causal path",
      "granting strong authority to a cause",
    ],
  },
] as const;

export const agenticSreConnectorFacts = [
  {
    title: "It dials out; nothing is exposed inbound",
    description: "In remote mode the control plane never connects to a customer cluster. The Connector runs inside it, holds every credential and dials out over gRPC with mutual TLS.",
  },
  {
    title: "Typed, bounded, audited requests",
    description: "Objects, Events, logs, resource pressure, traffic and traces through typed requests only. There is no shell and no free-form query.",
  },
  {
    title: "Secrets are excluded twice",
    description: "Once by read-only RBAC and again by the Connector's own deny list.",
  },
  {
    title: "Streams with explicit gaps",
    description: "Alerts and changes arrive as cursor-paged streams with epochs and explicit gap records for a Connector restart, buffer expiry or an unreachable backend, so the engine knows what it could not have seen.",
  },
  {
    title: "Proven equivalent over the wire",
    description: "Recorded real data survives the wire unchanged: direct and over-the-wire epistemic digests are identical on the migration gate.",
  },
] as const;

export const agenticSreStreamComparison = [
  { measure: "Event, source → journal (median / p90)", polling: "21.5 s / 27.1 s", watch: "1.2 s / 1.9 s" },
  { measure: "API requests per minute", polling: "about 116", watch: "about 10" },
  { measure: "Three-hour soak: failures / global re-snapshots", polling: "—", watch: "0 / 0" },
] as const;

export const agenticSreCoverageDimensions = [
  {
    dimension: "Source continuity",
    values: "CONTINUOUS · GAPPED (with intervals) · UNKNOWN",
    meaning: "Whether the Connector observed the scope without interruption up to the cutoff.",
  },
  {
    dimension: "Transport completeness",
    values: "PROVEN · NOT_PROVEN",
    meaning: "Whether the change stream, kept moving by a heartbeat, has been read past the cutoff. A diagnosis waits for this proof for at most 10 s.",
  },
] as const;

export const agenticSreEngineeringDecisions = [
  {
    title: "The investigator and the judge are separate",
    description:
      "A model can turn a plausible answer into an unverified diagnosis, so the investigator only chooses legal reads. Normalization, hypothesis rebuilding, verification and root-cause resolution stay deterministic, and every reported measurement ran with zero model calls.",
  },
  {
    title: "Strong authority is earned, not assumed",
    description:
      "A cause reaches strong authority only when a rule shows an execution witness and an incident effect at the exact target instance — a recorded quota rejection, or a chaos experiment's observed interval connected to the onset. Spawned or Applied alone confers nothing, and RESOLVED additionally requires every declared symptom to be covered, so it stays rare on purpose.",
  },
  {
    title: "A ranking's first place is not a cause",
    description:
      "Before the change, 23 of 122 testbed incidents led with an actor whose every finding was more than an hour old, and tied top scores were broken by name order. The leader is now chosen by the tier of its claim, and ties and missing evidence are shown as competing or not established. The change is presentation only; the stored diagnosis and its digest are untouched.",
  },
  {
    title: "Evidence belongs by when it was observed",
    description:
      "A diagnosis may use evidence the Connector observed by the cutoff, however late it reached the control plane, and source times never decide membership. Late evidence is not lost, and hindsight does not leak in.",
  },
  {
    title: "NO_DATA is neutral, not evidence against a theory",
    description:
      "A missing signal is reported as missing rather than counted against a hypothesis. The new per-scope coverage record is provenance today: the rules that infer from absence will read it one at a time, each measured on the testbed first.",
  },
  {
    title: "Every diagnosis can be replayed",
    description:
      "Each revision freezes its evidence manifest and the ordered tape of provider reads, and offline replay verifies the manifest, tape and epistemic digests. Replay reproduces the persisted evidence; it cannot recover evidence that was never captured.",
  },
] as const;

export const agenticSreMeasurements = [
  {
    measurement: "Ground-truth accuracy",
    result: "17/22 (77.3%)",
    compares: "The deterministic full-source diagnosis against the published ITBench-Lite label, exact canonical match only. This is the correctness measure.",
  },
  {
    measurement: "Full-source agreement",
    result: "21/25",
    compares: "The bounded prediction against the same engine's own full-source diagnosis, with predictions hashed before comparison. It measures information lost under a read budget, not correctness.",
  },
] as const;

export const agenticSreCalibration = [
  { confidence: "VERIFIED", test25: "8/10", all: "13/16" },
  { confidence: "LIKELY", test25: "9/15", all: "13/19" },
] as const;

export const agenticSreTestbedSlices = [
  {
    fault: "Network delay on payment-service",
    causeNamed: "3/3 of 3 valid runs",
    witness: "0/3 — a delay leaves no pod-level failure",
  },
  {
    fault: "CPU stress on order-service",
    causeNamed: "3/3 of 3 valid runs",
    witness: "1/3",
  },
  {
    fault: "Environment change rolled out to payment-service",
    causeNamed: "1/1 (phase 0)",
    witness: "0 — no rollout rule yet",
  },
] as const;

export const agenticSreEvidence = [
  {
    area: "ITBench-Lite TEST25",
    result: "17/22 (77.3%) · 0 model calls",
    detail: "Ground-truth accuracy of the full-source path. Blind when the architecture was frozen; since 2026-09-28 all 35 scenarios are development data, so this is regression evidence, not a generalization estimate. Four unmatchable labels are excluded (raw 17/25).",
  },
  {
    area: "All 35 ITBench-Lite scenarios",
    result: "26/31 (83.9%)",
    detail: "The full development regression set, with DEV10 at 9/9. Raw 26/35.",
  },
  {
    area: "Bounded vs full-source",
    result: "21/25 agreement",
    detail: "Six validated reads per incident, 150 reads, 0 tool errors. Measures information loss, not correctness; the bounded path's own ground-truth accuracy has not been established.",
  },
  {
    area: "Live scenario suite",
    result: "25/25 expected outcomes",
    detail: "25 faults staged on a running cluster, graded on the stored diagnosis: 16/16 root-cause actors, 9/9 abstentions, 0 fabricated RESOLVED. A 6-scenario holdout tier is kept out of engine changes; the labels are in-house with no external validity.",
  },
  {
    area: "Watch-driven change stream",
    result: "1.2 s median · p90 1.9 s",
    detail: "Source to evidence journal on the lab, down from 21.5 s with polling, with about 12× fewer API requests; a three-hour soak ran with 0 failures.",
  },
  {
    area: "Coverage proof",
    result: "60/60 deliveries proven",
    detail: "Every measured wait proved delivery past the cutoff, at a median of about 2 s and at most 7.0 s; none timed out.",
  },
  {
    area: "Instrumented testbed",
    result: "3 fault families · development tier",
    detail: "The injected cause and its exact instance were named in every valid run, with 0 false strong authority and 0 false RESOLVED. Small runs, not a benchmark.",
  },
  {
    area: "Trust boundary",
    result: "0 cluster writes",
    detail: "Read-only RBAC with Secrets denied twice, typed requests only, and remediation proposed but never executed.",
  },
] as const;

export const agenticSreStackGroups = [
  ["RCA engine", "Python · deterministic causal rules · LangGraph-orchestrated bounded investigation"],
  ["Connector", "gRPC over mutual TLS · read-only RBAC · watch-driven, cursor-paged streams"],
  ["Control plane", "FastAPI · SQLAlchemy · Alembic · PostgreSQL evidence journal"],
  ["Operator console", "React · TypeScript · Vite · TanStack Query · server-sent events · PDF/Markdown/JSON reports"],
  ["Observation sources", "Kubernetes objects + Events · Alertmanager · Prometheus · Loki · Tempo"],
  ["Testbed", "kind · Chaos Mesh · frozen manifests · recorded ground-truth timeline"],
  ["Quality gates", "Ruff · Mypy · pytest · OpenTelemetry"],
] as const;

export const agenticSreLimitations = [
  "The only blind generalization evidence, TEST25, has been folded into the development set; a new held-out measurement is being built on the testbed. The bounded path's own ground-truth accuracy has not been established.",
  "The testbed covers three fault families with a few development-tier runs each. There is no held-out result yet.",
  "Coverage is recorded on every diagnosis, but the rules that infer from absence do not read it yet; until each is changed and measured on the testbed, they behave as before.",
  "Strong authority needs an observed execution and a pod-level effect, so a latency-only fault yields a correctly named but non-strong cause.",
  "The Connector uses static 90-day certificates; enrollment, rotation, Helm packaging and multi-tenancy are not built, and the stream mode is opt-in.",
  "The control plane runs as a single replica, read endpoints are unauthenticated by default, and the local PostgreSQL has no durable volume, so evidence durability is not production-grade.",
  "Bounded windows and captured telemetry can miss decisive evidence, captured Loki data is not a full archive, and traffic and trace queries have no live readers yet.",
  "It is evidence-driven RCA, not formal causal inference, and there is no remediation, shell or cluster-write capability.",
] as const;

export const agenticSreDeepDiveLinks = [
  { label: "Connector boundary contract", href: `${repo}/blob/main/docs/architecture/connector-boundary-contract.md` },
  { label: "Causal semantics contract", href: `${repo}/blob/main/docs/architecture/m21-causal-semantics-contract.md` },
  { label: "Evidence timing and coverage design", href: `${repo}/blob/main/docs/architecture/late-evidence-design.md` },
  { label: "Testbed scenarios and results", href: `${repo}/blob/main/docs/architecture/testbed-scenarios-design.md` },
  { label: "Live-suite methodology", href: `${repo}/blob/main/docs/benchmarks/live-suite.md` },
  { label: "ITBench-Lite benchmark report", href: `${repo}/blob/main/evals/results/v1.1.2/README.md` },
  { label: "Roadmap", href: `${repo}/blob/main/docs/architecture/roadmap.md` },
] as const;
