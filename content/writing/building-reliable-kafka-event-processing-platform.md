---
title: "Building a Reliable Kafka Event Processing Platform"
description: "A deep dive into designing, testing, and optimizing an event-driven commerce platform with Kafka, PostgreSQL, Redis, and transactional outbox patterns."
slug: building-reliable-kafka-event-processing-platform
datePublished: 2026-08-21
dateModified: 2026-08-21
category: Distributed Systems
tags:
  - Distributed Systems
  - Kafka
  - PostgreSQL
  - Reliability
  - Performance Engineering
featured: true
relatedProjects:
  - real-time-commerce-platform
relatedLearning:
  - distributed-systems-reliability
  - concurrency-performance-engineering
relatedWriting:
  - kafka-at-least-once-idempotency
  - transactional-outbox-kafka
draft: false
seoTitle: "Building a Reliable Kafka Event Processing Platform"
---
Reliable Kafka processing begins after a record reaches the consumer. Delivery can repeat. A process can stop between two successful operations. Records within a partition are ordered, but work spread across partitions is not. PostgreSQL, Redis, and Kafka each define a different consistency boundary.

I built the Real-Time Commerce Platform to make those boundaries explicit. It processes a causal commerce sequence from customer and session creation through checkout, payment, refund, and fraud evaluation. The useful engineering work was not wiring a consumer to a topic. It was deciding when an event was durable, which failures could be retried safely, how offsets could advance without skipping work, and which performance experiments were compatible with business ordering.

This article follows that path from the processing contract to the benchmark ceiling. The measurements come from the repository's retained local benchmark artifacts. They describe an 8-CPU Docker VM with one Kafka broker, PostgreSQL 17.5, Redis 7.4.5, and a mixed commerce workload. They are evidence about this implementation and environment, not general capacity claims for Kafka or PostgreSQL.

## Architecture overview

Each valid source record follows one ordered lifecycle:

1. Poll one Kafka record and validate its envelope.
2. Reserve its `event_id` in Redis with a token-checked processing lease.
3. Start one PostgreSQL transaction.
4. Insert the event identity into `processed_events`.
5. Apply the business repository write.
6. Build fraud context and evaluate rules for eligible event types.
7. Persist the fraud result, alert, and outbox row when required.
8. Commit PostgreSQL.
9. Mark the Redis reservation complete.
10. Mark the record terminal so the offset tracker can commit the next contiguous safe offset.

:::diagram commerce-processing-lifecycle

Redis is coordination, not the durable record of success. Its lease suppresses concurrent work across processor instances and expires if a worker disappears. PostgreSQL owns correctness after a crash. The `processed_events` ledger and the business effect share the same transaction, so the database cannot retain one without the other.

The transaction is scoped to one source event. This keeps retry and offset decisions local: either that event's ledger row, business write, fraud state, and publication intent commit together, or none of them do. Kafka and Redis remain outside the transaction because PostgreSQL cannot make either system part of its local atomic commit.

## Designing idempotent event processing

The processor uses two layers because neither Redis nor PostgreSQL solves the whole problem alone.

### Redis: fast coordination

Reservation is an atomic Lua operation. A new event receives a `processing` lease containing a random token and a bounded TTL. A concurrent consumer sees that lease and leaves the record unresolved rather than running the same work in parallel. Completion and release compare the token before changing the key, which prevents an expired worker from modifying a newer worker's reservation.

This is deliberately temporary state. Redis can restart, evict a key, or become unavailable after the database has committed. Treating a completed Redis marker as the source of truth would turn any of those events into a duplicate-write risk.

### PostgreSQL: durable recovery

The first repository operation inside the event transaction checks `processed_events`, then inserts the event identity when it is new. Its primary key is `event_id`, and a separate unique constraint protects the Kafka topic, partition, and offset coordinate. The row stores a digest of the canonical event payload.

On replay, the repository compares the stored digest with the incoming event. The same identity and digest means the work is already durable. The same identity with different content is a permanent integrity error, not an ordinary duplicate. That distinction prevents corrupt or conflicting input from passing through the recovery path.

Consider the failure Redis cannot cover:

1. PostgreSQL commits the ledger and business effect.
2. The process stops before `RedisIdempotencyStore.complete()` runs.
3. The processing lease expires.
4. Kafka delivers the same record again because its offset is still uncommitted.
5. The ledger recognizes the event and returns `already_persisted`.
6. The processor repairs the Redis completed marker and allows the offset to advance without repeating the business write.

