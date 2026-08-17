import type { LearningAreaMeta } from "@/lib/content/types";

// Extracted from app/learning/page.tsx so /learning.md can render the same
// per-area "current foundation" / "next direction" copy the page does,
// without a second, independently maintained copy of it.
export const learningAreas: readonly LearningAreaMeta[] = [
  {
    name: "Agent Systems",
    index: "01",
    description: "Orchestration, deterministic policy and durable confirmation are implemented and evaluated; memory governs what persists across steps and future interactions.",
    foundation: "Stateful LangGraph orchestration, deterministic policy and persistent memory",
    direction: "Measured memory relevance, retention and compaction at scale",
  },
  {
    name: "Retrieval & Evaluation",
    index: "02",
    description: "Retrieval finds evidence; context engineering selects and budgets it; GraphRAG adds relationships; evaluation measures whether each change helps.",
    foundation: "Hybrid retrieval, reranking and citation integrity",
    direction: "Context construction, GraphRAG and repeatable evaluation",
  },
  {
    name: "Platform Infrastructure",
    index: "03",
    description: "Infrastructure provisioning, workload orchestration and observability extend containerized AI systems along distinct operational boundaries.",
    foundation: "Containerized services and observable release workflows",
    direction: "Remote state, cloud infrastructure and workload orchestration",
  },
  {
    name: "Software Systems Engineering",
    index: "04",
    description: "Deepening the systems-level engineering foundations behind reliable production AI and distributed applications through failure analysis, measurable performance and explicit service-boundary trade-offs.",
    foundation: "At-least-once delivery, idempotency, load-tested throughput and transactional service boundaries already implemented and measured",
    direction: "Explicit failure-scenario testing, profiling-driven performance work and service-level trade-off benchmarking",
  },
];
