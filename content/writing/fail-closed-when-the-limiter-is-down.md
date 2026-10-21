---
title: "Fail Closed When the Limiter Is Down"
description: "A rate limit that lives in each gateway replica multiplies with every replica, and a limit that disappears during an outage is not a limit. How the ML platform shares budgets through PostgreSQL, what it returns when that store is gone, and how a three-statement transaction cut limiter p95 from 187 ms to 4.7 ms."
metaDescription: "Shared PostgreSQL rate limits across gateway replicas, fail-closed behavior during a database outage, and a limiter p95 cut from 187 ms to 4.7 ms."
slug: fail-closed-when-the-limiter-is-down
datePublished: 2026-10-22
dateModified: 2026-10-22
category: AI Platform
tags:
  - AI Platform
  - PostgreSQL
  - Performance Engineering
  - Reliability
featured: false
relatedProjects:
  - ml-platform-infrastructure
relatedLearning:
  - distributed-systems-reliability
  - concurrency-performance-engineering
relatedWriting:
  - the-gateway-is-not-the-control-plane
  - kafka-at-least-once-idempotency
draft: false
seoTitle: "Fail Closed When the Rate Limiter Is Down"
---
An inference gateway enforces two promises. The endpoint's limit protects the model from being overwhelmed. The caller's limit gives each caller a fair share. Both are easy to keep with one gateway process and an in-memory token bucket.

They break as soon as the gateway scales. Four replicas with in-memory buckets admit four times the configured budget. And a limiter that quietly admits everything when its store is unreachable turns a database incident into an unprotected model.

The ML Platform Infrastructure gateway keeps both promises across replicas and through outages. This article covers how, and what it took to make that fast.

## Budgets live in the database

By default the gateway uses `CP_GATEWAY_LIMIT_STORE=postgres`. Endpoint buckets, caller buckets, LLM token reservations and token debt are rows in the control-plane database, shared by every gateway replica and surviving restarts.

Each admission locks both buckets in a stable order, refills them using the database clock, and admits or rejects atomically. A denied request consumes neither bucket. Lock and statement waits are bounded at 2 and 3 seconds.

The in-memory store still exists for demo mode, and it is labeled for what it is: per-process buckets, where more replicas mean more capacity.

:::diagram shared-limiter-admission

## The budget holds at any replica count

The first load matrix sent traffic to one, two and four distinct gateway pods against an endpoint and caller budget of 600 units per minute, ten seconds per sample. The question was not throughput. It was whether adding replicas let more requests through than the budget allows.

| Gateways | Offered RPS | Admitted | Rejected (429) | Shared-budget upper bound |
| ---: | ---: | ---: | ---: | ---: |
| 1 | 100 | 699 | 301 | 701 |
| 2 | 100 | 699 | 301 | 703 |
| 4 | 100 | 699 | 301 | 701 |

Every sample stayed within the shared-budget upper bound, at every replica count. A 429 here is the limiter working; the measurement counts 5xx responses, transport failures and growing client queues as the availability failures.

## The outage test

The limiter's most important behavior is what it does when it cannot decide. In the acceptance cluster, the dedicated control-plane PostgreSQL deployment was scaled to zero and restored, with 32 requests across four distinct gateway pods in each phase:

| Phase | Result | Error code |
| --- | --- | --- |
| Before | 32 × 200 | none |
| Outage, warm caches | 32 × 503 | `limit_store_unavailable` |
| Outage, expired caches | 32 × 503 | `data_store_unavailable` |
| Recovery | 32 × 200 | none |

Two details matter. First, warm authentication and endpoint caches did not let requests through: knowing who the caller is does not mean the platform can account for what they spend. Second, once those caches expired, the gateway failed at an earlier step with a different, equally redacted error. Both paths return 503 before anything is forwarded to the model.

When the database came back, every request in the recovery phase returned 200.

## Making the shared limiter fast

Correctness came first; the first matrix also showed the cost. At 500 offered requests per second, the database path built lock waiters and the HTTP latency climbed. The original two-bucket admission used **nine SQL statements** per request.

The optimized path uses **three**:

1. Transaction-local lock and statement timeouts.
2. One ordered bulk insert for buckets that do not exist yet.
3. One statement that locks, refills, admits and updates every bucket involved.

Locks and first-use inserts keep the same collation order as before, including during a mixed-version rollout, so old and new gateways always take locks in the same order. The database clock is read after all bucket locks are acquired, so a request that waited for a lock is refilled with the time it actually got the lock. Admission, refund and token debt remain atomic.

The before-and-after matrix ran on the same cluster, the same sampling code, four gateway pods with 1 CPU each, and no overlapping builds or deployments:

| Target gateways | Limiter p95 | HTTP request p95 | Peak lock waiters | Completed RPS |
| ---: | --- | --- | --- | --- |
| 2 | 96 → **30 ms** | 519 → **161 ms** | 22 → 20 | 492 → 493 |
| 4 | 187 → **4.7 ms** | 516 → **4.0 ms** | 47 → **0** | 490 → 495 |

At four gateways, limiter p95 fell by a factor of about 40 and lock waiters disappeared. **500 offered RPS passes with two and four gateways**, with every shared budget held and every limiter observation counted.

## The gate that rejected its own pass

Throughput alone is a misleading pass condition. A load generator can report high completed RPS while requests pile up in its own queue.

A single-gateway probe with 2 CPUs completed 464 RPS with no errors and correct budgets, and its first throughput-only gate called that a pass. Its client queue p95 was 2.2 seconds. The gate now also requires client queue and scheduling p95 at or below 100 ms, and re-evaluation marks that probe failed. The two- and four-gateway results pass the stricter guards.

That is the same principle as the limiter itself. A number that looks good is not evidence until the conditions that would make it wrong have been checked.

## Why not Redis

The measurements did not justify a second datastore. The shared PostgreSQL limiter keeps budgets exact across replicas, fails closed when its store is gone, and runs at single-digit milliseconds when the load is spread across gateways. Adding Redis would add another component to back up, secure and fail over, for a problem the numbers do not show.

The gateway's separation from the control plane is covered in [The Gateway Is Not the Control Plane](/writing/the-gateway-is-not-the-control-plane). The limiter, its load matrix and the outage evidence are in [ML Platform Infrastructure](/projects/ml-platform-infrastructure).
