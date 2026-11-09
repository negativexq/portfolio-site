---
title: "The Limiter Said 100. The Provider Saw 119."
description: "A 70.7 ms wall-clock jump exposed a hidden assumption in a Redis rate limiter. The investigation, controlled clock-step tests, and the throughput cost of a bounded fix."
metaDescription: "How a 70.7 ms clock jump broke a Redis sliding-window rate limit, what Docker Desktop had to do with it, and why a 100 ms margin costs throughput."
slug: the-limiter-said-100-the-provider-saw-119
datePublished: 2026-11-09
dateModified: 2026-11-09
category: Distributed Systems
tags:
  - Redis
  - Go
  - Docker
  - Rate Limiting
  - Performance Engineering
  - Reliability
featured: true
relatedProjects:
  - smart-campaign-composer
relatedLearning:
  - distributed-systems-reliability
  - concurrency-performance-engineering
relatedWriting:
  - fail-closed-when-the-limiter-is-down
  - kafka-at-least-once-idempotency
  - the-write-may-have-succeeded
draft: false
seoTitle: "Redis Rate Limits, Docker Clock Jumps and 119 Calls per Second"
---
A healthy load run sent 15,411 messages through Smart Campaign Composer. Every message finished, no delivery was accepted twice, and the worker's own record showed a maximum of 100 calls per second per channel.

The mock provider saw **119 on both channels**.

The limit was 100. The send could finish correctly and still violate that limit. The [recorded run](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/tests/verify/results/2026-11-06-2103-load.md) kept the violation as a failure rather than letting the successful delivery totals hide it.

The investigation led to a 70.7 ms forward jump in the Docker VM's wall clock. Redis's Lua script was still atomic. Its idea of how much time had passed was wrong for the provider's one-second window.

## The clock was part of the algorithm

The application sends SMS and email through independent worker loops. Each channel has a shared Redis sliding window, so adding workers does not multiply its budget. A worker reserves permits before claiming deliveries from PostgreSQL; a channel waiting for permission holds no messages.

