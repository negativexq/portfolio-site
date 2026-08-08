import type { Metric } from "@/lib/content/types";

export const metrics = [
  { value: "3+ YEARS", label: "Production AI/ML", context: "Experience" },
  { value: "10+ ML MODELS", label: "Deployed & operated", context: "Lifecycle" },
  { value: "~9M RECORDS / DAY", label: "Data pipelines", context: "Scale" },
  { value: "75% FASTER", label: "Core ETL workflow", context: "Performance" },
] satisfies readonly Metric[];
