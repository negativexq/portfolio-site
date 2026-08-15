import type { EngineeringArea } from "@/lib/content/types";

export const engineeringAreas = [
  {
    id: "ai-ml-platform",
    title: "AI / ML Platform",
    description:
      "Model lifecycle, progressive delivery, delayed quality feedback, policy-driven release control and observable production operations.",
    technologies: ["FastAPI", "Docker", "Kubernetes", "MLRun", "GitHub Actions"],
    evidenceProjectIds: ["modelops-control-plane"],
    evidenceExperienceIds: ["fibabanka"],
  },
  {
    id: "generative-ai-rag",
    title: "Generative AI / RAG",
    description:
      "Retrieval, reranking, citation integrity, evaluation and private open-source model serving.",
    technologies: ["Qdrant", "Ollama", "OpenTelemetry", "DeepEval", "LangChain"],
    evidenceProjectIds: [
      "knowledge-base-rag",
      "agentic-customer-service-platform",
      "production-rag-platform",
    ],
    evidenceExperienceIds: ["fibabanka"],
  },
  {
    id: "distributed-systems",
    title: "Distributed Systems",
    description:
      "Event processing with explicit delivery guarantees, failure handling and measured service limits.",
    technologies: ["Kafka", "PostgreSQL", "Redis", "Prometheus", "Grafana"],
    evidenceProjectIds: ["real-time-commerce-platform"],
    evidenceExperienceIds: [],
  },
  {
    id: "data-engineering",
    title: "Data Engineering",
    description:
      "Batch and near-real-time pipelines, transformation systems, quality controls and data lineage.",
    technologies: ["dbt", "Airflow", "Oracle", "sqlglot", "NetworkX"],
    evidenceProjectIds: ["dbt-feature-lineage", "real-time-commerce-platform"],
    evidenceExperienceIds: ["fibabanka"],
  },
  {
    id: "agent-infrastructure",
    title: "Agent Systems / Agent Infrastructure",
    description:
      "Stateful agent workflows with deterministic control boundaries, confirmation and recovery, secure tool interfaces, evaluation and observability.",
    technologies: ["LangGraph", "MCP", "FastMCP", "PostgreSQL", "OpenTelemetry"],
    evidenceProjectIds: ["agentic-customer-service-platform", "repo-context-forge"],
    evidenceExperienceIds: [],
  },
] satisfies readonly EngineeringArea[];
