export const modelOpsProjectUrl = "https://omerfkoc.dev/projects/modelops-control-plane";

export const modelOpsMeta = {
  title: "ModelOps Control Plane",
  description:
    "Policy-driven ML release control plane for progressive canary traffic, delayed ground-truth quality gates, automated promotion and rollback, and desired-versus-observed router reconciliation.",
  image: "/projects/modelops-control-plane/deployment-detail.png",
  imageAlt: "ModelOps deployment detail showing canary traffic, quality metrics and desired versus observed router revision.",
  keywords: [
    "ModelOps control plane",
    "policy-driven model promotion",
    "canary deployment",
    "delayed ground truth",
    "automated rollback",
    "desired observed reconciliation",
  ],
} as const;

export const modelOpsCapabilities = [
  {
    title: "Progressive delivery",
    items: [
      "Weighted stable/canary routing",
      "10% → 25% → 50% → 100% traffic stages",
      "Promotion and rollback through explicit state transitions",
    ],
  },
  {
    title: "Evidence-aware policy",
    items: [
      "Latency and error-rate reliability checks",
      "Delayed ground-truth label ingestion by prediction_id",
      "Matured quality windows with coverage and positive-label gates",
    ],
  },
  {
    title: "Control loop and operations",
    items: [
      "Stateless worker using the same API as an operator",
      "Desired-versus-observed router reconciliation",
      "Explainable deployment timeline and manual automation hold",
    ],
  },
] as const;

export const modelOpsWorkflow = [
  {
    label: "Candidate at 10%",
    detail: "A new model version enters a weighted canary rollout while the stable version keeps the remaining traffic.",
  },
  {
    label: "Two windows, two questions",
    detail: "Fresh traffic measures reliability; an older matured window gives delayed ground truth time to arrive before quality is judged.",
  },
  {
    label: "Not enough evidence yet",
    detail: "Missing label coverage or too few positive labels produces INCONCLUSIVE. The worker does not mistake a thin sample for a healthy model.",
  },
  {
    label: "Quality signal becomes decisive",
    detail: "Once sufficiency gates pass, minimum_recall can genuinely resolve to PASS or FAIL using labels joined to the exact prediction_id.",
  },
  {
    label: "Worker acts through the control plane",
    detail: "PASS advances 10% → 25% → 50% → 100%; FAIL triggers rollback; INCONCLUSIVE freezes for human review.",
  },
  {
    label: "Timeline records why",
    detail: "Policy snapshots, state transitions and worker actions form one chronological audit story instead of a final status without context.",
  },
] as const;

export const modelOpsControlPlaneRows = [
  {
    side: "Control plane owns",
    items: [
      "Desired traffic allocation",
      "Deployment state machine and revisions",
      "Policy thresholds and verdict precedence",
      "Ground-truth label storage and quality joins",
      "Promotion, rollback, freeze and reconciliation",
      "Audit timeline and operator holds",
    ],
  },
  {
    side: "Serving / router owns",
    items: [
      "Version → host mapping",
      "Weighted request routing",
      "Prediction execution and prediction_id",
      "Observed in-memory router configuration",
      "Health and readiness of model targets",
      "Error when the selected target is unavailable, with no silent fallback",
    ],
  },
] as const;

export const modelOpsEngineeringDecisions = [
  {
    title: "Delayed labels are evidence, not a backfill detail",
    description:
      "Predictions mint a stable prediction_id and labels arrive through a separate idempotent API. GroundTruthLabel is written even when its metric has not arrived yet, then both are joined at read time. Quality gates wait for label coverage and minimum positive labels before trusting recall.",
  },
  {
    title: "PASS, FAIL and INCONCLUSIVE are different states",
    description:
      "Reliability and quality checks produce explicit persisted evaluations. FAIL beats INCONCLUSIVE, which beats PASS; insufficient evidence cannot silently become approval, and a frozen rollout remains visible for human resolution.",
  },
  {
    title: "Desired state converges to observed state",
    description:
      "The database commits the desired allocation first. The router receives a best-effort push and keeps only observed in-memory state. A worker-triggered reconcile tick compares revisions and repairs drift after a router restart or transient push failure.",
  },
  {
    title: "Concurrency and stale writes are rejected",
    description:
      "Optimistic concurrency, a partial unique index for one unresolved deployment per model, and model-scoped routing generations prevent concurrent actions or delayed pushes from corrupting the rollout currently in charge.",
  },
] as const;

