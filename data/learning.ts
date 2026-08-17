import type { LearningItem } from "@/lib/content/types";

export const learningItems = [
  {
    id: "agent-memory",
    title: "Agentic Memory",
    status: "learning",
    area: "Agent Systems",
    rationale:
      "Customer-scoped persistent memory with consent, TTL and deletion already runs in the agentic platform, where remembered text is contextual evidence and cannot authorize work. The open question is how memory behaves as it grows: which entries stay worth retrieving, how retention and compaction should be decided, and how relevance is measured rather than assumed.",
    previewSummary:
      "Measuring retrieval relevance, retention and compaction as persistent agent memory grows.",
    topics: [
      "Episodic memory",
      "Semantic memory",
      "Memory retrieval",
      "Relevance measurement",
      "Memory compaction",
      "Retention policies",
      "Memory lifecycle",
      "Conflict handling",
    ],
    evidenceTarget:
      "Extend the existing persistent-memory implementation with a repeatable benchmark for retrieval relevance, retention behavior, compaction and conflict cases as memory volume grows.",
    connectedProjectIds: ["agentic-customer-service-platform"],
    connectedAreaIds: ["agent-infrastructure"],
    connectedLearningIds: [],
  },
  {
    id: "context-engineering-rag",
    title: "Context Engineering for RAG",
    status: "learning",
    area: "Retrieval & Evaluation",
    rationale:
      "Extending existing hybrid retrieval, reranking, citation-integrity and source-grounded context work by exploring how evidence should be selected, ordered and compressed before generation instead of passed through as a naive top-k chunk dump.",
    previewSummary:
      "Systematic selection, ordering and budgeting of retrieved evidence before generation.",
    topics: [
      "Context construction",
      "Chunk selection",
      "Context ordering",
      "Context budgeting",
      "Redundancy reduction",
      "Coverage-aware selection",
      "Diversity-aware selection",
      "MMR",
      "Metadata-aware context",
      "Query-aware context assembly",
      "Source-grounded context",
      "Context compression",
      "Context-window management",
    ],
    evidenceTarget:
      "Build a repeatable benchmark comparing naive top-k retrieval with diversity-aware and coverage-aware context selection across answer quality, context size, source coverage and latency.",
    connectedProjectIds: ["knowledge-base-rag"],
    connectedAreaIds: ["generative-ai-rag"],
    connectedLearningIds: ["graphrag", "llm-rag-evaluation"],
  },
  {
    id: "graphrag",
    title: "GraphRAG",
    status: "learning",
    area: "Retrieval & Evaluation",
    rationale:
      "Exploring when explicit entity and relationship structure improves retrieval compared with vector-only RAG, especially for multi-hop and relationship-heavy questions.",
    topics: [
      "Knowledge graphs",
      "Entity extraction",
      "Relationship modeling",
      "Graph traversal",
      "Multi-hop retrieval",
      "Vector retrieval",
      "Metadata filtering",
      "Graph + vector retrieval",
      "Neo4j",
    ],
    evidenceTarget:
      "Build a Neo4j-backed GraphRAG experiment and compare it against conventional hybrid RAG on the same evaluation set.",
    connectedProjectIds: ["knowledge-base-rag"],
    connectedAreaIds: ["generative-ai-rag"],
    connectedLearningIds: [],
  },
  {
    id: "llm-rag-evaluation",
    title: "LLM / RAG Evaluation",
    status: "learning",
    area: "Retrieval & Evaluation",
    rationale:
      "Extending existing DeepEval, bilingual reranker and citation-validation work into repeatable benchmark suites that measure retrieval quality, reranking behavior, citation integrity, context efficiency, latency and failure modes.",
    topics: [
      "Retrieval evaluation",
      "Reranker evaluation",
      "Recall@K",
      "MRR",
      "nDCG",
      "Citation integrity",
      "Grounding / faithfulness",
      "Context efficiency",
      "Latency",
      "Failure-mode testing",
      "Reproducible benchmark datasets",
      "Regression testing",
    ],
    evidenceTarget:
      "Create a versioned evaluation dataset and automated benchmark comparing retrieval and context-construction configurations across quality, grounding, context size and latency metrics.",
    connectedProjectIds: ["knowledge-base-rag"],
    connectedAreaIds: ["generative-ai-rag"],
    connectedLearningIds: [],
  },
  {
    id: "terraform",
    title: "Terraform",
    status: "learning",
    area: "Platform Infrastructure",
    rationale:
      "Building a production-style local infrastructure lab with modular Terraform, the Docker provider, state migration through moved blocks, native Terraform tests, CI validation and security scanning.",
    previewSummary:
      "Modular local infrastructure with explicit state migration, native tests and CI security gates.",
    topics: [
      "Infrastructure as Code",
      "Terraform Modules",
      "Docker provider",
      "State migration",
      "Moved blocks",
      "Native Terraform tests",
      "CI validation",
      "Security scanning",
    ],
    evidenceTarget:
      "Explore remote state, environment/state isolation, cloud infrastructure, CI plan workflows and workload orchestration without presenting them as demonstrated capability yet.",
    connectedProjectIds: ["terraform-docker-infrastructure-lab"],
    connectedAreaIds: ["ai-ml-platform"],
    connectedLearningIds: ["ai-platform-kubernetes"],
  },
  {
    id: "ai-platform-kubernetes",
    title: "AI Platform on Kubernetes",
    status: "planned",
    area: "Platform Infrastructure",
    rationale:
      "Extending containerized AI platform work toward production orchestration, with emphasis on model serving, rollout control, resource isolation, scaling and observability.",
    previewSummary:
      "Moving model serving and rollout control onto orchestrated, resource-isolated infrastructure.",
    topics: [
      "Model serving",
      "Application workloads",
      "Autoscaling",
      "Rollout strategies",
      "Health checks",
      "Resource requests and limits",
      "GPU scheduling",
      "Observability",
      "Service networking",
      "Configuration",
      "Secrets",
      "Workload isolation",
    ],
    evidenceTarget:
      "Deploy an existing ModelOps or RAG workload on Kubernetes with health checks, resource controls, rollout strategy and observable service behavior.",
    connectedProjectIds: ["modelops-control-plane"],
    connectedAreaIds: ["ai-ml-platform"],
    connectedLearningIds: [],
  },
  {
    id: "ai-platform-observability",
    title: "AI Platform Observability",
    status: "learning",
    area: "Platform Infrastructure",
    rationale:
      "Extending existing OpenTelemetry, Jaeger, Prometheus, Grafana and rollout-verification work toward AI-platform-specific signals across model serving, retrieval, agent execution and release automation.",
    previewSummary:
      "AI-specific signals and explicit SLIs across model serving, retrieval and agent execution.",
    topics: [
      "Distributed tracing",
      "Model-serving metrics",
      "Retrieval latency",
      "Token usage",
      "Agent traces",
      "Tool-call traces",
      "Rollout metrics",
      "Failure classification",
      "SLOs / SLIs",
      "Alerting",
      "Evaluation telemetry",
    ],
    evidenceTarget:
      "Define and validate an observable AI service workflow with end-to-end traces, platform metrics, failure classification and a small set of explicit SLIs.",
    connectedProjectIds: [
      "modelops-control-plane",
      "knowledge-base-rag",
      "agentic-customer-service-platform",
    ],
    connectedAreaIds: ["ai-ml-platform", "generative-ai-rag"],
    connectedLearningIds: [],
  },
  {
    id: "distributed-systems-reliability",
    title: "Distributed Systems & Reliability",
    status: "learning",
    area: "Software Systems Engineering",
    maturityLabel: "Deepening",
    rationale:
      "At-least-once delivery, idempotent consumers, bounded retries and a transactional outbox are already implemented and benchmarked in the commerce platform. The open direction is deeper: reasoning explicitly about partial failure — what a service should do when a workflow fails halfway, when eventual consistency is an acceptable trade-off rather than a shortcut, and where a retry helps versus where it turns a transient failure into a duplicate or a cascading one.",
    previewSummary:
      "Engineering explicit failure scenarios — partial failure, duplicate delivery, retry storms — beyond the happy path.",
    topics: [
      "Queues and asynchronous processing",
      "Retries and retry boundaries",
      "Idempotency",
      "Consistency models",
      "Backpressure",
      "Failure recovery",
    ],
    evidenceTarget:
      "Extend the commerce platform's failure-injection surface with explicit failure-scenario tests — partial workflow failure, duplicate delivery, retry storms and consistency-window violations — each with a reproducible before/after outcome, not just a passing happy-path suite.",
    connectedProjectIds: ["real-time-commerce-platform"],
    connectedAreaIds: ["distributed-systems"],
    connectedLearningIds: [],
  },
  {
    id: "concurrency-performance-engineering",
    title: "Concurrency & Performance Engineering",
    status: "learning",
    area: "Software Systems Engineering",
    maturityLabel: "Building",
    rationale:
      "Locust-driven load testing and query-plan-driven latency optimization already produced measured, reproducible numbers on the commerce platform and the ModelOps benchmark suite. The open direction is treating concurrency itself as an engineering variable: profiling to find where time is actually spent, distinguishing CPU-bound from I/O-bound from contention-bound workloads, and learning Go's goroutine and channel model as a second concurrency substrate to reason against Python's.",
    previewSummary:
      "Profiling-driven performance work: finding the actual bottleneck, not just measuring throughput.",
    topics: [
      "Concurrency and parallelism",
      "Go goroutines and channels",
      "Profiling",
      "Benchmarking",
      "Load testing",
      "Bottleneck analysis",
    ],
    evidenceTarget:
      "Produce reproducible benchmarks and profiling reports — before/after comparisons under load, with the saturated resource identified — rather than reporting a single throughput number without its bottleneck.",
    connectedProjectIds: ["real-time-commerce-platform", "modelops-control-plane"],
    connectedAreaIds: ["distributed-systems", "ai-ml-platform"],
    connectedLearningIds: [],
  },
  {
    id: "systems-api-engineering",
    title: "Systems & API Engineering",
    status: "learning",
    area: "Software Systems Engineering",
    maturityLabel: "Exploring",
    rationale:
      "FastAPI service boundaries, PostgreSQL transactional writes and idempotency-key design are already implemented across the agent, ModelOps and commerce platforms. The open direction moves underneath the endpoint: HTTP connection and timeout behavior, gRPC as an alternative to REST for internal service communication, transaction isolation levels and connection pooling, and the operating-system behavior a production service actually runs on top of.",
    previewSummary:
      "Moving beneath the endpoint: connection behavior, transaction isolation, REST vs. gRPC trade-offs.",
    topics: [
      "HTTP internals",
      "gRPC",
      "Networking fundamentals",
      "Database transactions",
      "Linux",
    ],
    evidenceTarget:
      "Implement, benchmark and document concrete service-level trade-offs — REST vs. gRPC for an internal call path, transaction isolation levels under concurrent writes, connection-pool behavior under load — rather than treating any of them as a fixed default.",
    connectedProjectIds: [
      "agentic-customer-service-platform",
      "modelops-control-plane",
      "real-time-commerce-platform",
    ],
    connectedAreaIds: ["ai-ml-platform", "distributed-systems"],
    connectedLearningIds: [],
  },
] satisfies readonly LearningItem[];
