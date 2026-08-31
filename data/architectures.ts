import type { ArchitectureDefinition } from "@/components/content/architecture-diagram";

const architectures = {
  "agentic-customer-service-platform": {
    projectId: "agentic-customer-service-platform",
    description:
      "The LLM proposes; deterministic software decides what may execute. Authentication resolves a typed principal before the server derives customer scope. The semantic proposal then passes through a deterministic compiler, authoritative target resolution, typed business validation, policy, confirmation, revalidation, typed tools, idempotency and database ownership. Knowledge follows a separate hybrid-retrieval and grounding path. Memory is context only; neither memory nor RAG can grant authority.",
    paths: [
      {
        id: "request-boundary",
        label: "Authenticated request boundary",
        summary: "Identity and customer scope are resolved server-side before any agent work begins.",
        variant: "primary",
        layout: { type: "rows", rows: [3, 1] },
        stages: [
          {
            id: "caller",
            nodes: [{ id: "caller", label: "Customer / Operator", subtitle: "chat or console request", variant: "client" }],
            edge: { label: "calls" },
          },
          {
            id: "api",
            nodes: [{ id: "api", label: "FastAPI", subtitle: "HTTP boundary, resolves principal", variant: "service" }],
            edge: { label: "resolves" },
          },
          {
            id: "auth",
            nodes: [{ id: "auth", label: "Authentication · RBAC", subtitle: "typed principal", variant: "control" }],
            edge: { label: "derives" },
          },
          {
            id: "context",
            nodes: [
              {
                id: "execution-context",
                label: "ExecutionContext",
                subtitle: "server-owned identity + scope",
                variant: "control",
                items: ["actor · customer scope", "request + conversation ID"],
              },
            ],
          },
        ],
      },
      {
        id: "decision-path",
        label: "Controlled business-action path",
        summary: "The model proposes semantic intent; the server owns every decision that can lead to a mutation.",
        variant: "control",
        layout: { type: "rows", rows: [2, 2, 2, 2, 2, 2] },
        stages: [
          {
            id: "graph",
            nodes: [{ id: "graph", label: "LangGraph Runtime", subtitle: "agent orchestration, typed state", variant: "service" }],
            edge: { label: "proposes" },
          },
          {
            id: "understand",
            nodes: [{ id: "understand", label: "LLM Semantic Proposal", subtitle: "untrusted, Pydantic-typed", variant: "analyzer" }],
            edge: { label: "validates" },
          },
          {
            id: "validate",
            nodes: [{ id: "validate", label: "Deterministic Compiler", subtitle: "provenance and admissibility", variant: "control" }],
            edge: { label: "resolves target", variant: "control" },
          },
          {
            id: "target",
            nodes: [{ id: "target", label: "Authoritative Target Resolution", subtitle: "authenticated customer scope", variant: "control" }],
            edge: { label: "validates", variant: "control" },
          },
          {
            id: "business-validation",
            nodes: [{ id: "business-validation", label: "Typed / Business Validation", subtitle: "live state and tool arguments", variant: "control" }],
            edge: { label: "evaluates", variant: "control" },
          },
          {
            id: "policy",
            nodes: [{ id: "policy", label: "Policy", subtitle: "deterministic · fail-closed", variant: "control" }],
            edge: { label: "branches", variant: "control", relation: "branch" },
          },
          {
            id: "outcomes",
            nodes: [
              { id: "allow", label: "Allow", subtitle: "risk 0 / 1", relationLabel: "typed path", variant: "service" },
              { id: "confirm", label: "Confirm", subtitle: "risk 2", relationLabel: "binds action", variant: "control" },
              { id: "human", label: "Human", subtitle: "risk 3", relationLabel: "escalates", variant: "output" },
              { id: "deny", label: "Deny", subtitle: "no execution", relationLabel: "blocks", variant: "boundary" },
            ],
            edge: { label: "continues when permitted", variant: "control", relation: "merge" },
          },
          {
            id: "confirmation",
            nodes: [{ id: "confirmation", label: "Confirmation Boundary", subtitle: "exact pending action", variant: "control" }],
            edge: { label: "revalidates", variant: "control" },
          },
          {
            id: "revalidation",
            nodes: [{ id: "revalidation", label: "Revalidation", subtitle: "ownership, expiry, live state", variant: "control" }],
            edge: { label: "calls", variant: "control" },
          },
          {
            id: "execute",
            nodes: [
              {
                id: "tools",
                label: "Typed Tool",
                subtitle: "execution authority",
                variant: "service",
                items: ["server-owned arguments", "business effect only here"],
              },
            ],
            edge: { label: "commits", variant: "control" },
          },
          {
            id: "idempotency",
            nodes: [{ id: "idempotency", label: "Idempotency + DB", subtitle: "one business effect", variant: "storage", items: ["replay protection", "state invariants"] }],
            edge: { label: "projects", variant: "observability" },
          },
          {
            id: "projection",
            nodes: [{ id: "projection", label: "Projection / Audit", subtitle: "bounded operator evidence", variant: "output" }],
          },
        ],
      },
      {
        id: "knowledge-path",
        label: "Bounded knowledge path",
        summary: "Retrieved evidence can support an answer, but it never grants execution authority.",
        variant: "async",
        stages: [
          {
            id: "question",
            nodes: [{ id: "question", label: "Knowledge Question", subtitle: "FAQ or policy request", variant: "client" }],
            edge: { label: "retrieves", variant: "async" },
          },
          {
            id: "retrieval",
            nodes: [{ id: "retrieval", label: "Hybrid Retrieval", subtitle: "dense + BM25", variant: "service" }],
            edge: { label: "checks", variant: "async" },
          },
          {
            id: "grounding",
            nodes: [{ id: "grounding", label: "Grounding / Citation Validation", subtitle: "bounded evidence", variant: "control" }],
            edge: { label: "answers", variant: "async" },
          },
          {
            id: "answer",
            nodes: [{ id: "answer", label: "Bounded Answer", subtitle: "abstains when evidence is insufficient", variant: "output" }],
          },
        ],
      },
      {
        id: "context-only",
        label: "Context, never authority",
        summary: "Customer-scoped memory enriches context; it cannot approve, widen scope or bypass policy.",
        variant: "async",
        stages: [
          {
            id: "memory",
            nodes: [{ id: "memory", label: "Memory = context", subtitle: "consent · TTL · customer scope", variant: "boundary" }],
            edge: { label: "does not authorize", variant: "failure" },
          },
          {
            id: "not-authority",
            nodes: [{ id: "not-authority", label: "Memory ≠ authority", subtitle: "no permission or approval", variant: "output" }],
          },
        ],
      },
      {
        id: "state-boundaries",
        label: "State ownership",
        summary: "Business state, idempotency receipts, memory and checkpoints are durable; retrieval remains a separate evidence system.",
        variant: "async",
        stages: [
          {
            id: "state-source",
            nodes: [{ id: "runtime-state", label: "Agent Runtime", subtitle: "context · memory · retrieval", variant: "service" }],
            edge: { variant: "async", relation: "branch" },
          },
          {
            id: "stores",
            nodes: [
              {
                id: "postgres",
                label: "PostgreSQL",
                subtitle: "system of record",
                relationLabel: "commits + checkpoints",
                variant: "storage",
                items: ["business records + receipts", "persistent memory", "LangGraph checkpoints"],
              },
              {
                id: "qdrant",
                label: "Qdrant",
                subtitle: "versioned hybrid index",
                relationLabel: "retrieves citations",
                variant: "storage",
                items: ["immutable snapshots", "atomic alias activation"],
              },
            ],
          },
        ],
      },
      {
        id: "observation",
        label: "Observation and evaluation",
        summary: "Telemetry and evaluation observe behavior without becoming authorization inputs.",
        variant: "observability",
        stages: [
          {
            id: "signal-sources",
            nodes: [
              { id: "api-spans", label: "HTTP boundary", subtitle: "safe metadata", variant: "service" },
              { id: "graph-spans", label: "Agent runtime", subtitle: "run + tool spans", variant: "service" },
            ],
            edge: { label: "emits", variant: "observability", relation: "branch" },
          },
          {
            id: "sinks",
            nodes: [
              { id: "otel", label: "OpenTelemetry / Jaeger", subtitle: "trace inspection", relationLabel: "traces", variant: "observability" },
              { id: "console", label: "Operator Console", subtitle: "metadata-only projections", relationLabel: "projects", variant: "output" },
              { id: "eval", label: "Evaluation Harness", subtitle: "deterministic + live suites", relationLabel: "scores", variant: "analyzer" },
            ],
          },
        ],
      },
    ],
    notes: [
      "Model output is an untrusted proposal: it cannot select an actor, widen customer scope, confirm its own action or override live business state.",
      "Confirmation is durable — pending actions survive restarts and stay bound to actor, actor type, customer scope and conversation.",
      "Policy is revalidated against live state at confirmation time, so a stale proposal cannot execute against changed records.",
      "Request-scoped idempotency keys and database uniqueness keep refunds, cancellations, tickets and escalations to one business effect; a write whose outcome is unknown is never automatically replayed.",
      "Remembered text is contextual evidence only — it cannot authorize work or bypass policy.",
      "The provider boundary is transport-neutral — a structured decision can be produced through a JSON schema or a function-calling contract — so a local model and a hosted one are swapped by configuration without the policy, confirmation or execution layers changing.",
      "Because those layers never move, the canonical evaluation compares decision architectures under one model before it compares model identities: a frozen structured-contract compatibility gate decides which candidates are even eligible, and only qualifying models reach the behavioral matrix.",
      "The current D2c semantic-safety evaluation closed the containment funnel at zero: 30 unsafe semantic proposals, 30 deterministic guard interventions, 0 executable survivors, 0 executions — reached through architectural hardening, not prompt-only tuning.",
      "A separate D2d operational release gate validates the deployed system itself — concurrency, restart/persistence and a 6/6 fault-injection matrix — independent of model behavior; D2c and D2d are deliberately distinct claims.",
      "The current runtime contract is semantic_decision_v3. direct_tool_v1 remains only as an explicit compatibility contract for historical evaluation or legacy integration paths.",
      "Static bearer credentials keep local development simple; the authenticator, persistence, retrieval and provider abstractions are replaceable rather than a complete deployment environment.",
    ],
  },
  "real-time-commerce-platform": {
    projectId: "real-time-commerce-platform",
    description:
      "Browser-driven scenarios publish commerce events to Kafka for at-least-once processing. The Event Processor coordinates through Redis, commits durable effects and outbox rows in PostgreSQL, explicitly publishes invalid or exhausted records to the DLQ, and a separate publisher emits fraud alerts. Prometheus and Grafana observe the local platform without changing processing outcomes.",
    paths: [
      {
        id: "request-flow",
        label: "Scenario to durable processing",
        summary: "The interactive demo reaches the same Kafka and processor path used by generated commerce events.",
        variant: "primary",
        layout: { type: "rows", rows: [3, 3] },
        stages: [
          {
            id: "browser",
            nodes: [{ id: "browser", label: "Browser", subtitle: "bounded scenarios", variant: "client" }],
            edge: { label: "controls" },
          },
          {
            id: "demo-web",
            nodes: [{ id: "demo-web", label: "Demo Control Web", subtitle: "Next.js", variant: "client" }],
          },
          {
            id: "demo-api",
            nodes: [{ id: "demo-api", label: "Demo Control API", subtitle: "FastAPI", variant: "service" }],
            edge: { label: "starts scenario" },
          },
          {
            id: "scenario-runner",
            nodes: [{ id: "scenario-runner", label: "Scenario Runner", subtitle: "shared event generator", variant: "service" }],
            edge: { label: "publishes" },
          },
          {
            id: "events-topic",
            nodes: [{ id: "events-topic", label: "commerce.events", subtitle: "partitioned Kafka topic", variant: "queue" }],
            edge: { label: "at least once" },
          },
          {
            id: "event-processor",
            nodes: [{ id: "event-processor", label: "Event Processor", subtitle: "partition-scoped handling", variant: "service" }],
          },
        ],
      },
      {
        id: "processor-state",
        label: "Processor state boundaries",
        summary: "Operational coordination stays reconstructible; durable identity and business effects share one database boundary.",
        variant: "control",
        stages: [
          {
            id: "processor",
            nodes: [{ id: "processor-state-source", label: "Event Processor", subtitle: "terminal handling", variant: "service" }],
            edge: { variant: "control", relation: "branch" },
          },
          {
            id: "state-stores",
            nodes: [
              {
                id: "redis",
                label: "Redis",
                subtitle: "leases · completion markers",
                relationLabel: "coordinates",
                variant: "storage",
              },
              {
                id: "postgres",
                label: "PostgreSQL",
                subtitle: "durable system of record",
                relationLabel: "commits durable effects",
                variant: "storage",
                items: ["business + fraud state", "processed identity + outbox"],
              },
            ],
          },
        ],
      },
      {
        id: "failure-path",
        label: "Confirmed failure path",
        summary: "The processor owns dead-letter publication after validation failure or bounded retry exhaustion.",
        variant: "failure",
        stages: [
          {
            id: "processor-failure",
            nodes: [{ id: "processor-failure-source", label: "Event Processor", subtitle: "classifies terminal failure", variant: "service" }],
            edge: { label: "publishes invalid / exhausted", variant: "failure" },
          },
          {
            id: "dlq",
            nodes: [{ id: "dlq", label: "commerce.events.dlq", subtitle: "confirmed DLQ delivery", variant: "queue" }],
          },
        ],
      },
      {
        id: "derived-events",
        label: "Derived fraud alerts",
        summary: "Committed outbox rows publish independently from the source-event transaction.",
        variant: "async",
        stages: [
          {
            id: "outbox",
            nodes: [{ id: "postgres-outbox", label: "PostgreSQL outbox", subtitle: "committed with source effects", variant: "storage" }],
            edge: { label: "claims", variant: "async" },
          },
          {
            id: "outbox-publisher",
            nodes: [{ id: "fraud-publisher", label: "Fraud Outbox Publisher", subtitle: "independent delivery loop", variant: "service" }],
            edge: { label: "publishes", variant: "async" },
          },
          {
            id: "alerts-topic",
            nodes: [{ id: "fraud-alerts", label: "commerce.fraud-alerts", subtitle: "Kafka topic", variant: "queue" }],
          },
        ],
      },
      {
        id: "observability",
        label: "Non-critical observability",
        summary: "Application metrics and infrastructure exporters are scraped without changing processing outcomes.",
        variant: "observability",
        stages: [
          {
            id: "observability-source",
            nodes: [{ id: "metrics-sources", label: "Services + exporters", subtitle: "bounded-label metrics", variant: "observability" }],
            edge: { label: "scraped by", variant: "observability" },
          },
          {
            id: "prometheus",
            nodes: [{ id: "prometheus", label: "Prometheus", subtitle: "platform signals", variant: "observability" }],
            edge: { label: "visualized in", variant: "observability" },
          },
          {
            id: "grafana",
            nodes: [{ id: "grafana", label: "Grafana", subtitle: "provisioned dashboards", variant: "observability" }],
          },
        ],
      },
    ],
    notes: [
      "The Event Processor—not the main Kafka topic—publishes invalid or exhausted records to commerce.events.dlq.",
      "PostgreSQL is the durable system of record; Redis contains reconstructible coordination state.",
      "Accepted event effects, fraud decisions, processed identity and outbox rows commit in one PostgreSQL transaction.",
      "Kafka offsets commit in bounded per-partition batches (50 records or 100ms, whichever comes first), with a synchronous flush on idle, rebalance and shutdown; delivery is at least once and ordering is partition scoped.",
      "Two independently evidenced changes — bounded offset-commit batching, then query-plan-driven PostgreSQL indexing — moved the isolated three-worker pipeline's sustainable capacity from ~750 to ~1,050 events/s (~40%) without weakening at-least-once correctness.",
    ],
  },
  "knowledge-base-rag": {
    projectId: "knowledge-base-rag",
    description:
      "Filesystem and Notion sources enter a fingerprinted sync path that builds versioned Qdrant collections before the kb_active alias moves. Authenticated queries receive a server-owned tenant ACL before dense and sparse retrieval, RRF fusion and reranking, so no later relevance stage can widen the authorized set. SectionAware evidence construction turns the surviving results into request-scoped support units, and release is gated in three separate steps: support-ID validation, occurrence-aware critical-value validation, then citation resolution. The React console exposes the same retrieval, security, evaluation and trace state through read-only FastAPI projections.",
    paths: [
      {
        id: "index-lifecycle",
        label: "Versioned index lifecycle",
        summary: "Source changes build and validate a compatible collection before the active alias moves.",
        variant: "async",
        layout: { type: "rows", rows: [3, 2, 2] },
        stages: [
          {
            id: "sources",
            nodes: [
              { id: "filesystem", label: "Filesystem", subtitle: "PDF · Markdown", variant: "boundary" },
              { id: "notion", label: "Notion", subtitle: "API connector", variant: "boundary" },
            ],
          },
          {
            id: "connectors",
            nodes: [{ id: "connectors", label: "Connectors", subtitle: "shared async protocol", variant: "service" }],
            edge: { label: "source documents" },
          },
          {
            id: "fingerprint",
            nodes: [{ id: "fingerprint", label: "Parse · Chunk · Fingerprint", subtitle: "content + pipeline identity", variant: "control" }],
            edge: { label: "compatible build" },
          },
          {
            id: "index-build",
            nodes: [{ id: "index-build", label: "Qwen3 + BM25", subtitle: "dense 1024 · sparse", variant: "service" }],
            edge: { label: "writes inactive version" },
          },
          {
            id: "versioned-collection",
            nodes: [{ id: "versioned-collection", label: "Versioned Collection", subtitle: "Qdrant · not yet active", variant: "storage" }],
            edge: { label: "validates" },
          },
          {
            id: "activation-check",
            nodes: [{ id: "activation-check", label: "Compatibility Check", subtitle: "schema · model · dimension", variant: "control" }],
            edge: { label: "activates or rolls back" },
          },
          {
            id: "active-alias",
            nodes: [{ id: "active-alias", label: "kb_active Alias", subtitle: "current searchable index", variant: "storage" }],
          },
        ],
      },
      {
        id: "query-path",
        label: "Authorized retrieval and strict release",
        summary: "Identity and tenant scope constrain the candidate set before relevance scoring or generation begins.",
        variant: "primary",
        layout: { type: "rows", rows: [3, 2, 3, 2] },
        stages: [
          {
            id: "react-console",
            nodes: [{ id: "react-console", label: "React Console", subtitle: "query + evidence inspector", variant: "client" }],
          },
          {
            id: "identity",
            nodes: [{ id: "identity", label: "FastAPI Identity", subtitle: "user · role · tenant", variant: "control" }],
            edge: { label: "creates retrieval context" },
          },
          {
            id: "tenant-acl",
            nodes: [{ id: "tenant-acl", label: "Mandatory Tenant ACL", subtitle: "before reranking", variant: "boundary" }],
            edge: { label: "filters active index" },
          },
          {
            id: "qdrant-retrieval",
            nodes: [{ id: "qdrant-retrieval", label: "Qdrant Retrieval", subtitle: "dense + BM25 sparse", variant: "storage" }],
            edge: { label: "fuses" },
          },
          {
            id: "rrf",
            nodes: [{ id: "rrf", label: "RRF Fusion", subtitle: "authorized candidates", variant: "analyzer" }],
            edge: { label: "passes 20" },
          },
          {
            id: "multilingual-reranker",
            nodes: [{ id: "multilingual-reranker", label: "BGE Reranker", subtitle: "authorized top 20 → top 5", variant: "analyzer" }],
            edge: { label: "packs evidence" },
          },
          {
            id: "untrusted-envelope",
            nodes: [{ id: "untrusted-envelope", label: "SectionAware Support Units", subtitle: "untrusted reference data · request-scoped IDs", variant: "boundary" }],
            edge: { label: "generates under answer_v3" },
          },
          {
            id: "generation",
            nodes: [{ id: "generation", label: "Ollama Generation", subtitle: "buffered in strict mode", variant: "service" }],
            edge: { label: "validates before release" },
          },
          {
            id: "strict-validation",
            nodes: [{ id: "strict-validation", label: "Support ID · Occurrence Validator · Citations", subtitle: "Architecture V2 · release gate", variant: "control" }],
            edge: { label: "releases" },
          },
          {
            id: "response",
            nodes: [{ id: "response", label: "Response Projection", subtitle: "answer · sources · security", variant: "output" }],
          },
        ],
      },
      {
        id: "operations",
        label: "Operations and evidence",
        summary: "Runtime traces and committed benchmark artifacts meet in read-only console projections.",
        variant: "observability",
        stages: [
          {
            id: "runtime-signals",
            nodes: [
              { id: "sync-trace", label: "Sync Runs", subtitle: "history + lifecycle", variant: "service" },
              { id: "chat-trace", label: "Query Traces", subtitle: "request waterfall", variant: "service" },
              { id: "evaluation-artifacts", label: "Evaluation Artifacts", subtitle: "machine-readable results", variant: "storage" },
            ],
            edge: { label: "projects", variant: "observability", relation: "merge" },
          },
          {
            id: "ui-aggregation",
            nodes: [{ id: "ui-aggregation", label: "FastAPI UI Aggregation", subtitle: "read-only projections", variant: "observability" }],
            edge: { label: "renders", variant: "observability" },
          },
          {
            id: "operator-views",
            nodes: [{ id: "operator-views", label: "Operations Console", subtitle: "health · evidence · traces", variant: "client" }],
          },
        ],
      },
    ],
    notes: [
      "The reranker receives only ACL-filtered candidates and cannot widen the authorized set.",
      "Strict production mode buffers, validates and then releases an answer; fast streaming is an explicit server-side alternative.",
      "Pipeline fingerprints bind model, dimension, parser, index and chunk configuration to a compatible collection.",
      "Citation integrity verifies membership in the authorized retrieved set, not claim-level semantic support.",
    ],
  },
  "modelops-control-plane": {
    projectId: "modelops-control-plane",
    description:
      "The Control Plane holds the durable desired routing state (Deployment + TrafficAllocation + a model-scoped RoutingGeneration) and pushes it to a weighted router as a best-effort, restart-losable cache — never a version's host or port. Client traffic reaches stable and canary model-serving processes, tagged with a prediction_id that a delayed ground-truth label later joins against at read time. A stateless worker closes the loop: it evaluates policy over a fresh reliability window and an older, matured quality window, then advances, promotes, rolls back or freezes a rollout through the same API an operator uses — and periodically reconciles the router's observed config back to the database's desired state.",
    paths: [
      {
        id: "traffic-path",
        label: "Prediction / traffic path",
        summary: "The router owns the version → host mapping; an unhealthy selected target returns an error rather than silently failing over.",
        variant: "primary",
        layout: { type: "rows", rows: [3, 1] },
        stages: [
          {
            id: "client-traffic",
            nodes: [{ id: "client-traffic", label: "Client Traffic", subtitle: "prediction request", variant: "client" }],
            edge: { label: "requests" },
          },
          {
            id: "weighted-router",
            nodes: [{ id: "weighted-router", label: "Weighted Router", subtitle: "owns version → host mapping ({version, weight} only, never host/port)", variant: "service" }],
            edge: { label: "routes", relation: "branch" },
          },
          {
            id: "models",
            nodes: [
              { id: "stable-model", label: "Stable Model", subtitle: "current version", variant: "service" },
              { id: "canary-model", label: "Canary Model", subtitle: "candidate version, no fallback", variant: "service" },
            ],
            edge: { label: "emits", variant: "async" },
          },
          {
            id: "metrics-emit",
            nodes: [{ id: "metrics-sink", label: "Control Plane", subtitle: "prediction_id-tagged metric, via POST /metrics (fire-and-forget)", variant: "control" }],
          },
        ],
      },
      {
        id: "quality-path",
        label: "Delayed ground-truth / quality path",
        summary: "Label and metric writes are independent; a GroundTruthLabel is durable even before its matching PredictionMetric arrives.",
        variant: "async",
        layout: { type: "rows", rows: [2, 2] },
        stages: [
          {
            id: "label-source",
            nodes: [{ id: "label-source", label: "Delayed Label Source", subtitle: "synthetic ground truth, via POST /api/labels(/batch)", variant: "boundary" }],
            edge: { label: "ingests", variant: "async" },
          },
          {
            id: "ground-truth-table",
            nodes: [{ id: "ground-truth-table", label: "GroundTruthLabel", subtitle: "written unconditionally, durable", variant: "storage" }],
            edge: { label: "join by prediction_id" },
          },
          {
            id: "quality-join",
            nodes: [{ id: "quality-join", label: "Quality Aggregation", subtitle: "joined against PredictionMetric at read time", variant: "analyzer" }],
            edge: { label: "summarizes" },
          },
          {
            id: "quality-summary",
            nodes: [{ id: "quality-summary", label: "Quality Summary", subtitle: "recall over matured window", variant: "output" }],
          },
        ],
      },
      {
        id: "automation-loop",
        label: "Policy / automated rollout loop",
        summary: "A separate stateless worker acts only through the same Control Plane endpoints available to an operator.",
        variant: "control",
        layout: { type: "rows", rows: [3, 1] },
        stages: [
          {
            id: "worker",
            nodes: [{ id: "worker", label: "Automation Worker", subtitle: "restart-safe polling loop", variant: "service" }],
            edge: { label: "evaluates", variant: "control" },
          },
          {
            id: "windows",
            nodes: [{ id: "windows", label: "Two Evaluation Windows", subtitle: "fresh reliability · matured quality", variant: "analyzer" }],
            edge: { label: "feeds" },
          },
          {
            id: "policy-engine",
            nodes: [{ id: "policy-engine", label: "Policy Engine", subtitle: "7 checks · FAIL beats INCONCLUSIVE beats PASS", variant: "analyzer" }],
            edge: { label: "verdict", relation: "branch" },
          },
          {
            id: "verdicts",
            nodes: [
              { id: "pass", label: "PASS", subtitle: "advance · 10% → 25% → 50% → 100%", variant: "control" },
              { id: "fail", label: "FAIL", subtitle: "automatic rollback", variant: "control" },
              { id: "inconclusive", label: "INCONCLUSIVE", subtitle: "freeze for manual review", variant: "control" },
            ],
          },
        ],
      },
      {
        id: "reconciliation-path",
        label: "Desired / observed reconciliation",
        summary: "The database's desired state commits first; the router push is best-effort and repaired on drift, not assumed to always land.",
        variant: "control",
        layout: { type: "rows", rows: [2, 2] },
        stages: [
          {
            id: "desired-state",
            nodes: [{ id: "desired-state", label: "Deployment + TrafficAllocation", subtitle: "durable desired state, model-scoped generation — commits before router push", variant: "storage" }],
            edge: { label: "pushes" },
          },
          {
            id: "router-push",
            nodes: [{ id: "router-push", label: "Best-Effort Router Push", subtitle: "PUT /router/config", variant: "control" }],
            edge: { label: "updates", variant: "async" },
          },
          {
            id: "router-observed",
            nodes: [{ id: "router-observed", label: "Router Observed Config", subtitle: "in-memory, restart-losable, rejects stale generation", variant: "service" }],
            edge: { label: "reconciles", variant: "async" },
          },
          {
            id: "reconciler",
            nodes: [{ id: "reconciler", label: "Reconcile Tick", subtitle: "worker-triggered, repairs drift", variant: "control" }],
          },
        ],
      },
      {
        id: "operator-path",
        label: "Operator / audit",
        summary: "Manual actions use the same endpoints the worker does; every action and policy verdict lands on one merged timeline.",
        variant: "primary",
        stages: [
          {
            id: "dashboard",
            nodes: [{ id: "dashboard", label: "Dashboard", subtitle: "pause / resume / promote / rollback", variant: "client" }],
            edge: { label: "calls" },
          },
          {
            id: "control-plane-api",
            nodes: [{ id: "control-plane-api", label: "Control Plane API", subtitle: "manual or automated actor, same endpoints as the worker", variant: "control" }],
            edge: { label: "records" },
          },
          {
            id: "audit",
            nodes: [{ id: "audit", label: "Deployment Timeline", subtitle: "events + policy snapshots merged", variant: "output" }],
          },
        ],
      },
    ],
    notes: [
      "The database is the durable desired routing state; the router's config is an in-memory, restart-losable cache the control plane pushes best-effort after committing that decision.",
      "TrafficAllocation revisions are scoped per model (RoutingGeneration), not per deployment, so the router rejects an equal-or-stale push even when it comes from an already-superseded rollout.",
      "SQLAlchemy optimistic concurrency (a version column bumped on every commit) and a DB-level partial unique index together stop a losing concurrent action from corrupting a rollout and cap each model at one unresolved deployment at a time — INCONCLUSIVE counts as unresolved too.",
      "INCONCLUSIVE means frozen for manual review, not a silent revert to the previous traffic split — its allocation stays the router's authoritative desired state until a human resolves it, the same as a completed PROMOTED or ROLLED_BACK rollout.",
      "The single-router, SQLite, local-compose scope is deliberate, not an oversight — Kubernetes, PostgreSQL, Kafka-based metrics, MLflow and auth are documented production-evolution steps, not implemented here.",
    ],
  },
  "repo-context-forge": {
    projectId: "repo-context-forge",
    description:
      "Typer and FastMCP adapters call explicit application factories that construct deterministic repository intelligence services. Those services read only bounded local repository mounts and write generated context packs to a separate output boundary. Analyzed code is not executed and repository content is not sent to a hosted language model.",
    paths: [
      {
        id: "adapter-path",
        label: "Bounded tool entry",
        summary: "Transport adapters remain thin; application factories construct the domain services and their security dependencies.",
        variant: "primary",
        stages: [
          {
            id: "adapters",
            nodes: [
              { id: "typer", label: "Typer CLI", subtitle: "local commands", variant: "client" },
              { id: "fastmcp", label: "MCP Clients", subtitle: "FastMCP tool adapters", variant: "client" },
            ],
            edge: { label: "adapters", relation: "merge" },
          },
          {
            id: "factories",
            nodes: [{ id: "factories", label: "Application Factories", subtitle: "explicit dependencies", variant: "control" }],
            edge: { label: "construct" },
          },
          {
            id: "services",
            nodes: [{
              id: "services",
              label: "Repository Intelligence Services",
              subtitle: "deterministic domain layer",
              variant: "analyzer",
              items: [
                "Repository access",
                "Code search",
                "Python symbols",
                "Dependency analysis",
                "Read-only Git",
                "Context generation",
              ],
            }],
          },
        ],
      },
      {
        id: "security-boundary",
        label: "Read boundary to write boundary",
        summary: "Analyzed workspaces and generated artifacts are separated by containment checks and bounded analyzers.",
        variant: "control",
        stages: [
          {
            id: "read-only-input",
            nodes: [{ id: "read-only-input", label: "Local Repositories", subtitle: "individually mounted · read only", variant: "boundary" }],
            edge: { label: "bounded reads", variant: "control" },
          },
          {
            id: "bounded-analysis",
            nodes: [{ id: "bounded-analysis", label: "Restricted Analyzers", subtitle: "no import · no execution", variant: "analyzer" }],
            edge: { label: "atomic artifacts", variant: "control" },
          },
          {
            id: "writable-output",
            nodes: [{ id: "writable-output", label: "Context Output", subtitle: "separate writable root", variant: "output" }],
          },
        ],
      },
    ],
    notes: [
      "Analyzed repositories are local, individually mounted read only and never executed or imported.",
      "Git is the only subprocess boundary and is restricted to allowlisted, read-only commands.",
      "Context output uses a separate writable root with containment checks and atomic replacement.",
      "The platform configures 40 tools across six local MCP servers; its local Ollama agent uses a bounded read-only subset and does not send repository content to a hosted LLM.",
    ],
  },
  "dbt-feature-lineage": {
    projectId: "dbt-feature-lineage",
    description:
      "A local dbt project or cloned git repository is resolved into manifest-aware or static analysis inputs. Both modes normalize into shared domain models. A common service layer powers model DAGs, column lineage, tracing, impact analysis, query flow and model health for both the Typer CLI and the FastAPI-backed Next.js web app.",
    paths: [
      {
        id: "ingestion-modes",
        label: "Two inputs, one domain model",
        summary: "Artifact-first loading and static fallback expose the same project representation to every downstream analysis.",
        variant: "primary",
        stages: [
          {
            id: "dbt-project",
            nodes: [{ id: "dbt-project", label: "dbt project / git clone", subtitle: "local checkout boundary", variant: "boundary" }],
            edge: { label: "load" },
          },
          {
            id: "loaders",
            nodes: [
              { id: "manifest-mode", label: "Manifest Mode", subtitle: "target/manifest.json · compiled SQL", variant: "service" },
              { id: "static-mode", label: "Static Mode", subtitle: "SQL + YAML scanners / parsers", variant: "service" },
            ],
            edge: { label: "normalize", relation: "merge" },
          },
          {
            id: "domain-models",
            nodes: [{ id: "domain-models", label: "Shared Domain Models", subtitle: "same representation", variant: "storage" }],
          },
        ],
      },
      {
        id: "service-consumers",
        label: "Shared analysis services",
        summary: "CLI and the FastAPI-backed web app consume one service layer rather than reimplementing analysis in each interface.",
        variant: "control",
        stages: [
          {
            id: "domain-input",
            nodes: [{ id: "domain-input", label: "Domain Models", subtitle: "manifest or static", variant: "storage" }],
            edge: { label: "analyze", variant: "control" },
          },
          {
            id: "analysis-services",
            nodes: [{
              id: "analysis-services",
              label: "Services",
              subtitle: "shared analysis layer",
              variant: "analyzer",
              items: ["Dashboard + health", "Model DAG", "Column lineage", "Impact + exposures", "Query flow"],
            }],
            edge: { label: "serve", variant: "control", relation: "branch" },
          },
          {
            id: "consumers",
            nodes: [
              { id: "typer-cli", label: "Typer CLI", subtitle: "human + JSON output", variant: "client" },
              { id: "fastapi-web", label: "FastAPI → Next.js", subtitle: "JSON API + web app", variant: "client" },
            ],
          },
        ],
      },
    ],
    notes: [
      "Manifest and static analysis normalize into the same domain models.",
      "Typer and the FastAPI-backed Next.js app share one service layer; analysis logic is not duplicated between interfaces.",
      "The demo and static-analysis path require no live data warehouse connection, and git imports are handled through the local clone boundary.",
    ],
  },
  "terraform-docker-infrastructure-lab": {
    projectId: "terraform-docker-infrastructure-lab",
    description:
      "Terraform owns the local Docker network, application layer and observability layer through a root module and three child modules. Browser or curl traffic enters through Nginx, reaches FastAPI and PostgreSQL, while Prometheus, Grafana, Alertmanager and Mailpit provide local monitoring and alert delivery.",
    paths: [
      {
        id: "terraform-boundaries",
        label: "Terraform ownership and module boundaries",
        summary: "The root module wires reusable child modules for the network, application and observability layers.",
        variant: "control",
        stages: [
          {
            id: "terraform-root",
            nodes: [{ id: "terraform-root", label: "Terraform root module", subtitle: "providers · variables · outputs", variant: "control" }],
            edge: { label: "provisions", variant: "control", relation: "branch" },
          },
          {
            id: "terraform-modules",
            nodes: [
              { id: "network-module", label: "modules/network", subtitle: "Docker network + port checks", variant: "service", relationLabel: "owns" },
              { id: "application-module", label: "modules/application", subtitle: "FastAPI · PostgreSQL · Nginx", variant: "service", relationLabel: "owns" },
              { id: "observability-module", label: "modules/observability", subtitle: "Prometheus · Grafana · alerts", variant: "observability", relationLabel: "owns" },
            ],
          },
        ],
      },
      {
        id: "application-flow",
        label: "Application request flow",
        summary: "Only Nginx is the public application entry point; FastAPI and PostgreSQL communicate over the dedicated Docker network.",
        variant: "primary",
        stages: [
          {
            id: "client",
            nodes: [{ id: "browser-curl", label: "Browser / curl", subtitle: "local request", variant: "client" }],
            edge: { label: "HTTP" },
          },
          {
            id: "nginx",
            nodes: [{ id: "nginx", label: "Nginx", subtitle: "reverse proxy", variant: "boundary" }],
            edge: { label: "proxy" },
          },
          {
            id: "fastapi",
            nodes: [{ id: "fastapi", label: "FastAPI", subtitle: "API + metrics", variant: "service" }],
            edge: { label: "queries" },
          },
          {
            id: "postgresql",
            nodes: [{ id: "postgresql", label: "PostgreSQL", subtitle: "database + volume", variant: "storage" }],
          },
        ],
      },
      {
        id: "observability-flow",
        label: "Metrics and alert lifecycle",
        summary: "FastAPI metrics are scraped by Prometheus, visualized in Grafana, and evaluated into alerts delivered through Alertmanager to Mailpit.",
        variant: "observability",
        stages: [
          {
            id: "metrics-source",
            nodes: [{ id: "metrics-source", label: "FastAPI /metrics", subtitle: "request + latency metrics", variant: "service" }],
            edge: { label: "scrapes", variant: "observability", relation: "branch" },
          },
          {
            id: "observability-services",
            nodes: [
              { id: "prometheus", label: "Prometheus", subtitle: "scrape + alert rules", variant: "observability", relationLabel: "queries / alerts" },
              { id: "grafana", label: "Grafana", subtitle: "PromQL dashboard", variant: "observability", relationLabel: "visualizes" },
            ],
            edge: { label: "routes", variant: "observability" },
          },
          {
            id: "alertmanager",
            nodes: [{ id: "alertmanager", label: "Alertmanager", subtitle: "group + route", variant: "control" }],
            edge: { label: "SMTP", variant: "observability" },
          },
          {
            id: "mailpit",
            nodes: [{ id: "mailpit", label: "Mailpit", subtitle: "local notification sink", variant: "output" }],
          },
        ],
      },
    ],
    notes: [
      "moved blocks preserve resource identities while the original root resources move into child modules.",
      "Application and monitoring configuration hashes drive deterministic replacement when meaningful inputs change.",
      "Native terraform test plans use mocked Docker providers; they do not provision real Docker infrastructure.",
      "GitHub Actions runs Terraform formatting, initialization, validation and tests, with TFLint, Trivy, Gitleaks and Hadolint security gates; CI does not run terraform apply.",
      "k6 exercises local load and controlled error, latency and API-down alert lifecycles end to end.",
    ],
  },
} satisfies Record<string, ArchitectureDefinition>;

export function getProjectArchitecture(projectId: string) {
  return architectures[projectId as keyof typeof architectures];
}
