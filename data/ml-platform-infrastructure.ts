export const mlPlatformInfrastructureProjectUrl = "https://omerfkoc.dev/projects/ml-platform-infrastructure";

export const mlPlatformInfrastructureMeta = {
  keywords: ["ML platform", "ML control plane", "Kubernetes", "KServe", "Argo Workflows", "MLflow", "inference gateway", "canary rollout", "OIDC", "LLM serving", "Batch inference", "Dataset lineage", "Model monitoring", "Go gateway"],
} as const;

export const mlPlatformInfrastructureCapabilities = [
  { title: "Projects and access", items: ["Project namespaces, resource quotas and GPU budgets", "OIDC sign-in with user and group memberships", "Invoker, viewer, operator and admin roles with fail-closed policy and audit"] },
  { title: "Data and recurring execution", items: ["Cron schedules with timezone, concurrency and missed-run policies", "Typed parameters and immutable execution snapshots", "S3/MinIO connections, versioned CSV/Parquet datasets and recorded lineage"] },
  { title: "Batch inference and model quality", items: ["Pinned model manifests, bounded scoring and versioned prediction outputs", "PSI and missing-rate drift; regression and classification quality reports", "Dataset-triggered monitoring with date-matched feedback and restart-safe intent"] },
  { title: "Training and model lifecycle", items: ["Argo Workflows jobs and multi-step pipeline DAGs", "Run logs, step timelines, retry, cancellation and model lineage", "Evaluation thresholds, candidate/champion promotion and MLflow alias reconciliation"] },
  { title: "Serving and release control", items: ["Immutable deployment revisions and manual rollback", "Canary steps gated on error rate, p95 latency and minimum traffic", "Automatic rollback when a canary fails its release gates"] },
  { title: "LLMs and functions", items: ["Full-commit-pinned Hugging Face versions; GPU/vLLM acceptance remains open", "OpenAI-compatible streaming chat and project GPU quotas", "Container functions with Knative scaling and JSON invoke endpoints"] },
  { title: "Inference gateway", items: ["Go data plane for predict, chat and function traffic; Python rollback option", "Per-caller API keys, endpoint exposure and request/token limits", "Caller usage, request IDs and a consistent error contract"] },
  { title: "Web UI and monitoring", items: ["React workspace for schedules, datasets, lineage, quality reports and serving", "Preview consequential changes before applying them", "Monitor, Grafana, Prometheus and traces from requests through reconcilers"] },
] as const;

export const mlPlatformInfrastructureWorkflow = [
  { label: "Create a project and establish access", detail: "The control plane records the project and memberships; the project reconciler targets a dedicated namespace with quotas, limits and network policy." },
  { label: "Run a training job or pipeline", detail: "A job or DAG becomes desired state. Reconcilers submit Argo workflows and bring run status, steps and failure reasons back into the platform." },
  { label: "Evaluate and promote a version", detail: "Register an MLflow artifact or Hugging Face version, evaluate it against acceptance thresholds, then promote an eligible candidate. Model-alias reconciliation aligns the registry with platform state." },
  { label: "Create an immutable serving revision", detail: "An authorized request checks version eligibility, runtime kind and GPU quota, then commits the revision, desired deployment state and audit context to PostgreSQL." },
  { label: "Reconcile and gate the rollout", detail: "Deployment reconciliation targets KServe readiness. The rollout loop shifts canary traffic, reads revision metrics and advances or rolls back according to its gates." },
  { label: "Expose an endpoint through the gateway", detail: "Callers use scoped API keys or OIDC tokens. The separate gateway resolves ready endpoints, applies limits, forwards or streams the response and records usage." },
] as const;

export const mlPlatformInfrastructureBoundaryRows = [
  { side: "Management plane", items: ["Browser → same-origin API with signed session and CSRF protection", "Project policy controls each management operation", "PostgreSQL owns lifecycle intent and audit", "Reconcilers drive external systems through typed ports"] },
  { side: "Inference data plane", items: ["Callers → separate gateway with API key or OIDC token", "Endpoint exposure and caller scope checked before forwarding", "Request or token budgets applied to calls", "Prediction traffic bypasses the management API"] },
] as const;

