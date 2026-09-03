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
          "Call recordings contained valuable operational signal but were expensive to inspect manually and difficult to reuse consistently in analytics.",
        summary:
          "Built a GPU-distributed, high-volume audio intelligence pipeline from transcription and diarization through structured operational outputs.",
        proof: {
          label: "Processing architecture",
          value: "GPU-DISTRIBUTED",
          scope: "High-volume daily processing",
          qualifier:
            "A GPU-distributed pipeline handled high-volume daily processing end to end: transcription with WhisperX, timestamp alignment, speaker diarization, then LLM summarization into structured fields that feed operational KPIs.",
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
          "As production ML use cases expanded, validation, promotion, serving, retraining and monitoring became a shared platform concern.",
        summary:
          "Owned deployment and lifecycle management across multiple production ML use cases.",
        proof: {
          label: "Production ML ownership",
          value: "END-TO-END LIFECYCLE",
          scope: "Multiple analytics use cases",
          qualifier:
            "Ownership covered the lifecycle rather than a single handoff: validation, versioning, promotion, serving, retraining and monitoring across multiple analytics use cases.",
        },
        topics: ["Validation", "Versioning", "Promotion", "Serving", "Retraining", "Monitoring"],
      },
      {
        id: "ai-infrastructure",
        title: "AI Infrastructure",
        context:
          "Generative AI prototypes validated in Azure required data-residency-aware serving and private infrastructure constraints.",
        summary:
          "Moved validated Azure prototypes to on-premises GPU infrastructure for private open-source model serving.",
        topics: ["Azure", "On-prem GPU", "llama.cpp", "Ollama", "LangChain"],
      },
      {
        id: "data-platform",
        title: "Data Platform",
        context:
          "As the core Oracle workflow grew, sequential execution increasingly constrained the batch window, dependency visibility and change isolation.",
        summary:
          "Re-architected sequential Oracle ETL workflows into modular parallel dbt pipelines.",
        proof: {
          label: "Core ETL impact",
          value: "75% RUNTIME REDUCTION",
          scope: "Sequential Oracle → modular parallel dbt",
          qualifier:
            "End-to-end runtime of the core workflow fell by 75% after splitting monolithic sequential procedures into modular dbt models that execute in parallel.",
        },
        topics: ["Oracle", "dbt", "ETL / ELT", "Parallel execution"],
      },
      {
        id: "feature-platform",
        title: "Feature Platform",
        context:
          "Multiple ML use cases independently rebuilt overlapping customer features, creating duplicated maintenance and definition drift.",
        summary:
          "Built a centralized feature store and dimensional models for reusable production ML features.",
        proof: {
          label: "Shared feature reuse",
          value: "One definition per feature",
          scope: "Centralized reuse across production ML use cases",
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
          value: "LARGE-SCALE COVERAGE",
          scope: "Multi-source batch + near-real-time datasets",
          qualifier:
            "Batch and near-real-time pipelines consolidate multiple upstream source systems into customer-level datasets for training, inference and analytics.",
        },
        topics: ["Batch pipelines", "Near-real-time", "Training", "Inference", "Analytics"],
      },
      {
        id: "quality-monitoring",
        title: "Quality & Monitoring",
        context:
          "Without pipeline-level validation, data and model regressions could surface late in downstream analytics.",
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
