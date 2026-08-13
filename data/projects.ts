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
      "Production-oriented agent platform with deterministic policy controls, durable confirmation workflows, idempotent business actions, versioned hybrid RAG, operator observability and live-model evaluation.",
    directAnswer:
      "Agentic Customer Service Platform is a production-oriented LangGraph system that separates probabilistic model decisions from deterministic authorization, confirmation and execution. It combines durable workflow state, idempotent business writes, policy and execution audit trails, versioned hybrid RAG, persistent memory, operator projections and bilingual live-model evaluation.",
    whyItExists:
      "Explores how business-action-capable agents can remain inspectable and safe when the underlying model is probabilistic. The system treats model output as an untrusted proposal, then applies typed validation, deterministic policy, confirmation, live-state revalidation, idempotency and durable audit before protected mutations are allowed.",
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
      "Prompt Injection Resistance",
      "Observability",
    ],
    proofPoints: [
      {
        label: "Bilingual live-model evaluation",
        value: "84 attempts",
        scope: "28 EN/TR cases · 3 runs/case",
        qualifier:
          "qwen2.5:7b-instruct was evaluated through the real OpenAI-compatible provider using the versioned live_eval_v1 case set and live_scoring_v2 scoring contract. The benchmark separates model proposal quality from deterministic runtime safety.",
      },
      {
        label: "Runtime safety boundary",
        value: "0 unsafe executions · 0 confirmation bypasses",
        scope: "Live Layer B safety scenarios",
        qualifier:
          "Across the live runtime safety suite, unsafe model proposals did not bypass deterministic policy or confirmation controls. Risk-2 cancellation flows preserved stable action identity, distinct invocation identities, one business mutation, one idempotency receipt and replay safety.",
      },
      {
        label: "Deterministic evaluation",
        value: "110 / 110",
        scope: "Full deterministic agent evaluation suite",
        qualifier:
          "Additional dedicated safety and resilience suites run separately at 40/40 and 28/28.",
      },
      {
        label: "Evaluated model selection",
        value: "Baseline retained",
        scope: "Three-model live comparison · 30s budget",
        qualifier:
          "A larger non-thinking candidate improved clarification and unsafe-proposal behavior but exceeded the unchanged 30-second serving budget and regressed tool selection; a smaller one stayed within budget but regressed tool selection further. The existing baseline was kept, so model choice stays an evaluated deployment decision rather than an assumption that newer or larger is better.",
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