The replay repeats orchestration, not the durable effect. This path is covered by the processor orchestration tests, including the ordering assertion that persistence completes before Redis completion and offset handling.

## Transactional outbox

Publishing directly to Kafka after a business write creates a dual-write gap. If PostgreSQL commits and the publish fails, the business fact exists without its event. If Kafka accepts the event and the database transaction later rolls back, consumers see an event for state that never became durable.

The platform writes the fraud alert and its `fraud_outbox` row through the same cursor inside the same PostgreSQL transaction. A `REVIEW` or `BLOCK` decision therefore commits both the alert and a `PENDING` publication record, or rolls both back. The record contains the deterministic event identity, topic, key, headers, and serialized payload that the publisher will send later.

An independent publisher claims pending rows with `FOR UPDATE SKIP LOCKED`, moves them to `PUBLISHING` under a claim token, publishes to Kafka, and then updates the row to `PUBLISHED`. Expired claims return to `PENDING`, so a stopped publisher does not strand work indefinitely.

The outbox closes the database-to-publication-intent gap. It does not make the final Kafka publish exactly once. A publisher can receive Kafka confirmation and stop before the `PUBLISHED` update commits. Once the claim expires, the stored event is published again. Producer idempotence narrows broker-level duplicates, while the next consumer still needs idempotency keyed by the deterministic event identity.

The [transactional outbox note](/writing/transactional-outbox-kafka) examines that post-publish, pre-status-update window in more detail.

## Failure recovery

Before the PostgreSQL commit, a retry is straightforward. The transaction rolls back, no ledger row or business state survives, and the Redis lease can be released or allowed to expire. The retry executes the same unit of work under a bounded backoff policy.

After the commit but before Redis completion or Kafka offset commit, retry means redelivery. The durable ledger turns that redelivery into recovery. The processor does not need to infer whether the earlier attempt reached a particular line of code; it asks PostgreSQL whether the event and its digest are already present.

Offset commits preserve the same rule. The tracker records terminal offsets per partition and advances only across a contiguous range. It batches the actual Kafka commit by record count or elapsed time, but it cannot jump over an unresolved record. Rebalance and shutdown paths force a synchronous flush of safe offsets.

At-least-once delivery is acceptable here because every durable effect has an idempotency boundary and every unresolved offset remains replayable. Exactly-once wording would hide the remaining cross-system windows without removing them.

## Performance investigation: finding the real bottleneck

The first credible three-processor ceiling was about `750 events/s`. Batched offset commits and two query-plan-aware composite indexes moved the documented sustainable boundary to about `1,050 events/s`, with `1,075 events/s` behaving as a transition. The important part of the later investigation was not another headline number. It was separating real resource cost from the mechanism that caused lag to grow.

### Was PostgreSQL the bottleneck?

PostgreSQL CPU was the strongest early saturation signal. Sampling ruled out a connection explosion, heavyweight lock contention, a dominant LWLock pattern, and one runaway query class. The observed cost came from aggregate execution of many small operations per event.

That made PostgreSQL a reasonable optimization target, but not yet a complete explanation for the ceiling. Later transaction decomposition showed read, write, and commit phases staying in roughly the same latency bands in both clean and degraded repeats. Handler latency also remained nearly flat while queue wait and consumer lag grew. PostgreSQL was doing meaningful work; no database phase was slowing down in the way required to explain the sharp transition by itself.

### Reducing fraud-context round trips

Fraud-eligible events originally issued ten bounded database round trips to construct context. The customer home-country lookup and order lookup were independent, always issued, and both used primary-key access. I combined them into one `LEFT JOIN`, preserving the original transaction and lookup semantics while reducing the count from ten to nine.

The controlled A/B showed a real improvement:

| Requested rate | `fraud_context` average | End-to-end p95 | Lag slope |
| --- | --- | --- | --- |
| `1,000 events/s` | `0.972 → 0.608 ms` | `317 → 110 ms` | `+4.17 → +1.70 events/s` |
| `1,050 events/s` | `0.870 → 0.740 ms` | `296 → 114 ms` | `+3.32 → +1.78 events/s` |
| `1,075 events/s` | `0.845 → 0.733 ms` | `217 → 223 ms` | `+2.87 → +2.37 events/s` |

