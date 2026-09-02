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
    why: string;
    flow?: readonly string[];
  };
};

export const platformNodes = [
  {
    id: "knowledge",
    stage: "KNOW",
    title: "Knowledge Base RAG",
    status: "PROVEN",
    role: "Trusted organizational knowledge",
    purpose: "Evidence-backed access to unstructured organizational knowledge.",
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
    decision: "The LLM proposes SQL. Deterministic software decides what may execute.",
    evidence: [],
    stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "sqlglot", "schema retrieval", "semantic metrics", "OpenTelemetry", "frozen evaluation harness"],
    links: [],
    details: {
      currentGoal: "Build a structured-data path where execution authority is explicit from the first query.",
      milestone: "Define schema retrieval, semantic metrics, AST validation, authorization, and read-only execution as separate stages.",
      nextGate: "Freeze the evaluation harness and execution policy before treating generated SQL as a useful result.",
      why: "A natural-language-to-SQL demo answers syntax. DecisionSQL is about whether a proposed query is authorized, bounded, explainable, and safe to run.",
      flow: ["natural language", "schema retrieval", "semantic layer", "SQL proposal", "AST + ACL + cost gate", "read-only execution", "result validation"],
    },
  },
  {
    id: "agent-runtime",
    stage: "ACT",
    title: "Agent Runtime",
    status: "PROVEN",
    role: "Agent Runtime foundation",
    purpose: "Controlled business actions where the model proposes intent but deterministic software owns execution authority.",
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
    decision: "Routing chooses computation; it never grants authority.",
    evidence: [],
    stack: ["task-aware", "quality-aware", "latency-aware", "privacy-aware"],
    links: [],
    details: {
      currentGoal: "Generalize the existing cost-aware routing foundation into an adaptive model runtime.",
      milestone: "Keep capability routing separate from model routing: first choose the subsystem, then choose the model inside it.",
      nextGate: "Define comparable quality, latency, cost, capability, and local-only signals before broadening the router contract.",
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
    id: "specialist-models",
    stage: "MODEL LIFECYCLE",
    title: "Specialist + General Models",
    status: "NEXT",
    role: "Candidate model classes",
    purpose: "A target model set for the adaptive runtime, not a claim of current deployment.",
    decision: "Specialization must beat the base model on the task and the operating constraints that matter.",
    evidence: [],
    stack: ["SQL specialist SLM", "RAG specialist SLM", "general reasoning", "VLM", "external / cloud"],
    links: [],
    details: {
      currentGoal: "Define the evaluation contract for specialist and general model candidates.",
      milestone: "Compare task quality, execution accuracy where relevant, latency, throughput, VRAM, cost, and generalization.",
      nextGate: "No candidate enters the router without passing the same evidence and lifecycle gates as any other model.",
      why: "The platform should make model choice inspectable and reversible rather than turning a single model into a permanent architectural assumption.",
    },
  },
] as const satisfies readonly PlatformNode[];

export const platformStatusDefinitions = [
  ["PROVEN", "Implemented independently and backed by explicit evidence."],
  ["BUILDING", "Active implementation."],
  ["EVOLVING", "A working subsystem exists; its role or abstraction is being generalized."],
  ["NEXT", "Not implemented yet."],
] as const;
