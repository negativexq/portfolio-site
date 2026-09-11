export const mlPlatformInfrastructureProjectUrl = "https://omerfkoc.dev/projects/ml-platform-infrastructure";

export const mlPlatformInfrastructureMeta = {
  title: "ML Platform Infrastructure",
  description:
    "A local ML platform reference implementation on Kubernetes: an inference service, its full MLflow/PostgreSQL/MinIO lifecycle, GitOps, autoscaling, security hardening and observability, validated with real failure drills instead of descriptions.",
  keywords: [
    "ML platform infrastructure",
    "Kubernetes",
    "GitOps",
    "Argo CD",
    "MLflow",
    "autoscaling",
    "chaos engineering",
    "SRE",
    "observability",
  ],
} as const;

export const mlPlatformInfrastructureCapabilities = [
  {
    title: "GitOps deployment",
    items: [
      "Git is the source of truth: Helm charts, GitOps manifests, Terraform",
      "Argo CD watches live cluster state continuously, drift reverted in ~1.4s",
      "Argo CD polls Git independently on a ~3 min default cadence",
    ],
  },
  {
    title: "ML lifecycle on Kubernetes",
    items: [
      "Inference service behind a Kubernetes Service, HPA 2↔6 on CPU",
      "MLflow tracking backed by PostgreSQL and MinIO, both StatefulSets with PVCs",
      "Pod Disruption Budget minAvailable=1 keeps the service up during voluntary disruption",
    ],
  },
  {
    title: "Security and observability",
    items: [
      "NetworkPolicy default-deny plus an explicit allow-list, verified not assumed",
      "Pod Security Standards: restricted, enforced cluster-wide",
      "Prometheus scrapes /metrics; Grafana dashboards; Alertmanager with 5 promtool-tested rules",
    ],
  },
] as const;

export const mlPlatformInfrastructureWorkflow = [
  {
    label: "Fresh cluster, nothing pre-existing",
    detail: "make local-up builds a kind cluster, bootstraps GitOps, runs the ML lifecycle and stands up observability from a clean checkout, in roughly 15 minutes.",
  },
  {
    label: "Argo CD applies from Git",
    detail: "Applications platform-local and inference-local are reconciled from helm/, gitops/ and infra/terraform/ — no manual kubectl apply.",
  },
  {
    label: "Two independent reconciliation loops",
    detail: "Argo CD watches live cluster state continuously and self-heals in ~1.4s; it polls Git on its own ~3 min cadence. A manual edit is reverted almost instantly; a Git commit lands on the next poll.",
  },
  {
    label: "Traffic reaches a governed boundary",
    detail: "The inference Service is the only path in. NetworkPolicy denies inference → PostgreSQL directly; the allowed path is inference → MLflow → PostgreSQL / MinIO.",
  },
  {
    label: "Load, faults and recovery are measured, not assumed",
    detail: "k6 load tests, HPA scale events, pod deletion, Argo drift, and 8 injected faults are run against the live cluster and timed.",
  },
  {
    label: "make local-test closes the loop",
    detail: "An 11-check acceptance suite runs against the live cluster; M11 proved the whole sequence again from a destroyed cluster, images and build cache.",
  },
] as const;

export const mlPlatformInfrastructureBoundaryRows = [
  {
    side: "Allowed",
    items: [
      "inference → MLflow (tracking calls)",
      "MLflow → PostgreSQL (metadata)",
      "MLflow → MinIO (artifacts)",
      "Prometheus → inference /metrics (scrape)",
    ],
  },
  {
    side: "Denied and verified",
    items: [
      "inference → PostgreSQL directly",
      "any pod outside the allow-list → ml-platform namespace",
      "any workload outside Pod Security Standards: restricted",
      "unauthenticated /predict traffic (Service boundary only)",
    ],
  },
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

export const mlPlatformInfrastructureStackGroups = [
  ["Orchestration", "Kubernetes (kind) + Helm + Argo CD"],
  ["ML lifecycle", "MLflow + PostgreSQL + MinIO, StatefulSets with PVCs"],
  ["Inference", "FastAPI inference service, HPA 2↔6, PDB minAvailable=1"],
  ["Observability", "Prometheus + Grafana + Alertmanager, 5 promtool-tested rules"],
  ["Security", "NetworkPolicy default-deny + Pod Security Standards: restricted"],
  ["IaC (design-only)", "Terraform: fmt / validate / tflint, no plan / apply yet"],
  ["Load / verification", "k6 load testing + make local-test 11-check acceptance suite"],
] as const;

export const mlPlatformInfrastructureLimitations = [
  "Status is local-v1.0.0: the local Kubernetes implementation (M0–M12) is validated and frozen. AWS (M13+) has not started — no cloud resource has been created.",
  "Terraform is at the design and static-validation level only (fmt, validate, tflint). No terraform plan or apply has been run against an AWS account.",
  "PostgreSQL and MinIO run single-replica by design; this is an intentionally non-HA local lab, not a claim of production high availability.",
  "Alerting uses static thresholds; there is no burn-rate or error-budget alerting yet.",
  "make local-up and make local-test were proven manually from a destroyed-and-rebuilt environment, but do not yet run automatically in CI.",
  "All committed credentials are disposable local-development defaults (for example MinIO's own upstream minioadmin/minioadmin). No production credentials, cloud secrets or customer data are included.",
] as const;

export const mlPlatformInfrastructureDeepDiveLinks = [
  {
    label: "Milestone roadmap",
    href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/roadmap.md",
  },
  {
    label: "Architecture notes",
    href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/architecture.md",
  },
  {
    label: "Failure engineering",
    href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/failure-engineering.md",
  },
  {
    label: "AWS migration design",
    href: "https://github.com/negativexq/ml-platform-infrastructure/blob/main/docs/aws-architecture.md",
  },
  {
    label: "M0–M12 evidence transcripts",
    href: "https://github.com/negativexq/ml-platform-infrastructure/tree/main/docs/evidence",
  },
] as const;
