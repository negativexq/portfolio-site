---
title: "Building an Observability-Driven Optimization Loop for Coding Agents"
description: "From distributed traces to verified performance improvements: an evidence interface, isolated runtime, independent verifier, and three-way experimental protocol."
slug: building-an-observability-driven-optimization-loop-for-coding-agents
datePublished: 2026-10-13
category: Agent Reliability
tags:
  - Coding Agents
  - OpenTelemetry
  - Performance Engineering
  - Benchmarking
  - Evaluation
featured: false
relatedProjects:
  - ml-platform-infrastructure
  - agentic-sre
  - agentic-customer-service-platform
relatedLearning:
relatedWriting:
  - stop-asking-coding-agents-to-guess-whats-wrong
  - hard-gates-frozen-hashes
  - decision-authority-execution-observability
draft: false
seoTitle: "An Observability-Driven Optimization Loop for Coding Agents"
---
Giving a coding agent access to Grafana is a useful start. It still leaves the agent to discover which workload produced a chart, whether the trace belongs to its checkout, how the histogram was sampled, and which command reproduces the result.

I would make those questions part of an **Agent Evidence Interface**: a bounded tool layer connecting runtime measurements, source identity, reproducible workloads, and verification. The agent proposes an explanation and a patch. A separate harness decides whether the change satisfies the contract.

This is a reference architecture and experimental protocol. It is not an implemented optimizer or a report of a successful agent-guided experiment. The [first article](/writing/stop-asking-coding-agents-to-guess-whats-wrong) explains the architectural argument; here I want to make its interfaces and evidence boundaries concrete.

## Turn observability into an engineering interface

Raw access permits queries. An engineering interface establishes what those queries mean.

A service baseline should identify the source revision, image digest, workload manifest, resource limits, observation window, and response population. A suspected regression should link to the query and artifacts supporting it. "No matching traces" should distinguish a quiet workload from collection failure, retention expiry, or sampling that missed the requests.

The interface should preserve access to underlying evidence. Precomputed summaries reduce query mistakes and context cost, but they can also hide a wrong filter or encourage the agent to accept the interface's diagnosis. Return measurements and derived hypotheses separately, with an escape hatch to inspect the relevant spans or profile frames.

Anthropic's [tool-design guidance](https://www.anthropic.com/engineering/writing-tools-for-agents) recommends meaningful context, explicit schemas, and bounded responses. Applied here, that means a small workload-scoped result with units and provenance, rather than an unrestricted dump of production telemetry.

## Reference architecture

I would start with an isolated git worktree and a disposable application runtime. A worktree separates code changes; containers, network policy, credentials, and resource quotas provide the execution boundary. Git isolation alone does not isolate a process from the host or a shared database.

The runtime contains the gateway, a controlled upstream, and a seeded PostgreSQL fixture. OpenTelemetry sends traces and metrics through a Collector. Tempo stores traces, Prometheus provides metrics, and Loki stores sanitized logs where they add diagnostic value. Pyroscope or a language-appropriate profiler supplies CPU and allocation evidence. Profiling may use a separate diagnostic run instead of remaining active during timed verification.

The benchmark runner controls arrivals and collects client measurements. A source index relates build identity to repository paths. The evidence interface queries these stores and returns bounded results to Codex or Claude Code. An independent verifier owns the protected workload, acceptance rules, and final artifact collection.

:::diagram observability-optimization-architecture

The [Mermaid source for this architecture](/diagrams/observability-optimization-loop.mmd) describes the same feedback and authority boundaries as the rendered diagram. Grafana is a human inspection surface; screenshots are not the interface's evidence format.

