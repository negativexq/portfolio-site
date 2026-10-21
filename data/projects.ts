import type { Project, RoadmapItem } from "@/lib/content/types";

const emptyRoadmap: readonly RoadmapItem[] = [];

const projectRecords = [
  {
    id: "agentic-customer-service-platform",
    slug: "agentic-customer-service-platform",
    order: 2,
    title: "Agentic Customer Service Platform",
    seoTitle: "Agentic Customer Service Platform: Safe LLM Agent Execution",
    metaDescription: "LLM support agent: the model proposes refunds and cancellations; deterministic policy, confirmation and idempotency decide what actually executes.",
    category: "AI Reliability / Execution Infrastructure",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Execution authority",
      value: "SERVER-OWNED",
      scope: "LLM proposal → deterministic execution",
      qualifier:
        "Authentication, scope, policy, confirmation, revalidation, idempotency and business execution stay outside the model. The exercised D2c slice recorded 0 unauthorized mutations and 0 unsafe executions.",
    },
    summary:
      "Customer-service agent platform where the LLM proposes refunds, cancellations, lookups, tickets and escalations while deterministic software owns scope, policy, confirmation, revalidation, idempotency and execution.",
    directAnswer:
      "Agentic Customer Service Platform is a production-oriented Agentic AI Control Plane for customer-support workflows. The LLM proposes semantic intent; deterministic software owns authentication, customer scope, target resolution, policy, confirmation, revalidation, idempotency and execution. The repository is a reference implementation with explicit release warnings, not an unrestricted production SaaS product.",
    whyItExists:
      "A customer-service agent becomes a systems problem when it can affect account state: refund an order, cancel it, create a ticket or escalate a case. A plausible model proposal is not an authorization decision. This project keeps natural-language understanding and execution authority separate, then measures semantic safety, operational correctness, deterministic resilience and real-LLM quality as distinct evidence rather than one synthetic score.",
    heroMetrics: [
      {
        value: "0 UNSAFE EXECUTIONS",
        label: "Deterministic containment",
        context: "D2c · current release candidate",
        detail: "30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions.",
      },
      {
        value: "18/18 SCENARIOS",
        label: "Operational release gate",
        context: "D2d · 8/8 phases · 6/6 fault classes",
        detail: "The reference deployment passed its exercised operational scenarios, mandatory phases and fault classes as a separate gate.",
      },
      {
        value: "540 MEASURED ATTEMPTS",
        label: "Semantic/safety evaluation",
        context: "D2c · semantic_decision_v3",
        detail: "The current source-bound semantic-safety slice closed with 0 unsafe executable survivors and 0 unsafe executions.",
      },
      {
        value: "100 REAL-LLM SAMPLES",
        label: "Adversarial quality audit",
        context: "82 passed · 18 bounded warning-partials",
        detail: "A quality-outcome breakdown from the real-LLM QA slice, not a safety rate.",
      },
    ],
    highlights: [
      {
        title: "Semantic safety",
        description:
          "Problem: an LLM can produce a plausible but ungrounded execution proposal — a non-authoritative output with unsupported semantic arguments — that cannot be trusted as executable intent. Solution: provenance validation and a deterministic decision compiler ground every argument in authoritative context before it becomes an executable decision, closing this gate at 0 unsafe executions across 540/540 measured semantic-safety attempts.",
      },
      {
        title: "Execution guarantees",
        description:
          "Problem: a non-authoritative model output should not be able to directly mutate a production system. Solution: policy checks, a confirmation gate and a separate execution authority stand between proposal and mutation, keeping 0 duplicate mutations, 0 confirmation bypasses and 0 unauthorized mutations a property of the system, not of any one run.",
      },
      {
        title: "Operational reliability",
        description:
          "Problem: a semantically correct agent can still fail operationally under concurrency, restarts or dependency failures. Solution: the D2d release gate validates same-action concurrency, restart/persistence and a 6/6 fault-injection matrix against the deployed system itself, independent of model behavior.",
      },
      {
        title: "Durable workflows that survive interruption and recovery",
        description:
          "Consequential actions bind confirmation to one pending action. Mixed messages suspend rather than confirm; workflows can resume or be superseded; supported browser/backend recovery restores state; revalidation and replay-safe idempotency protect the final write.",
      },
      {
        title: "Grounded RAG with bounded abstention",
        description:
          "Hybrid retrieval, evidence provenance, citation and excerpt validation, grounding checks, and bounded uncertainty when evidence is missing or insufficient. Retrieved evidence informs answers; it never grants execution authority.",
      },
      {
        title: "Evaluation as a first-class system",
        description:
          "Frozen bilingual scenarios, source-bound approvals, immutable hashes and explicit budgets back two separate release gates — D2c for semantic and containment safety, D2d for operational correctness under concurrency, restart and fault conditions — so a model-quality claim and a deployed-system claim are never conflated.",
      },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "LangGraph",
      "SQLAlchemy",
      "PostgreSQL",
      "Alembic",
      "Qdrant",
      "OpenTelemetry",
      "React",
      "TypeScript",
      "Vite",
      "Pydantic",
      "Ruff",
      "Mypy",
      "Vitest",
      "Playwright",
      "Docker Compose",
    ],
    concepts: [
      "Reliable Execution Infrastructure",
      "Agent Orchestration",
      "Typed Structured Decisions",
      "Deterministic Policy Engine",
      "Human-in-the-Loop",
      "Durable Checkpointing",
      "Risk-Based Tool Execution",
      "Confirmation Revalidation",
      "Idempotent Business Writes",
      "Exactly-Once Business Effects",
      "Policy Audit Trail",
      "Execution Audit Lifecycle",
      "Agent Run Projections",
      "Run / Action Identity",
      "Failure Taxonomy",
      "Hybrid RAG",
      "Immutable Knowledge Snapshots",
      "Atomic Alias Activation",
      "Snapshot Rollback",
      "Customer-Scoped Memory",
      "Live Model Evaluation",
      "Multilingual Evaluation",
      "Provider-Neutral Model Transport",
      "Structured-Contract Compatibility Gate",
      "Decision Architecture Evaluation",
      "Containment Funnel Analysis",
      "Prompt Injection Resistance",
      "Provenance Enforcement",
      "Operational Release Gate",
      "Fault Injection",
      "Observability",
    ],
    proofPoints: [
      {
        label: "D2c semantic safety validation",
        value: "540/540 measured attempts",
        scope: "semantic/safety · semantic_decision_v3",
        qualifier:
          "30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions. Also recorded: 0 confirmation bypasses, 0 unauthorized mutations, 0 duplicate mutations, 0 hallucinated identifiers.",
      },
      {
        label: "D2d operational release gate",
        value: "18/18 · 8/8 · 6/6",
        scope: "operational scenarios · phases · fault classes",
        qualifier:
          "The reference deployment passed 18/18 operational scenarios, 8/8 mandatory phases and recovered all 6/6 fault classes. This is operational evidence, not model-quality evidence.",
      },
      {
        label: "Safety hardening journey",
        value: "15 → 3 → 0 → 0 → 0",
        scope: "Unsafe executable survivors, M6.15B → M6.29B",
        qualifier:
          "Containment gaps were closed in stages — deterministic grounding and admissibility checks, then containment-observability instrumentation, then a targeted prompt-contract hardening once the remaining gap was isolated to unsupported refund-reason provenance. A Turkish valid-refund control exposed the mechanism directly: the model proposed unsupported reason wording that the deterministic compiler correctly rejected (0/3 supported). The prompt contract was aligned without weakening the compiler, and targeted then full prospective runs returned 3/3 supported Risk-2 flows. Unsafe executions held at zero throughout.",
      },
      {
        label: "Deterministic resilience snapshot",
        value: "28/28",
        scope: "Deterministic resilience",
        qualifier:
          "A separate resilience result for runtime correctness; it is not merged with D2c, D2d or real-LLM quality evidence.",
      },
      {
        label: "Current runtime contract",
        value: "semantic_decision_v3",
        scope: "Default semantic contract",
        qualifier:
          "The current runtime contract is semantic_decision_v3. direct_tool_v1 remains only as an explicit compatibility contract for historical evaluation or legacy integration paths.",
      },
      {
        label: "Structured-contract compatibility gate",
        value: "1 of 4 candidates qualified",
        scope: "semantic_decision_v3 · frozen contract",
        qualifier:
          "gpt-5.6-luna produced 24/24 typed V3 decisions in the hosted control. The tested local candidates — qwen3.5:4b, qwen3.5:9b and qwen2.5:7b-instruct — did not meet the same frozen structured-output contract under their evaluated configurations, so they were not promoted to behavioral comparison. This treats model eligibility as a gate to clear before benchmarking, not an assumption that any model can be swapped in.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/agentic-customer-service-platform",
  },
  {
    id: "modelops-control-plane",
    slug: "modelops-control-plane",
    order: 5,
    title: "ModelOps Control Plane",
    seoTitle: "ModelOps Control Plane: Canary Model Promotion and Rollback",
    metaDescription: "ML release control plane: 10→25→50→100% canary delivery, delayed-ground-truth quality gates, automatic rollback and desired-vs-observed reconciliation.",
    category: "MLOps / AI Platform",
    status: "current",
    flagship: true,
    cardProof: {
      label: "Routing control loop",
      value: "DESIRED ↔ OBSERVED",
      scope: "Durable database state → router reconciliation",
      qualifier:
        "The database owns desired traffic; the router is restart-losable observed state. A worker-triggered reconcile tick repairs drift after a restart or failed push.",
    },
    summary:
      "Policy-driven ML release control plane combining progressive canary delivery, delayed-ground-truth quality gates, automated promotion and rollback, and desired-vs-observed routing reconciliation.",
    directAnswer:
      "ModelOps Control Plane is a policy-driven ML release system that progressively exposes a candidate model to routed traffic, incorporates delayed ground-truth labels, promotes or rolls back on reliability and model-quality evidence, and continuously reconciles the database's desired routing state with the router's own observed state.",
    whyItExists:
      "Model deployment is not complete when a container starts. A release control plane has to decide whether a candidate deserves more traffic using live reliability signals and model-quality evidence that arrives late, and \"not enough evidence yet\" has to stay distinct from \"healthy\" rather than default to either. It also has to keep the database's desired routing state in sync with what the router is actually doing, despite concurrent operators, failed pushes and restarts. Several of those correctness gaps only surfaced once the real nine-container stack was exercised end to end: SQLAlchemy optimistic concurrency and a DB-level partial unique index now stop a losing concurrent write from corrupting another action's result and cap each model at one unresolved rollout at a time; the desired state now commits before the router push, which is best-effort, with model-scoped routing generations rejecting a delayed write from an already-superseded rollout; and ground-truth labels are now written unconditionally to their own durable table and joined against metrics at read time, closing a race where a label arriving before its metric could go permanently unlinked.",
    heroMetrics: [
      {
        value: "10 → 25 → 50 → 100%",
        label: "Automated canary progression",
        context: "Progressive delivery",
        detail: "The real stateless worker advances a genuinely healthy candidate through every traffic stage and promotes it on a live minimum_recall PASS.",
      },
      {
        value: "279 TESTS",
        label: "Backend regression suite",
        context: "Verification",
        detail: "pytest alongside Ruff and mypy --strict, ~91% statement coverage, run on every push.",
      },
      {
        value: "6 REAL-STACK SCENARIOS",
        label: "Integration CI",
        context: "System evidence",
        detail: "CI boots the real nine-container stack and exercises worker-driven promotion, rollback and router-restart recovery.",
      },
      {
        value: "DESIRED ↔ OBSERVED",
        label: "Router reconciliation",
        context: "Control loop",
        detail: "The database's durable desired routing state is continuously reconciled against the router's restart-losable observed state.",
      },
    ],
    highlights: [
      {
        title: "Delayed ground-truth quality gates",
        description:
          "Labels correlate to predictions by prediction_id and land in a durable GroundTruthLabel table. Before recall is trusted, the quality window must clear label-coverage and minimum-positive-label sufficiency gates, not just a raw sample count.",
      },
      {
        title: "Two-window policy evaluation",
        description:
          "Reliability checks read the freshest traffic window; quality checks read an older, matured window instead, since ground-truth labels arrive delayed and the newest predictions are always the least-labeled ones.",
      },
      {
        title: "Desired / observed reconciliation",
        description:
          "The database is the durable desired routing state; the router's config is a best-effort, restart-losable cache. A worker-triggered reconcile tick diffs the two and repairs drift on its own.",
      },
      {
        title: "Race-safe rollout control",
        description:
          "SQLAlchemy optimistic concurrency plus a DB-level partial unique index stop concurrent actions from corrupting a rollout and cap each model at one unresolved deployment at a time.",
      },
      {
        title: "Model-scoped routing generation",
        description:
          "Traffic-allocation revisions are scoped per model, not per deployment, so the router rejects a delayed push from an already-superseded rollout instead of silently resurrecting stale traffic.",
      },
      {
        title: "Operator control and auditability",
        description:
          "Manual automation holds, explicit state-machine transitions, policy-evaluation snapshots and a merged deployment timeline keep every automated decision inspectable and human-overridable.",
      },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "SQLAlchemy",
      "SQLite",
      "Alembic",
      "Next.js",
      "TypeScript",
      "scikit-learn",
      "Locust",
      "Docker Compose",
    ],
    concepts: [
      "Progressive Delivery",
      "Canary Deployment",
      "Weighted Routing",
      "Deployment State Machine",
      "Policy Engine",
      "Automated Promotion",
      "Automated Rollback",
      "Delayed Ground Truth",
      "Quality-Gated Promotion",
      "Label Coverage Gating",
      "Positive-Label Sufficiency",
      "Matured Quality Window",
      "Desired / Observed State",
      "Control-Loop Reconciliation",
      "Model-Scoped Routing Generation",
      "Stale Configuration Rejection",
      "Router Restart Recovery",
      "Optimistic Concurrency Control",
      "DB-Level Rollout Exclusivity",
      "Manual Automation Hold",
      "Fault Injection",
      "Auditable Deployment Timeline",
      "Policy Evaluation Snapshots",
      "Model Registry",
      "Model Serving",
      "Benchmarking",
    ],
    proofPoints: [
      {
        label: "Automated healthy rollout",
        value: "10% → 25% → 50% → 100%",
        scope: "Worker-driven real-stack CI",
        qualifier:
          "CI scenario 3 waits for the actual stateless worker — not a manual call standing in for it — to walk a genuinely healthy canary through every traffic stage on live routed traffic and delayed labels, then promote it on a real minimum_recall PASS.",
      },
      {
        label: "Quality-driven rollback",
        value: "Recall FAIL → automatic rollback",
        scope: "Delayed ground-truth CI",
        qualifier:
          "CI scenario 4 sends a deliberately weak model the same real, delayed label flow as scenario 3. Once the label data-sufficiency gates clear, minimum_recall genuinely fails and the worker rolls it back on its own — not a simulated verdict.",
      },
      {
        label: "Restart-safe routing",
        value: "Router restart recovery",
        scope: "Desired/observed reconciliation · CI scenarios 5–6",
        qualifier:
          "Model-scoped routing generations reject a stale or delayed push regardless of which deployment it came from. CI scenario 5 restarts the router mid-rollout and confirms the worker's own reconcile tick restores the desired split; scenario 6 restarts it again after a promotion completes, confirming the router's startup sync alone restores a terminal deployment's allocation.",
      },
      {
        label: "Backend regression suite",
        value: "279 tests",
        scope: "Backend suite · ~91% statement coverage",
        qualifier:
          "Runs alongside Ruff and mypy --strict on every push; a separate integration CI job boots the real nine-container stack and exercises all six scenarios above. CI/benchmark ground truth still originates from the synthetic dataset's known labels, delayed and partially covered through the real ingestion API — not live production feedback.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/modelops-control-plane",
  },
  {
    id: "knowledge-base-rag",
    slug: "knowledge-base-rag",
    order: 4,
    title: "Knowledge Base RAG",
    seoTitle: "Knowledge Base RAG: Agentic Document Research With Citations",
    metaDescription: "Agentic document research: PydanticAI agents on a typed research graph with scoped tools, original page images and maths in code. Tracked on 120 questions.",
    category: "Generative AI / RAG Platform",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Agentic question coverage",
      value: "96/120 accepted outcomes",
      scope: "120 distinct long-document questions",
      qualifier:
        "79 source-correct answers, 2 qualified calculations and 15 correct refusals, each question counted once and checked against the original PDF.",
    },
    summary:
      "Agentic document research workspace: PydanticAI agents on an application-owned typed research graph search authorized sources, read original PDF pages, extract values and calculate in code, then release answers with citations you can open.",
    directAnswer:
      "Knowledge Base RAG is an agentic document research workspace. Tenant and role filters scope retrieval first; PydanticAI agents then read a task-specific projection of an application-owned ResearchState and either propose a cited answer or name the missing evidence. Each gap becomes one narrow search, read, inspect or extract operation checked against authorization and a request, token, tool and time budget, quantitative values are read from text or the original page image and calculated in application code, and source, value and question-scope checks gate the release.",
    whyItExists:
      "A relevant chunk is not an answer, and a fluent model is not a calculator. Questions over complex tables, charts and scanned PDFs need evidence that is found, read from the right place and computed correctly, while access control and release policy stay outside the model. This project keeps the semantic work with agents and everything that must be trustworthy in application code: state, authorization, tool permissions, budgets, arithmetic and the final checks. It also keeps its results honest by counting each question once, keeping failed runs on the record and never reading an operational stop as proof that an answer is absent.",
    heroMetrics: [
      {
        value: "96/120",
        label: "Accepted outcomes",
        context: "120 distinct long-document questions",
        detail: "79 source-correct answers, 2 qualified calculations and 15 correct refusals, each question counted once and checked against the original PDF.",
      },
      {
        value: "10 REQUESTS · 240 S",
        label: "Bounded research budget",
        context: "120k tokens · at most six tool attempts",
        detail: "The profile used for recent document runs, with a stop after two rounds without progress and a 60-second finalization reserve. They are server-side limits that a user request cannot widen.",
      },
      {
        value: "10 AGENT ROLES",
        label: "Typed PydanticAI stages",
        context: "Reasoning effort set per stage",
        detail: "Reading and extraction run light; planning, source selection, quantity checks, scope judgment and finalization run at medium effort.",
      },
      {
        value: "2,125 TESTS",
        label: "Backend test suite",
        context: "Latest recorded run",
        detail: "The normal suite makes no paid provider calls; a separate target runs the local-model checks.",
      },
    ],
    highlights: [
      {
        title: "A typed research graph, not a prompt loop",
        description:
          "Problem: an LLM loop that decides everything is hard to bound, audit or stop safely. Solution: PydanticAI agents make typed semantic decisions while the application owns state transitions, authorization, tool dispatch, accounting and release policy, with a short path for questions the retrieved text already answers.",
      },
      {
        title: "Narrow tools with explicit boundaries",
        description:
          "Problem: a general-purpose tool lets research widen its own access or write its own answer. Solution: search, read, inspect, extract and calculate each expose only their own fields, validate arguments and source access before running, and cannot expand tenant scope, guess unreadable values or write the final answer.",
      },
      {
        title: "The model never does the arithmetic",
        description:
          "Problem: a model asked to compute a ratio, a count or a difference will sometimes invent the result. Solution: once operands and a formula are prepared they run directly in application code, so arithmetic, item counts and total-versus-distinct comparisons do not depend on another model call.",
      },
      {
        title: "Image-only pages are read from the original image",
        description:
          "Problem: scanned or chart-based pages break text extraction, and a misread label-value pair silently corrupts a calculation. Solution: quantitative reads are routed to the original page image, category, series, period and unit stay attached to each input, and an independent check reviews the inputs and their coverage.",
      },
      {
        title: "Application-owned state and independent finalization",
        description:
          "Problem: when a research loop stops, a model-written summary can lose the work that succeeded. Solution: ResearchState keeps typed evidence, checked inputs, calculations, unresolved issues and provenance, each agent receives only a task-specific projection, and finalization works from saved results.",
      },
      {
        title: "Authorization before relevance, rechecked at every tool call",
        description:
          "Problem: a strong relevance score or a clever tool call must never recover a document the user may not see. Solution: server-side tenant and role filters apply before reranking and generation, each tool call revalidates authorized sources and versions, and the model can cite only evidence it was shown.",
      },
      {
        title: "Results counted once, failures kept on the record",
        description:
          "Problem: a growing success count across reruns reads as progress that has not been measured. Solution: the answered-question ledger lists each question once with its run, answer, latency and model-call count, keeps open questions visible, and treats a budget or API stop as an operational outcome rather than evidence that the answer is absent.",
      },
    ],
    technologies: [
      "PydanticAI",
      "Python",
      "FastAPI",
      "Qdrant",
      "React",
      "TypeScript",
      "Vite",
      "Ollama",
      "OpenAI",
      "Claude",
      "Tesseract OCR",
      "OpenTelemetry",
      "Jaeger",
      "Docker Compose",
    ],
    concepts: [
      "Agentic Document Research",
      "Typed Research Graph",
      "Application-Owned State",
      "Task-Specific State Projections",
      "Scoped Research Tools",
      "Tool and Budget Gating",
      "Original Page-Image Reading",
      "Deterministic Calculation",
      "Independent Finalization",
      "Question-Scope Checks",
      "Evidence Ledger",
      "Tenant-Scoped Retrieval",
      "Role-Based Access Control",
      "Hybrid Retrieval",
      "RRF Fusion",
      "Multilingual Reranking",
      "Verified Source References",
      "Untrusted RAG Context",
      "Table-Aware Ingestion",
      "Support-Unit Identity",
      "Occurrence Ledger",
      "Fail-Closed Abstention",
      "Distributed Tracing",
      "Source-Verified Evaluation Ledger",
    ],
    proofPoints: [
      {
        label: "Agentic question coverage",
        value: "96/120 accepted outcomes",
        scope: "120 distinct long-document questions",
        qualifier:
          "79 source-correct answers, 2 qualified calculations and 15 correct refusals. Each question is counted once and reruns never raise the total.",
      },
      {
        label: "Bounded research budget",
        value: "10 requests · 240 s",
        scope: "120k tokens · six tool attempts · 60 s reserve",
        qualifier:
          "The profile used for recent document runs. The limits are configurable server-side settings that user requests cannot widen, and a stopped research loop can still produce a verified answer from its saved results.",
      },
      {
        label: "Backend test suite",
        value: "2,125 passed",
        scope: "Latest recorded run",
        qualifier:
          "No paid provider calls in the normal suite; a separate target runs the checks that use a local model.",
      },
      {
        label: "Trust boundary",
        value: "Verified references only",
        scope: "Tenant and role filters before reranking",
        qualifier:
          "Unknown, hidden and cross-tenant source references are rejected before release, and every tool call rechecks the authorized sources and versions.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    evolvedFrom: {
      fromProjectId: "production-rag-platform",
      limitations: [
        "Single-source ingestion — PyMuPDF read one PDF corpus; a new source meant a hand-rolled parser, not a configured connector",
        "No incremental sync — the index couldn't tell when a source document changed or was removed, so staleness accumulated silently",
        "No versioned re-indexing or reconciliation — nothing verified that the vector index still matched the registry after partial change, cancellation or deletion",
        "Citations pointed at retrieved chunks without an integrity check tying the response to a still-valid source identity",
      ],
      narrative:
        "Production RAG Platform established a focused single-PDF retrieval foundation with hybrid search, reranking, citation-aware generation, evaluation and tracing. Knowledge Base RAG evolved that foundation into a reliability-oriented platform with multi-source ingestion, tenant-scoped retrieval, versioned indexes and citation-integrity validation, and then into an agentic research workspace: a typed PydanticAI research graph with scoped tools, original page-image reading, calculation in application code and an openable evidence inspector.",
    },
    githubUrl: "https://github.com/negativexq/knowledge-base-rag",
  },
  {
    id: "real-time-commerce-platform",
    slug: "real-time-commerce-platform",
    order: 7,
    title: "Real-Time Commerce Platform",
    seoTitle: "Real-Time Commerce Platform: Kafka, Outbox and Idempotency",
    metaDescription: "Event-driven commerce platform where Kafka may redeliver, but layered idempotency, a transactional outbox and bounded retries protect business effects.",
    category: "Distributed Systems / Streaming",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Sustainable isolated capacity",
      value: "Workload-dependent",
      scope: "~1,050 evt/s at 42.8% fraud-eligible · ~1,600 at 0%",
      qualifier:
        "The processor has no single workload-independent ceiling, because fraud-eligible events take a longer path. The ~750 to ~1,050 evt/s (+40%) optimisation was measured on the 42.8% workload. Measured on an isolated local benchmark.",
    },
    summary:
      "Production-oriented event-driven commerce platform where Kafka may redeliver, but layered idempotency, transactional persistence and bounded failure handling protect durable business effects.",
    directAnswer:
      "Real-Time Commerce Platform is a Kafka-based distributed system with idempotent consumers, PostgreSQL transactional persistence, Redis coordination, bounded retry, a DLQ and a transactional outbox under partition-scoped ordering.",
    whyItExists:
      "Makes event-processing guarantees and failure paths explicit, then treats sustainable throughput as something to measure and defend rather than assume. Query-plan analysis and repeated boundary tests separate real capacity from short-lived throughput, and two independently evidenced changes — bounded Kafka offset-commit batching, then query-plan-driven PostgreSQL indexing — moved the isolated pipeline's sustainable ceiling from ~750 to ~1,050 events/s without weakening at-least-once correctness.",
    heroMetrics: [
      {
        value: "~1,050 evt/s",
        label: "Sustainable isolated capacity",
        context: "3 workers · 3 partitions",
        detail: "Highest clearly sustainable rate in the local Kafka → processor → persistence benchmark; ~1,075 evt/s degraded repeatably.",
      },
      {
        value: "28.6×",
        label: "Fewer offset commits",
        context: "125,669 → 4,385 calls",
        detail: "Bounded contiguous per-partition batching moved the earlier sustainable boundary from ~750 to ~900 evt/s.",
      },
      {
        value: "0.253 ms",
        label: "Recent-payment lookup",
        context: "10.897 ms before indexing",
        detail: "Measured PostgreSQL execution time after query-plan-driven indexing, not end-to-end latency.",
      },
    ],
    highlights: [
      {
        title: "At-least-once, duplicate-safe",
        description: "Kafka offsets can be replayed. Redis leases coordinate active work, while PostgreSQL durable identity and uniqueness make repeated business effects harmless.",
      },
      {
        title: "One durable business boundary",
        description: "Commerce state, fraud outcomes and the derived-event outbox commit together in a PostgreSQL Unit of Work.",
      },
      {
        title: "Measured limits",
        description: "Demo full-path throughput and isolated processor capacity are measured separately, with a fresh sweep defining the current sustainable boundary.",
      },
    ],
    technologies: [
      "Python",
      "TypeScript",
      "FastAPI",
      "Next.js",
      "Kafka",
      "PostgreSQL",
      "Redis",
      "Prometheus",
      "Grafana",
      "Docker Compose",
    ],
    concepts: [
      "Event-Driven Architecture",
      "At-Least-Once Delivery",
      "Idempotent Consumer",
      "Transactional Outbox",
      "Bounded Retry",
      "Dead Letter Queue",
      "Unit of Work",
      "Consumer Groups",
      "Partition-Scoped Ordering",
      "Query-Plan Analysis",
      "Offset-Commit Batching",
      "Observability",
      "Performance Engineering",
    ],
    proofPoints: [
      {
        label: "Sustainable capacity improvement",
        value: "750 → 1,050 evt/s (+40%)",
        scope: "Isolated local benchmark · Kafka → processor → persistence",
        qualifier:
          "Three processor workers matched to three Kafka partitions (750–775 evt/s was the original non-sustainable transition). Bounded per-partition offset-commit batching moved the sustainable boundary to ~900 evt/s; query-plan-driven PostgreSQL indexing plus a fresh capacity sweep moved it to ~1,050 evt/s. That figure belongs to a workload of about 42.8% fraud-eligible events, where ~1,075 evt/s was the highest near-line-rate observation and ~1,100 evt/s the transition candidate. Not production capacity or Demo Control throughput.",
      },
      {
        label: "Workload-sensitive ceiling",
        value: "1,075 → 1,600 evt/s observed",
        scope: "Fraud-eligible share 42.8% → 0%",
        qualifier:
          "The processor has no single workload-independent throughput ceiling: fraud-eligible events take a longer path through extra context reads, fraud evaluation and fraud persistence. As their share falls, the highest near-line-rate observation rises from ~1,075 to ~1,600 evt/s. Fraud-eligible share is not the fraud detection rate, and the 0% workload contains no eligible events rather than disabling fraud processing. Rows were collected in separate benchmark state regimes, so this is a sensitivity study, not an authoritative capacity curve.",
      },
      {
        label: "Recent-payment lookup",
        value: "10.897 → 0.253 ms",
        scope: "Query-plan-driven optimization",
        qualifier:
          "Measured PostgreSQL execution time for the recent-payment lookup after using query-plan evidence to optimize its access path.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/real-time-commerce-platform",
  },
  {
    id: "repo-context-forge",
    slug: "repo-context-forge",
    order: 9,
    title: "Repo Context Forge",
    seoTitle: "Repo Context Forge: Read-Only MCP Code Intelligence",
    metaDescription: "Local-first MCP repository intelligence: 40 tools across six servers for deterministic, source-grounded code analysis within strict read-only boundaries.",
    category: "Agent Infrastructure / Developer Tooling",
    status: "current",
    flagship: false,
    summary:
      "Local-first MCP repository intelligence and agent platform for deterministic, source-grounded code analysis within strict read-only boundaries.",
    directAnswer:
      "Repo Context Forge is a local-first MCP repository intelligence and agent platform with 40 configured tools across six local servers, plus a bounded source-grounded agent that uses a restricted tool subset by default.",
    whyItExists:
      "Provides secure repository access, deterministic search and analysis, and reproducible context packs without executing analyzed code or relaxing filesystem, path, process and tool-argument boundaries.",
    technologies: ["Python", "MCP", "FastMCP", "Python AST", "Typer", "Docker", "Git", "Ollama"],
    concepts: [
      "Repository Intelligence",
      "Source-Grounded Context",
      "Deterministic Code Search",
      "Symbol Analysis",
      "References",
      "Callers / Callees",
      "Dependency Analysis",
      "Dependency Graphs",
      "Read-Only Git Intelligence",
      "Context Packs",
      "Task Bundles",
      "Validated Tool Arguments",
      "Filesystem / Path Containment",
      "Read-Only Process Boundaries",
      "Bounded Local Agent",
    ],
    proofPoints: [
      {
        label: "Configured MCP surface",
        value: "40 tools",
        scope: "Six local MCP servers",
        qualifier:
          "The platform configures 40 tools across six servers; the read-only local agent uses a bounded subset by default.",
      },
      {
        label: "Prerelease validation",
        value: "206 tests · 87% coverage",
        scope: "v0.2 alpha validation",
        qualifier:
          "Validation covers deterministic analyzers, tool arguments, context generation and filesystem, path, Git and process security boundaries.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/repo-context-forge",
  },
  {
    id: "dbt-feature-lineage",
    slug: "dbt-feature-lineage",
    order: 10,
    title: "dbt Feature Lineage",
    seoTitle: "dbt Feature Lineage: Column-Level Lineage and Change Impact",
    metaDescription: "Local-first dbt analysis for model dependencies, cross-model column lineage and change impact, from the manifest and static SQL, without a live warehouse.",
    category: "Data Engineering / Lineage",
    status: "current",
    flagship: false,
    summary:
      "Local-first dbt analysis for model dependencies, cross-model column lineage, change impact and query flow without a live warehouse.",
    directAnswer:
      "dbt Feature Lineage is a local-first developer tool that reads a dbt checkout or cloned git repository, prefers manifest-aware analysis when artifacts exist, falls back to static SQL/YAML analysis, and exposes the result through a Typer CLI and a FastAPI-backed Next.js web app.",
    whyItExists:
      "Makes upstream and downstream lineage inspectable across manifest-aware and static modes, distinguishing direct from transitive impact while keeping query flow, exposure-aware impact, model health and interface logic on one analysis layer.",
    heroMetrics: [
      {
        value: "2 MODES",
        label: "One normalized project model",
        context: "MANIFEST + STATIC",
        detail: "Artifact-first loading with a static SQL/YAML fallback keeps the analysis path useful before a manifest exists.",
      },
      {
        value: "5 VIEWS",
        label: "Shared selection context",
        context: "NEXT.JS WEB APP",
        detail: "Dashboard, Model Explorer, Model DAG, Column Lineage and Feature Explorer share the same project scope.",
      },
      {
        value: "LOCAL ONLY",
        label: "No warehouse connection required",
        context: "DEMO STATIC PATH",
        detail: "The included demo runs with static analysis from project files on disk.",
      },
    ],
    highlights: [
      {
        title: "Artifact-first, fallback-ready",
        description: "Manifest and catalog artifacts are preferred; recursive SQL/YAML scanning keeps local exploration available when they are missing.",
      },
      {
        title: "Direct vs transitive impact",
        description: "Downstream analysis separates direct column consumers from the full inherited chain, so blast radius stays actionable.",
      },
      {
        title: "Shared analysis layer",
        description: "Typer and the FastAPI-backed Next.js web app consume the same normalized domain models and services instead of reimplementing lineage logic.",
      },
      {
        title: "Visible parsing uncertainty",
        description: "Partial SQL results return with a warning when a query cannot be fully understood; the tool does not fail silently.",
      },
    ],
    technologies: [
      "Python",
      "dbt Core",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "React Flow",
      "sqlglot",
      "NetworkX",
      "Typer",
      "Docker",
    ],
    concepts: [
      "Model DAG",
      "Column-Level Lineage",
      "Upstream Trace",
      "Downstream Trace",
      "Direct / Transitive Impact",
      "Static SQL Analysis",
      "Manifest-Aware Analysis",
      "Compiled SQL Analysis",
      "Query Flow",
      "Exposure-Aware Impact",
      "Model Health",
      "Git URL Import",
      "Deep-Linkable Views",
    ],
    proofPoints: [
      {
        label: "Analysis scope",
        value: "Cross-model column lineage",
        scope: "Manifest-aware + static analysis",
        qualifier:
          "Traces columns upstream and downstream and summarizes direct versus transitive downstream impact without a live warehouse connection.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/dbt-feature-lineage",
  },
  {
    id: "production-rag-platform",
    slug: "production-rag-platform",
    order: 11,
    title: "Production RAG Platform",
    seoTitle: "Production RAG Platform: Hybrid Search, Reranking, Citations",
    metaDescription: "Single-PDF RAG foundation: hybrid search, reranking, citation-aware generation, evaluation and tracing. The groundwork that evolved into Knowledge Base RAG.",
    category: "Generative AI / Retrieval",
    status: "current",
    flagship: false,
    summary:
      "Focused single-PDF retrieval foundation covering hybrid search, reranking, citation-aware generation, evaluation and observability.",
    directAnswer:
      "Production RAG Platform is a focused single-PDF retrieval system that combines hybrid retrieval, reranking, citation-aware generation, citations, evaluation and observability over a local corpus.",
    whyItExists:
      "Established the focused retrieval and evaluation foundation that later evolved into the multi-source, reliability-oriented Knowledge Base RAG platform.",
    technologies: [
      "FastAPI",
      "Qdrant",
      "Ollama",
      "OpenTelemetry",
      "Jaeger",
      "DeepEval",
      "PyMuPDF",
      "Docker Compose",
    ],
    concepts: [
      "Hybrid Retrieval",
      "RRF Fusion",
      "Cross-Encoder Reranking",
      "Citation-Aware Generation",
      "Citations",
      "Evaluation",
      "Observability",
    ],
    proofPoints: [],
    roadmap: emptyRoadmap,
    relationships: [
      {
        type: "evolved-into",
        targetProjectId: "knowledge-base-rag",
        label: "Evolved into",
      },
    ],
    githubUrl: "https://github.com/negativexq/production-rag-platform",
  },
  {
    id: "terraform-docker-infrastructure-lab",
    slug: "terraform-docker-infrastructure-lab",
    order: 12,
    title: "Terraform Docker Infrastructure Lab",
    seoTitle: "Terraform Docker Infrastructure Lab: State-Safe Refactoring",
    metaDescription: "Modular Terraform lab: state-safe refactoring with moved blocks (0 add, 0 change, 0 destroy), native IaC tests, CI security gates and failure validation.",
    category: "Infrastructure as Code / Platform Engineering",
    status: "current",
    flagship: false,
    summary:
      "Modular Terraform infrastructure lab with state-safe refactoring, native IaC tests, CI security gates, observability, and end-to-end failure validation.",
    directAnswer:
      "Terraform Docker Infrastructure Lab provisions a local FastAPI, PostgreSQL, Nginx and observability stack through reusable Terraform modules, with native Terraform tests, state-safe moved blocks, CI validation and security scanning.",
    whyItExists:
      "Explores infrastructure lifecycle and platform engineering beyond basic provisioning by making module boundaries, state migration, configuration-driven replacement, failure testing and infrastructure validation explicit.",
    technologies: [
      "Terraform",
      "Docker",
      "FastAPI",
      "PostgreSQL",
      "Nginx",
      "Prometheus",
      "Grafana",
      "Alertmanager",
      "k6",
      "GitHub Actions",
    ],
    concepts: [
      "Infrastructure as Code",
      "Terraform Modules",
      "Terraform State",
      "State Migration",
      "Moved Blocks",
      "Native Terraform Tests",
      "Provider Mocking",
      "Configuration Hashing",
      "Infrastructure Validation",
      "DevSecOps",
      "Observability",
      "Alert Lifecycle Testing",
    ],
    proofPoints: [
      {
        label: "State-safe module refactor",
        value: "0 add · 0 change · 0 destroy",
        scope: "Verified Terraform migration",
        qualifier:
          "The original root resources were reorganized into network, application and observability modules through explicit Terraform moved blocks while preserving managed resource identities and avoiding infrastructure recreation.",
      },
      {
        label: "Infrastructure validation",
        value: "Native Terraform tests",
        scope: "Mock-provider test suite",
        qualifier:
          "Root and child-module contracts are exercised with terraform test and mocked Docker providers, validating naming, outputs, resource wiring and failure conditions without provisioning real Docker infrastructure.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [
      {
        type: "related-to",
        targetProjectId: "ml-platform-infrastructure",
        label: "Infrastructure as code",
      },
    ],
    githubUrl: "https://github.com/negativexq/terraform-docker-infrastructure-lab",
  },
  {
    id: "cause-tune",
    slug: "cause-tune",
    order: 8,
    title: "CauseTune",
    seoTitle: "CauseTune: QLoRA Fine-Tuning With Blind Generalization Tests",
    metaDescription: "QLoRA fine-tuning lab: Qwen3-4B rose from 65.28% to 99.31% diagnosis accuracy on a frozen synthetic benchmark and held 98.33% on a fresh blind challenge.",
    category: "Model Training / Fine-Tuning",
    status: "current",
    flagship: false,
    showCardProof: true,
    cardProof: {
      label: "Measured specialization gain",
      value: "+34.03 pp diagnosis exact match",
      scope: "Frozen 144-case synthetic benchmark",
      qualifier:
        "Untouched Qwen3-4B scored 65.28% on a benchmark frozen before training and excluded from checkpoint selection; the tuned adapter reached 99.31%. A second, independent blind challenge the adapter never saw later confirmed the gain held at 98.33%, while a cheaper alternative recipe did not hold as well on the same challenge.",
    },
    summary:
      "LLM fine-tuning laboratory built around the full craft, not one training run: capability-gap measurement, QLoRA recipe selection under a hardware and data budget, held-out generalization testing, failure-mode and calibration analysis, and cross-model replication.",
    directAnswer:
      "CauseTune is a QLoRA fine-tuning laboratory that measures a model's capability gap, selects a training recipe under a frozen validation-only study, then treats the resulting gain as a claim to stress-test rather than a result to publish: does it survive data the adapter never saw, a second model architecture, and evidence deliberately made ambiguous. Quality, efficiency and failure behavior are kept as separate, honestly scoped evidence.",
    whyItExists:
      "A single accuracy number does not show whether fine-tuning added a real capability, whether it generalizes past the benchmark it was measured on, or what it cost. CauseTune keeps the benchmark frozen before training, selects checkpoints and recipes on validation only, and then goes further: the confirmed gain is re-tested on data the adapter never saw, on a second model family, and under evidence deliberately made ambiguous — the same discipline a fine-tuning recipe needs before anyone trusts it past the benchmark it was tuned on.",
    heroMetrics: [
      {
        value: "65.28% → 99.31%",
        label: "Diagnosis exact match",
        context: "Frozen 144-case benchmark",
        detail: "Untouched Qwen3-4B versus the tuned adapter on a benchmark frozen before training. +34.03 pp.",
      },
      {
        value: "98.33%",
        label: "Held on a fresh blind challenge",
        context: "Independent 120-case set · base 66.67%",
        detail: "The adapter was retested on a challenge it never saw during training or checkpoint selection. The gain survived, only 0.98 pp below its frozen-benchmark score.",
      },
      {
        value: "-5.83 pp",
        label: "A cheaper recipe that didn't hold",
        context: "Cost-optimized recipe vs. the original, same challenge",
        detail: "The cheaper recipe saturated validation at 100% diagnosis, but regressed against the original once measured on data neither adapter had seen. Validation performance did not guarantee generalization.",
      },
      {
        value: "9 / 48 = 18.75%",
        label: "False-confident diagnosis at the boundary",
        context: "Ambiguous / insufficient evidence cases",
        detail: "Under sufficient evidence the adapter reached 100% accuracy, but at the failure boundary it stated a confident diagnosis 18.75% of the time when the evidence did not support one.",
      },
    ],
    highlights: [
      {
        title: "A recipe chosen under a budget, not guessed",
        description:
          "Problem: LoRA rank, learning rate and training-data volume are usually picked by intuition or copied from a blog post. Solution: a frozen, validation-only study swept data volume, adapter capacity and learning rate under a fixed hardware budget before any number was reported, so the selected recipe is a defensible choice, not a lucky run.",
      },
      {
        title: "Frozen benchmark before any training",
        description:
          "Problem: a benchmark the model was tuned against measures memorization, not capability. Solution: the challenge benchmark and evaluation contract are established and hashed before training, excluded from the train and validation data, and never used for checkpoint selection.",
      },
      {
        title: "The gain survived an independent fresh challenge",
        description:
          "Problem: a frozen benchmark can still be a proxy the model quietly overfit to. Solution: the tuned adapter was retested on a second, completely independent blind challenge it never saw during training or checkpoint selection — diagnosis held at 98.33% against an untouched-base 66.67%, only 0.98 pp below the original frozen-benchmark result.",
      },
      {
        title: "Validation saturation is not proof of generalization",
        description:
          "Problem: a recipe hitting 100% on validation looks finished. Solution: a cheaper, cost-optimized recipe reached 100% diagnosis, resolution and strict-JSON on validation, but the same independent blind challenge exposed a 5.83 pp diagnosis regression against the original recipe — preserved as evidence instead of retroactively explained away.",
      },
      {
        title: "Calibration under ambiguous evidence, not just accuracy",
        description:
          "Problem: a specialized model can sound certain even when the evidence does not support a diagnosis, and accuracy alone never surfaces that. Solution: sufficient, insufficient, contradictory, ambiguous and out-of-taxonomy evidence were tested directly — 100% accuracy when evidence was sufficient, but an 18.75% (9/48) false-confident diagnosis rate at the boundary, measured directly instead of hidden behind accuracy.",
      },
      {
        title: "Cross-model replication, honestly scoped",
        description:
          "Problem: a result on one model family is easy to overstate as general. Solution: the same controlled methodology was rerun on a second, architecturally different model (Phi-4-mini) — untouched baseline 0% diagnosis, tuned 63.33% (38/60), so the method carries across model families.",
      },
      {
        title: "A causal training-order diagnosis",
        description:
          "One training-affecting variable was isolated by holding everything else fixed: an unshuffled class-contiguous order collapsed held-out accuracy to 26.8% because the final optimizer windows were single-class, while a deterministic seeded shuffle recovered it to 99.2%. Train loss alone was insufficient evidence.",
      },
    ],
    technologies: [
      "Python",
      "PyTorch",
      "Transformers",
      "PEFT",
      "bitsandbytes",
      "TRL",
      "QLoRA",
      "Qwen3-4B",
      "Phi-4-mini",
      "pytest",
    ],
    concepts: [
      "QLoRA",
      "LoRA",
      "PEFT",
      "NF4 Quantization",
      "Frozen Benchmark",
      "Held-Out Evaluation",
      "Checkpoint Selection",
      "Early Stopping",
      "Validation-Only Selection",
      "Failure-Mode Analysis",
      "Training Dynamics",
      "Generalization Slices",
      "Causal Shuffle Diagnosis",
      "VRAM Profiling",
      "Deterministic Training",
      "Base-vs-Tuned Measurement",
      "Fresh Blind Evaluation",
      "Cross-Model Replication",
      "Failure-Boundary Evaluation",
      "False-Confidence Measurement",
      "Cost / Quality Trade-off Analysis",
    ],
    proofPoints: [
      {
        label: "Specialization gain",
        value: "65.28% -> 99.31% diagnosis exact match",
        scope: "Experiment 02 · frozen 144-case synthetic benchmark",
        qualifier:
          "Untouched Qwen3-4B versus the tuned adapter on a benchmark frozen before training and excluded from checkpoint selection. +34.03 pp; resolution exact match rose +64.58 pp.",
      },
      {
        label: "Generalization by slice",
        value: "STANDARD 100% · HARD 97.92% · TRANSFER 100%",
        scope: "Experiment 02 tuned · held-out slices",
        qualifier:
          "The single remaining diagnosis error was one HARD downstream-timeout case predicted as DNS resolution failure. TRANSFER is transfer-style evaluation, not true OOD.",
      },
      {
        label: "Training efficiency",
        value: "Stopped at step 100 of 600 · 5.312 GiB peak VRAM",
        scope: "8 GB RTX 5070 Laptop · 0.814% trainable",
        qualifier:
          "Early stopping on validation_no_improvement avoided 500 of 600 optimizer updates. 33,030,144 trainable parameters over a 4,055,498,240-parameter logical model.",
      },
      {
        label: "Causal training-order fix",
        value: "26.8% -> 99.2% validation accuracy",
        scope: "Experiment 01 · M5 unshuffled vs M6 seeded shuffle",
        qualifier:
          "Changing only the training order from class-contiguous to a deterministic seed-42 shuffle recovered held-out performance; all 250 optimizer windows became mixed-class instead of terminal single-class.",
      },
      {
        label: "Fresh blind confirmation vs a regression",
        value: "E02 98.33% held · E04 92.50% regressed -5.83 pp",
        scope: "E05 · independent 120-case blind challenge",
        qualifier:
          "Neither adapter had seen this challenge. The original E02 adapter's gain held close to its frozen-benchmark score; E04's cost-optimized recipe, which had saturated validation at 100%, regressed against E02 once tested on unseen data.",
      },
      {
        label: "Cross-model replication",
        value: "0% -> 63.33% (38/60) diagnosis exact",
        scope: "E06 · microsoft/Phi-4-mini-instruct",
        qualifier:
          "Same controlled methodology, separate frozen held-out benchmark, untouched-baseline 0% diagnosis and 0% strict-JSON compliance.",
      },
      {
        label: "Failure-boundary false confidence",
        value: "9/48 = 18.75% false-confident diagnosis",
        scope: "E07 · ambiguous / insufficient / contradictory evidence",
        qualifier:
          "The E04 adapter reached 100% accuracy on sufficient-evidence cases but stated a confident diagnosis 18.75% of the time when the evidence at the boundary did not support one.",
      },
      {
        label: "Cost / quality trade-off",
        value: "Classified: lower-cost, not quality-preserving",
        scope: "E08 · efficiency-frontier study",
        qualifier:
          "E04 reduced training corpus size and wall-clock cost versus E02, but the classification accounts for the E05 blind-challenge regression: cheaper was not quality-preserving once fresh generalization was included.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/cause-tune",
  },
  {
    id: "decision-sql",
    slug: "decision-sql",
    order: 6,
    title: "DecisionSQL",
    seoTitle: "DecisionSQL: Governed Text-to-SQL With Execution Guardrails",
    metaDescription: "Governed text-to-SQL: the model proposes SQL; policy, authority and cost gates decide what runs. 160/180 governed tasks on a synthetic benchmark.",
    category: "Structured Data / Governed Text-to-SQL",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Execution authority",
      value: "SERVER-OWNED",
      scope: "Model proposes SQL · deterministic admission decides",
      qualifier:
        "An ANSWER + SQL submission crosses parse, global policy, request-scoped relation authority, grain safety, EXPLAIN and a cost gate, and only an accepted immutable QueryPlan reaches the restricted read-only executor. There is no raw unsafe fallback, and the executor never runs SQL the safety service did not admit.",
    },
    summary:
      "Governed one-shot Text-to-SQL for enterprise analytics: the model emits one typed decision, deterministic software owns SQL admission and read-only execution, and correctness is measured by execution against counterfactual database states.",
    directAnswer:
      "DecisionSQL is a governed one-shot Text-to-SQL system and execution-based benchmark where the model proposes a single typed decision — an answer with read-only SQL, a clarification, or an authority/policy block — and deterministic software owns parsing, policy, request-scoped relation authority, grain safety, cost admission and restricted execution before any SQL reaches PostgreSQL.",
    whyItExists:
      "A natural-language-to-SQL demo answers syntax. DecisionSQL is about whether a proposed query is authorized, bounded, semantically correct and safe to run: it keeps model proposal and execution authority separate, evaluates governance apart from query execution because some cases should refuse SQL entirely, and scores correctness by execution against counterfactual states rather than string similarity.",
    heroMetrics: [
      {
        value: "160 / 180",
        label: "Governed task success",
        context: "88.89% · 180-case governed benchmark",
        detail: "One-shot governed decisions across 12 synthetic domains.",
      },
      {
        value: "28 / 30",
        label: "Authority",
        context: "93.33% · model governance",
        detail: "Two cases where the model wrongly chose ANSWER on an authority-blocked request; request-scoped relation authority blocked the unauthorized relation before any database interaction.",
      },
      {
        value: "108 / 122",
        label: "Answerable runtime TSA",
        context: "88.52% · BASE + counterfactual",
        detail: "Answerable queries that survived the real runtime and satisfied the result contract on BASE and every required counterfactual state.",
      },
      {
        value: "12 / 12",
        label: "Policy blocks",
        context: "100% · ambiguity 12/16 = 75.00%",
        detail: "Policy-blocked cases were refused exactly; ambiguity recognition is the weaker governance axis. Refusing SQL is a measured outcome, not a failure.",
      },
    ],
    highlights: [
      {
        title: "The model proposes, deterministic software admits",
        description:
          "Problem: a model can emit plausible SQL that is unauthorized, unbounded or semantically wrong. Solution: an ANSWER + SQL submission crosses sqlglot parsing, global SQL policy, request-scoped relation authority, grain-safety validation, PostgreSQL EXPLAIN and a cost gate, and only an accepted immutable QueryPlan reaches a restricted read-only executor. There is no raw unsafe fallback, and the executor never runs SQL the safety service did not admit.",
      },
      {
        title: "Governance is scored apart from execution",
        description:
          "Problem: scoring only answered queries hides whether a system knows when not to answer. Solution: the benchmark includes authority, ambiguity and policy cases where producing SQL is the wrong behaviour, so governance is scored separately — authority 28/30, policy 12/12, ambiguity 12/16. When the model wrongly answered an authority-blocked case, request-scoped relation authority blocked the unauthorized relation before any database interaction.",
      },
      {
        title: "Correctness is execution-based, not string match",
        description:
          "Problem: on one database state wrong SQL can accidentally return the right rows. Solution: two independent reference witnesses, a typed ResultContract and counterfactual fixtures that change distributions so wrong semantics diverge. healthcare_10 passes on the BASE state and fails a counterfactual, which is why one database state is not enough to call a query correct.",
      },
      {
        title: "Server-owned grain safety",
        description:
          "Problem: joining a parent to many children can silently triple a SUM. Solution: fanout is a server-owned semantic contract with a deliberately narrow deterministic normalizer for the supported additive-parent, declared-1:N shape that stays fail-closed outside it. Normalized SQL still re-passes parse, policy, EXPLAIN and cost, with no raw unsafe fallback.",
      },
      {
        title: "One-shot by design",
        description:
          "One benchmark case yields one semantic attempt with no retry, repair, judge, selector or pass@K, so model decision errors and server enforcement stay observable instead of being smoothed over by a repair loop.",
      },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "Alembic",
      "sqlglot",
      "Pydantic",
      "pytest",
      "Ruff",
      "Mypy",
      "OpenTelemetry",
      "Docker Compose",
    ],
    concepts: [
      "Governed Text-to-SQL",
      "Typed Decision Contract",
      "Deterministic Admission Boundary",
      "SQL Parsing & Policy",
      "Request-Scoped Authority",
      "Accepted QueryPlan",
      "Restricted Read-Only Execution",
      "Server-Owned Grain Safety",
      "Grain-Safe Normalization",
      "Execution-Based Evaluation",
      "Counterfactual Fixtures",
      "Cost Admission Gate",
      "One-Shot Evaluation",
      "Authority Enforcement",
      "Policy Enforcement",
      "Ambiguity Handling",
      "Reproducible Benchmark",
      "Observability",
    ],
    proofPoints: [
      {
        label: "Governed task success",
        value: "160/180 = 88.89% governed task success",
        scope: "180-case governed benchmark · 12 synthetic domains",
        qualifier:
          "One-shot governed decisions across four behavior classes on one synthetic benchmark.",
      },
      {
        label: "Answerable runtime correctness",
        value: "108/122 = 88.52% answerable runtime TSA",
        scope: "BASE + counterfactual execution",
        qualifier:
          "Answerable queries that survived the real runtime and satisfied the result contract on BASE and every required counterfactual state. healthcare_10 passes BASE but fails a counterfactual, which is why a single state is not enough.",
      },
      {
        label: "Authority containment",
        value: "28/30 authority · unauthorized relation blocked before DB access",
        scope: "model governance + runtime enforcement",
        qualifier:
          "Model authority decisioning is 28/30; telecom_15 is the known case where the model wrongly answered. Request-scoped relation authority returned an authorization rejection with zero database connection, EXPLAIN or execution.",
      },
      {
        label: "Governance split",
        value: "policy 12/12 = 100% · ambiguity 12/16 = 75.00%",
        scope: "governance blocks scored separately from execution",
        qualifier:
          "Policy blocking is exact; ambiguity recognition is the weaker axis. Refusing to write SQL is a measured, expected outcome on the governance cases, not a failure.",
      },
      {
        label: "Execution boundary",
        value: "QueryPlan-gated execution · no raw unsafe fallback",
        scope: "request-scoped authority + accepted QueryPlan",
        qualifier:
          "Accepted execution requires an immutable QueryPlan issued by the SQL safety service; raw SQL or copied plan objects cannot bypass planning, and the reader runs under a read-only transaction, reader role, statement timeout and bounded rows.",
      },
      {
        label: "Server-owned grain safety",
        value: "narrow deterministic normalizer · fail-closed",
        scope: "PARENT_MEASURE_FANOUT · supported shape only",
        qualifier:
          "Server-owned metadata detects the supported additive-parent, declared-1:N fanout shape and preaggregates on the child side. Outside it the normalizer stays fail-closed.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/decision-sql",
  },
  {
    id: "ml-platform-infrastructure",
    slug: "ml-platform-infrastructure",
    order: 1,
    title: "ML Platform",
    seoTitle: "ML Platform: Scheduled Scoring, Lineage and Model Monitoring",
    metaDescription: "Self-hosted Kubernetes ML platform: scheduled batch inference, versioned data lineage, model monitoring and a Go gateway, verified in local acceptance runs.",
    category: "AI Infrastructure / Platform Engineering",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Scheduled scoring and quality monitoring",
      value: "1M ROWS",
      scope: "Real NYC TLC data · local acceptance · 8 Oct 2026",
      qualifier: "One million February 2025 taxi trips scored through a scheduled Argo pipeline and matched to ground truth with 100% coverage.",
    },
    summary:
      "A self-hosted Kubernetes ML platform for scheduled scoring, versioned datasets, model monitoring and governed serving, backed by a PostgreSQL control plane and a separate Go inference gateway.",
    directAnswer:
      "ML Platform joins training, scheduled batch inference, immutable dataset versions, recorded lineage, model-quality reports and serving in one project-scoped workspace. A Python API and reconcilers persist intent in PostgreSQL; a separate Go gateway governs inference traffic. Local Kubernetes acceptance includes the CPU lifecycle and a million-row historical NYC TLC scoring/monitoring workflow.",
    whyItExists:
      "Training a model is only one step in operating it. Teams also need ownership, evaluation rules, release decisions, serving access and a way to recover interrupted infrastructure changes. This platform organizes those concerns around durable lifecycle intent and distinct control and data planes, extending the original Kubernetes inference foundation into a shared ML workspace.",
    heroMetrics: [
      { value: "1,000,000", label: "Trips scored and matched to labels", context: "NYC TLC · local historical-data replay · 8 Oct 2026", detail: "100% feedback coverage, zero unmatched rows." },
      { value: "18.95 s", label: "Scheduled scoring pipeline", context: "Single node · warm images · Argo overhead included", detail: "1 CPU / 1 GiB main container; separate monitoring Job took 28.17 s. One recorded execution, not sustained throughput." },
      { value: "200/200", label: "Function responses during rolling restart", context: "Go gateway · final-image acceptance · 7 Oct 2026", detail: "Real function requests with validated IDs and headers. Availability probes, not load-capacity measurement." },
      { value: "12/12", label: "Control-plane release checks", context: "Monitoring automation · local artifact · 8 Oct 2026", detail: "Migration 0030, dependency isolation, readiness recovery, SBOM and severity/secrets scans." },
    ],
    highlights: [
      { title: "A million-row lifecycle with recorded identities", description: "Real historical NYC TLC data passes through scheduled scoring, verified model/data artifacts, versioned prediction publication and independently checked quality metrics. Dataset-triggered monitoring resumes without duplicate execution after reconciler restart." },
      { title: "Durable intent and reconciliation", description: "The API commits lifecycle intent to PostgreSQL; reconcilers target external infrastructure and report observed state. Deterministic resource identities and idempotent application support recovery after interrupted work." },
      { title: "A project-scoped ML lifecycle", description: "Training jobs and pipeline DAGs lead to registered model versions, evaluation thresholds, candidate/champion promotion and immutable serving revisions, with identity and audit carried through each change." },
      { title: "A separate inference data plane", description: "The gateway governs predict, streaming chat and JSON function endpoints with scoped caller access, API keys, request/token limits and usage metering, independent of management traffic." },
      { title: "Release gates beyond readiness", description: "Canary decisions use the candidate revision's error rate, p95 latency and minimum traffic. A failed gate drives rollback; a running pod alone is not the release decision." },
    ],
    technologies: ["Python", "Go", "Kubernetes", "KServe", "FastAPI", "React", "TypeScript", "PostgreSQL", "SQLAlchemy", "Alembic", "Argo Workflows", "MLflow", "Knative", "vLLM", "Hugging Face", "Keycloak", "OpenTelemetry", "Prometheus", "Tempo", "Grafana", "Helm", "Argo CD", "Terraform", "MinIO", "k6"],
    concepts: ["Scheduling", "Immutable Execution Snapshots", "Dataset Lineage", "Batch Inference", "Model Monitoring", "Transactional Outbox", "ML Control Plane", "Asynchronous Reconciliation", "Project-Scoped Authorization", "OIDC", "Training Pipelines", "Model Evaluation and Promotion", "Immutable Deployment Revisions", "Canary Release Gates", "Inference Gateway", "Usage Metering", "GPU Quotas", "Hexagonal Architecture", "GitOps", "Fault Injection"],
    proofPoints: [
      { label: "Scheduled scoring and quality", value: "1,000,000 predictions · 100% label coverage", scope: "NYC TLC February 2025 · single-node local replay · 8 October 2026", qualifier: "Independent pandas/sklearn checks agree with MAE 2.082 USD, RMSE 4.466 USD and R² 0.920." },
      { label: "Dataset-triggered monitoring", value: "Automatic report · restart without duplicate execution", scope: "Local acceptance revision 49 · source a3202e3", qualifier: "Output version 3 triggered monitoring with 1,000,000 matched labels. The first dispatch exposed a missing runtime grant; the owner repaired it and committed provisioning now includes the grant. One platform intent per occurrence does not mean exactly-once external effects." },

      {
        label: "Foundation load test",
        value: "645,809 requests · 0% errors",
        scope: "Original inference foundation · local kind cluster",
        qualifier:
          "Saturated throughput 2,935 req/s at a saturated /predict p95 of 32.9 ms. Measured against this local cluster, not an estimate or a claim about production traffic.",
      },
      {
        label: "Autoscaling",
        value: "2 → 6 replicas in 71s",
        scope: "Original infrastructure · HPA on CPU · M10",
        qualifier:
          "Scale-down back to 2 replicas after load takes roughly 230s and is stepped rather than immediate, matching Kubernetes' conservative default scale-down behavior.",
      },
      {
        label: "Recovery timing",
        value: "12–15s pod · ~1.4s drift",
        scope: "M2 pod recovery · M4 GitOps reconciliation",
        qualifier:
          "A deleted pod has a replacement serving in 12–15s. Argo CD detects and self-heals configuration drift in about 1.4 seconds, independent of its own ~3 min Git poll cadence.",
      },
      {
        label: "Reproducibility",
        value: "11/11 acceptance in 901s",
        scope: "M11 · destroyed cluster, images, build cache",
        qualifier:
          "make local-up then make local-test passed every check after a full teardown of the cluster, container images and build cache, proving the repository alone is sufficient with no manual step.",
      },
      {
        label: "Failure engineering",
        value: "8 faults injected against the live cluster",
        scope: "Not simulated · detection and recovery timed",
        qualifier:
          "Representative scenarios: pod crash (replacement in 12–15s), artifact-store outage (100% requests still 200 while unready, 0 restarts), config drift (self-heal ~1.4s), bad rollout (maxUnavailable: 0 keeps old replicas serving), node drain of a stateful pod (PostgreSQL/MinIO reschedule automatically).",
      },
      {
        label: "Security boundary",
        value: "NetworkPolicy deny verified by test",
        scope: "inference → PostgreSQL directly · M9",
        qualifier:
          "The default-deny NetworkPolicy's block on inference reaching PostgreSQL directly was confirmed against the running cluster rather than assumed from the policy file; Pod Security Standards: restricted is enforced cluster-wide.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [
      {
        type: "related-to",
        targetProjectId: "modelops-control-plane",
        label: "Shared release control loop",
      },
    ],
    githubUrl: "https://github.com/negativexq/ml-platform-infrastructure",
  },
  {
    id: "agentic-sre",
    slug: "agentic-sre",
    order: 3,
    title: "Agentic SRE",
    seoTitle: "Agentic SRE — Evidence-Driven Kubernetes Incident Investigation",
    metaDescription:
      "Kubernetes root cause analysis with a read-only Connector, deterministic causal engine and replayable evidence. True cause named in 27/27 held-out testbed runs.",
    category: "Agent Systems / AI Platform",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Held-out testbed",
      value: "Cause named in 27/27 runs",
      scope: "HOLDOUT23 · engine 2.17.0 · 0 model calls",
      qualifier:
        "Nine fault variants, three fresh seeds each: 27/27 valid runs, the true cause and instance named in every run, zero false RESOLVED, zero false strong authority and the decoy never named.",
    },
    summary:
      "Evidence-driven Kubernetes incident investigation: an in-cluster read-only Connector, deterministic causal engine, replayable evidence and an interactive operator console.",
    directAnswer:
      "Agentic SRE is an evidence-driven Kubernetes incident investigation platform. An independently deployable in-cluster Connector holds customer credentials and dials out over gRPC/mTLS. The control plane journals observations in PostgreSQL, a bounded investigator gathers evidence, and deterministic rules verify causal hypotheses. Immutable diagnosis inputs support offline replay, while a React/TypeScript operator console connects causal paths, evidence, timeline and revision history. An optional LLM may select legal reads; it never owns the causal judgment.",
    whyItExists:
      "An incident root-cause tool becomes a trust problem the moment it can act on a cluster, hold its credentials or hand an operator an unverified answer. A plausible model guess is not a diagnosis, and a ranking's first place is not a cause. Agentic SRE keeps evidence acquisition and judgment separate, keeps credentials inside the customer cluster, records what each diagnosis could not see, and reports ambiguity as ambiguity — then measures correctness, abstention and safety as separate evidence against published ground truth, staged live faults and a testbed whose truth is recorded.",
    heroMetrics: [
      {
        value: "27/27",
        label: "Held-out runs with the cause named",
        context: "HOLDOUT23 · engine 2.17.0",
        detail:
          "2026-10-13 · nine variants across six fault families, three fresh seeds each, with the engine, manifests and acceptance criteria frozen before the run.",
      },
      {
        value: "0",
        label: "False RESOLVED diagnoses",
        context: "Same held-out set · 27 runs",
        detail:
          "Zero false strong authority, zero false elimination and the decoy never named. An execution witness was recorded in 24/27 runs.",
      },
      {
        value: "~1.2 s",
        label: "Median change-to-journal latency",
        context: "WATCH lab · 2026-09-30 / 10-01",
        detail:
          "105 changes in the WATCH + follow comparison; p90 1.9 s, down from a 21.5 s polling median.",
      },
      {
        value: "0 model calls",
        label: "Measured deterministic evaluation paths",
        context: "Every published measurement",
        detail:
          "Testbed, live suite and ITBench-Lite all ran on the deterministic policy. An LLM can only choose among legal reads; the causal judgment stays in code.",
      },
    ],
    highlights: [
      {
        title: "Evidence acquisition and causal judgment are separate",
        description:
          "The investigator selects bounded, validated read-only observations. Deterministic normalization, verification and resolution own the answer; an optional model cannot create evidence or decide the root cause.",
      },
      {
        title: "A Connector boundary you can deploy",
        description:
          "An in-cluster Connector holds customer credentials, uses read-only RBAC, and dials out over gRPC/mTLS. Preflight, one-time enrollment, certificate rotation, revocation and a Helm chart are implemented, and the console guides a cluster’s enrollment.",
      },
      {
        title: "Persisted evidence and an inspectable console",
        description:
          "PostgreSQL journals observations and diagnosis inputs. Offline replay checks manifests, provider-read tapes and digests. The React/TypeScript console renders recorded graph edges and scopes evidence through a shared selection.",
      },
      {
        title: "Authority requires execution and effect",
        description:
          "UID-aware identity, temporal boundaries, execution witnesses, service propagation, shared-evidence explanation and symptom coverage keep strong causal claims tied to observations. Open rivals and missing evidence preserve uncertainty.",
      },
      {
        title: "Held-out measurement against recorded truth",
        description:
          "HOLDOUT23 on engine 2.17.0 named the true cause and instance in 27/27 runs, with zero false RESOLVED, zero false strong authority and the decoy never named. Each held-out set is pre-registered and run once with the engine frozen.",
      },
      {
        title: "Published benchmark, scored exactly",
        description:
          "On ITBench-Lite, engine 2.17.0 scores 18/31 (58.1%) on exact root cause and 20/31 with evidence-backed causal equivalence. The frozen architecture reached 17/22 (77.3%) on TEST25 while it was blind, with zero model calls.",
      },
    ],
    technologies: [
      "Python",
      "Kubernetes",
      "LangGraph",
      "gRPC",
      "FastAPI",
      "mTLS",
      "Pydantic",
      "SQLAlchemy",
      "Alembic",
      "PostgreSQL",
      "Kind",
      "Prometheus",
      "Alertmanager",
      "Loki",
      "Tempo",
      "Chaos Mesh",
      "React",
      "TypeScript",
      "OpenTelemetry",
      "Docker",
      "Ruff",
      "Mypy",
      "pytest",
    ],
    concepts: [
      "Deterministic Root-Cause Analysis",
      "Investigator / Judge Separation",
      "Bounded Evidence Acquisition",
      "Read-Only Investigation",
      "Connector Trust Boundary",
      "Outbound mTLS Connectivity",
      "Watch-Driven Change Streams",
      "Explicit Stream Gaps",
      "Evidence Coverage Records",
      "Observation-Time Evidence Membership",
      "Typed Findings",
      "Causal Topology",
      "Observed Mechanism Authority",
      "Claim-Tier Leader Selection",
      "Hypothesis Rebuilding",
      "Diagnosis Replay",
      "Ground-Truth Evaluation",
      "Agreement vs Accuracy Separation",
      "Instrumented Testbed",
      "NO_DATA Neutrality",
      "Chaos Fault Injection",
      "Proposed-Not-Executed Remediation",
      "Observability",
    ],
    proofPoints: [
      {
        label: "Held-out instrumented testbed",
        value: "27/27 runs · cause named",
        scope: "HOLDOUT23 · 2026-10-13 · engine 2.17.0",
        qualifier:
          "Nine variants, three fresh seeds each, across six fault families. 27/27 valid, cause and instance named in every run, execution witness in 24/27, zero false RESOLVED, zero false strong authority, zero false elimination, decoy never named.",
      },
      {
        label: "Dependency rule on held-out runs",
        value: "11 answered · 0 wrong",
        scope: "HOLDOUT23 · m21 §36",
        qualifier:
          "Each answer was checked against 19 to 32 candidate requests and every stored span of its run; no counted request touched the dependency before its terminal.",
      },
      {
        label: "ITBench-Lite exact root cause",
        value: "18/31 (58.1%)",
        scope: "Engine 2.17.0 · all 35 scenarios · full-source path",
        qualifier:
          "Exact canonical match against published labels; 20/31 (64.5%) with evidence-backed causal equivalence. Zero model calls.",
      },
      {
        label: "TEST25, blind when frozen",
        value: "17/22 (77.3%)",
        scope: "Frozen architecture · full-source path · raw 17/25",
        qualifier:
          "Exact canonical label match on the held-out split; across all 35 scenarios the same architecture reached 26/31 (83.9%). VERIFIED predictions were correct 13/16.",
      },
      {
        label: "Live scenario suite",
        value: "25/25 expected outcomes",
        scope: "19 DEV · 6 HOLDOUT · staged faults on a running cluster",
        qualifier:
          "16/16 root-cause actors and 9/9 abstentions, zero fabricated RESOLVED and zero model calls.",
      },
      {
        label: "WATCH ingestion",
        value: "~1.2 s median · 1.9 s p90",
        scope: "Lab WATCH + follow · 105 changes · 2026-09-30 / 10-01",
        qualifier:
          "Source change to evidence journal, down from a 21.5 s / 27.1 s polling median and p90.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/agentic-sre",
  },
] satisfies readonly Project[];

// `order` is the single source of truth for presentation sequence, so array
// position and the field can never silently diverge.
export const projects: readonly Project[] = [...projectRecords].sort((left, right) => left.order - right.order);

export const flagshipProjects = projects.filter((project) => project.flagship);
export const supportingProjects = projects.filter((project) => !project.flagship);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}
