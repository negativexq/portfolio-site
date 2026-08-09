import type { Project } from "@/lib/content/types";

export const projects = [
  {
    id: "real-time-commerce-platform",
    slug: "real-time-commerce-platform",
    order: 1,
    title: "Real-Time Commerce Platform",
    category: "Distributed Systems / Streaming",
    status: "current",
    flagship: true,
    summary:
      "Event-driven commerce platform focused on reliable at-least-once processing, transactional consistency, failure handling and measurable performance.",
    directAnswer:
      "Real-Time Commerce Platform is an event-driven commerce system that uses Kafka, FastAPI, PostgreSQL, Redis and a transactional outbox to make at-least-once processing, failure handling and performance measurable.",
    whyItExists:
      "Built to make delivery guarantees, failure paths and performance limits explicit in an event-driven commerce workflow.",
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
      "Observability",
      "Performance Engineering",
    ],
    proofPoints: [
      {
        label: "Sustainable service rate",
        value: "~742 evt/s",
        scope: "Isolated local benchmark",
        qualifier:
          "Documented isolated local Kafka → processor → persistence benchmark using 3 processor workers and 3 Kafka partitions.",
      },
    ],
    roadmap: [
      { title: "Terraform", status: "planned" },
      { title: "Kubernetes", status: "planned" },
      { title: "Cloud Infrastructure", status: "planned" },
    ],
    relationships: [],
    githubUrl: "https://github.com/negativexq/real-time-commerce-platform",
  },
  {
    id: "knowledge-base-rag",
    slug: "knowledge-base-rag",
    order: 2,
    title: "Knowledge Base RAG",
    category: "Generative AI / RAG Platform",
    status: "current",
    flagship: true,
    summary:
      "Multi-source knowledge platform with incremental synchronization, hybrid retrieval, reranking, citation integrity and distributed tracing.",
    directAnswer:
      "Knowledge Base RAG is a multi-source retrieval-augmented generation platform that combines incremental synchronization, hybrid retrieval, reranking, citation integrity checks and distributed tracing.",
    whyItExists:
      "Extends retrieval beyond a happy-path demo with source synchronization, index repair, citation validation and observable evaluation workflows.",
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
      "Index Reconciliation",
      "Distributed Tracing",
      "Evaluation",
    ],
    proofPoints: [
      {
        label: "Repository test evidence",
        value: "426 tests",
        scope: "Repository test suite",
        qualifier:
          "Repository documentation emphasizes extensive real-dependency validation including SQLite, Qdrant, Jaeger and browser automation.",
      },
    ],
    roadmap: [],
    relationships: [],
    evolvedFrom: {
      fromProjectId: "production-rag-platform",
      limitations: [
        "Single-source ingestion — PyMuPDF read one PDF corpus; a new source meant a hand-rolled parser, not a configured connector",
        "No incremental sync — the index couldn't tell when a source document changed or was removed, so staleness accumulated silently",
        "No index reconciliation — nothing verified the vector index still matched the source of truth",
        "Citations pointed at retrieved chunks with no integrity check tying an answer back to a still-valid source",
      ],
      narrative:
        "Production RAG Platform proved the retrieval core: hybrid search, reranking and grounded generation over a single local PDF corpus. Running it past a happy-path demo surfaced four gaps — all in ingestion and trust, not retrieval quality. Knowledge Base RAG rebuilds that layer: multi-source connectors with incremental sync, index reconciliation, and citation integrity checks, while keeping the same hybrid retrieval and reranking foundation.",
    },
    githubUrl: "https://github.com/negativexq/knowledge-base-rag",
  },
  {
    id: "modelops-control-plane",
    slug: "modelops-control-plane",
    order: 3,
    title: "ModelOps Control Plane",
    category: "MLOps / AI Platform",
    status: "current",
    flagship: true,
    summary:
      "Controlled ML releases using canary traffic, policy-based evaluation and automated promotion or rollback.",
    directAnswer:
      "ModelOps Control Plane is an MLOps platform that evaluates canary releases against explicit policies and then promotes, rolls back or routes them to human review.",
    whyItExists:
      "Explores how model releases can progress through explicit deployment states while policy outcomes drive promotion, rollback or a human decision.",
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
      "Benchmarking",
    ],
    proofPoints: [
      {
        label: "Progressive canary rollout",
        value: "10% → 25% → 50% → 100%",
        scope: "Configured rollout policy",
        qualifier:
          "Traffic-weighting stages enforced by the platform's policy engine, exercised with Locust load tests — not observed production traffic.",
      },
    ],
    roadmap: [],
    relationships: [],
    githubUrl: "https://github.com/negativexq/modelops-control-plane",
  },
  {
    id: "repo-context-forge",
    slug: "repo-context-forge",
    order: 4,
    title: "Repo Context Forge",
    category: "Agent Infrastructure / Developer Tooling",
    status: "current",
    flagship: true,
    summary:
      "Local-first MCP repository intelligence platform that produces source-grounded context for coding agents.",
    directAnswer:
      "Repo Context Forge is a local-first MCP repository intelligence platform that gives coding agents bounded, source-grounded context through 38 read-only tools across six local servers.",
    whyItExists:
      "Gives coding agents bounded, deterministic repository context through secure tool interfaces instead of relying on unsourced or unstructured context.",
    technologies: ["Python", "MCP", "FastMCP", "Python AST", "Typer", "Docker", "Git"],
    concepts: [
      "Repository Intelligence",
      "Source-Grounded Context",
      "Symbol Analysis",
      "Callers / Callees",
      "Dependency Analysis",
      "Dependency Graphs",
      "Read-Only Git Intelligence",
      "Context Packs",
      "Task Bundles",
      "Tool Security Boundaries",
    ],
    proofPoints: [
      {
        label: "MCP tooling",
        value: "38 tools",
        scope: "Local MCP deployment",
        qualifier:
          "Read-only tools enabled by default across six local MCP servers.",
      },
    ],
    roadmap: [],
    relationships: [],
    githubUrl: "https://github.com/negativexq/repo-context-forge",
  },
  {
    id: "dbt-feature-lineage",
    slug: "dbt-feature-lineage",
    order: 5,
    title: "dbt Feature Lineage",
    category: "Data Engineering / Lineage",
    status: "current",
    flagship: true,
    summary:
      "Local-first dbt analysis tool for tracing model dependencies, column-level lineage and downstream impact.",
    directAnswer:
      "dbt Feature Lineage is a local-first analysis tool that traces dbt model dependencies, cross-model column lineage and the downstream impact of data changes.",
    whyItExists:
      "Makes transformation lineage and change impact inspectable, answering where a column came from and what can break downstream.",
    technologies: ["Python", "dbt Core", "sqlglot", "NetworkX", "Streamlit", "Typer", "Docker"],
    concepts: [
      "Model DAG",
      "Column-Level Lineage",
      "Upstream Trace",
      "Downstream Trace",
      "Downstream Impact",
      "Static SQL Analysis",
      "Manifest-Aware Analysis",
      "Query Flow",
    ],
    proofPoints: [
      {
        label: "Analysis scope",
        value: "Cross-model column lineage",
        scope: "Static manifest analysis",
        qualifier: "Includes transitive downstream impact analysis.",
      },
    ],
    roadmap: [],
    relationships: [],
    githubUrl: "https://github.com/negativexq/dbt-feature-lineage",
  },
  {
    id: "production-rag-platform",
    slug: "production-rag-platform",
    order: 6,
    title: "Production RAG Platform",
    category: "Generative AI / Retrieval",
    status: "current",
    flagship: false,
    summary:
      "End-to-end RAG platform covering hybrid retrieval, reranking, grounded generation, citations, evaluation and observability.",
    directAnswer:
      "Production RAG Platform is an end-to-end retrieval-augmented generation system that combines hybrid retrieval, reranking, grounded generation, citations, evaluation and observability over a local PDF corpus.",
    whyItExists:
      "Established the focused retrieval and evaluation foundation that later expanded into the multi-source Knowledge Base RAG platform.",
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
      "Grounded Generation",
      "Citations",
      "Evaluation",
      "Observability",
    ],
    proofPoints: [],
    roadmap: [],
    relationships: [
      {
        type: "evolved-into",
        targetProjectId: "knowledge-base-rag",
        label: "Evolved into",
      },
    ],
    githubUrl: "https://github.com/negativexq/production-rag-platform",
  },
] satisfies readonly Project[];

export const flagshipProjects = projects.filter((project) => project.flagship);
export const supportingProjects = projects.filter((project) => !project.flagship);

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectById(id: string) {
  return projects.find((project) => project.id === id);
}
