import type { SupportingLabGroup } from "@/lib/content/types";

// Intentionally isolated from data/projects.ts: nothing in this file is
// imported by lib/graph/build-graph.ts, so this group can never produce
// Engineering Graph nodes, edges, or accessible-list entries. It renders
// only in Projects -> Supporting Work. Do not merge this into
// data/projects.ts or import it from lib/graph/*.
export const goReliabilityLabs: SupportingLabGroup = {
  id: "go-reliability-labs",
  title: "Go Reliability Labs",
  summary:
    "A focused series of six Go labs exploring how backend systems remain predictable under load, concurrency, and partial failure — covering latency measurement, idempotency, admission control, dependency resilience, backpressure, and end-to-end deadline budgeting.",
  theme: "Predictable backend behavior under load and failure.",
  labs: [
    {
      repo: "go-api-prober",
      label: "Measure",
      description:
        "Bounded-concurrency HTTP probing with throughput measurement, latency percentiles, status distributions, connection reuse, graceful cancellation, and race-tested concurrency.",
      githubUrl: "https://github.com/negativexq/go-api-prober",
    },
    {
      repo: "go-idempotency-lab",
      label: "Correctness",
      description:
        "Concurrent idempotent request handling backed by PostgreSQL transactions and UNIQUE constraints, preventing duplicate side effects while safely replaying completed results.",
      githubUrl: "https://github.com/negativexq/go-idempotency-lab",
    },
    {
      repo: "go-rate-limiter",
      label: "Admission Control",
      description:
        "Local token-bucket and Redis-backed distributed rate limiting with atomic decisions, explicit rate-limit responses, and concurrency-tested global limits.",
      githubUrl: "https://github.com/negativexq/go-rate-limiter",
    },
    {
      repo: "go-retry-circuit-breaker",
      label: "Resilience",
      description:
        "Dependency-free bounded retries with exponential backoff and jitter, retryable HTTP classification, response-body lifecycle handling, and a concurrency-safe circuit breaker.",
      githubUrl: "https://github.com/negativexq/go-retry-circuit-breaker",
    },
    {
      repo: "go-backpressure-lab",
      label: "Overload Control",
      description:
        "Bounded queues and fixed workers demonstrating saturation behavior, enqueue timeouts, explicit overload rejection, context cancellation, stats, and graceful draining.",
      githubUrl: "https://github.com/negativexq/go-backpressure-lab",
    },
    {
      repo: "go-deadline-budget-lab",
      label: "Time Budget",
      description:
        "End-to-end deadline propagation with child timeout budgeting, safety reserves, fail-fast budget exhaustion, budget-aware retries, and parent-child deadline guarantees.",
      githubUrl: "https://github.com/negativexq/go-deadline-budget-lab",
    },
  ],
};