export const mlPlatformInfrastructureDesignDecisions = [
  { title: "Commit intent before touching infrastructure", description: "An API request records desired state and returns. Reconcilers compare that intent with external state and apply deterministic resources, so an interrupted operation can be resumed on a later pass." },
  { title: "Separate management from prediction traffic", description: "The control plane governs projects and lifecycle changes. The inference gateway has its own process and pods, allowing prediction traffic and management operations to scale independently." },
  { title: "Keep domain rules behind ports", description: "Domain and application layers import no frameworks or external SDKs. Kubernetes, Argo, MLflow, KServe, Prometheus and identity sit behind adapters; composition roots wire the implementation." },
  { title: "Preserve the release decision", description: "Immutable revisions bind an artifact to its runtime settings. Canary gates assess the candidate revision's error rate, p95 latency and traffic; a failed gate drives rollback instead of declaring a deployment healthy from readiness alone." },
  { title: "Carry identity and trace context through reconciliation", description: "Lifecycle changes retain actor and trace context in durable state. Audit explains who requested the change, while reconciler spans connect asynchronous work back to that request." },
] as const;

export const mlPlatformInfrastructureScreenshots = [
  { src: "/projects/ml-platform-infrastructure/07-model-monitoring.png", width: 1440, height: 1237, alt: "Synthetic Credit Risk quality report with feature drift, missing values, feedback coverage, accuracy and macro F1", caption: "Model monitoring: distinguish drift, coverage and predictive quality" },
  { src: "/projects/ml-platform-infrastructure/04-schedules.png", width: 1440, height: 1020, alt: "Synthetic Credit Risk schedules showing recurring scoring, quality review, timezone and next execution", caption: "Schedules: recurring work with recorded execution history" },
  { src: "/projects/ml-platform-infrastructure/05-dataset-lineage.png", width: 1440, height: 1413, alt: "Synthetic prediction dataset showing immutable versions, schema and recorded input, model, run and output lineage", caption: "Dataset lineage: inspect the identities behind an output" },
  { src: "/projects/ml-platform-infrastructure/06-batch-inference.png", width: 1440, height: 1020, alt: "Synthetic Credit Risk batch inference definition with pinned input and model versions and Parquet output", caption: "Batch inference: bind a model and data to a reproducible run" },
  { src: "/projects/ml-platform-infrastructure/08-pipeline-run.png", width: 1440, height: 1631, alt: "Synthetic completed training pipeline with DAG, step timeline, model lineage and readable execution logs", caption: "Pipeline runs: connect execution steps, logs and model lineage" },
] as const;

export const mlPlatformInfrastructureStackGroups = [
  ["Control plane", "Python + FastAPI, PostgreSQL + SQLAlchemy + Alembic"],
  ["Inference gateway", "Go + PostgreSQL budgets + OpenTelemetry; Python rollback runtime"],
  ["Data and quality", "S3/MinIO catalog, bounded batch workers, PSI and feedback metrics"],
  ["Web workspace", "React + TypeScript, typed OpenAPI client"],
  ["Identity", "OIDC + Keycloak, project roles, signed sessions"],
  ["Training", "Argo Workflows, jobs and pipeline DAGs"],
  ["Models", "MLflow registry + Hugging Face Hub"],
  ["Serving architecture", "KServe + Knative, MLflow server, vLLM and container functions"],
  ["Observability", "OpenTelemetry Collector + Prometheus + Tempo + Grafana"],
  ["Infrastructure", "Kubernetes + Helm + Argo CD; Terraform for EKS, RDS and S3"],
] as const;

export const mlPlatformInfrastructureDeploymentTargets = [
  { area: "Cluster", local: "kind", cloud: "EKS" },
  { area: "Lifecycle database", local: "PostgreSQL", cloud: "RDS PostgreSQL" },
  { area: "Artifacts", local: "MinIO", cloud: "S3" },
  { area: "Images", local: "Local container images", cloud: "ECR" },
  { area: "Identity", local: "Keycloak", cloud: "Organization OIDC provider" },
  { area: "Ingress", local: "ingress-nginx + cert-manager", cloud: "ALB or ingress + ACM" },
] as const;

