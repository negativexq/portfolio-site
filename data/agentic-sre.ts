export const agenticSreProjectUrl = "https://omerfkoc.dev/projects/agentic-sre";
export const agenticSreRevision = "87fc192b94932ddad51aeb48a77911488e470a03";
const repo = "https://github.com/negativexq/agentic-sre";
const source = `${repo}/blob/${agenticSreRevision}`;
export const agenticSreSources = {
  measured: `${source}/docs/results/measured-performance.md`,
  benchmark: `${source}/evals/results/v1.1.2/README.md`,
  exact: `${source}/docs/architecture/c11-itbench-equivalence.md`,
  holdout: `${source}/docs/architecture/testbed-scenarios-design.md#351-nineteenth-holdout-result-2026-10-11-engine-280-24-runs-from-a-worktree`,
  watch: `${source}/docs/architecture/connector-boundary-contract.md`,
  semantics: `${source}/docs/architecture/m21-causal-semantics-contract.md`,
  screenshots: `${source}/docs/ui/screenshots/README.md`,
  how: `${source}/docs/how-it-works.md`,
  roadmap: `${source}/docs/architecture/roadmap.md`,
  readme: `${source}/README.md`,
} as const;
export const agenticSreMeta = {
  keywords: [
    "Agentic SRE",
    "Kubernetes incident investigation",
    "deterministic RCA",
    "read-only Connector",
    "gRPC",
    "mTLS",
    "evidence journal",
    "offline replay",
    "causal topology",
    "operator console",
    "ITBench-Lite",
    "fault injection",
  ],
} as const;
export const agenticSreWorkflow = [
  {
    label: "An alert opens an incident",
    detail:
      "Alertmanager context arrives through the Connector. Intake records the alert occurrence, incident episode and observation cutoff.",
  },
  {
    label: "Observations and changes are captured",
    detail:
      "LIST + WATCH feeds object versions, Events, lifecycle records and explicit scope gaps into the PostgreSQL evidence journal.",
  },
  {
    label: "Findings become causal hypotheses",
    detail:
      "Deterministic normalization attaches typed Findings to resource instances. Directional topology supplies candidate claim paths, rather than treating graph proximity as causality.",
  },
  {
    label: "Investigation fills evidence gaps",
    detail:
      "The bounded investigator selects one legal read through the Connector, within turn, read, wall-time and per-gap budgets. The ordered provider-read tape records what actually ran.",
  },
  {
    label: "Rules verify causal claims",
    detail:
      "The engine rebuilds hypotheses and checks execution, effect, symptom coverage, material rivals and open frontier questions. The investigator never decides the root cause; an optional LLM can only select already-legal reads.",
  },
  {
    label: "A diagnosis revision is persisted",
    detail:
      "The result freezes its evidence manifest, provenance, coverage and limitations. Offline replay verifies the manifest, read tape and epistemic digest against the retained evidence.",
  },
  {
    label: "The operator inspects the explanation",
    detail:
      "The console connects the causal path to Findings, raw observations, timeline and revision history. Competing explanations remain visible; remediation is proposed for human review and never executed.",
  },
] as const;
export const agenticSreSemantics = [
  {
    title: "Resource identity and time are part of the claim",
    description:
      "A recreated Pod can reuse a name without being the same instance. UID-aware identity and lifecycle evidence bind faults and resource-pressure effects to the Pod that existed during execution. Evidence membership follows Connector observation time at the cutoff, so late delivery does not become hindsight.",
  },
  {
    title: "Execution needs an effect",
    description:
      "A chaos object being Applied or Spawned is insufficient. Strong authority requires an execution witness at the exact target and an incident effect. Attributed service traces can connect a payment fault to upstream symptoms; an experiment that ended 40 minutes before onset must not earn strong authority.",
  },
  {
    title: "Shared evidence is explained, not counted twice",
    description:
      "A target Pod may appear as a rival because it carries the same fault effect as an upstream actor. Shared-evidence rules explain that manifestation only when the evidence and path justify it. RESOLVED also needs every declared symptom covered; a single witnessed Pod cannot explain a Service while another selected Pod remains ready.",
  },
  {
    title: "Configuration questions require continuous observation",
    description:
      "The configuration frontier can close when the API write record predates the window and the scope was followed continuously through onset with delivery proven. A ConfigMap edited inside the window remains open. A gap cannot be converted into proof of no change.",
  },
  {
    title: "Dependencies are answered for a specific claim",
    description:
      "Engine 2.9.0 answers a dependency question when it lies on every material claim’s recorded path. Engine 2.10.0 can identify a declared dependency that the traced caller never used: server.address attributes must identify outgoing calls and no caller trace read may have failed. In the development check, order-service did not call Redis, while order-worker did; the answers differed accordingly.",
  },
  {
    title: "Healthy earlier calls do not prove health at onset",
    description:
      "A proposed dependency-health rule failed twice: Kafka calls looked healthy before a fault stopped new calls from reaching it. Shortening the window did not close that blind interval. The rule was withdrawn; the dependency question stays open. Truncated trace samples still have an unresolved representativeness limit.",
  },
] as const;
export const agenticSreBenchmarks = [
  {
    label: "Historical blind TEST25 accuracy",
    result: "17/22 · 77.3%",
    detail:
      "Frozen full-source path versus published ground-truth labels; raw 17/25. Three unmatchable TEST labels excluded.",
    href: agenticSreSources.benchmark,
  },
  {
    label: "Historical TEST25 path agreement",
    result: "21/25 · 84%",
    detail:
      "Bounded versus the same engine’s FULL_SOURCE root. Predictions hashed first. Consistency under a read budget, not ground-truth correctness.",
    href: agenticSreSources.benchmark,
  },
  {
    label: "Historical combined accuracy",
    result: "26/31 · 83.9%",
    detail:
      "Full-source ground truth across DEV + TEST; raw 26/35. Four unmatchable labels excluded. Includes development data.",
    href: agenticSreSources.benchmark,
  },
  {
    label: "Last documented full-set exact score",
    result: "18/31 · 58.1%",
    detail:
      "Engine 2.2.2, full-source exact canonical root against published labels. Causal equivalence and controller ancestry are separate scores.",
    href: agenticSreSources.exact,
  },
] as const;
export const agenticSreFaultFamilies = [
  ["Dependency fault", "Packet loss on payment-service", "1/9"],
  ["Direct pod fault", "CPU stress on payment-service", "6/16"],
  ["Scheduled recurring fault", "Schedule spawning CPU stress", "0/4"],
  [
    "Configuration rollout",
    "Missing image tag; environment error rollout (variant C)",
    "0/12 + 0/15",
  ],
  [
    "Negative control",
    "Missing image plus isolated decoy; DB-delay rollout variant C",
    "0/8 + 0/14",
  ],
  ["Competing causes", "Packet loss plus independent pod kill", "5/21"],
] as const;
export const agenticSreScreenshots = [
  {
    file: "incident-workspace-dark.png",
    width: 1440,
    height: 1357,
    title: "Incident workspace",
    alt: "Seeded dark incident workspace showing an engine diagnosis, causal path and recorded lifecycle",
    detail:
      "The diagnosis and its evidence basis stay beside investigation context.",
  },
  {
    file: "evidence-explorer-dark.png",
    width: 1440,
    height: 1293,
    title: "Evidence explorer",
    alt: "Seeded evidence explorer with searchable normalized Findings attached to Kubernetes resources",
    detail:
      "A resource, Finding or causal-node selection scopes related evidence across views.",
  },
  {
    file: "incident-timeline-dark.png",
    width: 1440,
    height: 2341,
    title: "Incident timeline",
    alt: "Seeded incident timeline separating occurrence and recording times for changes and lifecycle events",
    detail:
      "Occurrence and recording times expose delayed observations instead of flattening chronology.",
  },
  {
    file: "diagnosis-history-dark.png",
    width: 1440,
    height: 1000,
    title: "Diagnosis history",
    alt: "Seeded diagnosis history showing revision metadata and an explicit first revision",
    detail:
      "This seed has one revision. The UI does not invent a predecessor comparison.",
  },
] as const;
export const agenticSreLimitations = [
  "Read-only access limits the blast radius, but leaves recovery to the operator. There is no shell, autonomous remediation or cluster-write capability.",
  "Conservative authority deliberately leaves many diagnoses unresolved. Correct actor identification is weaker than proving every symptom and eliminating material rivals. Six fault families on one demo workload remain a small held-out evaluation.",
  "Observation windows and read budgets can miss decisive evidence. Loki capture is not a complete archive; bounded traffic is not yet read live, and some queries and signal mappings remain workload-specific.",
  "Tempo stability affects causal evidence. In the nineteenth HOLDOUT, one memory kill caused 117 failed trace reads in a competing-causes run. Missing evidence remains a limitation; replay cannot recover it.",
  "Replay lasts only as long as its exact persisted inputs. Retention does not protect rows merely because a manifest references them, and the local reference PostgreSQL Deployment has no durable volume.",
  "The supported control plane is single-process / single-replica. Several Connectors can enroll, but diagnosis uses one configured Connector; high availability, multi-cluster diagnosis and multi-tenancy remain incomplete.",
  "Connector preflight, one-time enrollment, certificate rotation, revocation and a Helm chart are implemented. No Connector image is published yet, stream mode is opt-in, and built-in read endpoints are unauthenticated by default. Deployment authentication, network controls and storage hardening remain necessary.",
] as const;
export const agenticSreDeepDiveLinks = [
  { label: "How the system works", href: agenticSreSources.how },
  {
    label: "Measured performance and methodology",
    href: agenticSreSources.measured,
  },
  {
    label: "Causal semantics and rule evidence",
    href: agenticSreSources.semantics,
  },
  { label: "Nineteenth HOLDOUT report", href: agenticSreSources.holdout },
  {
    label: "Connector boundary and WATCH measurements",
    href: agenticSreSources.watch,
  },
  {
    label: "Console screenshots and capture provenance",
    href: agenticSreSources.screenshots,
  },
  { label: "Engineering roadmap", href: agenticSreSources.roadmap },
] as const;
