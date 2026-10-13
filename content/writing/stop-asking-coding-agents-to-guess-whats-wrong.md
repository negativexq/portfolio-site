---
title: "Stop Asking Coding Agents to Guess What's Wrong"
description: "Why Agent-Friendly Codebases need runtime evidence, not just better documentation: traces, profiles, reproducible workloads, and independent verification."
slug: stop-asking-coding-agents-to-guess-whats-wrong
datePublished: 2026-10-13
category: Agent Reliability
tags:
  - Coding Agents
  - Observability
  - Performance Engineering
  - Evaluation
featured: false
relatedProjects:
  - ml-platform-infrastructure
  - agentic-sre
relatedLearning:
relatedWriting:
  - building-an-observability-driven-optimization-loop-for-coding-agents
  - hard-gates-frozen-hashes
  - agentic-without-the-llm-deterministic-kubernetes-rca
draft: false
seoTitle: "Agent-Friendly Codebases Need Runtime Evidence"
---
Suppose I ask a coding agent to improve a slow prediction endpoint. It can read the Go gateway, follow the Python services, inspect the PostgreSQL queries, and run the unit tests. It finds repeated JSON allocations and replaces them with a cheaper serialization path. The patch is correct. The tests pass. The endpoint is still slow.

In this illustrative case, requests spend most of their time waiting for admission to a bounded limiter worker, while the serialization path consumes little of the request's elapsed time. The agent improved something measurable in isolation, but not the thing users were waiting for.

That is a failure mode of the environment as much as the model. We gave it the implementation and an objective, but no representative workload, queue measurements, traces, or profiles. A plausible change was easier to produce than a defensible diagnosis.

I use **Agent-Friendly Codebase** to describe a broader engineering goal: make the system's behavior discoverable, its suspected problems reproducible, and proposed fixes independently checkable. Repository navigation is part of that goal. Runtime evidence is another part that deserves more attention.

## The problem with "just optimize it"

"Make this faster" leaves several engineering decisions unspecified. Faster at which arrival rate? For which payloads and caller distribution? Does the target include rejected requests, cold starts, and streaming responses? What CPU or memory cost is acceptable? Which behavior must remain unchanged?

A coding agent can fill those gaps with assumptions. A human engineer can do the same. Neither should be rewarded for a speedup on a workload that no longer represents the requirement.

For the gateway example, a useful objective would name a workload and require a lower successful-request p95 at the same offered load, without increasing errors, weakening rate limits, or exceeding a resource budget. It would also preserve client-side queue delay rather than quietly exclude it from the latency report.

The difference is practical. The agent now has questions it can answer before editing: where does time accumulate, which callers are affected, and what evidence would distinguish worker saturation from slow upstream inference?

## Source code visibility is not runtime visibility

Reading the source shows possible execution paths. It does not show how often those paths run or what competes for their resources.

A small lock can dominate latency when many requests contend for it. A connection pool can look appropriately bounded and still become exhausted because transactions hold connections longer under load. Retries can amplify a downstream slowdown into a larger upstream queue. Database I/O and network round trips can dominate a path whose local computation is cheap.

The opposite is possible too. Serialization and memory allocation can become significant once upstream latency falls or request volume rises. A function that is harmless for small payloads may cause allocation pressure on a different input distribution. The bottleneck belongs to an execution under conditions, not permanently to a file.

For the gateway, I would distinguish at least client queueing, limiter-worker waiting, database-pool acquisition, limiter transaction time, upstream duration, and response handling. Increasing the worker limit might reduce one wait while moving contention into PostgreSQL. Low average CPU would not rule out lock waiting; high CPU would not tell us which functions consumed it.

Traces, metrics, and profiles answer different questions. A trace locates elapsed intervals along an instrumented request. Metrics describe populations over time. A CPU profile attributes sampled execution to stacks. None of those alone establishes why a change will help.

## From readable repositories to diagnosable systems

Documentation, modularity, typed contracts, tests, and repository instructions still matter. They tell an agent how to start the application, which boundaries it may change, and what the software promises. Runtime evidence without that context can be just as misleading as source code without measurements.

The additional requirement is that runtime behavior must be accessible through an engineering interface. The agent needs to discover a workload, retrieve evidence for a particular revision, identify missing instrumentation, and rerun the same measurement after a patch.

This also separates three subjects that are often discussed together:

| Subject | Question |
| --- | --- |
| Observability of agents | What did the agent propose, call, spend, and change? |
| Observability for agents | What did the software under investigation do? |
| Agent-driven optimization | Did an evidence-guided patch improve the agreed workload without breaking its contract? |

My writing on [decision, authority, and execution](/writing/decision-authority-execution-observability) primarily concerns the first row. This pair of articles concerns the second and third. We still need agent audit records, but a complete transcript of tool calls cannot replace a missing measurement of database-pool waiting.

## Existing work already supplies important pieces

This is a synthesis, not a claim that performance feedback loops are new.

OpenAI's February 11, 2026 engineering case study, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/), describes application instances and ephemeral observability stacks scoped to individual git worktrees. Codex can query logs and metrics, and inspect traces. That is a concrete example of making runtime information part of an agent's development environment. It is a report about a particular internal engineering system, not a controlled comparison of every possible harness.

Grafana's April 21, 2026 [o11y-bench announcement](https://grafana.com/blog/o11y-bench-open-benchmark-for-observability-agents/) describes sandboxed tasks involving Prometheus, Loki, Tempo, dashboards, and incident investigation. Its graders check environmental facts and saved state rather than relying only on fluent explanations. It evaluates observability workflows; it does not establish that an agent can patch a service and improve its performance safely.

