import type { Project, RoadmapItem } from "@/lib/content/types";

const emptyRoadmap: readonly RoadmapItem[] = [];

const projectRecords = [
  {
    id: "agentic-customer-service-platform",
    slug: "agentic-customer-service-platform",
    order: 1,
    title: "Agentic Customer Service Platform",
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
          "30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions. Also recorded: 0 confirmation bypasses, 0 unauthorized mutations, 0 duplicate mutations, 0 hallucinated identifiers. Evidence for this exact source, prompt, model, provider and contract binding — not a universal guarantee about future hosted-model behavior.",
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
    order: 3,
    title: "ModelOps Control Plane",
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
    order: 2,
    title: "Knowledge Base RAG",
    category: "Generative AI / RAG Platform",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Multilingual reranker benchmark",
      value: "MRR 0.367 → 0.956",
      scope: "220 questions · frozen multilingual benchmark",
      qualifier:
        "The multilingual reranker improved Cross MRR from the prior English reranker's 0.367 to 0.956 and reached Recall@5 of 1.000 on both TR-to-EN and EN-to-TR slices. These are retrieval/ranking metrics, not final-answer accuracy.",
    },
    summary:
      "Local-first multilingual RAG platform where tenant scope, evidence construction, support-unit identity and occurrence-aware validation are separate boundaries, and where a change is adopted only if it passes a decision rule frozen before the result was known.",
    directAnswer:
      "Knowledge Base RAG is a local-first platform for operating multilingual knowledge bases. Server-owned tenant ACL runs before retrieval and reranking, SectionAware evidence construction turns authorized results into request-scoped support units, and an occurrence-aware validator checks critical-value consistency before a citation-resolved answer is released. Retrieval, evidence, generation, validation and citation failures are attributed to distinct boundaries rather than collapsed into one pass or fail label.",
    whyItExists:
      "Retrieval quality alone does not make an answer trustworthy. The system has to preserve tenant boundaries, construct evidence deliberately, explain which support units reached the model, validate the model's references, and fail closed when a safety boundary cannot be established. The second half of the project is treating evaluation as an engineering control rather than a scoreboard: decision rules are frozen before results are known, rejected candidates are preserved as evidence instead of being rewritten into a success narrative, and metric families are kept separate so a ranking score is never read as answer accuracy.",
    heroMetrics: [
      {
        value: "70% USEFUL-ANSWER",
        label: "End-to-end evaluation",
        context: "Canonical TechQA BGE-ON record",
        detail: "Correct plus Partial, which is not an accuracy claim. 2% were materially incorrect and 28% released no useful supported answer.",
      },
      {
        value: "0 CONTRACT FAILURES",
        label: "Support-ID and citation contracts",
        context: "Corrected TechQA evaluation",
        detail: "No unknown, cross-query, hidden or unauthorized support IDs were accepted. Deterministic contract results on the evaluated corpus, not proven security.",
      },
      {
        value: "RECALL@5 1.0000",
        label: "Reranker selection benchmark",
        context: "220 multilingual questions",
        detail: "Against 0.9563 cross-lingual without a reranker. A retrieval and ranking metric, separate from final-answer accuracy.",
      },
      {
        value: "REMOVAL NOT AUTHORIZED",
        label: "Preregistered decision rule held",
        context: "BGE_REMOVAL_NOT_SUPPORTED",
        detail: "Disabling the reranker improved evidence completeness, but the semantic non-regression gate frozen beforehand failed, so the change was not adopted.",
      },
    ],
    highlights: [
      {
        title: "Tenant scope before relevance",
        description:
          "FastAPI resolves a server-owned user, role and tenant context before retrieval. The mandatory ACL runs before reranking, so no later relevance stage can widen the authorized result set.",
      },
      {
        title: "Retrieved context stays untrusted",
        description:
          "Document bodies, titles, headings, source names and locations are serialized as reference data under answer_v3. Delimiter-looking instructions inside a document never receive a system or assistant message role.",
      },
      {
        title: "Occurrence-aware critical-value validation",
        description:
          "Earlier validator prototypes bolted on handling for negation, corrections, signed values and repeated siblings, and kept failing because identity was lost between extraction, matching, masking and re-discovery. Architecture V2 replaced the patches with one canonical extraction feeding an immutable occurrence ledger, so a role decision stays attached to the occurrence it belongs to. It is the default validator in this runtime.",
      },
      {
        title: "Versioned index lifecycle",
        description:
          "Pipeline fingerprints bind embedding, parser, index and chunk settings to a collection. A compatible version is built and checked before the kb_active alias moves, keeping model or dimension changes from silently reusing the wrong index.",
      },
      {
        title: "Failures are attributed to a boundary",
        description:
          "When an answer is wrong the useful question is which boundary made it wrong, so retrieval miss, reranker loss, evidence-packing loss, generation error, validator over-rejection and citation failure stay separate classes. That keeps a retrieval limitation from hiding behind a validator metric, and stops a citation identity check from being read as semantic grounding.",
      },
      {
        title: "Operations console, not a chat shell",
        description:
          "The React console brings sources, retrieval stages, security state, trace spans, synchronization history, active settings and evaluation artifacts into the same inspection path as the answer.",
      },
    ],
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Vite",
      "Qdrant",
      "Ollama",
      "OpenTelemetry",
      "Jaeger",
      "Docker Compose",
    ],
    concepts: [
      "Multi-Source Ingestion",
      "Incremental Sync",
      "Tenant-Scoped Retrieval",
      "Role-Based Access Control",
      "Hybrid Retrieval",
      "Dense Retrieval",
      "Sparse Retrieval",
      "RRF Fusion",
      "Multilingual Reranking",
      "Untrusted RAG Context",
      "Prompt Injection Resistance",
      "Strict Output Validation",
      "Citation Integrity",
      "Pipeline Fingerprinting",
      "Versioned Index Activation",
      "Alias Rollback",
      "SectionAware Evidence Packing",
      "Support-Unit Identity",
      "Occurrence Ledger",
      "Failure Attribution",
      "Preregistered Evaluation Gates",
      "Fail-Closed Abstention",
      "Distributed Tracing",
      "Artifact-Backed Evaluation",
    ],
    proofPoints: [
      {
        label: "End-to-end evaluation",
        value: "70% useful · 2% incorrect",
        scope: "Canonical TechQA BGE-ON record",
        qualifier:
          "Useful-answer rate is Correct plus Partial and is not an accuracy claim. Strict full-completeness scored separately at 30%, which is a different metric rather than another outcome bucket. Candidate evidence recall at the shared Top-20 stage was 95.9%. Benchmark results on an evaluated corpus, not live traffic or serving performance.",
      },
      {
        label: "Unavailable or abstained",
        value: "28% · 18% self · 10% forced",
        scope: "9/50 self-abstain · 5/50 forced abstain",
        qualifier:
          "No useful supported answer was released. Abstaining when support cannot be established is intentional fail-closed behaviour, but an abstention is not automatically a safety success or a quality failure: appropriateness is assessed through layer-wise failure attribution rather than inferred from the aggregate, and candidate evidence recall sits at an earlier retrieval boundary that does not classify individual abstentions.",
      },
      {
        label: "Support-ID and citation contracts",
        value: "0 failures",
        scope: "Corrected TechQA evaluation",
        qualifier:
          "No unknown, cross-query, hidden or unauthorized support IDs were accepted, and there were zero citation contract failures. Deterministic contract results from the evaluated corpus, not a claim of formally proven system security.",
      },
      {
        label: "Reranker selection benchmark",
        value: "Recall@5 1.0000 · MRR 0.9558",
        scope: "220 multilingual questions · frozen set",
        qualifier:
          "Against 0.9563 cross-lingual Recall@5 with hybrid retrieval and no reranker, and 63 rescue cases with zero drop-outs. The prior English reranker went the other way on the same set, dropping 85 expected top-five cases and rescuing one. Total retrieval p95 was 2457.7 ms on the measured local path. These are retrieval and ranking metrics, not final-answer accuracy.",
      },
      {
        label: "Preregistered decision rule",
        value: "BGE_REMOVAL_NOT_SUPPORTED",
        scope: "Frozen semantic non-regression gate",
        qualifier:
          "Disabling the reranker materially improved evidence completeness, but the gate frozen before the result was known still failed, so removal was not authorized. Rejected validator candidates are kept as canonical evidence with their original verdicts rather than rewritten into a success narrative.",
      },
      {
        label: "Repository test evidence",
        value: "844 backend · 18 frontend",
        scope: "Last recorded full verification",
        qualifier:
          "Two external Notion/provider checks skipped. Ruff, backend and frontend type checks, frontend lint and the production build were green in the same recorded verification.",
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
        "Production RAG Platform established a focused single-PDF retrieval foundation with hybrid search, reranking, citation-aware generation, evaluation and tracing. Knowledge Base RAG evolved that foundation into a reliability-oriented platform: PDF, Markdown and Notion connectors, incremental synchronization, versioned re-indexing, cancellation safety, schema migration, Qdrant and registry reconciliation, and explicit citation-integrity validation.",
    },
    githubUrl: "https://github.com/negativexq/knowledge-base-rag",
  },
  {
    id: "real-time-commerce-platform",
    slug: "real-time-commerce-platform",
    order: 5,
    title: "Real-Time Commerce Platform",
    category: "Distributed Systems / Streaming",
    status: "current",
    flagship: true,
    showCardProof: true,
    cardProof: {
      label: "Sustainable isolated capacity",
      value: "Workload-dependent",
      scope: "~1,050 evt/s at 42.8% fraud-eligible · ~1,600 at 0%",
      qualifier:
        "The processor has no single workload-independent ceiling, because fraud-eligible events take a longer path. The ~750 to ~1,050 evt/s (+40%) optimisation was measured on the 42.8% workload. Local isolated benchmark, not production capacity.",
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
        description: "Demo full-path throughput and isolated processor capacity remain separate claims, with a fresh sweep defining the current sustainable boundary.",
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
    order: 7,
    title: "Repo Context Forge",
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
    order: 8,
    title: "dbt Feature Lineage",
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
    order: 9,
    title: "Production RAG Platform",
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
    order: 10,
    title: "Terraform Docker Infrastructure Lab",
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
    relationships: [],
    githubUrl: "https://github.com/negativexq/terraform-docker-infrastructure-lab",
  },
  {
    id: "cause-tune",
    slug: "cause-tune",
    order: 6,
    title: "CauseTune",
    category: "Model Training / Fine-Tuning",
    status: "current",
    flagship: false,
    showCardProof: true,
    cardProof: {
      label: "Measured specialization gain",
      value: "+34.03 pp diagnosis exact match",
      scope: "Frozen 144-case synthetic benchmark",
      qualifier:
        "Experiment 02: untouched Qwen3-4B scored 65.28%, the tuned adapter 99.31%. The benchmark was frozen before training and excluded from checkpoint selection; 99.31% is benchmark accuracy on synthetic cases, not production accuracy.",
    },
    summary:
      "LLM fine-tuning laboratory for measuring specialization gain, training dynamics, generalization and failure behavior under constrained hardware, with a frozen benchmark and base-vs-tuned evidence.",
    directAnswer:
      "CauseTune is a QLoRA fine-tuning laboratory that freezes a held-out benchmark, measures the untouched base model's capability gap, runs one controlled specialization, then re-measures base versus tuned on the same frozen evaluation with quality, efficiency and failure analysis kept as separate evidence.",
    whyItExists:
      "A single accuracy number does not show whether fine-tuning added a real capability, whether it generalized, or what it cost. CauseTune keeps the benchmark frozen before training, selects checkpoints on validation only, and reports the gain as specific failure modes disappearing rather than one headline score — so a specialization claim is inspectable, not asserted.",
    heroMetrics: [
      {
        value: "65.28% → 99.31%",
        label: "Diagnosis exact match",
        context: "Experiment 02 · frozen 144-case benchmark",
        detail: "Untouched Qwen3-4B versus the tuned adapter on a benchmark frozen before training. +34.03 pp; synthetic benchmark accuracy, not production accuracy.",
      },
      {
        value: "100 / 600 STEPS",
        label: "Early stop, no forced budget",
        context: "validation_no_improvement",
        detail: "Diagnosis hit the validation ceiling by step 25; early stopping ended the run at step 100, avoiding 500 of 600 optimizer updates (83.33%).",
      },
      {
        value: "5.312 GiB",
        label: "Peak allocated VRAM",
        context: "8 GB RTX 5070 Laptop · 0.814% trainable",
        detail: "33,030,144 trainable parameters over a 4.06B logical model. Peak allocated VRAM, not framework reserved-memory accounting.",
      },
      {
        value: "26.8% → 99.2%",
        label: "One-variable causal fix",
        context: "Experiment 01 · M5 → M6 validation",
        detail: "Changing only the training order from unshuffled to a deterministic seeded shuffle recovered held-out accuracy; balanced data still produced pathological single-class optimizer windows.",
      },
    ],
    highlights: [
      {
        title: "Frozen benchmark before any training",
        description:
          "Problem: a benchmark the model was tuned against measures memorization, not capability. Solution: the challenge benchmark and evaluation contract are established and hashed before training, excluded from the train and validation data, and never used for checkpoint selection.",
      },
      {
        title: "The gain is specific failure modes disappearing",
        description:
          "Problem: an aggregate delta hides whether the model got better or just shifted errors. Solution: base-vs-tuned is decomposed into mechanically observed transitions — 49 cases went base-wrong to tuned-correct against 1 regression — and per-family behavior, so configuration_regression (0% → 100%) and disk_io_saturation (25% → 100%) are visible individually.",
      },
      {
        title: "Efficiency measured, not assumed",
        description:
          "Problem: fine-tuning claims often ignore what the run cost. Solution: peak allocated VRAM (5.312 GiB on an 8 GB laptop GPU), trainable-parameter share (0.814%), optimizer steps actually consumed (100 of 600) and wall time are reported as first-class results alongside quality.",
      },
      {
        title: "A causal training-order diagnosis",
        description:
          "Experiment 01 isolated one training-affecting variable: an unshuffled class-contiguous order collapsed held-out accuracy to 26.8% because the final optimizer windows were single-class, while a deterministic seeded shuffle recovered it to 99.2%. Train loss alone was insufficient evidence.",
      },
      {
        title: "Integrity controls over convenience",
        description:
          "No benchmark-informed oversampling, no LLM judge, no manual output repair, no alternate-checkpoint fishing. Malformed outputs were scored as produced, and metrics were recomputed offline from the persisted 144 predictions without regenerating model outputs.",
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
    ],
    proofPoints: [
      {
        label: "Specialization gain",
        value: "65.28% -> 99.31% diagnosis exact match",
        scope: "Experiment 02 · frozen 144-case synthetic benchmark",
        qualifier:
          "Untouched Qwen3-4B versus the tuned adapter on a benchmark frozen before training and excluded from checkpoint selection. +34.03 pp; resolution exact match rose +64.58 pp. Synthetic benchmark accuracy, not production accuracy.",
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
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/cause-tune",
  },
  {
    id: "decision-sql",
    slug: "decision-sql",
    order: 4,
    title: "DecisionSQL",
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
        value: "155 / 180",
        label: "Governed task success",
        context: "86.11% · 180-case governed benchmark",
        detail: "One-shot governed decisions across 12 synthetic domains. Synthetic benchmark accuracy, not general or production Text-to-SQL accuracy.",
      },
      {
        value: "28 / 30",
        label: "Authority",
        context: "93.33% · model governance",
        detail: "Two cases where the model wrongly chose ANSWER on an authority-blocked request; request-scoped relation authority blocked the unauthorized relation before any database interaction.",
      },
      {
        value: "103 / 120",
        label: "Answerable runtime TSA",
        context: "85.83% · BASE + counterfactual",
        detail: "Answerable queries that survived the real runtime and satisfied the result contract on BASE and every required counterfactual state.",
      },
      {
        value: "12 / 12",
        label: "Policy blocks",
        context: "100% · ambiguity 12/18 = 66.67%",
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
          "Problem: scoring only answered queries hides whether a system knows when not to answer. Solution: the benchmark includes authority, ambiguity and policy cases where producing SQL is the wrong behaviour, so governance is scored separately — authority 28/30, policy 12/12, ambiguity 12/18. When the model wrongly answered an authority-blocked case, request-scoped relation authority blocked the unauthorized relation before any database interaction.",
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
        value: "155/180 = 86.11% governed task success",
        scope: "180-case governed benchmark · 12 synthetic domains",
        qualifier:
          "One-shot governed decisions across four behavior classes on one synthetic benchmark. Synthetic benchmark accuracy, not general or production Text-to-SQL accuracy.",
      },
      {
        label: "Answerable runtime correctness",
        value: "103/120 = 85.83% answerable runtime TSA",
        scope: "BASE + counterfactual execution",
        qualifier:
          "Answerable queries that survived the real runtime and satisfied the result contract on BASE and every required counterfactual state. healthcare_10 passes BASE but fails a counterfactual, which is why a single state is not enough.",
      },
      {
        label: "Authority containment",
        value: "28/30 authority · unauthorized relation blocked before DB access",
        scope: "model governance + runtime enforcement",
        qualifier:
          "Model authority decisioning is 28/30; telecom_15 is the known case where the model wrongly answered. Request-scoped relation authority returned an authorization rejection with zero database connection, EXPLAIN or execution. This is relation-level authority, not universal column or relationship-path authorization.",
      },
      {
        label: "Governance split",
        value: "policy 12/12 = 100% · ambiguity 12/18 = 66.67%",
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
          "Server-owned metadata detects the supported additive-parent, declared-1:N fanout shape and preaggregates on the child side. Outside it the normalizer stays fail-closed; this is not universal grain repair, and remaining fail-closed grain cases are under investigation.",
      },
    ],
    roadmap: emptyRoadmap,
    relationships: [],
    githubUrl: "https://github.com/negativexq/decision-sql",
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
