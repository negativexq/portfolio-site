export const agenticSreProjectUrl = "https://omerfkoc.dev/projects/agentic-sre";
export const agenticSreRevision = "77f2c66bed3f828adedf6a5cadf104511963faea";
const repo = "https://github.com/negativexq/agentic-sre";
const source = `${repo}/blob/${agenticSreRevision}`;
export const agenticSreSources = {
  measured: `${source}/docs/results/measured-performance.md`,
  benchmark: `${source}/evals/results/v1.1.2/README.md`,
  exact: `${source}/docs/architecture/c11-itbench-equivalence.md`,
  holdout: `${source}/docs/architecture/testbed-scenarios-design.md#411-results-2026-10-13-engine-2170-at-bd90b5b-27-runs-from-a-worktree-scored-after-the-run`,
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
      "The result freezes its evidence manifest, provenance and per-scope coverage. Offline replay verifies the manifest, read tape and epistemic digest against the retained evidence.",
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
      "The configuration frontier closes when the API write record predates the window and the scope was followed continuously through onset with delivery proven. A gap is never converted into proof of no change.",
  },
  {
    title: "Dependencies are answered for a specific claim",
    description:
      "A dependency question is answered when it lies on every material claim’s recorded path, and a declared dependency the traced caller never used is identified from server.address attributes on outgoing calls. In the development check, order-service did not call Redis while order-worker did, and the answers differed accordingly.",
  },
  {
    title: "A symptom met elsewhere answers the dependency question",
    description:
      "Engine 2.17.0 reads each firing alert’s own counter samples. When the callers’ alert was met by refusals at another peer before any request reached the dependency, the dependency question is answered from that record. On HOLDOUT23 the rule answered 11 dependency questions, each checked against 19 to 32 candidate requests and every stored span of the run, with none answered wrongly.",
  },
] as const;
export const agenticSreBenchmarks = [
  {
    label: "ITBench-Lite exact root cause",
    result: "18/31 · 58.1%",
    detail:
      "Engine 2.17.0, all 35 scenarios on the full-source path, 31 scoreable. The answer must equal the published label exactly.",
    href: agenticSreSources.exact,
  },
  {
    label: "Evidence-backed causal equivalence",
    result: "20/31 · 64.5%",
    detail:
      "Engine 2.17.0: the answer is a Schedule whose own spawned experiment ran across the incident’s onset. Reported beside the exact score.",
    href: agenticSreSources.exact,
  },
  {
    label: "TEST25, blind when frozen",
    result: "17/22 · 77.3%",
    detail:
      "Full-source path against published ground truth on the held-out split of the frozen architecture; raw 17/25, three unmatchable labels excluded.",
    href: agenticSreSources.benchmark,
  },
  {
    label: "All 35, frozen architecture",
    result: "26/31 · 83.9%",
    detail:
      "DEV10 plus TEST25 against published ground truth; four unmatchable labels excluded.",
    href: agenticSreSources.benchmark,
  },
] as const;
export const agenticSreFaultFamilies = [
  ["Dependency fault", "Packet loss on payment-service", "3/3"],
  ["Dependency fault (new)", "Delay on the Kafka Pod alone", "3/3"],
  ["Direct pod fault", "CPU stress on payment-service", "3/3"],
  ["Scheduled recurring fault", "Schedule spawning CPU stress", "3/3"],
  ["Configuration rollout", "Image change to a missing tag", "3/3"],
  ["Configuration rollout", "Environment error rollout (variant C)", "3/3"],
  ["Negative control", "Real change plus a CPU-stress decoy", "3/3"],
  ["Negative control", "DB-delay rollout plus decoy (variant C)", "3/3"],
  ["Competing causes", "Packet loss plus an independent pod kill", "3/3"],
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
      "Every revision is kept with its metadata, so a diagnosis can be compared with what came before it.",
  },
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
  { label: "HOLDOUT23 pre-registration and results", href: agenticSreSources.holdout },
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