Correctness held across all 18 repeats. The change was kept because it reduced work and improved latency without weakening transaction boundaries. A later ceiling sweep did not establish a higher sustainable rate, so the optimization should be described as a latency and efficiency improvement, not a capacity breakthrough.

### Adding a worker pool

The synchronous processor handles one record at a time per partition. A four-thread worker-pool experiment tested whether local concurrency could raise the ceiling while keeping offset commits on the poll thread.

It failed on correctness before throughput could matter. All 12 candidate repeats violated the durable row invariant, with `662–948` events missing per repeat and `11,326` records sent to the DLQ during the candidate sweep. Causally related events from one partition could race: a payment worker might run before the order worker had committed the dependency it needed.

The pool was reverted. A safe concurrent design would need key-sticky dispatch or another mechanism that preserves causal ordering for related entities. More threads alone were not a tuning change; they altered the business semantics.

### Adding more partitions

More partitions preserve ordering within each partition, so the next experiment scaled from three partitions and consumers to six. Correctness held in all 12 repeats, including the highest requested rates. Throughput did not scale: mean service rate remained in the same `977–1,233 events/s` band across the six-consumer sweep in this shared local environment.

That result rules out partition count as the limiting lever for this benchmark setup. It does not show that Kafka partition scaling fails in general. At six consumers, the host also ran PostgreSQL, Redis, Kafka, Prometheus, and exporters on the same 8-CPU Docker VM, so the experiment cannot isolate a universal platform limit.

### Raising the CPU quota

The six-consumer result made compute contention a plausible environment-level hypothesis. A controlled container A/B doubled each processor's CPU quota from `0.5` to `1.0` CPU. The processors used roughly the same aggregate CPU in both configurations, and service rate did not improve. Container quota was therefore not the limiting factor.

The broader VM-wide contention question remains open because the benchmark environment could not reproduce a controlled host CPU allocation change. I prefer that unresolved conclusion to assigning the ceiling to whichever component looked busiest on a dashboard.

The strongest measured explanation for the three-consumer transition is structural. Median handler time stayed near `2.6 ms`, which gives three synchronous workers a rough theoretical ceiling of `3 × (1 / 0.0026) ≈ 1,154 events/s`. Near that range, records accumulated in librdkafka's already-fetched queue while handler time stayed flat. The service could not drain records faster without changing a correctness-constrained execution model.

## Engineering trade-offs

### Why not exactly once?

Exactly-once behavior across Kafka, Redis, and PostgreSQL would require a cross-system transaction protocol or a redesign around a single transactional authority. That cost is hard to justify when at-least-once delivery plus durable idempotency makes replay safe and leaves the failure windows visible. The system promises repeatable processing with duplicate-safe effects, not a label it cannot enforce end to end.

### Why not batch database writes?

The current persistence boundary maps one event to one transaction, one ledger identity, one set of dependency checks, one optional outbox record, and one terminal offset decision. Bulk insertion of ledger rows is mechanically possible, but partial batch failure bookkeeping does not exist. Business writes also include dependency validation and `FOR UPDATE` locking against prior state.

Batching those writes would couple unrelated failures and weaken the direct event-to-offset safety model. No safe, low-complexity batch boundary was found that justified that redesign, so database batching was rejected during analysis rather than implemented speculatively.

### Why not allow unlimited consumer concurrency?

Concurrency is bounded by causal ordering, not by thread count. Customer, session, cart, checkout, order, payment, and refund events form dependency chains. Routing related events to the same partition and processing that partition sequentially is part of correctness.

Scaling remains possible, but the unit of parallelism must respect those keys. More partitions can help when workload, database capacity, and host resources scale with them. Parallel handlers inside one ordered stream need an ordering-aware scheduler, not a generic worker pool.

## Lessons learned

- Measure before optimizing. Resource utilization is a clue, not a diagnosis.
- Reliability boundaries matter more than an isolated throughput number.
- Correctness constraints determine which scaling options are legitimate.
- An optimization can improve latency and still leave the capacity boundary unchanged.
- Failed experiments are useful when they are controlled, measured, and reverted.
- Distributed systems become easier to reason about when crash points are part of the design.

## Related work

- [Real-Time Commerce Platform](/projects/real-time-commerce-platform): implementation details, benchmark evidence, and repository links.
- [Architecture documentation](https://github.com/negativexq/real-time-commerce-platform/tree/main/docs/architecture): event lifecycle, failure recovery, and design decisions.
