import type { Metric } from "@/lib/content/types";

// Career figures follow the résumé.
export const metrics = [
  {
    value: "3+ years",
    label: "Production AI/ML",
    context: "Experience",
    detail: "Professional experience across ML, Generative AI and data systems in financial services.",
  },
  {
    value: "10",
    label: "Production ML models",
    context: "ML platform",
    detail: "Owned deployment and lifecycle on Iguazio/MLRun, Docker and Kubernetes: validation, versioning, promotion, retraining, monitoring and FastAPI serving.",
  },
  {
    value: "5",
    label: "Production LLM workflows",
    context: "Generative AI",
    detail: "Contributed to five LLM workflows running in production at the bank, alongside RAG and document-intelligence work.",
  },
  {
    value: "25–30 min",
    label: "Down from 2–3 hours",
    context: "Data platform",
    detail: "Sequential Oracle feature-engineering procedures re-architected into parallel dbt and Airflow pipelines.",
  },
] satisfies readonly Metric[];
