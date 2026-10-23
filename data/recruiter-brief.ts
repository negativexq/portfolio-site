/**
 * Content for /recruiters, a one-page summary for hiring teams: what I can
 * do, the skills behind it and what each project is for, in plain language.
 * Project entries point at ids in the site data; the page fails the build if
 * one goes stale.
 */
export const recruiterBrief = {
  roles: ["MLOps / ML Platform Engineer", "AI Platform Engineer", "LLM / AI Engineer", "Data Engineer"],
  competencies: [
    {
      title: "ML Platform & MLOps",
      text: "Taking models from a notebook to production: training and scoring pipelines, model serving, versioned releases, monitoring and rollback on Kubernetes.",
    },
    {
      title: "LLM, RAG & Agents",
      text: "AI assistants and agents that work with company documents and tools, where code checks what the model produces before anything is used.",
    },
    {
      title: "AI Reliability & Observability",
      text: "Keeping AI systems dependable in production: evaluation on fixed test sets, a trace for every model call, release gates and safe failure.",
    },
    {
      title: "Data Engineering",
      text: "Batch and streaming pipelines with Kafka, dbt and SQL, with data quality checks and feature definitions shared across models.",
    },
  ],
  projects: [
    {
      id: "ml-platform-infrastructure",
      purpose: "A self-hosted platform for running ML on Kubernetes: scheduled scoring jobs, versioned datasets, model monitoring and serving.",
    },
    {
      id: "agentic-customer-service-platform",
      purpose: "Lets an AI agent handle refunds, cancellations and support tickets safely: the model suggests the action, code checks the rules and the customer confirms before anything runs.",
    },
    {
      id: "knowledge-base-rag",
      purpose: "Answers questions from long PDFs such as annual reports, 10-K filings and manuals, and shows the exact page each answer comes from.",
    },
    {
      id: "agentic-sre",
      purpose: "Investigates Kubernetes outages and points to the root cause with the evidence behind it, so on-call engineers do not have to dig through logs by hand.",
    },
    {
      id: "decision-sql",
      purpose: "Lets people ask data questions in plain English and get answers from read-only SQL that stays inside their access rules.",
    },
    {
      id: "modelops-control-plane",
      purpose: "Rolls out new model versions gradually, checks their quality on live traffic and rolls them back automatically if they get worse.",
    },
    {
      id: "cause-tune",
      purpose: "Fine-tunes a small open-source language model for a specialist task and tests whether the improvement holds on cases it has never seen.",
    },
    {
      id: "real-time-commerce-platform",
      purpose: "An event-driven order system on Kafka that keeps orders and payments correct even when messages arrive twice or a service fails.",
    },
  ],
  // Figures and tools come from the résumé and the experience data.
  highlights: [
    "Owned deployment and lifecycle for 10 production ML models on Iguazio/MLRun, Docker and Kubernetes: validation, versioning, promotion, retraining, monitoring and containerized FastAPI serving.",
    "Re-architected sequential Oracle feature-engineering workflows into parallel dbt models orchestrated by Airflow, cutting end-to-end processing from 2–3 hours to 25–30 minutes.",
    "Built a centralized feature store and dimensional models across Oracle, Trino and SQL Server, with shared definitions, validation controls and data contracts reused by training, inference and analytics.",
    "Migrated validated Azure GenAI prototypes to on-premises GPU infrastructure, serving quantized open-source LLMs with llama.cpp and vLLM under data-residency constraints; contributed to 5 production LLM workflows.",
    "Built a GPU-distributed call-center pipeline: WhisperX transcription, timestamp alignment, speaker diarization and LLM summarization into structured KPI fields.",
    "Added Great Expectations and Deepchecks gates to Airflow pipelines and GitHub Actions delivery, so data and model regressions fail in the pipeline instead of surfacing in reports.",
  ],
  skills: [
    { area: "ML platform", items: ["Kubernetes", "KServe", "Argo Workflows", "MLflow", "Helm", "Terraform", "Docker"] },
    { area: "LLM & agents", items: ["PydanticAI", "LangGraph", "LangChain", "Qdrant", "vLLM", "Ollama", "QLoRA", "PyTorch"] },
    { area: "Data", items: ["Kafka", "dbt", "Airflow", "PostgreSQL", "Oracle", "Redis"] },
    { area: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "Langfuse", "Jaeger"] },
    { area: "Languages & APIs", items: ["Python", "Go", "SQL", "FastAPI", "gRPC"] },
  ],
} as const;
