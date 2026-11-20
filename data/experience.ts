import type { Experience } from "@/lib/content/types";

// Figures follow the résumé at public/resume/omer-faruk-koc-resume.pdf.
export const experiences = [
  {
    id: "fibabanka",
    company: "Fibabanka",
    team: "Analytics Center of Excellence",
    role: "AI & MLOps Engineer",
    period: "Mar 2023 — Mar 2026",
    location: "Istanbul, Türkiye",
    summary:
      "Ran production machine learning, built Generative AI workflows and the infrastructure under both: 10 production ML models, 5 production LLM workflows and private LLM serving on the bank's own GPUs.",
    impacts: [
      {
        id: "ml-platform",
        area: "ML platform",
        title: "Production ML Platform",
        context:
          "As production ML use cases grew, validation, promotion, serving, retraining and monitoring had to work the same way for every model.",
        summary:
          "Owned deployment and lifecycle management for 10 production ML models on Iguazio/MLRun, Docker and Kubernetes, each served as a containerized FastAPI inference service.",
        proof: {
          label: "Models in production",
          value: "10 production models",
          scope: "Iguazio/MLRun, Docker, Kubernetes, FastAPI",
          qualifier:
            "Ownership covered the whole lifecycle rather than a single handoff: validation, versioning, promotion, retraining, monitoring and serving.",
        },
        topics: ["Iguazio / MLRun", "Kubernetes", "Docker", "FastAPI", "Model monitoring", "Retraining"],
      },
      {
        id: "feature-platform",
        area: "ML platform",
        title: "Feature Platform",
        context:
          "Multiple ML use cases rebuilt overlapping customer features from many source tables, creating duplicated maintenance and definition drift.",
        summary:
          "Built a centralized feature store and reusable batch and near-real-time training, inference and analytics pipelines across Oracle, Trino and SQL Server.",
        proof: {
          label: "Shared feature reuse",
          value: "One definition per feature",
          scope: "Oracle, Trino and SQL Server sources",
          qualifier:
            "Shared feature definitions, data-quality validation and production data contracts replaced per-model reimplementation of the same customer attributes.",
        },
        topics: ["Feature store", "Dimensional modeling", "Oracle", "Trino", "SQL Server", "Data contracts"],
      },
      {
        id: "quality-monitoring",
        area: "ML platform",
        title: "Quality & Monitoring",
        context:
          "Without pipeline-level validation, data and model regressions could surface late in downstream reports.",
        summary:
          "Implemented data quality, model validation and delivery workflows around the production models.",
        proof: {
          label: "Failure detection point",
          value: "Checks in the pipeline, not the report",
          scope: "Data quality and model validation gates",
          qualifier:
            "Great Expectations and Deepchecks checks run as part of the Airflow pipelines and GitHub Actions delivery workflow, so data and model regressions are caught where they occur.",
        },
        topics: ["Great Expectations", "Deepchecks", "Airflow", "GitHub Actions"],
      },
      {
        id: "llm-workflows",
        area: "Generative AI",
        title: "RAG & Document Intelligence",
        context:
          "Internal teams needed answers and structured data from documents that could not leave the bank.",
        summary:
          "Built RAG and document-intelligence workflows combining embeddings, retrieval, grounded LLM processing, structured outputs and API integration into internal AI applications.",
        proof: {
          label: "LLM workflows in production",
          value: "5 production LLM workflows",
          scope: "Contributed across internal AI applications",
          qualifier:
            "Retrieval, grounded generation and structured extraction were delivered as APIs that internal applications call, with sensitive data kept on premises.",
        },
        topics: ["RAG", "Embeddings", "Document intelligence", "Structured outputs", "LangChain", "APIs"],
      },
      {
        id: "call-center-intelligence",
        area: "Generative AI",
        title: "Call-Center Intelligence",
        context:
          "Call recordings contained valuable operational signal but were expensive to inspect manually and difficult to reuse consistently.",
        summary:
          "Engineered call-center intelligence workflows that turn recorded calls into structured KPIs with WhisperX transcription, speaker diarization and LLM analysis.",
        proof: {
          label: "Processing architecture",
          value: "Audio to structured KPIs",
          scope: "GPU-distributed daily processing",
          qualifier:
            "Transcription with WhisperX, timestamp alignment and speaker diarization, then LLM analysis into structured fields that feed operational KPIs, with data-quality monitoring on the output.",
        },
        topics: ["WhisperX", "Speaker diarization", "LLM analysis", "Structured outputs", "Operational KPIs"],
      },
      {
        id: "ai-infrastructure",
        area: "Infrastructure and data",
        title: "On-Premises AI Infrastructure",
        context:
          "Generative AI prototypes validated in Azure had to run under the bank's security and data-residency requirements.",
        summary:
          "Moved validated Azure prototypes to on-premises GPU infrastructure, serving quantized open-source LLMs and internal inference endpoints.",
        proof: {
          label: "Private model serving",
          value: "On-premises GPU serving",
          scope: "Azure prototype to in-house GPU cluster",
          qualifier:
            "Quantized open-source models and internal inference endpoints ran on the bank's own GPUs, so sensitive banking data stayed on premises.",
        },
        topics: ["Azure", "On-prem GPU", "Quantized LLMs", "llama.cpp", "vLLM", "Inference endpoints"],
      },
      {
        id: "data-platform",
        area: "Infrastructure and data",
        title: "Data Platform",
        context:
          "As the core Oracle feature-engineering workflow grew, sequential execution constrained the batch window, dependency visibility and change isolation.",
        summary:
          "Re-architected sequential Oracle feature-engineering procedures into parallel dbt and Apache Airflow pipelines.",
        proof: {
          label: "Feature-engineering runtime",
          value: "2–3 hours to 25–30 minutes",
          scope: "Sequential Oracle procedures to parallel dbt + Airflow",
          qualifier:
            "Splitting monolithic sequential procedures into modular dbt models that run in parallel under Airflow cut end-to-end processing while improving orchestration and visibility.",
        },
        topics: ["Oracle", "dbt", "Airflow", "ETL / ELT", "Parallel execution"],
      },
    ],
  },
] satisfies readonly Experience[];
