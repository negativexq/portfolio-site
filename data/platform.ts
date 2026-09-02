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
    currentFoundation?: string;
    milestone?: string;
    nextGate?: string;
    objective?: string;
    targetEvolution?: readonly string[];
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
    decision: "Tenant ACL and evidence validation stay server-owned; unsupported answers fail closed.",
    evidence: [
      "95.9% candidate evidence recall",
      "220-query frozen reranker benchmark",
      "0 citation contract failures",
    ],
    stack: ["Qdrant", "Qwen3 embeddings", "BM25", "RRF", "BGE reranking", "tenant ACL", "citation validation", "fail-closed abstention", "OpenTelemetry"],
    links: [
      { label: "GitHub", href: "https://github.com/negativexq/knowledge-base-rag" },
      { label: "Architecture", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/architecture.md" },
      { label: "Security", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/security.md" },
      { label: "Reranking evaluation", href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/reranking.md" },
      { label: "Canonical evaluation", href: "https://github.com/negativexq/knowledge-base-rag/tree/main/artifacts/ragbench/canonical" },
    ],
    details: {
      why: "Retrieval quality alone does not make an answer trustworthy. Tenant scope, support-unit identity, citation validation, and abstention are separate system boundaries.",
      flow: ["authorized request", "dense + BM25 retrieval", "RRF + BGE", "evidence construction", "validation", "release / abstain"],
    },
  },
  {
    id: "decision-sql",
    stage: "UNDERSTAND",
    title: "DecisionSQL",
    status: "BUILDING",
    role: "Data / Structured Data Plane",
    purpose: "Governed natural-language access to structured enterprise data.",
    architectureDescription: "Governed access to structured data",
    decision: "The LLM proposes SQL. Deterministic software decides what may execute.",
    evidence: [],
    stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "sqlglot", "schema retrieval", "semantic metrics", "OpenTelemetry", "frozen evaluation harness"],
    links: [],
    details: {
      currentGoal: "Build a structured-data path where execution authority is explicit from the first query.",
      milestone: "Define schema retrieval, semantic metrics, AST validation, authorization, and read-only execution as separate stages.",
      nextGate: "Freeze the evaluation harness and execution policy before treating generated SQL as a useful result.",
      why: "A natural-language-to-SQL demo answers syntax. DecisionSQL is about whether a proposed query is authorized, bounded, explainable, and safe to run.",
      flow: ["schema retrieval", "semantic resolution", "SQL proposal", "sqlglot AST validation", "authorization", "EXPLAIN cost gate", "read-only execution", "result validation"],
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
    role: "Model selection inside bounded subsystems",
    purpose: "A broader routing abstraction evolving from the implemented Cost-Aware LLM Router.",
    architectureDescription: "Model selection inside bounded AI subsystems",
    decision: "Routing chooses computation; it never grants authority.",
    evidence: [],
    stack: ["task-aware", "quality-aware", "latency-aware", "privacy-aware"],
    links: [],
    details: {
      currentGoal: "Generalize the existing cost-aware routing foundation into an adaptive model runtime.",
      currentFoundation: "Cost-Aware LLM Router",
      milestone: "Keep capability routing separate from model routing: first choose the subsystem, then choose the model inside it.",
      nextGate: "Define comparable quality, latency, cost, capability, and local-only signals before broadening the router contract.",
      objective: "Use the smallest and cheapest model that reliably satisfies the task’s quality, latency, privacy and capability requirements.",
      targetEvolution: ["task-aware", "capability-aware", "complexity-aware", "quality-aware", "latency-aware", "cost-aware", "privacy / local-only aware", "health-aware", "fallback / escalation aware"],
      routingDistinction: {
        capability: "Which subsystem should handle the request?",
        model: "Which model should perform the AI work inside that subsystem?",
      },
      why: "The objective is to use the smallest and cheapest model that reliably satisfies the task's quality, latency, privacy, and capability requirements.",
      flow: ["task + constraints", "candidate model classes", "quality / latency / cost", "local-only policy", "fallback / escalation"],
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
    id: "fineforge",
    stage: "MODEL LIFECYCLE",
    title: "FineForge",
    status: "NEXT",
    role: "Specialist-model training and evaluation",
    purpose: "A planned specialization path from base model to evaluated candidate.",
    decision: "Specialization must beat the base model on the task and the operating constraints that matter.",
    evidence: [],
    stack: ["QLoRA", "offline evaluation", "quality", "latency", "VRAM", "cost", "generalization"],
    links: [],
    details: {
      currentGoal: "Define the training and evaluation path for specialist model candidates.",
      milestone: "Compare base and specialized models across task quality, execution accuracy where relevant, latency, throughput, VRAM, cost, and generalization.",
      nextGate: "A candidate must clear offline evaluation before ModelOps can manage its canary lifecycle.",
      why: "FineForge is intentionally NEXT: no specialization result is presented as implemented or better than a base model.",
      flow: ["base model", "FineForge / QLoRA", "offline evaluation", "candidate", "ModelOps", "promote / rollback", "model pool"],
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
      { label: "Knowledge plane", status: "PROVEN", items: ["retrieval + reranking", "evidence construction", "citation validation", "fail-closed abstention"] },
      { label: "Data plane", status: "BUILDING", items: ["schema retrieval", "SQL generation", "AST validation", "table / column ACL", "read-only execution"] },
      { label: "Action plane", status: "PROVEN", items: ["target resolution", "policy", "confirmation", "revalidation", "idempotent execution"] },
    ],
  },
  {
    id: "runtime",
    band: "Shared model runtime",
    note: "Model choice never changes permissions.",
    columns: [
      { label: "Adaptive Model Router", status: "EVOLVING", items: ["task · capability · complexity aware", "quality · latency · cost aware", "privacy and local-only aware", "health · fallback · escalation"] },
      { label: "Model tiers", status: "NEXT", items: ["specialist SLM", "general reasoning LLM", "vision and multimodal"] },
      { label: "Inference providers", items: ["local open models", "OpenAI-compatible APIs"] },
    ],
  },
  {
    id: "lifecycle",
    band: "Model lifecycle",
    note: "A candidate reaches the router only through an evaluation it passed.",
    columns: [
      { label: "FineForge", status: "NEXT", items: ["QLoRA / PEFT", "dataset preparation", "resource profiling"] },
      { label: "Offline evaluation", status: "NEXT", items: ["base vs fine-tuned", "quality · latency · VRAM", "generalization"] },
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
] satisfies readonly PlatformLayer[];