export const mlPlatformInfrastructureDeepDiveLinks = [
  { label: "Million-row NYC acceptance", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-08/million-row-acceptance/README.md" },
  { label: "Dataset-triggered monitoring evidence", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-08/monitoring-automation/README.md" },
  { label: "Current status and open gates", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/status.md" },
  { label: "Go gateway migration and verification", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/evidence/live-2026-10-07/observability/gateway-go-migration.md" },
  { label: "Scheduling and execution snapshots", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/scheduling.md" },
  { label: "Data catalog and lineage", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/data-catalog.md" },
  { label: "Batch inference contract", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/batch-inference.md" },
  { label: "Model monitoring contract", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/model-monitoring.md" },
  { label: "Platform architecture", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/architecture.md" },
  { label: "Identity and roles", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/identity.md" },
  { label: "Gateway and API keys", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/gateway.md" },
  { label: "Web UI", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/ui.md" },
  { label: "Observability", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/observability.md" },
  { label: "Platform roadmap", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/roadmap.md" },
  { label: "Infrastructure failure drills", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/history/failure-engineering.md" },
  { label: "AWS infrastructure design", href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/history/aws-architecture.md" },
] as const;

export const mlPlatformInfrastructureEngineeringDecisions = [
  {
    title: "Blocking startup hid behind a slow dependency",
    description:
      "Model loading ran on the request path at startup, so a slow artifact store took /health down with it. Fixed by moving model loading to a background thread so liveness and readiness stop being hostage to one dependency's latency.",
  },
  {
    title: "A green rollout still dropped a request",
    description:
      "kubectl rollout status reported success while an external probe measured 1 failure in 90 during a rolling update. The Kubernetes-level signal and the client-observed signal were both correct and still disagreed. Fixed with a preStop hook that drains in-flight connections before the pod terminates.",
  },
  {
    title: "Zero errors and not instrumented looked identical",
    description:
      "A labelled Prometheus counter emits no series until its first increment, so an empty dashboard panel could mean either. Fixed twice with or vector(0), because the first fix did not cover every label combination.",
  },
  {
    title: "The security drill flagged itself",
    description:
      "Pod Security Standards: restricted rejected the drill's own probe pods, and every admission rejection was misread as a NetworkPolicy DENY during the first run. Fixed by making the probe pods themselves PSS-compliant, then rerunning the drill against the real boundary.",
  },
  {
    title: "A memory floor traded against CVEs",
    description:
      "The 297 MiB MLflow image carried 7 unpatched CRITICAL CVEs; every fix landed only in a build with a 1.46 GiB floor. The tradeoff was made explicitly and the larger image was kept, rather than shipping the smaller image with known criticals.",
  },
] as const;

export const mlPlatformInfrastructureFailureScenarios = [
  {
    scenario: "Pod crash",
    observed: "ReplicaSet notices; the surviving replica keeps serving",
    recovery: "replacement ready in 12–15s",
  },
  {
    scenario: "Invalid model artifact",
    observed: "readiness probe returns 503; pod held out of Service endpoints",
    recovery: "Git revert",
  },
  {
    scenario: "Artifact store outage",
    observed: "100% of requests still return 200 while the pod is not ready",
    recovery: "background recheck, 0 restarts",
  },
  {
    scenario: "Config drift",
    observed: "Argo CD marks the app OutOfSync the moment it diverges",
    recovery: "self-heal in ~1.4s",
  },
  {
    scenario: "Bad rollout",
    observed: "maxUnavailable: 0 keeps old replicas serving",
    recovery: "Git revert, bad ReplicaSet pruned",
  },
  {
    scenario: "Node drain with a stateful pod on it",
    observed: "surviving inference pod absorbs traffic",
    recovery: "PostgreSQL / MinIO reschedule automatically",
  },
] as const;

export const mlPlatformInfrastructureEvidence = [
  {
    area: "Load test",
    result: "645,809 requests · 0% errors",
    detail: "k6 against the live cluster; saturated throughput 2,935 req/s at a saturated /predict p95 of 32.9 ms.",
  },
  {
    area: "Autoscaling",
    result: "2 → 6 replicas in 71s",
    detail: "HPA scale-up under load; scale-down back to 2 takes ~230s, stepped rather than immediate.",
  },
  {
    area: "Recovery timing",
    result: "12–15s pod · ~1.4s drift",
    detail: "Pod deleted to replacement serving is 12–15s. Argo CD detects and reconciles config drift in ~1.4s, independent of its ~3 min Git poll.",
  },
  {
    area: "Reproducibility",
    result: "11/11 acceptance · 901s",
    detail: "Cluster, images and build cache destroyed first, then make local-up → make local-test from the repo alone, proven in M11.",
  },
  {
    area: "Failure engineering",
    result: "8 faults injected, not simulated",
    detail: "Run against the live cluster with measured detection and recovery, not described in documentation.",
  },
  {
    area: "Security boundary",
    result: "NetworkPolicy deny verified",
    detail: "inference → PostgreSQL directly is denied and confirmed by test, not assumed from the policy YAML; Pod Security Standards: restricted is enforced.",
  },
] as const;