Using Redis's clock avoids comparing timestamps from different worker hosts. Redis's own [rate-limiter examples](https://redis.io/docs/latest/develop/use-cases/rate-limiter/nodejs/) use `TIME` inside Lua for that reason. But `TIME` returns a Unix timestamp and microseconds, an interface Redis compares to `gettimeofday`. It is a server wall clock, not a promise of elapsed time unaffected by clock corrections. [Redis TIME reference](https://redis.io/docs/latest/commands/time/)

The relevant operation looks like this, with the reservation and in-flight bookkeeping omitted:

```lua
local clock = redis.call('TIME')
local now_us = clock[1] * 1000000 + clock[2]
redis.call('ZREMRANGEBYSCORE', key, 0, now_us - window_us)
local room = limit - redis.call('ZCARD', key)
```

The script serializes the decision. It cannot tell whether the timestamp advanced because time elapsed or because something corrected the clock.

If the clock jumps forward, recent entries look older. The script removes them early and gives out room that has not yet opened in the provider's elapsed-time window. A fixed offset between clocks would cancel when subtracting timestamps; a correction between those timestamps does not.

:::diagram redis-clock-window-jump

The drawing uses one illustrative entry to show the mechanism. It is not a reconstruction of the 119-call trace. Permits leave in batches, so a 70.7 ms jump does not imply exactly seven extra calls at a nominal 100/s rate.

## First, make sure the measurement is real

A previous profiling step had already found a misleading peak. The mock provider originally stamped arrivals after reading the body and acquiring a lock also used for journal writes. Calls waiting behind that lock could appear to arrive together.

The provider was changed to take the timestamp at the start of the handler, before body decoding, and use a separate lock for rate accounting. That corrected one source of false peaks. The [performance log](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/docs/performance.md#step-3-calls-above-100s) records that earlier measurement correction; the later clock investigation is documented separately in the [verification findings](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/tests/verify/FINDINGS.md).

That distinction matters. A timestamp taken when an outcome is written is not necessarily a timestamp for when the provider received the call. Recovered worker attempts can also bunch up in the database even when the actual arrivals stayed within the limit.

The provider's current [arrival counter](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/internal/mockprovider/mockprovider.go) retains Go `time.Time` values in memory and compares them with `Sub`. That preserves their monotonic readings, allowing its elapsed windows to differ from Redis's wall-clock windows even though both containers run in the same VM. Go documents this distinction in its [monotonic-clock behavior](https://pkg.go.dev/time#hdr-Monotonic_Clocks).

## Watch the clocks disagree

The remaining failures were unusual: both channels exceeded the limit in the same second. Reruns could show an overrun before the test had touched Redis, making Redis restart recovery an insufficient explanation.

A watcher inside the VM compared wall-clock elapsed time against monotonic elapsed time every 10 ms. The investigation recorded one forward step of **70.7 ms** during eight healthy sends. The run that reached 119 calls on both channels had its busiest provider window spanning that step. The other seven stayed at 100. These observations and their limits are in the [clock investigation](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/docs/errors-and-retries.md#when-rediss-clock-steps-forward).

The diagnostic comparison can be expressed in Go as:

```go
before := time.Now()
// Wait for the next sample, or perform the controlled clock step.
after := time.Now()

wallElapsed := after.Round(0).Sub(before.Round(0))
monoElapsed := after.Sub(before)
clockCorrection := wallElapsed - monoElapsed
```

`Round(0)` removes the monotonic component. Subtraction between the original values uses it. The difference exposes a change in wall time beyond the elapsed interval. Go's monotonic readings are process-local and omitted from serialized timestamps; sending a Unix timestamp to Redis does not preserve that protection. [Go time documentation](https://pkg.go.dev/time#hdr-Monotonic_Clocks)

## Docker corrected the clock

There are two separate ideas here: drift is a clock accumulating an offset; a step is a correction applied at once. The correction can make the clock more accurate against the host while making a duration-based algorithm admit work too early.

Docker's February 2019 [technical account of time drift on Mac](https://www.docker.com/blog/addressing-time-drift-in-docker-desktop-for-mac/) describes a helper VM with its own clock and a synchronization design in which an SNTP client calls `settimeofday` to correct it. That is historical implementation context, not evidence that every current Docker Desktop version uses that exact path. In this project, the direct evidence is the observed VM clock step; the controlled tests below reproduce its effect on the limiter.

Clock steps are not exclusive to Docker. The [chrony manual](https://chrony-project.org/doc/4.6/chrony.conf.html#makestep) distinguishes gradual correction from `makestep`, which permits a jump under configured conditions. A deployment that normally slews still needs to consider startup, operator actions and its configured clock policy. "The server runs NTP" does not specify how time advances during a correction.

## Reproduce the failure, then price the fix

The verification suite includes a [Linux clock-step helper](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/tests/verify/clockstep/main.go) that calls `settimeofday` and measures the resulting wall-versus-monotonic difference. The [load scenario](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/tests/verify/load/load_test.go) applies five steps during a send, ten seconds apart. It changes the shared VM clock, so this belongs in an isolated test environment rather than beside a demo someone is using.

The fix adds 100 ms to the post-response accounting window: **1.1 seconds instead of 1 second**. In the November 7 run, the provider measured:

| Injected forward step | Peak email calls/s | Peak SMS calls/s | Calls refused for exceeding the limit |
| --- | ---: | ---: | ---: |
| 70 ms | 100 | 100 | 0 |
| 100 ms | 100 | 100 | 0 |
| 150 ms | 104 | 103 | 9 |
| 500 ms | 110 | 117 | 37 |

All four campaigns completed with 15,411 messages sent and no duplicate acceptance. These numbers come from one [dated verification report](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/tests/verify/results/2026-11-07-0001-load.md); later runs have different peaks and should not be mixed into the same table.

The margin covers a bounded correction, not arbitrary clock behavior. In a simplified elapsed-time model, a window of `T + M` retains at least `T` real time if the clock's excess advance over that interval stays within `M`. Repeated smaller jumps can exhaust the same margin; gradual rate error also belongs in the time assumption. The tests establish the listed step scenarios, not a universal clock-error bound.

The cost is continuous even when the fault is rare. The project's [comparison](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/docs/errors-and-retries.md#when-rediss-clock-steps-forward) reports roughly 96 seconds instead of 87 for the healthy verification send, about 9% less throughput. That is the trade: capacity is spent on a measured tolerance.

## A permit is earlier than an arrival

The extra 100 ms sits on top of another decision: a call stays counted while in flight and until the accounting window has passed after its answer. Counting only from permit grant had allowed delayed calls to arrive with the next batch.

:::diagram rate-limit-arrival-boundary

The useful ordering is that the provider received a call before answering it. Retaining that call through the response and the following window prevents a delayed arrival from disappearing merely because its permit was granted long ago, subject to the clock bound. A call with no answer uses a conservative timeout hold. The [limiter implementation](https://github.com/negativexq/smart-campaign-composer/blob/5fc3295ca9f2dffd69f8940deaf0866f004d9787/internal/delivery/limiter.go) contains that reservation and settlement logic.

Simply clamping time to `max(previous, now)` would address backward movement, not a forward jump: the new value would still be accepted immediately. A stronger design could centralize admission around a monotonic time authority, but then ownership, restarts, failover and calls already in flight become part of that authority's contract. Replacing Redis timestamps with unrelated worker clocks would give up the shared time domain without solving those problems.

## Keep the guarantees separate

A provider returning 429 can stop excess calls from being accepted. It cannot make those calls disappear from the arrival count. A limiter test must count refused requests too.

Stable idempotency keys answer a different question: whether retrying a delivery creates a second accepted message. This mock provider journals those keys before replying and replays them after restart. It recorded no duplicate acceptance in the clock-step experiments. That recovery depends on the provider honoring the key; it does not prove the sender stayed under 100 calls/s.

For this implementation, the contract is explicit: shared budgets across workers, conservative accounting through uncertain calls, and a measured 100 ms forward-step tolerance at a throughput cost. Larger steps remain outside that tested tolerance.

The [Smart Campaign Composer case study](/projects/smart-campaign-composer) places this limiter in the complete approval and delivery workflow. [Fail Closed When the Limiter Is Down](/writing/fail-closed-when-the-limiter-is-down) covers the separate problem of an unavailable budget store. Here the store was available and the script was atomic. The missing assumption was how its clock could advance.