This stack is proposed. [ML Platform's observability configuration](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/docs/observability.md) already documents OTel, Tempo, Prometheus, and Grafana. That does not establish the proposed evidence service, Pyroscope integration, isolated optimization environment, or acceptance controller.

## Connect runtime evidence to the source revision

Trace IDs group a request's distributed work; span IDs and parent relationships describe instrumented execution. Propagate context across the gateway and upstream, and record whether asynchronous work is a child or linked operation. Lost context must remain a coverage gap rather than be reconstructed from timestamps alone.

Attach service identity and build metadata to telemetry. [OpenTelemetry's service conventions](https://opentelemetry.io/docs/specs/semconv/registry/entities/service/) define `service.version`, but do not prescribe a complete Git mapping. I would bind that version to a manifest containing the full commit SHA, dirty-tree status, image digest, compiler settings, and dependency lock identities. Source lookup must use that manifest, not the developer's current branch.

Instrument important boundaries with stable semantic attributes: operation, route template, outcome, and dependency. Add code-location attributes or a separate instrumentation map where useful. Avoid caller secrets, raw payloads, and unbounded metric labels. A trace identifier belongs in trace records or exemplars, not as a label generating a new metric series for every request.

Critical-path analysis needs overlapping intervals, not a sum of every span duration. Parallel calls and parent/child nesting make that sum double-count time. Missing spans, clock skew across hosts, and work outside the request leave uncertainty. [Tempo's TraceQL](https://grafana.com/docs/tempo/latest/traceql/) can select traces by their structure and attributes; it does not automatically establish a complete critical path or prove causality.

CPU profiles answer a different question. A wide flame-graph frame identifies accumulated samples, not necessarily wall-clock waiting. Native extensions, inlining, missing symbols, and truncated stacks can limit source attribution. For Go, [runtime/pprof](https://pkg.go.dev/runtime/pprof) supplies runtime profiles, including CPU, allocation, and appropriately enabled blocking/mutex profiles. Their sampling and overhead differ.

[Pyroscope span profiles](https://grafana.com/docs/pyroscope/latest/configure-client/trace-span-profiles/) correlate samples with active spans when the integration records span identity. Ordinary profiles do not acquire that relationship merely because traces exist nearby. A source correlation response should say whether the match comes from a symbol, explicit instrumentation, or a heuristic, and return unknown when the build cannot be matched.

## Design the Agent Evidence Interface

The following are proposed tools, not functions currently implemented in the project:

| Capability | Contract |
| --- | --- |
| `get_service_baseline` | Retrieve workload, build, population, and resource identities. |
| `find_latency_regressions` | Compare equivalent cohorts; report filters and uncertainty. |
| `get_critical_path` | Return observed intervals, overlap handling, and coverage gaps. |
| `get_cpu_hotspots` | Return profile type, stacks, symbols, and sampling settings. |
| `correlate_with_source` | Resolve a location against the measured build. |
| `get_missing_evidence` | Name unavailable observations and a bounded next diagnostic step. |
| `run_workload` | Request an allowlisted workload in the isolated runtime. |
| `compare_benchmark_runs` | Check comparability before calculating differences. |
| `check_performance_budget` | Retrieve the independent verifier's verdict. |

Separate read-only queries from workload execution. The latter consumes resources and changes fixture state, so it needs its own authorization, reset policy, and budget. Neither capability grants deployment permission.

Here is a synthetic response shape, with hypothetical values and identifiers. It is not gateway evidence:

```json
{
  "workload_id": "gateway-mixed-callers-v1",
  "commit_sha": "0123456789abcdef0123456789abcdef01234567",
  "observed": {
    "client_p95_ms": 180,
    "completed_requests": 20000,
    "limiter_queue_mean_ms": 42
  },
  "suspected_bottleneck": {
    "kind": "worker_admission",
    "status": "hypothesis",
    "supporting_trace_ids": ["0123456789abcdef0123456789abcdef"]
  },
  "source": {
    "path": "services/gateway-go/gateway.go",
    "symbol": null,
    "attribution": "phase instrumentation; symbol unresolved"
  },
  "measurement_confidence": {
    "basis": "one controlled run; no between-run estimate"
  },
  "missing_evidence": ["database lock waits", "CPU profile"],
  "next_diagnostic_action": "collect bounded DB wait evidence"
}
```

In a real response, include run IDs, query definitions, time windows, sampling rates, units, and immutable artifact references. The confidence field describes evidence quality; it is not a calibrated probability that the bottleneck hypothesis is correct. Queue mean and client p95 concern different populations and must not be added or subtracted to invent a residual latency.

## Use the Go gateway without overstating its evidence

The [Go gateway contract](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/services/gateway-go/README.md) provides a concrete setting. API and reconciler components remain Python; the previous Python gateway is retained for rollback. The Go gateway uses PostgreSQL-backed limits and bounded limiter concurrency. Its documented defaults are 12 limiter workers and 15 database connections.

The [telemetry implementation](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/services/gateway-go/telemetry.go) defines request, worker, phase, pool-acquisition, query, and transaction measurements. Root trace sampling is parent-based at 1%, while latency measurements are independently sampled at 20%. Request counters remain exact within the application recording path. Normal mode uses custom database metrics without SQL auto-spans; an empty SQL-span view is not evidence of zero database work. Those settings do not guarantee exporter delivery or sufficient samples for every low-volume cohort.

Historical measurements show why workload identity matters. The October 7, 2026 [raw runtime summary](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/docs/evidence/live-2026-10-07/observability/gateway-runtime-summary.json) records:

| 500 offered RPS, 60-second window | Python gateway | Go gateway |
| --- | ---: | ---: |
| Completed responses | 30,000 | 30,000 |
| HTTP p95 | 250.93 ms | 1.48 ms |
| Mean gateway CPU cores | 0.622 | 0.182 |

The [experiment report](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/docs/evidence/live-2026-10-07/observability/gateway-runtime-ab.md) states that every timed response was HTTP 429; no timed request reached inference. These were sequential single-CPU ARM64 lab windows with normal OTel, shared PostgreSQL, and controlled client transport. HTTP latency excludes load-generator queueing. Runtime, driver, and instrumentation implementations differed, so this was not an isolated language comparison. Separate successful forwarding smokes were functional checks, not successful-inference throughput measurements. None of these results came from the proposed agent experiment.

For a future high-p95 investigation, first identify whether the regression affects successful requests, refusals, or both. Inspect offered versus completed traffic and client queueing, then worker waiting, worker occupancy, pool acquisition, and transaction duration. Gateway CPU must be interpreted alongside throttling; database duration includes more than server execution. In this implementation, the [acquire measurement](https://github.com/negativexq/ml-platform-infrastructure/blob/6d4e9a2947db222ada4646430c86332fb74ff917/services/gateway-go/store.go) includes checkout pre-ping.

Suppose a new regression shows longer worker waiting while database time stays stable. That would prioritize worker scheduling and CPU attribution over rewriting SQL or serialization. It would not yet justify adding workers: a downstream limit may simply absorb the extra contention. A profile implicating per-request telemetry allocation could motivate a narrow allocation change that preserves instrumentation semantics. This is a hypothetical decision path, not a claim that the current gateway contains that regression.

## Build a controller that can reject the patch

The controller owns run identity, fixture resets, iteration limits, and protected verification. The model owns candidate proposals. I would implement this sequence:

1. Establish the baseline revision, workload, and acceptance manifest.
2. Run the controlled workload after the declared warm-up.
3. Collect client results, telemetry, resource data, and diagnostic profiles.
4. Identify the likely bottleneck and missing evidence.
5. Record a falsifiable hypothesis and expected side effects.
6. Apply one narrowly scoped candidate change.
7. Run correctness and contract tests.
8. Rerun the workload with equivalent settings.
9. Compare repeated baseline and candidate runs.
10. Accept, revise, or revert according to the verifier's verdict.

```python
manifest = verifier.freeze(workload, budgets, baseline_sha)
baseline = runner.measure_repeated(baseline_sha, manifest)
for attempt in range(max_attempts):
    evidence = evidence_api.collect(baseline, manifest)
    proposal = agent.propose(evidence, allowed_paths)
    candidate = sandbox.apply(proposal.patch)
    if not verifier.check_integrity(manifest, candidate):
        stop("verification inputs changed")
    if not verifier.check_correctness(candidate, manifest):
        sandbox.revert(candidate)
        continue
    measured = runner.measure_repeated(candidate, manifest)
    verdict = verifier.compare(baseline, measured, manifest)
    archive(proposal, evidence, measured, verdict)
    if verdict.accepted:
        return candidate  # reviewed artifact; not a deployment
    sandbox.revert(candidate)
return unresolved_with_evidence()
```

This pseudocode describes control flow, not available APIs. Evidence should incorporate rejected candidates and newly acquired diagnostics across attempts; the archive provides that history. Infrastructure failures and missing measurements should be classified separately from unsuccessful patches. A verifier exception must stop acceptance rather than become an empty successful result.

## Independent verification is a measurement contract

Keep workload manifests, golden outputs, budget definitions, verifier code, and their trusted hashes outside the agent-writable checkout. A hash inside an editable manifest cannot protect its own meaning. The [hard-gates article](/writing/hard-gates-frozen-hashes) discusses that authority boundary in more detail.

Correctness checks must cover the behavior an optimization could accidentally bypass: caller identity, shared limits, concurrent admission, expiry, revocation, cancellation, streaming, and refusal semantics. Faster responses are invalid if they skip necessary work. Throughput, successful-request latency, rejection counts, CPU per completed unit, and peak memory should be reported together.

For comparison, preserve payloads, caller distribution, offered arrivals, concurrency, connection reuse, fixture state, resources, and collection settings. Fix the arrival schedule when investigating overload; a client that waits for each response before offering more work can conceal demand that would have queued. Count dropped and unissued arrivals as outcomes, not as invisible requests removed from the denominator.

Separate cold starts from steady-state windows and declare warm-up rules. Alternate baseline/candidate order, reset state, and repeat runs. Publish distributions and uncertainty for the chosen effect size. Independent runs, not millions of correlated requests in one window, establish between-run variability. An inconclusive difference should produce an inconclusive verdict.

[Prometheus's histogram guidance](https://prometheus.io/docs/practices/histograms/) explains why quantile handling matters. Aggregate compatible histogram buckets before estimating a population quantile; do not average replica p95 values. Preserve bucket boundaries and sampling populations across comparisons, and use client measurements when the budget concerns client experience.

Profile diagnostically, then verify with the intended production telemetry configuration. Account for Collector, database, profiler, and load-generator CPU separately. Keep noisy neighbors and competing runs out of the measurement window. Anthropic's [infrastructure-noise study](https://www.anthropic.com/engineering/infrastructure-noise) shows that resource configuration affects agent evaluation outcomes; it is an experimental variable, not incidental setup.

Changing the benchmark during optimization invalidates the original comparison unless the contract is explicitly revised and both arms rerun. That includes arrival rate, caches, sampling, timeouts, and which response classes count as success.

## Design the three-way experiment before claiming a benefit

I would compare three conditions on the same task set:

| Condition | Evidence available to the agent |
| --- | --- |
| A: Code Only | Repository, correctness tests, and common benchmark feedback; no diagnostic telemetry. |
| B: Code + Raw Observability | A plus bounded raw metric, trace, log, and profile queries. |
| C: Code + Agent-Friendly Evidence Interface | The same underlying evidence as B, contextualized by the proposed tools. |

"Code Only" still receives timing feedback needed to attempt optimization. The independent evaluator instruments all conditions identically; A simply cannot query the diagnostic stores. Removing telemetry from A's runtime would change the software being measured.

Pin the model version, objective, harness, workload, environment, resource limits, iteration and token budgets, and verifier. Use multiple tasks with controlled, documented causes: CPU work, worker contention, pool waiting, and upstream delay. Reset to the same baseline and use fresh agent sessions for repeated trials. Randomize condition order and prevent one condition's patch or hidden answer from entering another's context.

Primary outcomes should include successful optimization rate, verified improvement, correctness regressions, and invalid optimization rate. Record root-cause accuracy only for tasks with a defensible reference cause; otherwise grade supported diagnosis separately. Also record tokens, tool calls, time to verified fix, and human intervention, including failed attempts.

Count the interface's preprocessing, query execution, and any summarizing model calls. C must not secretly receive extra compute or a hidden solution. B and C should share access scopes and evidence retention. A raw-format ablation of C's tool responses can help distinguish normalization from extra diagnostic guidance. Some guidance is the proposed interface's purpose, so the experiment must report that contribution rather than claim to measure formatting alone.

The July 8, 2026 preprint [PERFOPT-Bench](https://arxiv.org/abs/2607.07744) combines correctness checks, performance measurement, and trajectory audit, and discusses benchmark shortcuts. It supports treating invalid gains as a separate outcome. It does not demonstrate that condition C wins here. This experiment has not been run; C could help, have no effect, or mislead agents through biased summaries.

## Security and failure modes

Telemetry can contain tokens, user data, SQL parameters, and attacker-controlled text. Redact before collection, apply tenant and workload scope at the server, bound time ranges and result sizes, and retain provenance without exposing credentials. Read-only queries can still exfiltrate data, so read-only is a capability restriction, not a complete confidentiality policy.

Treat logs and telemetry attributes as untrusted data. An instruction embedded in an error message must not authorize shell execution, broaden a query scope, or change the verifier. [Agentic Security Audit](https://github.com/negativexq/agentic-security-audit/blob/04df03d9eb21b9bfc831cfd7da36becb4a7bd7d6/README.md) frames review around paths from attacker-controlled context to execution authority. That is a useful review model, not validation of this proposed interface.

Workload tools should accept registered manifests rather than arbitrary commands. Fixture mutation, production writes, deployment, and credential access need separate authorization. The [Customer Service Platform](/projects/agentic-customer-service-platform) provides relevant policy and action-boundary examples; those controls would still need implementation in an optimization harness.

Other failures are less adversarial: incomplete traces, wrong source mappings, bottleneck migration, benchmark overfitting, and observability services competing with the application. Missing evidence should stop a confident conclusion. A patch that reduces instrumentation or omits difficult requests can improve the reward while degrading the system. Independent artifacts and protected acceptance rules make those changes inspectable; they cannot compensate for a poorly chosen contract.

## Make diagnosis a first-class development capability

I would begin with one gateway, a small workload registry, a few evidence queries, and an independent verifier. Add broader automation only after measuring where that interface helps and where it introduces errors.

The [first article](/writing/stop-asking-coding-agents-to-guess-whats-wrong) argues for making systems easier for agents to diagnose. This design turns that argument into something testable: a proposed interface, a controlled intervention, and a verdict the coding agent does not own.
