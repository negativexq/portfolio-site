import type { Metric } from "@/lib/content/types";

export const metrics = [
  {
    value: "3+ YEARS",
    label: "Production AI/ML",
    context: "Experience",
    detail: "Professional experience across ML, data and GenAI systems.",
  },
  {
    value: "10+ ML MODELS",
    label: "Deployed & operated",
    context: "Lifecycle",
    detail: "Production ML lifecycle ownership across multiple analytics use cases.",
  },
  {
    value: "~9M CUSTOMERS",
    label: "Customer-level tables",
    context: "Scale",
    detail: "Batch and near-real-time pipelines consolidating many source tables into customer-level training, inference and analytics tables.",
  },
  {
    value: "75% RUNTIME REDUCTION",
    label: "Core ETL workflow",
    context: "Performance",
    detail: "Sequential Oracle ETL re-architected with modular parallel dbt: 120 → 30 min.",
  },
] satisfies readonly Metric[];
