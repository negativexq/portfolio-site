export type PlatformStatus = "PROVEN" | "BUILDING" | "EVOLVING" | "NEXT";

export type PlatformLink = {
  label: string;
  href: string;
};

export type PlatformNode = {
  id: string;
  stage: string;
  title: string;
  status: PlatformStatus;
  role: string;
  purpose: string;
  decision: string;
  evidence: readonly string[];
  stack: readonly string[];
  links: readonly PlatformLink[];
  details: {
    currentGoal?: string;
    milestone?: string;
    nextGate?: string;
    objective?: string;
    /** Capabilities that are actually implemented now, not a future target —
     * distinct from `evidence`, which is measured results. */
    implementedCore?: readonly string[];
    /** Consumers of a shared component, split by whether the integration is
     * real (end-to-end) or currently only a contract/evaluation fixture. */
    consumers?: readonly { name: string; status: "IMPLEMENTED" | "CONTRACT" }[];
    /** Independent sub-statuses shown inside one node's detail panel, e.g. a
     * component whose core is PROVEN while its platform-wide role is still
     * EVOLVING. Keeps the top-level `status` from having to average the two. */
    subStatuses?: readonly { label: string; status: PlatformStatus }[];
    routingDistinction?: {
      capability: string;
      model: string;
    };
    why: string;
    flow?: readonly string[];
  };
  architectureDescription?: string;
  showStatus?: boolean;
};

