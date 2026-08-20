---
title: "Transactional Outbox: Closing the Database–Kafka Failure Window"
description: "How the commerce platform commits business state and a Kafka-ready event together, then publishes that event through a recoverable PostgreSQL outbox."
slug: transactional-outbox-kafka
datePublished: 2026-07-30
dateModified: 2026-07-30
tags:
  - Kafka
  - PostgreSQL
  - Distributed Systems
featured: true
relatedProjects:
  - real-time-commerce-platform
relatedLearning:
  - distributed-systems-reliability
relatedWriting:
  - kafka-at-least-once-idempotency
draft: false
seoTitle: "Transactional Outbox for Kafka and PostgreSQL"
---
A PostgreSQL commit and a Kafka publish are two independent operations. Calling them one after the other does not make them atomic. If the database commits and the publish fails, the business state exists without its event. If Kafka accepts the event first and the database rolls back, consumers can observe an event for state that never committed.

The Real-Time Commerce Platform uses a transactional outbox for derived fraud alerts. The source processor writes the fraud evaluation, the alert, and a serialized Kafka event into PostgreSQL in the same transaction as the accepted source event. A separate service publishes committed outbox rows later.

## The dual-write boundary

Consider a payment that triggers a fraud review. The processor needs to preserve two facts:

- PostgreSQL contains the evaluation and the open fraud alert.
- Kafka eventually receives the corresponding `fraud_alert_created` event.

Publishing inside the database transaction does not solve this. PostgreSQL cannot roll back a Kafka message that has already been acknowledged. Holding the transaction open during broker I/O also adds latency and lock time while leaving the atomicity problem intact.

Publishing after the commit has the opposite gap. The database state becomes visible first, then a process crash or Kafka outage can prevent the message from being sent. Retrying the source event may help, but it couples source consumption to a downstream broker recovery path and still needs idempotency.

The outbox changes the write set. Instead of trying to commit PostgreSQL and Kafka together, the source transaction commits PostgreSQL business state and an intent to publish:

:::diagram transactional-outbox-flow

If the transaction rolls back, none of those rows survive. If it commits, the event bytes needed for publication are durable even when Kafka is unavailable.

## Store the event that will be published

The outbox row contains the canonical serialized event, its deterministic event ID, topic, message key, and headers. The publisher parses the stored bytes before sending and verifies that the embedded event ID matches the row's `event_id`. Invalid stored data fails before any Kafka call.

This avoids rebuilding the message later from mutable database state. Reconstructing at publish time could produce different bytes if the source records changed between commit and delivery. The stored outbox payload is the event produced by the original transaction.

For REVIEW and BLOCK decisions, the fraud repository writes one OPEN alert and one outbox row. Evaluation, alert, alert event, and outbox IDs are deterministic. APPROVE writes the evaluation but does not create an alert or outbox entry.

## Claim work without making publication a long transaction

The publisher can run with multiple workers. `OutboxRepository.claim` selects due PENDING rows with `FOR UPDATE SKIP LOCKED`, marks them PUBLISHING, assigns a claim token, increments the attempt count, and commits that short claim transaction.

Kafka publication happens after the claim transaction closes. This prevents a slow broker request from keeping row locks and a database transaction open. The claim token protects the later status update: `published` changes a row only when its outbox ID, PUBLISHING state, and token still match.

Claims are leases, not permanent ownership. Before taking new work, the repository moves PUBLISHING rows with expired `claimed_at` timestamps back to PENDING. A worker that dies after claiming a row therefore does not strand it forever.

```text
PENDING
  -> PUBLISHING with claim token
      -> PUBLISHED after confirmed delivery
      -> PENDING with bounded backoff after a temporary failure
      -> FAILED after the configured attempt bound
```

The claim query orders rows by creation time and outbox ID. `SKIP LOCKED` lets workers make progress on different rows without waiting on one another.

## Delivery confirmation and retries

The Kafka producer enables idempotence, uses `acks=all`, and allows at most five in-flight requests per connection. The publisher does not mark a row PUBLISHED when it merely calls `produce`. It flushes within a bounded timeout and checks the delivery callback. A remaining queued message or callback error becomes `FraudOutboxRetryableError`.

Failed rows return to PENDING with capped exponential backoff until `fraud_outbox_max_attempts` is reached. Exhausted rows remain FAILED for inspection. They are not sent to the source processor's DLQ because this is a different delivery lifecycle: the source event and its database effects have already committed.

Operational state stays queryable. The service reports pending, publishing, and failed counts, the age of the oldest pending row, recovered claims, attempts, publication outcomes, and a staleness-based health signal.

## The remaining duplicate window

The outbox closes the missing-event window, but it does not create exactly-once delivery. Kafka can confirm the publish and the process can crash before PostgreSQL records PUBLISHED. When the claim expires, another worker republishes the same stored bytes.

That outcome is deliberate. Losing the event would be worse than sending a duplicate, and there is no atomic commit shared by Kafka and PostgreSQL in this design. The event ID remains deterministic across republication, so consumers can deduplicate it. `test_deterministic_event_id_survives_republication_window` publishes the same outbox record twice and verifies that both payloads are identical.

Kafka producer idempotence helps with retries inside the producer session. It does not replace consumer idempotency across application restarts and a new producer session. The downstream consumer still needs a durable event ledger or an equivalent uniqueness boundary.

## Trade-offs

The outbox adds a table, a publisher service, retry state, cleanup policy, and monitoring. Delivery is asynchronous, so consumers observe the derived event after the database commit. Backlog age becomes an operating signal that needs an explicit threshold.

In return, the source transaction has one clear authority: PostgreSQL. Kafka availability no longer decides whether an accepted source event can commit. The publisher can recover independently, and every uncompleted delivery remains visible as a row rather than disappearing between two function calls.

This implementation is intentionally scoped. It runs in a local Docker Compose topology and does not claim production availability. The useful property is still general: commit business state and publication intent in one database transaction, then treat broker delivery as an at-least-once process with deterministic identity.

The [Real-Time Commerce Platform](/projects/real-time-commerce-platform) case study provides the surrounding processor and persistence context. The companion note on [Kafka idempotency](/writing/kafka-at-least-once-idempotency) follows the derived event into the next consumer boundary.
