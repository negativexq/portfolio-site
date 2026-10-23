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
  // Written for a recruiter's first read; the figures come from the résumé.
  highlights: [
    "Owned 10 production ML models end to end on Kubernetes: validation, versioning, release, serving, retraining and monitoring.",
    "Cut feature processing from 2–3 hours to 25–30 minutes by rebuilding sequential Oracle workflows as parallel dbt and Airflow pipelines.",
    "Took generative AI from Azure prototypes to on-premises GPUs, serving open-source LLMs under strict data-residency and security rules, and contributed to 5 production LLM workflows.",
    "Built a pipeline that turns call recordings into operational KPIs: transcription, speaker separation, LLM analysis and monitoring.",
    "Replaced feature logic duplicated across models with one shared, validated feature platform for training, inference and analytics.",
  ],
  skills: [
    { area: "ML platform", items: ["Kubernetes", "KServe", "Argo Workflows", "MLflow", "Helm", "Terraform", "Docker"] },
    { area: "LLM & agents", items: ["PydanticAI", "LangGraph", "LangChain", "Qdrant", "vLLM", "Ollama", "QLoRA", "PyTorch"] },
    { area: "Data", items: ["Kafka", "dbt", "Airflow", "PostgreSQL", "Oracle", "Redis"] },
    { area: "Observability", items: ["OpenTelemetry", "Prometheus", "Grafana", "Langfuse", "Jaeger"] },
    { area: "Languages & APIs", items: ["Python", "Go", "SQL", "FastAPI", "gRPC"] },
  ],
} as const;
