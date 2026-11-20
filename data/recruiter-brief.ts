/**
 * Content for /recruiters, a one-page summary for hiring teams: what I can
 * do, the skills behind it and what each project is for, in plain language.
 * Project entries point at ids in the site data; the page fails the build if
 * one goes stale.
 */
export const recruiterBrief = {
  roles: ["AI Engineer / AI Software Engineer", "AI Platform Engineer", "MLOps / ML Platform Engineer", "LLM / Agent Engineer", "Forward Deployed Engineer"],
  // The five things the projects prove, in the order an AI product is built.
  competencies: [
    {
      title: "Design the product",
      text: "Decide where the model helps and where a person or code decides: review screens, human approval, typed proposals and a workflow the user can follow.",
      evidence: ["customer-journey-composer", "smart-campaign-composer", "knowledge-base-rag"],
    },
    {
      title: "Build the backend",
      text: "Go and Python services with PostgreSQL, Redis and Kafka: data models, APIs, queues, durable workflows and agent orchestration.",
      evidence: ["customer-journey-composer", "agentic-customer-service-platform", "real-time-commerce-platform"],
    },
    {
      title: "Take it to production",
      text: "Kubernetes, model and LLM serving, canary releases, GitOps, access control and tracing, on cloud or on-premises GPUs.",
      evidence: ["ml-platform-infrastructure", "agentic-sre"],
    },
    {
      title: "Measure it",
      text: "Fixed evaluation sets, benchmarks and load tests, with each result tied to a dated run that can be repeated.",
      evidence: ["knowledge-base-rag", "decision-sql", "cause-tune"],
    },
    {
      title: "Make it reliable",
      text: "Idempotency, leases and fencing, transactional outbox, retries and circuit breakers, and deterministic limits on what a model can trigger.",
      evidence: ["agentic-customer-service-platform", "smart-campaign-composer", "agentic-sre"],
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
      id: "customer-journey-composer",
      purpose: "Turns a plain-language brief into a multi-day customer journey with waits, branches, email, SMS and push; AI proposes it, a person tests and publishes it, and a Go runtime on PostgreSQL runs it for each customer.",
    },
    {
      id: "smart-campaign-composer",
      purpose: "Turns a marketing brief into a checked audience and multilingual SMS and email, requires human approval, and handles queued delivery, retries and live reporting through a mock provider.",
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
    "Built RAG and document-intelligence workflows combining embeddings, retrieval, grounded LLM processing, structured outputs and API integration into internal AI applications.",
    "Added Great Expectations and Deepchecks gates to Airflow pipelines and GitHub Actions delivery, so data and model regressions fail in the pipeline instead of surfacing in reports.",
  ],
  // Categories follow the résumé; each names the projects where the skills are used.
  skills: [
    {
      area: "Backend and frontend",
      items: ["Python", "Go", "SQL", "FastAPI", "Pydantic", "SQLAlchemy", "REST APIs", "PostgreSQL", "Redis", "Kafka", "React", "Vue", "TypeScript", "Next.js"],
      evidence: ["customer-journey-composer", "agentic-customer-service-platform", "real-time-commerce-platform"],
    },
    {
      area: "Generative AI and agents",
      items: ["LangGraph", "PydanticAI", "LangChain", "MCP / FastMCP", "Tool calling", "Human-in-the-loop", "Structured outputs", "Context engineering", "RAG", "Qdrant", "Hybrid search", "BM25", "Reranking"],
      evidence: ["knowledge-base-rag", "agentic-customer-service-platform", "repo-context-forge"],
    },
    {
      area: "LLM evaluation and ML",
      items: ["Langfuse", "DeepEval", "LLM evaluation", "Guardrails", "Prompt injection defense", "PyTorch", "Hugging Face Transformers", "PEFT", "LoRA / QLoRA", "Fine-tuning", "WhisperX", "Speaker diarization"],
      evidence: ["knowledge-base-rag", "cause-tune", "agentic-customer-service-platform"],
    },
    {
      area: "AI platforms and MLOps",
      items: ["Kubernetes", "Docker", "Iguazio / MLRun", "MLflow", "KServe", "Knative", "Argo Workflows", "Argo CD", "Helm", "vLLM", "Ollama", "Model registry", "Feature store", "GPU / LLM serving", "Model monitoring"],
      evidence: ["ml-platform-infrastructure"],
    },
    {
      area: "Data, DevOps and observability",
      items: ["dbt", "Airflow", "Oracle", "Trino", "SQL Server", "Azure", "Linux", "Terraform", "GitHub Actions", "GitOps", "OpenTelemetry", "Prometheus", "Grafana", "Loki", "Tempo", "Jaeger"],
      evidence: ["agentic-sre", "ml-platform-infrastructure", "dbt-feature-lineage"],
    },
    {
      area: "Software engineering and testing",
      items: ["Distributed systems", "Event-driven architecture", "Concurrency", "Idempotency", "Transactional outbox", "Circuit breakers", "Canary releases", "Pytest", "Playwright", "k6", "Integration, E2E and chaos testing"],
      evidence: ["real-time-commerce-platform", "smart-campaign-composer", "customer-journey-composer"],
    },
  ],
} as const;
