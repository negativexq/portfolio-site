import type { Metric } from "@/lib/content/types";

export const metrics = [
  {
    value: "3+ YEARS",
    label: "Production AI/ML",
    context: "Experience",
    detail: "Professional experience across ML, data and GenAI systems.",
  },
  {
    value: "PRODUCTION ML",
    label: "End-to-end lifecycle",
    context: "Lifecycle",
    detail: "Owned validation, promotion, serving, retraining and monitoring across multiple analytics use cases.",
  },
  {
    value: "LARGE-SCALE DATA",
    label: "Customer-level ML datasets",
    context: "Scale",
    detail: "Batch and near-real-time pipelines consolidating multiple source systems into reusable training, inference and analytics datasets.",
  },
  {
    value: "75% RUNTIME REDUCTION",
    label: "Core ETL workflow",
    context: "Performance",
    detail: "Sequential Oracle ETL re-architected into modular parallel dbt workflows, reducing end-to-end runtime by 75%.",
  },
] satisfies readonly Metric[];
