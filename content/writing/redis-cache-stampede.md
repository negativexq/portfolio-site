---
title: "Preventing Cache Stampedes with Redis"
description: "A planned engineering note on request coalescing, TTL jitter, stale reads, and scoped Redis locks for hot-key expiry."
slug: redis-cache-stampede
datePublished: 2026-08-20
dateModified: 2026-08-20
tags:
  - Redis
  - Caching
  - Reliability
featured: false
relatedProjects:
relatedLearning:
relatedWriting:
draft: true
seoTitle: "Preventing Redis Cache Stampedes"
---
## Evidence still required

This article remains a draft because the inspected repositories do not contain a cache-stampede implementation or measurements that would support a project-backed account.

Before publication, build a reproducible hot-key workload and compare the following designs under the same concurrency and expiry schedule:

- baseline cache-aside behavior;
- in-process request coalescing;
- TTL jitter;
- bounded stale reads;
- a narrowly scoped Redis lock with an ownership token and expiry.

## Measurements to collect

Record origin request amplification, cache hit and stale-hit rates, lock wait time, database latency, timeout behavior, and recovery after the lock holder stops. Document the exact Redis commands or Lua scripts used for ownership-safe release.

## Publication condition

Publish only after the repository contains the implementation, load generator, raw artifacts, and a short methodology note. Do not turn a conceptual design into a production incident narrative.
