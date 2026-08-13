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
        id: "call-center-intelligence",
        title: "Call-Center Intelligence",
        context:
          "Call recordings held operational signal that nobody could query: reviewing them was manual, so the content never reached reporting.",
        summary:
          "Built an audio intelligence pipeline from transcription and diarization through structured operational outputs.",
        proof: {
          label: "Audio pipeline throughput",
          value: "~9,000 recordings / day",
          scope: "Production call-center pipeline",
          qualifier:
            "Daily recording volume processed end to end: transcription with WhisperX, timestamp alignment, speaker diarization, then LLM summarization into structured fields that feed operational KPIs.",
        },
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
        id: "ml-platform",
        title: "ML Platform",
        context:
          "Models were reaching production faster than there was a repeatable way to validate, promote and monitor them.",
        summary:
          "Owned deployment and lifecycle management for 10+ production ML models.",
        proof: {
          label: "Production model ownership",
          value: "10+ production ML models",
          scope: "Full lifecycle ownership",
          qualifier:
            "Ownership covered the lifecycle rather than a single handoff: validation, versioning, promotion, serving, retraining and monitoring across multiple analytics use cases.",
        },
        topics: ["Validation", "Versioning", "Promotion", "Serving", "Retraining", "Monitoring"],
      },
      {
        id: "ai-infrastructure",
        title: "AI Infrastructure",
        context:
          "Generative AI prototypes validated on Azure could not stay there — customer data required the models to run inside the bank.",
        summary:
          "Moved validated Azure prototypes to on-premises GPU infrastructure for private open-source model serving.",
        topics: ["Azure", "On-prem GPU", "llama.cpp", "Ollama", "LangChain"],
      },
      {
        id: "data-platform",
        title: "Data Platform",
        context:
          "The core ETL ran as sequential Oracle procedures, so the workflow's runtime grew with every addition and left no room in the batch window.",
        summary:
          "Re-architected sequential Oracle ETL workflows into modular parallel dbt pipelines.",
        proof: {
          label: "Core ETL runtime",
          value: "120 → 30 min",
          scope: "Sequential Oracle → modular parallel dbt",
          qualifier:
            "End-to-end runtime of the core workflow after splitting monolithic sequential procedures into modular dbt models that execute in parallel — a 75% reduction.",
        },
        topics: ["Oracle", "dbt", "ETL / ELT", "Parallel execution"],
      },
      {
        id: "feature-platform",
        title: "Feature Platform",
        context:
          "Every model rebuilt the same customer features in its own pipeline, so definitions drifted apart between use cases.",
        summary:
          "Built a centralized feature store and dimensional models used by 10+ production ML models.",
        proof: {
          label: "Shared feature reuse",
          value: "One definition per feature",
          scope: "Centralized store across 10+ models",
          qualifier:
            "Features and dimensional models were defined once and consumed by the production models, replacing per-model reimplementation of the same customer attributes.",
        },
        topics: ["Feature store", "Dimensional modeling", "Reusable features"],
      },
      {
        id: "data-scale",
        title: "Data Scale",
        context:
          "Training, inference and analytics all needed the same customer-level view, assembled from many separate source tables.",
        summary:
          "Engineered batch and near-real-time training, inference and analytics pipelines.",
        proof: {
          label: "Customer-level coverage",
          value: "~9M customers",
          scope: "Customer-level output tables",
          qualifier:
            "The pipelines consolidate many upstream source tables into customer-level tables covering the full ~9M customer base. This is the coverage of the produced tables, not a per-day record throughput.",
        },
        topics: ["Batch pipelines", "Near-real-time", "Training", "Inference", "Analytics"],
      },
      {
        id: "quality-monitoring",
        title: "Quality & Monitoring",
        context:
          "Pipeline and model failures surfaced downstream as wrong numbers in reports rather than as an alert at the point of failure.",
        summary:
          "Implemented data quality, model validation and delivery workflows around production analytics systems.",
        proof: {
          label: "Failure detection point",
          value: "Checks in the pipeline, not the report",
          scope: "Data quality + model validation gates",
          qualifier:
            "Great Expectations and Deepchecks checks run as part of the Airflow pipelines and GitHub Actions delivery workflow, so data and model regressions are caught where they occur instead of being discovered in downstream analytics.",
        },
        topics: ["Great Expectations", "Deepchecks", "Airflow", "GitHub Actions"],
      },
    ],
  },
] satisfies readonly Experience[];
