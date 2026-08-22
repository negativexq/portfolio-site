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
    summary:
      "Release-candidate agentic platform where every LLM output is an untrusted proposal: deterministic grounding, policy, confirmation, idempotency and audit decide what reaches a real customer account — validated through a closed semantic-safety gate and a passed operational release gate.",
    directAnswer:
      "Agentic Customer Service Platform is a validated production-oriented reference architecture built on one principle: the LLM proposes, deterministic software decides what may execute. A LangGraph agent proposes actions against real customer accounts; provenance validation, a deterministic decision compiler, a policy engine, a confirmation gate and an execution authority decide whether a mutation is actually allowed. The current release candidate has passed both its semantic-safety validation (D2c) and its operational release gate (D2d).",
    whyItExists:
      "LLMs are probabilistic; business actions are not. This project treats that gap as an execution-infrastructure problem: an early prospective live evaluation found unsafe model proposals reaching executable, confirmation-required state before deterministic guards fully contained them. Rather than prompt-tuning around individual failures, the response was architectural — semantic grounding and destructive-target admissibility checks added to the control plane, then a targeted prompt-contract hardening pass once a narrower provenance gap was isolated. Across that evaluation sequence, unsafe executable survivors were eliminated in stages — 15 → 3 → 0 → 0 → 0 — while unsafe executions held at zero throughout. The current release candidate (M6.29B) closed semantic-safety validation with zero survivors across 540 measured executions, and a separate operational release gate (M6.34) validated the deployed system under concurrency, restart and fault conditions. D2c and D2d are deliberately separate claims: one is evidence about model behavior under this exact contract, the other is evidence about the deployed system's own correctness — neither is a claim of unrestricted production readiness.",
    heroMetrics: [
      {
        value: "540 RUNS",
        label: "Semantic safety validation",
        context: "D2c · M6.29B",
        detail: "180 bilingual scenarios × 3 repetitions on the frozen live_eval_v2 dataset, semantic_decision_v3 contract.",
      },
      {
        value: "0 UNSAFE EXECUTIONS",
        label: "Deterministic containment",
        context: "D2c · M6.29B",
        detail: "30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions.",
      },
      {
        value: "15 → 0",
        label: "Safety hardening journey",
        context: "M6.15B → M6.29B",
        detail: "Unsafe executable survivors eliminated in stages (15 → 3 → 0 → 0 → 0) through deterministic containment and semantic-contract hardening.",
      },
      {
        value: "D2D_RELEASE_GATE_PASS",
        label: "Operational release gate",
        context: "D2d · M6.34",
        detail: "Baseline E2E, same-action concurrency, restart/persistence, a 6/6 fault matrix and observability/privacy all passed under a frozen deployment.",
      },
    ],
    highlights: [
      {
        title: "Semantic safety",
        description:
          "Problem: an LLM can produce a plausible but ungrounded execution proposal — a non-authoritative output with unsupported semantic arguments — that cannot be trusted as executable intent. Solution: provenance validation and a deterministic decision compiler ground every argument in authoritative context before it becomes an executable decision, closing this gate at 0 unsafe executions across 540 measured executions.",
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
        title: "Human-in-the-loop that survives restarts",
        description:
          "Confirmation is bound to a durable pending action rather than a regenerated model response. Ownership, arguments and current business state are revalidated before it executes.",
      },
      {
        title: "Production-oriented RAG",
        description:
          "Hybrid dense + sparse retrieval with reciprocal-rank fusion and optional reranking, versioned snapshots with atomic alias activation, and bounded fallback when the reranker fails.",
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
      "Ollama",
      "React",
      "TypeScript",
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
      "Persistent Memory",
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
        value: "540/540 · 0 unsafe executions",
        scope: "M6.29B · semantic_decision_v3 · live_eval_v2",
        qualifier:
          "30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions. Also recorded: 0 confirmation bypasses, 0 unauthorized mutations, 0 duplicate mutations, 0 hallucinated identifiers. Evidence for this exact source, prompt, model, provider and contract binding — not a universal guarantee about future hosted-model behavior.",
      },
      {
        label: "D2d operational release gate",
        value: "D2D_RELEASE_GATE_PASS",
        scope: "M6.34 · frozen deployment topology",
        qualifier:
          "Baseline E2E PASS; same-action concurrency committed 1, 1, 1 across 16-way contention and 3 rounds; independent-action concurrency committed 2, 2, 2; restart/persistence PASS; fault matrix 6/6 recovered; observability/privacy PASS. Validates the deployed system's own correctness under controlled operational conditions, not model quality.",
      },
      {
        label: "Safety hardening journey",
        value: "15 → 3 → 0 → 0 → 0",
        scope: "Unsafe executable survivors, M6.15B → M6.29B",
        qualifier:
          "Containment gaps were closed in stages — deterministic grounding and admissibility checks, then containment-observability instrumentation, then a targeted prompt-contract hardening once the remaining gap was isolated to unsupported refund-reason provenance. Unsafe executions held at zero throughout.",
      },
      {
        label: "Deterministic regression suite",
        value: "110/110 · 40/40 · 28/28",
        scope: "Deterministic · safety · resilience gates",
        qualifier:
          "Runs against a fake structured-decision provider as a repeatable CI regression gate — evidence about runtime correctness, not a claim about live-model behavior.",
      },
      {
        label: "Decision architecture selection",
        value: "94.05% vs 82.14%",
        scope: "semantic_decision_v3 vs direct_tool_v1 · same model",
        qualifier:
          "Both architectures ran the same gpt-5.6-luna model, provider, dataset and deterministic safety stack, so only the decision path varied: semantic_decision_v3 reached 79/84 effective routing and clarification against 69/84 for direct tool calling. That made it the canonical architecture for subsequent model evaluation — the production runtime default itself remains direct_tool_v1 until that migration is made.",
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
    order: 2,
    title: "ModelOps Control Plane",
    category: "MLOps / AI Platform",
    status: "current",
    flagship: true,
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
    order: 3,
    title: "Knowledge Base RAG",
    category: "Generative AI / RAG Platform",
    status: "current",
    flagship: true,
    summary:
      "RAG reliability platform with multi-source ingestion, incremental synchronization, hybrid retrieval, reranking, citation integrity and observable index repair.",
    directAnswer:
      "Knowledge Base RAG is a multi-source RAG platform that synchronizes PDF, Markdown and Notion content incrementally, combines dense and sparse retrieval with native RRF fusion, reranks results and validates citation integrity before returning a response.",
    whyItExists:
      "Extends retrieval beyond the happy path with versioned re-indexing, cancellation safety, Qdrant and registry reconciliation, schema migration, DeepEval evaluation, and OpenTelemetry traces inspected in Jaeger.",
    technologies: [
      "Python",
      "FastAPI",
      "Qdrant",
      "Ollama",
      "OpenTelemetry",
      "Jaeger",
      "DeepEval",
      "Streamlit",
      "Docker Compose",
    ],
    concepts: [
      "Multi-Source Ingestion",
      "Incremental Sync",
      "Hybrid Retrieval",
      "Dense Retrieval",
      "Sparse Retrieval",
      "RRF Fusion",
      "Cross-Encoder Reranking",
      "Citation Integrity",
      "Versioned Re-Indexing",
      "Cancellation Safety",
      "Index Reconciliation",
      "Schema Migration",
      "Distributed Tracing",
      "Evaluation",
    ],
    proofPoints: [
      {
        label: "Repository test evidence",
        value: "448 tests",
        scope: "Repository test suite",
        qualifier:
          "The suite covers synchronization, retrieval, citation integrity, migration and real-dependency behavior across SQLite, Qdrant, Jaeger and browser paths.",
      },
      {
        label: "Bilingual reranker investigation",
        value: "8 real cells",
        scope: "2×2 × reranker on/off",
        qualifier:
          "Query and document language pairing was flipped across the matrix: both cross-lingual cells regressed under reranking while both mono-lingual cells remained unchanged.",
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
    order: 4,
    title: "Real-Time Commerce Platform",
    category: "Distributed Systems / Streaming",
    status: "current",
    flagship: true,
    summary:
      "Distributed commerce system focused on at-least-once correctness, transactional persistence, bounded failure handling, observability and measured performance limits.",
    directAnswer:
      "Real-Time Commerce Platform is a Kafka-based distributed system with idempotent consumers, PostgreSQL transactional persistence, Redis coordination, bounded retry, a DLQ and a transactional outbox under partition-scoped ordering.",
    whyItExists:
      "Makes event-processing guarantees and failure paths explicit, then treats sustainable throughput as something to measure and defend rather than assume. Query-plan analysis and repeated boundary tests separate real capacity from short-lived throughput, and two independently evidenced changes — bounded Kafka offset-commit batching, then query-plan-driven PostgreSQL indexing — moved the isolated pipeline's sustainable ceiling from ~750 to ~1,050 events/s without weakening at-least-once correctness.",
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
          "Three processor workers matched to three Kafka partitions (750–775 evt/s was the original non-sustainable transition). Bounded per-partition offset-commit batching moved the sustainable boundary to ~900 evt/s; query-plan-driven PostgreSQL indexing plus a fresh capacity sweep moved it to ~1,050 evt/s, with ~1,075 evt/s the first repeatably degraded rate. Not production capacity or Demo Control throughput.",
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
    order: 5,
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
    order: 6,
    title: "dbt Feature Lineage",
    category: "Data Engineering / Lineage",
    status: "current",
    flagship: false,
    summary:
      "Manifest-aware dbt analysis for model dependencies, cross-model column lineage, change impact and query flow without a live warehouse.",
    directAnswer:
      "dbt Feature Lineage reads target/manifest.json and compiled SQL when available, falls back to static SQL analysis, and uses sqlglot and NetworkX to trace cross-model columns and downstream impact without a live warehouse connection.",
    whyItExists:
      "Makes upstream and downstream lineage inspectable across manifest-aware and static modes, distinguishing direct from transitive impact while keeping query-flow visualization and interface logic on one analysis layer.",
    technologies: ["Python", "dbt Core", "sqlglot", "NetworkX", "Streamlit", "Typer", "Docker"],
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
    order: 7,
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
    order: 8,
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
