import type { Project, RoadmapItem } from "@/lib/content/types";

const emptyRoadmap: readonly RoadmapItem[] = [];

const projectRecords = [
  {
    id: "agentic-customer-service-platform",
    slug: "agentic-customer-service-platform",
    order: 1,
    title: "Agentic Customer Service Platform",
    category: "Agent Systems / AI Platform",
    status: "current",
    flagship: true,
    summary:
      "A production-oriented agentic customer service platform where LLM output is treated as an untrusted proposal, and every real-world action passes through deterministic grounding, authorization, policy, confirmation, idempotency and audit before it can execute.",
    directAnswer:
      "Agentic Customer Service Platform is a production-oriented LangGraph system built around one principle: the LLM proposes, deterministic software decides what is allowed to execute. Model output for a request type, target and semantic intent is untrusted input; typed validation, a deterministic policy engine, durable confirmation, live-state revalidation, idempotent writes and audit trails sit between that proposal and any business mutation.",
    whyItExists:
      "LLMs are probabilistic; business actions are not. This project explores how an agent can operate against real customer accounts — refunds, cancellations, escalations — without giving the model direct authority over destructive actions. A prospective live evaluation (M6.15B) found unsafe model proposals that survived the deterministic controls of that time; rather than prompt-tuning around the failures, the fix was architectural — semantic grounding and destructive-target admissibility checks added to the control plane itself. The next frozen evaluation (M6.20B) measured the same failure class again and found executable, confirmation-required survivors down from 15 to 3, an 80% reduction, with zero unsafe executions in both runs. The remaining three are tracked as an open containment gap, not a closed result.",
    heroMetrics: [
      {
        value: "540 RUNS",
        label: "Prospective evaluation",
        context: "Scale",
        detail: "180 bilingual scenarios × 3 repetitions, M6.20B, frozen live_eval_v2.",
      },
      {
        value: "0 UNSAFE EXECUTIONS",
        label: "Deterministic containment",
        context: "Safety",
        detail: "No unsafe model proposal reached execution across the full M6.20B run.",
      },
      {
        value: "15 → 3",
        label: "Unsafe executable survivors",
        context: "Hardening",
        detail: "An 80% reduction after adding deterministic semantic grounding and destructive-target admissibility guards.",
      },
      {
        value: "0 BYPASSES",
        label: "Confirmation compliance",
        context: "Safety",
        detail: "Every confirmation-required action was revalidated before executing; none bypassed the confirmation boundary.",
      },
    ],
    highlights: [
      {
        title: "Deterministic agent safety",
        description:
          "Explicit identifiers must be grounded in the user's current request before destructive actions can proceed. Symbolic or model-invented targets are blocked or routed to clarification instead of executing.",
      },
      {
        title: "Transaction-safe business actions",
        description:
          "Writes use actor- and request-scoped idempotency keys, database uniqueness constraints and durable receipts. A write whose outcome is unknown is never automatically replayed.",
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
          "Frozen bilingual scenarios, source-bound approvals, immutable hashes and explicit budgets run across deterministic regression, safety and resilience suites, plus an approval-gated prospective live run.",
      },
      {
        title: "Operational visibility",
        description:
          "OpenTelemetry traces cover agent, tool, policy, RAG, memory and resilience stages while excluding raw customer prompts and sensitive tool arguments from labels.",
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
      "Observability",
    ],
    proofPoints: [
      {
        label: "Prospective containment funnel",
        value: "0 unsafe executions · 0 confirmation bypasses",
        scope: "M6.20B · 540 measured executions · gpt-5.6-luna",
        qualifier:
          "The latest approval-gated live run (semantic_decision_v3, official OpenAI API, 180 scenarios × 3 repetitions) traced the full containment path: 29 unsafe semantic proposals, 26 stopped by deterministic guards before execution, 3 executable confirmation-required survivors that did not execute. Zero reached execution and zero bypassed confirmation — but the 3 pre-execution survivors are tracked as an open runtime-fix item (PRODUCT_RUNTIME_FIX_REQUIRED), not a closed result.",
      },
      {
        label: "Deterministic evaluation",
        value: "110 / 110",
        scope: "Full deterministic agent evaluation suite",
        qualifier:
          "Additional dedicated safety and resilience suites run separately at 40/40 and 28/28, all against a fake structured-decision provider — a regression gate, not a claim about live-model behavior.",
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
      "ML release control plane with weighted canary routing, policy-driven evaluation, automated promotion and rollback, and an auditable deployment state machine.",
    directAnswer:
      "ModelOps Control Plane is an ML release control plane that combines weighted canary routing, policy-driven evaluation and a closed-loop worker to promote, roll back or pause model deployments through an auditable state machine.",
    whyItExists:
      "Makes model-release decisions reproducible and inspectable through fault injection, deployment timelines, SQLAlchemy optimistic concurrency control and verification by the same worker that advances rollout state.",
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
      "Model Registry",
      "Model Serving",
      "Canary Deployment",
      "Weighted Routing",
      "Deployment State Machine",
      "Policy Engine",
      "Automated Promotion",
      "Automated Rollback",
      "Fault Injection",
      "Auditable Deployment Timeline",
      "Optimistic Concurrency Control",
      "Closed-Loop Verification",
      "Benchmarking",
    ],
    proofPoints: [
      {
        label: "Worker-verified canary progression",
        value: "10% → 25% → 50% → 100%",
        scope: "Real-stack CI",
        qualifier:
          "CI boots the full nine-container stack and waits for the actual worker to progress a healthy deployment through every stage; a separate injected-latency scenario verifies automatic rollback.",
      },
      {
        label: "Backend validation",
        value: "210 tests",
        scope: "Backend test suite",
        qualifier:
          "The backend suite runs alongside Ruff, mypy --strict and a separate real-stack integration job.",
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
      "Makes event-processing guarantees and failure paths explicit while using query-plan analysis, observability and repeated boundary tests to distinguish sustainable local performance from short-lived throughput.",
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
      "Observability",
      "Performance Engineering",
    ],
    proofPoints: [
      {
        label: "Sustainable service rate",
        value: "~742 evt/s",
        scope: "Isolated local benchmark",
        qualifier:
          "Measured only across Kafka → processor → Redis/PostgreSQL with three processor workers and three Kafka partitions; 775 evt/s was non-sustainable in repeated boundary tests. This is not production capacity or Demo Control throughput.",
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
