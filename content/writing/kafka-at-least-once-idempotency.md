---
title: "At-Least-Once Kafka Without Duplicate Side Effects"
description: "A concrete Kafka consumer design that combines Redis leases, a PostgreSQL event ledger, transactional writes, bounded retries, and careful offset commits."
slug: kafka-at-least-once-idempotency
datePublished: 2026-07-29
dateModified: 2026-07-29
category: Distributed Systems
tags:
  - Kafka
  - Distributed Systems
  - Reliability
featured: true
relatedProjects:
  - real-time-commerce-platform
relatedLearning:
  - distributed-systems-reliability
relatedWriting:
  - transactional-outbox-kafka
draft: false
seoTitle: "Kafka At-Least-Once Processing Without Duplicate Side Effects"
---
Kafka can deliver the same record more than once, so I design for the repeat. In the Real-Time Commerce Platform, a second execution is harmless because several boundaries work together: a short-lived Redis lease, a durable PostgreSQL event ledger, one transaction for the ledger and business effects, bounded retries, and an offset commit that happens only after the record reaches a terminal state.

None of those mechanisms is sufficient on its own. Redis coordinates active workers but can lose state. PostgreSQL protects durable effects but does not control Kafka redelivery. An offset commit advances the consumer position but cannot repair a partial database write. The processing order is the guarantee.

## The processing contract

The processor uses manual Kafka offset commits. For each valid record it follows this sequence:

1. Validate the envelope and headers.
2. Reserve the event ID in Redis with a token-checked processing lease.
3. Open a PostgreSQL transaction.
4. Insert the source event into `processed_events`.
5. Apply the business write and any fraud evaluation or outbox write.
6. Commit PostgreSQL.
7. Replace the Redis processing lease with a completed marker.
8. Commit the next Kafka offset.

The database transaction is the durable boundary. Redis and Kafka operations stay outside it. If PostgreSQL rolls back, the processor does not mark the event complete and does not commit its offset.

:::diagram kafka-idempotency-flow

This is at-least-once processing with durable idempotency. It is not end-to-end exactly once, and the repository does not claim otherwise.

## Redis coordinates work, PostgreSQL decides whether work already happened

The Redis state machine has three useful outcomes: `reserved`, `processing`, and `completed`. Reservation uses a Lua script so the initial `SET ... NX` and state inspection are atomic. The value includes a random processing token. Only the holder of that token can complete or release the lease.

That token matters when a worker stalls. A second worker may acquire the event after the first lease expires. The first worker must not be able to wake up later and clear or complete the second worker's reservation. Both the completion and release scripts compare the current token before changing the key.

Redis remains coordination state, not the final record of truth. The completed marker expires. Redis can also fail after PostgreSQL commits. Durable duplicate protection lives in `processed_events`, whose primary key is `event_id`. The table also has a unique Kafka source coordinate: topic, partition, and offset.

The ledger stores a SHA-256 hash of the canonical event. A repeat with the same event ID and the same hash is a safe duplicate. Reusing that event ID with different canonical content is a permanent integrity error. Assigning the same Kafka source coordinate to another event is also an integrity error. This distinction avoids treating conflicting data as an ordinary replay.

## The commit-before-completion crash window

The most interesting failure happens after PostgreSQL commits but before Redis records completion. The business effect is durable, but Kafka still sees an uncommitted offset. Once the Redis lease expires, Kafka may deliver the record again.

The second attempt reserves the event ID and enters the normal persistence path. `ProcessedEventRepository.insert_identity` finds the existing ledger row and compares the canonical hash. A match raises the repository's already-persisted signal. The unit of work returns `already_persisted=True` without repeating the business write. The processor then repairs the Redis completed marker and commits the Kafka offset.

The recovery path is tested directly in `test_already_persisted_recovery_still_repairs_redis_before_commit`. The test also checks the more general ordering rule: database commit precedes Redis completion and Kafka commit.

| Crash point | Result on redelivery |
| --- | --- |
| Before PostgreSQL commit | The transaction rolls back and the lease eventually expires. The event can run again. |
| After PostgreSQL commit, before Redis completion | The ledger identifies the event as already persisted. Business effects are skipped, Redis is repaired, and the offset can advance. |
| After Redis completion, before Kafka commit | Redis reports `completed`; the processor verifies durable persistence, skips the duplicate, and commits the offset. |
| After confirmed DLQ delivery, before Kafka commit | Kafka may contain a repeated DLQ record. Its deterministic `dlq_record_id` gives downstream consumers a deduplication key. |

## Retry only failures that may succeed later

Retries are bounded and classified. `run_with_retry` catches `RetryableProcessingError`, applies exponential backoff with a cap and jitter, and stops after `maximum_attempts`. Permanent processing and database-integrity errors do not enter that loop.

That classification prevents two common mistakes. The processor does not retry malformed or conflicting data as if time could fix it. It also does not retry forever while holding a partition behind one record. Exhausted transient failures follow the DLQ path, and the source offset advances only after DLQ delivery is confirmed.

A missing parent record is retryable because partition-scoped or cross-partition arrival order can expose a child before its dependency. Once retries are exhausted, the record is dead-lettered as `missing_business_dependency`. The processor does not invent a parent row to force progress.

## Offset commits cannot skip unresolved gaps

The platform later introduced bounded per-partition offset batching for performance: up to 50 terminal records or 100 ms, whichever comes first. The batching rule does not change correctness. Offsets remain partition-scoped, and the tracker commits only the highest contiguous terminal offset. It never commits past an unresolved gap.

Idle, rebalance, and shutdown paths flush synchronously. This keeps batching from turning a throughput optimization into a wider replay or loss window. The repository's benchmark evidence showed fewer commit calls and a higher sustainable processing boundary, but the safety property comes from contiguous terminal tracking, not from the measured speedup.

## What this design guarantees

For the implemented event types, the database prevents a repeated source event from applying the same durable business effect twice. Redis reduces concurrent duplicate work. Kafka offsets advance only after success, a recognized durable duplicate, or confirmed DLQ handling. Retry and DLQ behavior is bounded.

The design does not make Kafka, Redis, and PostgreSQL one transaction. A DLQ record can be published twice across the publish-before-offset-commit crash window. A derived outbox event can also be published twice if Kafka confirms it and the publisher crashes before PostgreSQL records `PUBLISHED`. Those remaining duplicates carry deterministic identities so the next consumer can apply the same rule: treat repeats as normal input and make their effects harmless.

The [Real-Time Commerce Platform](/projects/real-time-commerce-platform) case study connects this processing path to the broader persistence, observability, and performance evidence. The related note on the [transactional outbox](/writing/transactional-outbox-kafka) covers the separate database-to-Kafka publication boundary.
