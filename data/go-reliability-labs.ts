import type { SupportingLabGroup } from "@/lib/content/types";

// Intentionally isolated from data/projects.ts: nothing in this file is
// imported by lib/graph/build-graph.ts, so this group can never produce
// Engineering Graph nodes, edges, or accessible-list entries. It renders
// only in Projects -> Supporting Work. Do not merge this into
// data/projects.ts or import it from lib/graph/*.
//
// These six labs were originally six standalone repositories and are now
// consolidated as subdirectories of one monorepo, github.com/negativexq/
// go-resilience-labs. Each lab's githubUrl below points at its subdirectory.
export const goReliabilityLabs: SupportingLabGroup = {
  id: "go-reliability-labs",
  title: "Go Resilience Labs",
  summary:
    "A focused series of six Go labs exploring how backend systems remain predictable under load, concurrency, and partial failure — covering latency measurement, idempotency, admission control, dependency resilience, backpressure, and end-to-end deadline budgeting.",
  theme: "Predictable backend behavior under load and failure.",
  githubUrl: "https://github.com/negativexq/go-resilience-labs",
  labs: [
    {
      repo: "api-prober",
      label: "Measure",
      description:
        "Bounded-concurrency HTTP probing with throughput measurement, latency percentiles, status distributions, connection reuse, graceful cancellation, and race-tested concurrency.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/api-prober",
    },
    {
      repo: "idempotency",
      label: "Correctness",
      description:
        "Concurrent idempotent request handling backed by PostgreSQL transactions and UNIQUE constraints, preventing duplicate side effects while safely replaying completed results.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/idempotency",
    },
    {
      repo: "rate-limiter",
      label: "Admission Control",
      description:
        "Local token-bucket and Redis-backed distributed rate limiting with atomic decisions, explicit rate-limit responses, and concurrency-tested global limits.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/rate-limiter",
    },
    {
      repo: "retry-circuit-breaker",
      label: "Resilience",
      description:
        "Dependency-free bounded retries with exponential backoff and jitter, retryable HTTP classification, response-body lifecycle handling, and a concurrency-safe circuit breaker.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/retry-circuit-breaker",
    },
    {
      repo: "backpressure",
      label: "Overload Control",
      description:
        "Bounded queues and fixed workers demonstrating saturation behavior, enqueue timeouts, explicit overload rejection, context cancellation, stats, and graceful draining.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/backpressure",
    },
    {
      repo: "deadline-budget",
      label: "Time Budget",
      description:
        "End-to-end deadline propagation with child timeout budgeting, safety reserves, fail-fast budget exhaustion, budget-aware retries, and parent-child deadline guarantees.",
      githubUrl: "https://github.com/negativexq/go-resilience-labs/tree/main/deadline-budget",
    },
  ],
};