export const modelOpsScreenshots = [
  {
    src: "/projects/modelops-control-plane/deployment-detail.png",
    alt: "ModelOps deployment detail showing stable and canary traffic distribution, latency and error metrics, quality labels, and desired versus observed revision.",
    caption:
      "Deployment detail: traffic split, delayed-label quality evidence and desired-versus-observed router revision appear together on the rollout surface.",
    source: "docs/screenshots/deployment-detail.png",
    sourceUrl:
      "https://github.com/negativexq/modelops-control-plane/blob/main/docs/screenshots/deployment-detail.png",
    width: 1280,
    height: 1500,
  },
  {
    src: "/projects/modelops-control-plane/timeline-quality-rollback.png",
    alt: "ModelOps timeline showing policy checks, a minimum recall failure, automatic state transitions and rollback to stable traffic.",
    caption:
      "Quality rollback: once label sufficiency clears, minimum_recall fails and the worker rolls back the weak canary without a manual action.",
    source: "docs/screenshots/timeline-quality-rollback.png",
    sourceUrl:
      "https://github.com/negativexq/modelops-control-plane/blob/main/docs/screenshots/timeline-quality-rollback.png",
    width: 1200,
    height: 960,
  },
  {
    src: "/projects/modelops-control-plane/timeline-router-reconciled.png",
    alt: "ModelOps timeline showing a router_reconciled event restoring router revision to the database desired revision after a restart.",
    caption:
      "Self-healing routing: a router restart creates drift, then the worker's reconcile tick restores the database's desired revision.",
    source: "docs/screenshots/timeline-router-reconciled.png",
    sourceUrl:
      "https://github.com/negativexq/modelops-control-plane/blob/main/docs/screenshots/timeline-router-reconciled.png",
    width: 1200,
    height: 360,
  },
] as const;

export const modelOpsEvidence = [
  {
    area: "Automated healthy rollout",
    result: "10% → 25% → 50% → 100%",
    detail:
      "A real-stack CI scenario waits for the stateless worker to advance a healthy canary on live routed traffic and delayed labels, then promote it on a genuine minimum_recall PASS.",
  },
  {
    area: "Quality-driven rollback",
    result: "Recall FAIL → automatic rollback",
    detail:
      "A deliberately weak canary follows the same delayed label path; after sufficiency gates clear, minimum_recall fails and the worker rolls the deployment back.",
  },
  {
    area: "Restart-safe routing",
    result: "CI scenarios 5–6",
    detail:
      "The router is restarted during a rollout and after a terminal promotion. Reconciliation or startup sync restores the desired allocation without a human replay.",
  },
  {
    area: "Backend verification",
    result: "279 tests · ~91% coverage",
    detail:
      "Ruff, mypy --strict and pytest run alongside a separate integration job that boots the real nine-container stack and exercises six scenarios.",
  },
] as const;

export const modelOpsStackGroups = [
  ["Control plane", "FastAPI + SQLAlchemy + SQLite + Alembic"],
  ["Frontend", "Next.js + TypeScript + Tailwind + Recharts"],
  ["Model serving", "scikit-learn + joblib + FastAPI"],
  ["Routing", "Weighted router with static version → host mapping"],
  ["Verification", "pytest + Ruff + mypy --strict + Locust"],
  ["Runtime", "Docker + Docker Compose"],
] as const;

export const modelOpsDeepDiveLinks = [
  {
    label: "Repository README and walkthrough",
    href: "https://github.com/negativexq/modelops-control-plane/blob/main/README.md",
  },
  {
    label: "Design notes",
    href: "https://github.com/negativexq/modelops-control-plane/blob/main/docs/DESIGN_NOTES.md",
  },
  {
    label: "Integration CI smoke test",
    href: "https://github.com/negativexq/modelops-control-plane/blob/main/backend/scripts/ci_smoke_test.py",
  },
  {
    label: "CI workflow",
    href: "https://github.com/negativexq/modelops-control-plane/blob/main/.github/workflows/ci.yml",
  },
] as const;

export const modelOpsRelatedWriting = [
  {
    href: "/writing/designing-a-policy-driven-model-promotion-control-plane",
    title: "Designing a Policy-Driven Model Promotion Control Plane",
    description:
      "Why canary traffic, delayed ground truth, explicit policy outcomes, rollback and desired-versus-observed reconciliation belong in one control loop.",
  },
] as const;
