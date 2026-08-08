import type { Experience } from "@/lib/content/types";

export const experiences = [
  {
    id: "fibabanka",
    company: "Fibabanka",
    team: "Analytics Center of Excellence",
    role: "MLOps & Analytics Engineer",
    period: "Mar 2023 — Mar 2026",
    location: "Istanbul, Türkiye",
    summary:
      "Built and operated production ML, data and Generative AI platform capabilities across analytics workloads.",
    impacts: [
      {
        id: "data-platform",
        title: "Data Platform",
        summary:
          "Re-architected sequential Oracle ETL workflows into modular parallel dbt pipelines.",
        proof: "120 min → 30 min · 75% reduction",
        topics: ["Oracle", "dbt", "ETL / ELT", "Parallel execution"],
      },
      {
        id: "ml-platform",
        title: "ML Platform",
        summary:
          "Owned deployment and lifecycle management for 10+ production ML models.",
        proof: "10+ production ML models",
        topics: ["Validation", "Versioning", "Promotion", "Serving", "Retraining", "Monitoring"],
      },
      {
        id: "feature-platform",
        title: "Feature Platform",
        summary:
          "Built a centralized feature store and dimensional models used by 10+ production ML models.",
        topics: ["Feature store", "Dimensional modeling", "Reusable features"],
      },
      {
        id: "data-scale",
        title: "Data Scale",
        summary:
          "Engineered batch and near-real-time training, inference and analytics pipelines.",
        proof: "~9M records / day",
        topics: ["Batch pipelines", "Near-real-time", "Training", "Inference", "Analytics"],
      },
      {
        id: "ai-infrastructure",
        title: "AI Infrastructure",
        summary:
          "Moved validated Azure prototypes to on-premises GPU infrastructure for private open-source model serving.",
        topics: ["Azure", "On-prem GPU", "llama.cpp", "Ollama", "LangChain"],
      },
      {
        id: "call-center-intelligence",
        title: "Call-Center Intelligence",
        summary:
          "Built an audio intelligence pipeline from transcription and diarization through structured operational outputs.",
        proof: "~9,000 recordings / day",
        topics: [
          "WhisperX",
          "Timestamp alignment",
          "Speaker diarization",
          "LLM summarization",
          "Structured outputs",
          "Operational KPIs",
        ],
      },
      {
        id: "quality-monitoring",
        title: "Quality & Monitoring",
        summary:
          "Implemented data quality, model validation and delivery workflows around production analytics systems.",
        topics: ["Great Expectations", "Deepchecks", "Airflow", "GitHub Actions"],
      },
    ],
  },
] satisfies readonly Experience[];