The July 22, 2026 preprint [PerfAgent: Profiler-Guided Iterative Refinement for Repository-Level Code Optimization](https://arxiv.org/abs/2607.19653) addresses that optimization problem more directly. It combines curated profiler feedback, iterative refinement, and verification. Its reported GPT-5.1 comparison improves expert-matching patches on GSO from 19.6% to 39.2%. That result belongs to its benchmark and configuration, not to a distributed gateway or the interface proposed here.

Anthropic's [long-running agent harness](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) adds another relevant lesson: progress artifacts and end-to-end checks help subsequent sessions establish what actually works. These sources contribute environment design, observable tasks, profiling feedback, and verification. They do not all implement the same architecture.

## Three architectural principles

I would organize an Agent-Friendly Codebase around three properties.

**Observable by Design.** Important waits and work have explicit measurements. In the gateway, limiter queueing and transaction execution should be distinguishable from total request duration. Counters should retain refusals and errors, so a lower latency achieved by rejecting more traffic cannot masquerade as improvement. Resource measurements should include throttling and memory, not only a latency chart.

**Diagnosable by Design.** Evidence carries enough identity to connect it to a workload, deployment, and source revision. A slow span without a service version is difficult to relate to a patch. A profile without its collection settings is difficult to interpret. Missing evidence should be a first-class result: "pool waiting was not instrumented" is more useful than silently treating the unobserved interval as zero.

**Verifiable by Design.** The environment can replay an equivalent workload and compare independently collected results. The agent can modify the implementation, but it cannot redefine the budget, remove difficult inputs, or grade its own success. A correct optimization needs both preserved behavior and measured improvement under the stated conditions.

I call the evidence representation connecting these properties **Agent-Legible Telemetry**. This is my proposed framing, not an OpenTelemetry standard. It means bounded evidence with units, provenance, population definitions, source references where available, and explicit gaps. JSON by itself does not make telemetry legible, and a generated diagnosis does not become a measurement because it has a confidence field.

:::diagram agent-evidence-feedback-loop

## A feedback loop that changes the next decision

Return to the slow gateway. Before changing serialization, the agent runs the registered workload and compares gateway phases with client latency. Suppose those observations place the largest unexplained delay before limiter execution. That would justify investigating worker availability and pool acquisition before touching the response encoder.

The next step is a falsifiable hypothesis: worker waiting is limiting this workload, and a bounded change will reduce that wait without increasing database contention. The agent should name what would refute it. If pool acquisition or lock waiting rises and end-to-end p95 stays unchanged, the bottleneck may simply have moved.

After a narrowly scoped patch, correctness checks run first. The workload then runs again with the same arrivals, input mix, resource limits, and telemetry settings. An independent verifier checks latency, throughput, errors, CPU, and memory. It accepts the patch, asks for more evidence, or rejects it. Rejection is useful feedback, not an invitation to relax the acceptance rules.

The full loop is **Observe → Identify → Hypothesize → Modify → Measure → Verify → Accept or Revert**. Observation selects a question; measurement tests the intervention. The example is an investigation design, not a report that the current gateway has that fault or that this loop has already fixed it.

The [Agentic SRE architecture](https://github.com/negativexq/agentic-sre/blob/905ab7d784a72bd15a783c406063e2225a9f80dd/docs/architecture.md) uses bounded read-only investigation and explicit information gaps. That is a useful neighboring pattern. Incident diagnosis and source-code optimization remain different tasks, with different verification requirements.

## More telemetry is not automatically better

A large log dump can consume context without resolving a single uncertainty. Useful interfaces should start with the relevant workload and time window, preserve links to underlying artifacts, and let the agent request more detail. Summaries should retain contradictory evidence rather than manufacture one tidy explanation.

Sampling limits what can be concluded. [OpenTelemetry's sampling documentation](https://opentelemetry.io/docs/concepts/sampling/) distinguishes decisions made before the complete trace is known from decisions informed by completed spans. A sample enriched for slow requests is useful for diagnosis, but it is not an unbiased latency distribution. Missing spans also leave unknown intervals; an absent database span does not prove there was no database work.

Measurement can change the system. The ML Platform's [historical Python gateway profile](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/docs/evidence/live-2026-10-07/observability/gateway-cpu-profile.md) explicitly reports roughly 3.3-fold throughput slowdown with its profiler active. The report treats attribution as diagnostic evidence and calls for an unprofiled comparison. That is more informative than presenting the profile as an exact picture of normal execution.

Correlation needs the same restraint. A longer transaction and higher CPU can occur together because load changed. Traces help localize the investigation; controlled interventions provide stronger evidence for a particular explanation. Benchmarks also need integrity: a faster error response, a warmer cache, or a different arrival schedule can produce an attractive number while violating the objective.

The agent's success message should therefore remain a claim until the verifier has checked the patch. More evidence can improve the decision process, but observability does not guarantee successful optimization.

## Make the environment part of the engineering problem

Stronger models and better prompts may help. So may a development environment that exposes the right waits, records the workload, identifies gaps, and keeps verification outside the agent's authority.

We spend a lot of time making code easier for AI agents to read. I think we should spend more time making systems easier for them to diagnose.

The practical continuation, [Building an Observability-Driven Optimization Loop for Coding Agents](/writing/building-an-observability-driven-optimization-loop-for-coding-agents), proposes the evidence interface, reference architecture, and experiment needed to test that argument.
