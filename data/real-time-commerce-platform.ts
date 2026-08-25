export const commerceProjectUrl = "https://omerfkoc.dev/projects/real-time-commerce-platform";

export const commerceMeta = {
  title: "Real-Time Commerce Platform",
  description:
    "Production-oriented event-driven commerce platform with at-least-once Kafka processing, idempotent business effects, transactional persistence, fraud outbox delivery, and measured performance limits.",
  image: "/projects/real-time-commerce-platform/event-lifecycle.svg",
  imageAlt: "Event lifecycle from Kafka delivery through idempotent persistence and offset commit.",
  keywords: [
    "event-driven commerce",
    "Kafka at-least-once processing",
    "idempotent consumers",
    "transactional outbox",
    "distributed systems reliability",
    "Kafka performance engineering",
  ],
} as const;

export const commerceCapabilities = [
  {
    title: "Commerce events",
    items: [
      "Registrations, browsing, carts, orders and payments",
      "Refund journeys with partition-scoped causal ordering",
      "Versioned event envelopes with one validation boundary",
    ],
  },
  {
    title: "Durable outcomes",
    items: [
      "PostgreSQL business and fraud state",
      "Deterministic fraud evaluations and explainable alerts",
      "Transactional outbox for derived Kafka events",
    ],
  },
  {
    title: "Failure and operations",
    items: [
      "Bounded retry and confirmed DLQ handling",
      "Interactive scenarios, run history and health views",
      "Prometheus metrics and provisioned Grafana dashboards",
    ],
  },
] as const;

export const commerceFailureWorkflow = [
  {
    label: "Event delivered",
    detail: "Kafka delivers a commerce event to the processor with manual offset management and partition-scoped ordering.",
  },
  {
    label: "Lease and transaction",
    detail: "Redis coordinates active ownership while PostgreSQL records the event identity, business effect, fraud result and outbox row in one transaction.",
  },
  {
    label: "Crash after commit",
    detail: "The process stops before Redis completion and the Kafka offset commit. The database effect is already durable, but the offset remains uncommitted.",
  },
  {
    label: "Redelivery is expected",
    detail: "The lease expires and Kafka redelivers the event. The durable processed_events ledger recognizes the same event and its digest.",
  },
  {
    label: "Safe replay",
    detail: "Business writes, fraud evaluation and outbox insertion do not run a second time. The duplicate is acknowledged without creating a second effect.",
  },
  {
    label: "Derived event recovery",
    detail: "A separate outbox publisher retries committed fraud alerts. A pending row remains available when publisher delivery is interrupted.",
  },
] as const;

export const commerceDeliveryRows = [
  {
    side: "Kafka delivery semantics",
    items: [
      "At-least-once delivery",
      "Manual offset commits",
      "Partition-scoped ordering",
      "Redelivery after an unresolved commit",
    ],
  },
  {
    side: "Application correctness",
    items: [
      "Redis leases coordinate active processing",
      "PostgreSQL is the durable system of record",
      "Processed-event uniqueness makes replay harmless",
      "Business effects and outbox rows commit atomically",
    ],
  },
] as const;

export const commerceEngineeringDecisions = [
  {
    title: "Idempotency is layered on purpose",
    description:
      "Redis is the fast coordination path with token-checked leases. PostgreSQL's processed_events ledger is the durable safety net when a lease expires, Redis loses state, or a crash occurs after commit. Neither layer is treated as sufficient by itself.",
  },
  {
    title: "The transaction owns the business boundary",
    description:
      "The ledger insert, commerce repositories, fraud evaluation, alert and transactional-outbox row share one PostgreSQL transaction. The alert cannot commit without the outbox fact that it needs to be published.",
  },
  {
    title: "Failure handling is bounded and explicit",
    description:
      "Only classified transient failures retry with capped backoff. Invalid or exhausted records follow a confirmed DLQ path, while contiguous terminal offsets prevent the consumer from committing past an unresolved gap.",
  },
  {
    title: "Performance follows evidence, not a headline",
    description:
      "The project separates Demo full-path throughput from the isolated processor benchmark. Offset-commit batching moved the isolated boundary from about 750 to 900 events/s; query-plan-aware indexes and a fresh sweep established about 1,050 events/s as the highest clearly sustainable point.",
  },
] as const;

