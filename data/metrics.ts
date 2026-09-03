import type { Metric } from "@/lib/content/types";

export const metrics = [
  {
    value: "3+ YEARS",
    label: "Production AI/ML",
    context: "Experience",
    detail: "Professional experience across ML, data and GenAI systems.",
  },
  {
    value: "75% RUNTIME REDUCTION",
    label: "Core data workflow",
    context: "Performance",
    detail: "Sequential Oracle processing was re-architected into modular parallel dbt workflows, reducing end-to-end runtime by 75%.",
  },
  {
    value: "END-TO-END ML",
    label: "Lifecycle ownership",
    context: "Production",
    detail: "Owned validation, versioning, promotion, serving, retraining and monitoring across multiple production ML use cases.",
  },
  {
    value: "PRIVATE GENAI",
    label: "On-prem GPU serving",
    context: "Infrastructure",
    detail: "Adapted validated cloud prototypes to private GPU infrastructure for quantized open-source model serving under data-residency constraints.",
  },
] satisfies readonly Metric[];