export const platformNodes = [
  {
    id: "knowledge",
    stage: "KNOW",
    title: "Knowledge Base RAG",
    status: "PROVEN",
    role: "Trusted organizational knowledge",
    purpose: "Evidence-backed access to unstructured organizational knowledge.",
    architectureDescription: "Trusted organizational knowledge",
    decision: "Agents choose what to look for; tenant scope, tools, calculations and release stay application-owned.",
    evidence: [
      "96/120 accepted outcomes on 120 distinct long-document questions",
      "PydanticAI agents on a typed research graph with application-owned ResearchState",
      "Original page-image reading, checked inputs and calculation in application code",
    ],
    stack: ["PydanticAI", "typed research graph", "ResearchState", "Qdrant", "Qwen3 embeddings", "BM25", "RRF", "BGE reranking", "tenant ACL", "page-image reading", "calculation in code", "OpenTelemetry"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/knowledge-base-rag" },
      { label: "Architecture", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/architecture.md" },
      { label: "Security", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/security.md" },
      { label: "Research workflow", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/adaptive-workflow.md" },
      { label: "Answered questions", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/adaptive-solved-questions.md" },
      { label: "Reranking evaluation", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/reranking.md" },
    ],
    details: {
      why: "Retrieval quality alone does not make an answer trustworthy. Agents handle the semantic decisions inside a typed research graph, while tenant scope, tool permissions, budgets, arithmetic and the release checks stay application-owned.",
      flow: ["authorized request", "scoped retrieval", "typed research graph", "scoped tools", "calculation in code", "release checks / abstain"],
    },
  },
  {
    id: "decision-sql",
    stage: "UNDERSTAND",
    title: "DecisionSQL",
    status: "PROVEN",
    role: "Data / Structured Data Plane",
    purpose: "Governed natural-language access to structured enterprise data.",
    architectureDescription: "Governed access to structured data",
    decision: "The model proposes SQL. Deterministic software decides what may execute.",
    evidence: [
      "160/180 = 88.89% governed task success",
      "28/30 authority · unauthorized relation blocked before DB access",
      "180-case benchmark · 12 synthetic domains",
    ],
    stack: ["Python", "FastAPI", "PostgreSQL", "sqlglot", "global SQL policy", "request-scoped authority", "server-owned grain safety", "EXPLAIN cost gate", "read-only execution", "counterfactual evaluation"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/decision-sql" },
    ],
    details: {
      nextGate: "M54 classifies the remaining governance, ambiguity and SQL-semantic misses by causal mechanism before the next intervention.",
      why: "A natural-language-to-SQL demo answers syntax. DecisionSQL is about whether a proposed query is authorized, bounded, explainable, and safe to run, and the 180-case benchmark backs that with execution-based evidence: governance is scored apart from execution, correctness is measured against counterfactual states, and when the model wrongly answered an authority-blocked case, request-scoped relation authority blocked the unauthorized relation before any database interaction.",
      flow: ["schema retrieval", "semantic resolution", "SQL proposal", "sqlglot AST validation", "global policy", "request-scoped authority", "EXPLAIN cost gate", "read-only execution", "result validation"],
    },
  },
  {
    id: "agent-runtime",
    stage: "ACT",
    title: "Agent Runtime",
    status: "PROVEN",
    role: "Agent Runtime foundation",
    purpose: "Controlled business actions where the model proposes intent but deterministic software owns execution authority.",
    architectureDescription: "Controlled business action runtime",
    decision: "The LLM never receives mutation authority.",
    evidence: [
      "540/540 measured deterministic safety attempts",
      "0 unsafe executable survivors",
      "0 unsafe executions",
    ],
    stack: ["LangGraph", "FastAPI", "PostgreSQL", "SQLAlchemy", "typed tools", "deterministic policy", "confirmation", "revalidation", "idempotency", "OpenTelemetry"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/agentic-customer-service-platform" },
      { label: "Architecture", href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/architecture.md" },
      { label: "Release evidence", href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/release-evidence.md" },
      { label: "Security QA", href: "https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/security/real-llm-production-qa-report.md" },
    ],
    details: {
      why: "A plausible model proposal is not an authorization decision. Scope, target resolution, policy, confirmation, revalidation, idempotency, and execution stay outside the model.",
      flow: ["semantic proposal", "target resolution", "business validation", "policy", "confirmation", "revalidation", "typed execution"],
    },
  },
  {
    id: "adaptive-router",
    stage: "MODEL RUNTIME",
    title: "Adaptive Model Router",
    status: "EVOLVING",
    role: "Shared model-compute selection across bounded subsystems",
    purpose: "Shared model-compute routing across bounded AI subsystems: the router selects computation, it does not grant permissions.",
    architectureDescription: "Shared model-compute selection",
    decision: "Routing chooses computation; it never grants authority. Model choice never changes permissions.",
    evidence: [
      "374 tests passing, 3 skipped · strict mypy · Ruff, verified by the CI release gate",
      "0 critical regressions, 100% quality retention (synthetic offline evaluation)",
      "26.76% projected cost reduction vs. a strong-only baseline",
      "~6.5k routing decisions/sec — local pure-routing characterization, not provider/API throughput",
    ],
    stack: ["FastAPI", "provider-neutral registry v2", "deterministic release gate", "shadow/canary policy lifecycle", "strict mypy", "Ruff"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/adaptive-model-router" },
      { label: "Architecture", href: "https://github.com/negativexq/adaptive-model-router/blob/main/docs/architecture.md" },
    ],
    details: {
      currentGoal: "The router's core is implemented and passes a deterministic release gate: eligibility, quality/latency/cost selection, health-aware fallback and quality escalation all exist and are enforced before any provider call. What is evolving is its platform-wide shared-runtime role: the Coding Agent adapter is integrated end to end, and Knowledge RAG, DecisionSQL and Agent Runtime are contract-tested against it. By design, model lifecycle approval belongs to ModelOps Control Plane; this router selects eligible compute for a request the platform already approved.",
      milestone: "Keep capability routing separate from model routing: the bounded subsystem decides which capability handles a request; the router only decides which eligible model computes it.",
      nextGate: "Run the frozen 24-case real coding-agent benchmark (coding-agent-real-v1) against a hosted provider.",
      objective: "Use the smallest and cheapest eligible model that satisfies a request's quality, latency, privacy, capability and budget requirements — never the strongest model by default.",
      implementedCore: [
        "task & caller-supplied capability context",
        "complexity, risk & required quality",
        "latency priority & expected cost",
        "privacy, locality & hard budget",
        "health-aware eligibility",
        "availability fallback",
        "quality escalation",
        "protected minimum model tiers",
        "provider-neutral model registry (cheap / balanced / strong)",
      ],
      consumers: [
        { name: "Coding Agent", status: "IMPLEMENTED" },
        { name: "Knowledge RAG", status: "CONTRACT" },
        { name: "DecisionSQL", status: "CONTRACT" },
        { name: "Agent Runtime", status: "CONTRACT" },
      ],
      subStatuses: [
        { label: "Core routing engine", status: "PROVEN" },
        { label: "Platform-wide integration", status: "EVOLVING" },
      ],
      routingDistinction: {
        capability: "Which subsystem should handle the request?",
        model: "Which eligible model should compute it inside that subsystem?",
      },
      why: "EVOLVING describes the platform-wide shared-runtime role, not the router's own engine — that engine is implemented and release-gated.",
      flow: ["task + capability + constraints", "hard eligibility (health, privacy, budget)", "quality / latency / cost selection", "provider-neutral model registry", "provider or local runtime", "fallback / escalation if needed"],
    },
  },
  {
    id: "modelops",
    stage: "MODEL LIFECYCLE",
    title: "ModelOps Control Plane",
    status: "PROVEN",
    role: "Evidence-based model lifecycle management",
    purpose: "Canary delivery and promotion control where candidates earn traffic through explicit evidence gates.",
    decision: "A candidate earns production traffic by satisfying predefined evidence gates, not by existing.",
    evidence: [
      "10% → 25% → 50% → 100% automated canary progression",
      "PASS / FAIL / INCONCLUSIVE verdicts with automatic rollback paths",
      "279 backend tests · ~91% statement coverage",
    ],
    stack: ["FastAPI", "SQLAlchemy", "canary rollout", "quality + reliability gates", "delayed ground truth", "automatic rollback", "reconciliation", "Docker Compose"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/modelops-control-plane" },
      { label: "Design notes", href: "https://github.com/negativexq/modelops-control-plane/blob/main/docs/DESIGN_NOTES.md" },
      { label: "Integration smoke test", href: "https://github.com/negativexq/modelops-control-plane/blob/main/backend/scripts/ci_smoke_test.py" },
      { label: "CI workflow", href: "https://github.com/negativexq/modelops-control-plane/blob/main/.github/workflows/ci.yml" },
    ],
    details: {
      why: "Reliability and delayed model-quality evidence are different questions. Insufficient evidence stays INCONCLUSIVE instead of becoming approval, while desired routing state is reconciled with observed router state.",
      flow: ["candidate", "canary", "quality + reliability gates", "PASS / FAIL / INCONCLUSIVE", "promote / rollback", "reconcile"],
    },
  },
  {
    id: "model-pool",
    stage: "MODEL LIFECYCLE",
    title: "Model Pool",
    status: "NEXT",
    showStatus: false,
    role: "Runtime resource grouping",
    purpose: "The set of models available to runtime selection; not a standalone project.",
    decision: "The router selects from available models; lifecycle evidence changes which candidates are available.",
    evidence: [],
    stack: ["General LLMs · CURRENT", "Specialist SLMs · NEXT", "VLM / Other · FUTURE"],
    links: [],
    details: {
      currentGoal: "General models are the current available pool.",
      milestone: "Specialist SQL/RAG SLMs and VLM or other models are future additions, each with its own evidence boundary.",
      nextGate: "No candidate enters the pool without passing the same offline evaluation and ModelOps gates as any other model.",
      why: "The model pool is a runtime resource grouping, not a portfolio project or a claim that every model class is deployed.",
    },
  },
  {
    id: "causetune",
    stage: "MODEL LIFECYCLE",
    title: "CauseTune",
    status: "PROVEN",
    role: "Specialist-model training and evaluation",
    purpose: "A measured specialization path from base model to evaluated candidate.",
    decision: "Specialization only counts if it beats the untouched base model on a benchmark frozen before training and excluded from checkpoint selection.",
    evidence: [
      "65.28% → 99.31% diagnosis exact match, held at 98.33% on a fresh blind challenge",
      "cross-model replication on a second model family (Phi-4-mini)",
      "18.75% false-confident diagnosis measured at the failure boundary",
    ],
    stack: ["QLoRA", "PEFT", "Qwen3-4B", "frozen benchmark", "fresh blind evaluation", "failure-boundary testing", "cross-model replication"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/cause-tune" },
    ],
    details: {
      nextGate: "The gain held on a fresh blind benchmark (98.33%). Next: wire the evaluated candidate into the ModelOps canary lifecycle.",
      why: "The training and evaluation loop is proven to produce a measured gain that decomposes into specific failure modes disappearing, not one headline score, and the gain was then stress-tested rather than left alone: retested on an independent blind challenge, a second model family, and an adversarial evidence boundary. A cheaper recipe that looked finished on validation did not survive that retest.",
      flow: ["base model", "CauseTune / QLoRA", "fresh blind evaluation", "candidate", "ModelOps", "promote / rollback", "model pool"],
    },
  },
  {
    id: "sre",
    stage: "OPERATE",
    title: "Agentic SRE",
    status: "PROVEN",
    role: "Incident investigation for the Kubernetes runtime",
    purpose: "Root cause analysis for Kubernetes incidents from evidence, with a read-only Connector inside the cluster.",
    architectureDescription: "Evidence-driven Kubernetes root cause analysis",
    decision: "A bounded investigator gathers evidence; deterministic rules decide the root cause.",
    evidence: [
      "27/27 held-out testbed runs with the true cause named · HOLDOUT23",
      "0 false RESOLVED · 0 false strong authority · decoy never named",
      "18/31 exact on ITBench-Lite · 0 model calls in every measurement",
    ],
    stack: ["Python", "Kubernetes", "gRPC over mTLS", "read-only Connector", "PostgreSQL evidence journal", "deterministic RCA", "offline replay", "Prometheus · Loki · Tempo", "Chaos Mesh testbed", "React console"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/agentic-sre" },
      { label: "How it works", href: "https://github.com/negativexq/agentic-sre/blob/main/docs/how-it-works.md" },
      { label: "Measured performance", href: "https://github.com/negativexq/agentic-sre/blob/main/docs/results/measured-performance.md" },
    ],
    details: {
      why: "When the platform's workloads fail, an alert shows what broke but rarely why. Agentic SRE keeps credentials inside the cluster behind a read-only Connector, gathers evidence within explicit budgets, and lets deterministic rules decide the cause, so every diagnosis can be replayed from its frozen inputs.",
      flow: ["alert", "Connector evidence stream", "typed Findings", "bounded read-only investigation", "deterministic verification", "diagnosis + proposed remediation"],
    },
  },
] as const satisfies readonly PlatformNode[];

export const platformStatusDefinitions = [
  ["PROVEN", "Implemented independently and backed by explicit evidence."],
  ["BUILDING", "Active implementation."],
  ["EVOLVING", "A working subsystem exists; its role or abstraction is being generalized."],
  ["NEXT", "Not implemented yet."],
] as const;

export type PlatformLayerItem = {
  label: string;
  status?: PlatformStatus;
  items: readonly string[];
};

export type PlatformLayer = {
  id: string;
  band: string;
  note?: string;
  columns: readonly PlatformLayerItem[];
};

/**
 * The full target architecture, shown only when the reader expands it.
 *
 * The simplified graph above answers "what exists and how does it connect".
 * This answers "what is the whole system meant to become", which is a
 * different question and a much denser one. Status markers travel with every
 * box on purpose: without them the target reads as though it were built.
 */
export const platformArchitectureLayers = [
  {
    id: "entry",
    band: "Request entry",
    columns: [
      { label: "Platform Gateway", items: ["identity · tenant", "request context", "authn / authz context"] },
      { label: "Capability Router", status: "NEXT", items: ["which capability handles this request"] },
    ],
  },
  {
    id: "planes",
    band: "Capability planes",
    note: "Each plane proposes; the deterministic controls inside it decide.",
    columns: [
      { label: "Knowledge plane", status: "PROVEN", items: ["scoped retrieval + reranking", "typed research graph (PydanticAI)", "page-image reading + calculation in code", "source, value and scope checks"] },
      { label: "Data plane", status: "PROVEN", items: ["schema retrieval", "global SQL policy", "request-scoped authority", "server-owned grain safety", "EXPLAIN cost gate", "read-only execution"] },
      { label: "Action plane", status: "PROVEN", items: ["target resolution", "policy", "confirmation", "revalidation", "idempotent execution"] },
    ],
  },
  {
    id: "runtime",
    band: "Shared model runtime",
    note: "Model choice never changes permissions.",
    columns: [
      { label: "Adaptive Model Router", status: "EVOLVING", items: ["core routing engine: PROVEN", "task · capability · complexity aware", "quality · latency · cost · budget aware", "health · fallback · escalation", "1 real integration · 3 contract-tested"] },
      { label: "Model tiers", status: "NEXT", items: ["specialist SLM", "general reasoning LLM", "vision and multimodal"] },
      { label: "Inference providers", items: ["local open models", "OpenAI-compatible APIs"] },
    ],
  },
  {
    id: "lifecycle",
    band: "Model lifecycle",
    note: "A candidate reaches the router only through an evaluation it passed.",
    columns: [
      { label: "CauseTune", status: "PROVEN", items: ["QLoRA / PEFT", "frozen benchmark", "resource profiling"] },
      { label: "Offline evaluation", status: "PROVEN", items: ["base vs fine-tuned", "quality · VRAM · efficiency", "generalization slices"] },
      { label: "ModelOps Control Plane", status: "PROVEN", items: ["canary 10 → 25 → 50 → 100", "quality and reliability gates", "delayed ground truth", "promotion · rollback · reconciliation"] },
      { label: "Model registry", status: "NEXT", items: ["versions and lineage", "feeds the router"] },
    ],
  },
  {
    id: "governance",
    band: "Cross-cutting governance",
    note: "Shared contracts and central governance over independent services, not one monolith.",
    columns: [
      { label: "Enterprise Context", status: "NEXT", items: ["one entity across planes", "data · knowledge · metrics · actions", "role / tenant / scope"] },
      { label: "Capability Gateway", status: "NEXT", items: ["typed capabilities", "REST / OpenAPI · MCP", "databases · knowledge · business systems"] },
      { label: "Unified Registry", status: "NEXT", items: ["models · agents · knowledge bases", "entities · tools · policies", "eval suites · deployments"] },
      { label: "Control Plane", status: "NEXT", items: ["identity · policy · lifecycle", "evaluation · deployment state", "observability · audit · cost"] },
    ],
  },
  {
    id: "observability",
    band: "One trace across every plane",
    columns: [
      { label: "knowledge.rag", items: ["retrieve", "rerank", "evidence.build", "model.route", "validate"] },
      { label: "decision.sql", items: ["schema.retrieve", "sql.generate", "sql.parse", "policy.evaluate", "query.execute"] },
      { label: "agent.runtime", items: ["proposal", "target.resolve", "policy.evaluate", "confirmation", "tool.execute"] },
    ],
  },
  {
    id: "operations",
    band: "Operations",
    note: "Incidents are investigated from evidence; remediation is proposed, never executed.",
    columns: [
      { label: "Agentic SRE", status: "PROVEN", items: ["read-only in-cluster Connector", "evidence journal with explicit gaps", "deterministic root-cause rules", "replayable diagnoses"] },
    ],
  },
] satisfies readonly PlatformLayer[];