export const commerceVisuals = [
  {
    src: "/projects/real-time-commerce-platform/event-lifecycle.svg",
    alt: "Event lifecycle diagram showing Kafka delivery, Redis idempotency, a PostgreSQL transaction, outbox persistence, and a safe offset commit.",
    caption:
      "Full lifecycle: the durable ledger, business state, fraud result and outbox row commit together before the source offset advances.",
    source: "docs/architecture/event-lifecycle.svg",
    sourceUrl:
      "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/architecture/event-lifecycle.svg",
    width: 920,
    height: 1690,
  },
  {
    src: "/projects/real-time-commerce-platform/failure-recovery.svg",
    alt: "Failure recovery timeline showing a crash after PostgreSQL commit, Kafka redelivery, Redis lease expiry, and durable duplicate suppression.",
    caption:
      "Crash recovery: the offset is intentionally left uncommitted, so redelivery can consult durable truth instead of repeating the business effect.",
    source: "docs/architecture/failure-recovery.svg",
    sourceUrl:
      "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/architecture/failure-recovery.svg",
    width: 920,
    height: 1160,
  },
  {
    src: "/projects/real-time-commerce-platform/event-processing-sequence.svg",
    alt: "Event-processing sequence diagram across the producer, Kafka, consumer, Redis and PostgreSQL, including crash points and retry path.",
    caption:
      "Sequence view: commit order, crash points and retry behavior are visible across Kafka, Redis and PostgreSQL.",
    source: "docs/architecture/event-processing-sequence.svg",
    sourceUrl:
      "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/architecture/event-processing-sequence.svg",
    width: 1100,
    height: 1280,
  },
] as const;

export const commerceEvidence = [
  {
    area: "Isolated sustainable capacity",
    result: "~750 → ~1,050 evt/s (+40%)",
    detail:
      "Three workers and three Kafka partitions on the isolated Kafka → processor → persistence path. ~1,050 evt/s stayed bounded and correct across all retained repeats; ~1,075 evt/s was the first repeatably degraded rate.",
  },
  {
    area: "Offset-commit optimization",
    result: "125,669 → 4,385 commit calls",
    detail:
      "Bounded per-partition contiguous batching reduced commit calls by about 28.6x and moved the earlier sustainable boundary from ~750 to ~900 evt/s.",
  },
  {
    area: "Query-plan evidence",
    result: "10.897 → 0.253 ms",
    detail:
      "Measured recent-payment lookup after aligning PostgreSQL indexes with the equality, range and descending-timestamp access pattern. This is query execution time, not end-to-end latency.",
  },
  {
    area: "Demo full path",
    result: "49.843 → 97.934 evt/s median",
    detail:
      "The interactive Demo Control path improved after generator hot-path and pacing fixes. It is intentionally separate from the isolated processor capacity result.",
  },
] as const;

export const commerceStackGroups = [
  ["Backend", "Python 3.12 + FastAPI + Pydantic v2 + psycopg 3"],
  ["Messaging", "Apache Kafka 3.9 KRaft + confluent-kafka"],
  ["Persistence", "PostgreSQL 17 + Redis 7"],
  ["Frontend", "Next.js App Router + React + Tailwind + Recharts"],
  ["Observability", "Prometheus + Grafana + exporters + prometheus-client"],
  ["Verification", "Ruff + mypy + pytest + Vitest"],
  ["Runtime", "Docker Compose + GNU Make"],
] as const;

export const commerceDeepDiveLinks = [
  {
    label: "Architecture and failure recovery",
    href: "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/architecture/README.md",
  },
  {
    label: "Performance report",
    href: "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/performance-report.md",
  },
  {
    label: "Demo Control Center",
    href: "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/demo-control-center.md",
  },
  {
    label: "Observability",
    href: "https://github.com/negativexq/real-time-commerce-platform/blob/main/docs/observability.md",
  },
] as const;

export const commerceRelatedWriting = [
  {
    href: "/writing/building-reliable-kafka-event-processing-platform",
    title: "Building a Reliable Kafka Event Processing Platform",
    description:
      "The longer case study: delivery semantics, failure recovery, transaction boundaries and benchmark-driven performance work.",
  },
  {
    href: "/writing/kafka-at-least-once-idempotency",
    title: "At-Least-Once Kafka Without Duplicate Side Effects",
    description:
      "How Redis leases, a durable event ledger, bounded retry and careful offsets make replay safe.",
  },
  {
    href: "/writing/transactional-outbox-kafka",
    title: "Transactional Outbox: Closing the Database–Kafka Failure Window",
    description:
      "Why the database fact and the event-to-publish fact must commit together before a publisher takes over.",
  },
] as const;
