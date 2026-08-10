import type { ArchitectureDefinition } from "@/components/content/architecture-diagram";

const architectures = {
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
      "Kafka offsets commit after terminal handling; delivery is at least once and ordering is partition scoped.",
    ],
  },
  "knowledge-base-rag": {
    projectId: "knowledge-base-rag",
    description:
      "PDF, Markdown and Notion connectors feed an incremental synchronization pipeline backed by a SQLite document registry and Qdrant hybrid index. User queries pass through FastAPI, dense and sparse retrieval with native RRF fusion, cross-encoder reranking, citation-aware generation, and citation validation. OpenTelemetry sends end-to-end sync and chat traces to Jaeger.",
    paths: [
      {
        id: "sync-path",
        label: "Incremental sync and indexing",
        summary: "Source-aware connectors reconcile registry state before versioned parsing, embedding and indexing.",
        variant: "async",
        layout: { type: "rows", rows: [3, 3] },
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
            edge: { label: "documents" },
          },
          {
            id: "sync-manager",
            nodes: [{ id: "sync-manager", label: "Sync Manager", subtitle: "diff · delete · reconcile", variant: "control" }],
            edge: { label: "content hash registry" },
          },
          {
            id: "registry",
            nodes: [{ id: "registry", label: "Document Registry", subtitle: "SQLite · sync runs", variant: "storage" }],
          },
          {
            id: "index-pipeline",
            nodes: [{ id: "index-pipeline", label: "Parse · Chunk · Embed", subtitle: "Ollama embeddings", variant: "service" }],
            edge: { label: "versioned upsert" },
          },
          {
            id: "qdrant-index",
            nodes: [{ id: "qdrant-index", label: "Qdrant", subtitle: "dense + sparse index", variant: "storage" }],
          },
        ],
      },
      {
        id: "sync-control",
        label: "Sync control",
        summary: "Manual API requests and per-connector schedules enter the same synchronization manager.",
        variant: "control",
        stages: [
          {
            id: "sync-triggers",
            nodes: [
              { id: "manual-sync", label: "FastAPI", subtitle: "manual sync trigger", variant: "client" },
              { id: "scheduler", label: "Sync Scheduler", subtitle: "per-connector interval", variant: "control" },
            ],
            edge: { label: "triggers", variant: "control", relation: "merge" },
          },
          {
            id: "shared-manager",
            nodes: [{ id: "shared-sync-manager", label: "Sync Manager", subtitle: "single path per connector", variant: "control" }],
          },
        ],
      },
      {
        id: "query-path",
        label: "Hybrid retrieval and citation-aware response",
        summary: "Retrieval combines two signals before reranking; generation is followed by an explicit citation-integrity check.",
        variant: "primary",
        layout: { type: "rows", rows: [3, 3, 2] },
        stages: [
          {
            id: "user-ui",
            nodes: [{ id: "streamlit", label: "User / Streamlit", subtitle: "chat request", variant: "client" }],
          },
          {
            id: "fastapi",
            nodes: [{ id: "fastapi", label: "FastAPI", subtitle: "chat orchestration", variant: "service" }],
            edge: { label: "searches" },
          },
          {
            id: "qdrant-query",
            nodes: [{ id: "qdrant-query", label: "Qdrant", subtitle: "dense + sparse candidates", variant: "storage" }],
            edge: { label: "RRF fusion" },
          },
          {
            id: "hybrid",
            nodes: [{ id: "hybrid", label: "Hybrid Retrieval", subtitle: "native RRF fusion", variant: "analyzer" }],
          },
          {
            id: "reranker",
            nodes: [{ id: "reranker", label: "Cross-Encoder", subtitle: "candidate reranking", variant: "analyzer" }],
          },
          {
            id: "generation",
            nodes: [{ id: "generation", label: "Generation", subtitle: "Ollama by default", variant: "service" }],
            edge: { label: "produces citations" },
          },
          {
            id: "citation-validation",
            nodes: [{ id: "citation-validation", label: "Citation Validation", subtitle: "source triple integrity", variant: "control" }],
            edge: { label: "returns" },
          },
          {
            id: "response",
            nodes: [{ id: "response", label: "Response", subtitle: "answer + citations", variant: "output" }],
          },
        ],
      },
      {
        id: "tracing",
        label: "Distributed tracing",
        summary: "A sync run and a chat request each remain one end-to-end trace.",
        variant: "observability",
        stages: [
          {
            id: "trace-sources",
            nodes: [
              { id: "sync-trace", label: "Sync path", subtitle: "connector to index", variant: "service" },
              { id: "chat-trace", label: "Chat path", subtitle: "request to response", variant: "service" },
            ],
            edge: { label: "spans", variant: "observability" },
          },
          {
            id: "otel",
            nodes: [{ id: "otel", label: "OpenTelemetry", subtitle: "trace instrumentation", variant: "observability" }],
            edge: { label: "OTLP", variant: "observability" },
          },
          {
            id: "jaeger",
            nodes: [{ id: "jaeger", label: "Jaeger", subtitle: "trace inspection", variant: "observability" }],
          },
        ],
      },
    ],
    notes: [
      "Content hashes drive incremental sync; registry and Qdrant counts are reconciled to repair drift.",
      "Changed documents are indexed under a new version before old chunks are removed; failed partial versions are cleaned up.",
      "Citation validation verifies retrieved source identity, not claim-level semantic support.",
      "Ollama provides embeddings and the default generation path; chat generation can be configured separately.",
    ],
  },
  "modelops-control-plane": {
    projectId: "modelops-control-plane",
    description:
      "An operator manages an auditable deployment state machine and policy through the Control Plane, which owns desired traffic allocation, uses SQLAlchemy optimistic concurrency control, and pushes a derived configuration to a weighted router. Client traffic reaches stable and canary model services. A separate stateless worker closes the verification loop by evaluating policy results and advancing, promoting, rolling back, or freezing an inconclusive rollout for human review.",
    paths: [
      {
        id: "control-plane",
        label: "Desired release state",
        summary: "Deployment lifecycle, policy and desired allocation live behind the Control Plane API.",
        variant: "control",
        stages: [
          {
            id: "operator",
            nodes: [{ id: "dashboard", label: "Dashboard / Operator", subtitle: "manual release actions", variant: "client" }],
          },
          {
            id: "control-plane-service",
            nodes: [{ id: "control-plane", label: "Control Plane", subtitle: "allocation source of truth", variant: "control" }],
            edge: { label: "persists", variant: "control" },
          },
          {
            id: "deployment-state",
            nodes: [
              { id: "state-machine", label: "Deployment State", subtitle: "audited state machine", variant: "storage" },
              { id: "policy-state", label: "Policy Evaluations", subtitle: "PASS · FAIL · INCONCLUSIVE", variant: "storage" },
            ],
            edge: { label: "pushes weights", variant: "control" },
          },
          {
            id: "router-cache",
            nodes: [{ id: "router-cache", label: "Router Config", subtitle: "derived runtime cache", variant: "control" }],
          },
        ],
      },
      {
        id: "traffic-path",
        label: "Weighted inference traffic",
        summary: "The router selects a configured target; an unhealthy selected target returns 503 rather than silently failing over.",
        variant: "primary",
        stages: [
          {
            id: "client-traffic",
            nodes: [{ id: "client-traffic", label: "Client Traffic", subtitle: "prediction request", variant: "client" }],
          },
          {
            id: "weighted-router",
            nodes: [{ id: "weighted-router", label: "Weighted Router", subtitle: "stable / canary split", variant: "service" }],
            edge: { label: "routes by weight", relation: "branch" },
          },
          {
            id: "models",
            nodes: [
              { id: "stable-model", label: "Stable Model", subtitle: "current version", variant: "service" },
              { id: "canary-model", label: "Canary Model", subtitle: "candidate version", variant: "service" },
            ],
          },
        ],
      },
      {
        id: "automation-loop",
        label: "Automated rollout decision",
        summary: "A separate stateless worker acts only through the same Control Plane endpoints available to an operator.",
        variant: "async",
        stages: [
          {
            id: "worker",
            nodes: [{ id: "worker", label: "Automation Worker", subtitle: "restart-safe polling loop", variant: "service" }],
            edge: { label: "evaluate", variant: "async" },
          },
          {
            id: "policy-engine",
            nodes: [{ id: "policy-engine", label: "Policy Engine", subtitle: "windowed comparison", variant: "analyzer" }],
            edge: { label: "verdict", variant: "async", relation: "branch" },
          },
          {
            id: "verdicts",
            nodes: [
              { id: "pass", label: "PASS", subtitle: "10% → 25% → 50% → 100%", variant: "control" },
              { id: "fail", label: "FAIL", subtitle: "automated rollback", variant: "control" },
              { id: "inconclusive", label: "INCONCLUSIVE", subtitle: "freeze for human review", variant: "control" },
            ],
          },
        ],
      },
      {
        id: "benchmark-path",
        label: "Real-stack verification",
        summary: "Real-stack CI, Locust load and injected runtime faults exercise the actual router, candidate services and automation worker.",
        variant: "failure",
        stages: [
          {
            id: "benchmark-harness",
            nodes: [{ id: "benchmark-harness", label: "Real-Stack CI", subtitle: "nine-container stack", variant: "client" }],
            edge: { label: "Locust traffic", variant: "failure" },
          },
          {
            id: "router-under-test",
            nodes: [{ id: "router-under-test", label: "Weighted Router", subtitle: "system under test", variant: "service" }],
          },
          {
            id: "fault-candidates",
            nodes: [{ id: "fault-candidates", label: "Candidate Services", subtitle: "quality / latency / error scenarios", variant: "service" }],
          },
        ],
      },
    ],
    notes: [
      "The Control Plane owns desired traffic allocation; router configuration is a pushed, derived cache.",
      "Real-stack CI waits for the actual worker to progress 10% → 25% → 50% → 100%; a separate injected-latency scenario verifies rollback.",
      "INCONCLUSIVE retries are bounded; a frozen deployment remains available for manual promote or rollback.",
      "The current lightweight stack deliberately excludes Kubernetes, MLflow and Prometheus.",
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
      "A local dbt project is loaded from target/manifest.json and compiled SQL when available, with static SQL and YAML analysis as a fallback. Both modes normalize into shared domain models. A common service layer powers model DAGs, column lineage, tracing, impact analysis, and query flow for both the Typer CLI and Streamlit UI helpers.",
    paths: [
      {
        id: "ingestion-modes",
        label: "Two inputs, one domain model",
        summary: "Artifact-first loading and static fallback expose the same project representation to every downstream analysis.",
        variant: "primary",
        stages: [
          {
            id: "dbt-project",
            nodes: [{ id: "dbt-project", label: "Local dbt Project", subtitle: "project files on disk", variant: "boundary" }],
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
        summary: "CLI and Streamlit consume one service layer rather than reimplementing analysis in each interface.",
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
              items: ["Model DAG", "Column lineage", "Up/downstream trace", "Impact analysis", "Query flow"],
            }],
            edge: { label: "serve", variant: "control", relation: "branch" },
          },
          {
            id: "consumers",
            nodes: [
              { id: "typer-cli", label: "Typer CLI", subtitle: "human + JSON output", variant: "client" },
              { id: "streamlit-ui", label: "UI Helpers → Streamlit", subtitle: "thin presentation adapters", variant: "client" },
            ],
          },
        ],
      },
    ],
    notes: [
      "Manifest and static analysis normalize into the same domain models.",
      "Typer and Streamlit share one service layer; analysis logic is not duplicated between interfaces.",
      "The demo and static-analysis path require no live data warehouse connection.",
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
