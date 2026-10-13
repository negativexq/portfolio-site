# Agent-Friendly Codebases: publication evidence audit

Research and source checks: 2026-10-13. This record supports the two articles dated
2026-10-13; it is not an experiment report. External research was read from primary
publisher pages and full preprints. Project source was inspected in temporary
research checkouts using read-only inspection; no project implementation was changed or benchmark rerun.

## External claims

| Source | Classification and verified claim | Publication |
| --- | --- | --- |
| [OpenAI Harness engineering](https://openai.com/index/harness-engineering/) | Internal engineering case study; worktree-local application and ephemeral logs/metrics/traces, with LogQL/PromQL access. Not a comparative optimization benchmark. | 2026-02-11 |
| [PerfAgent](https://arxiv.org/abs/2607.19653), [full v1](https://arxiv.org/html/2607.19653v1) | Preprint; curated profiler feedback, refinement controller, verification. Reported GPT-5.1 GSO expert-matching rate 19.6% to 39.2%. Not evidence for this gateway or proposed interface. | Submitted 2026-07-22 |
| [PERFOPT-Bench](https://arxiv.org/abs/2607.07744), [full v1](https://arxiv.org/html/2607.07744v1) | Preprint; correctness, measured performance, trajectory audit, benchmark shortcuts. No leaderboard or task-count claim is reproduced because the full-text scope differs from the abstract. | Submitted 2026-07-08 |
| [o11y-bench](https://grafana.com/blog/o11y-bench-open-benchmark-for-observability-agents/) | Vendor-maintained open benchmark announcement; synthetic observability environments and checks of reference queries/saved state. Not repository-patching performance evaluation. | 2026-04-21 |
| [Anthropic tool design](https://www.anthropic.com/engineering/writing-tools-for-agents) | Engineering guidance; meaningful bounded results, explicit schemas and context-efficient responses. No universal improvement claimed. | 2025-09-11 |
| [Anthropic long-running harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Engineering case study; progress artifacts and end-to-end verification across sessions. | 2025-11-26 |
| [Anthropic infrastructure noise](https://www.anthropic.com/engineering/infrastructure-noise) | Experimental engineering report; resource configuration can alter evaluation outcomes. No effect size transferred to our proposal. | 2026-02-05 |
| [OTel sampling](https://opentelemetry.io/docs/concepts/sampling/) | Documentation; head/tail decision boundaries and sampling limitations. | Living documentation |
| [OTel service conventions](https://opentelemetry.io/docs/specs/semconv/registry/entities/service/) | Specification; service.version does not mandate a Git/source mapping. | Living specification |
| [Tempo TraceQL](https://grafana.com/docs/tempo/latest/traceql/) | Product documentation; structural/attribute trace selection, not automatic causal proof. | Living documentation |
| [Pyroscope span profiles](https://grafana.com/docs/pyroscope/latest/configure-client/trace-span-profiles/) | Product documentation; requires span-aware sample labeling. | Living documentation |
| [Go runtime/pprof](https://pkg.go.dev/runtime/pprof) | Official API reference; runtime profiles and collection requirements. | Versioned API documentation |
| [Prometheus histograms](https://prometheus.io/docs/practices/histograms/) | Official documentation; distributions can be aggregated, precomputed quantiles cannot be combined into a population quantile. | Living documentation |

These preprints are described as preprints, not as peer-reviewed findings. Their
reported results were checked against source, not independently reproduced.

## Project evidence

ML Platform inspected at `6d4e9a2947db222ada4646430c86332fb74ff917`:

- `services/gateway-go/README.md`, `gateway.go`, `store.go`, `telemetry.go`: Go gateway,
  retained Python rollback runtime, PostgreSQL-backed limiter, worker/pool bounds,
  phase/worker/pool/query/transaction metrics, pre-ping inside acquisition timing,
  parent-based 1% root tracing, independent 20% latency samples, application counters.
- `docs/observability.md` and Collector/Kubernetes configuration: OTel, Tempo,
  Prometheus and Grafana. No claimed evidence-interface or Pyroscope deployment.
- `docs/evidence/live-2026-10-07/observability/gateway-runtime-summary.json`, raw
  `gateway-runtime-500.json`, and `gateway-runtime-ab.md`: both 500-RPS arms completed
  30,000 requests; HTTP p95 250.930584/1.479583 ms; mean CPU
  0.6218754657179147/0.182122690317964 cores in the summary. Rounded article values
  are 250.93/1.48 ms and 0.622/0.182. The raw 500-RPS artifact and derived
  summary were checked together.
- Timed responses were all 429 and never reached upstream inference. HTTP p95 excludes
  load-generator queue delay. One sequential run per runtime/rate, ARM64 kind,
  one-CPU gateway, normal telemetry. Not confidence intervals, maximum capacity,
  successful inference throughput, or an agent experiment.
- `gateway-cpu-profile.md` and profile JSON: historical Python Yappi profiling
  materially slowed throughput; approximately 3.3-fold slowdown is diagnostic scope,
  not normal-runtime attribution. Separate unprofiled checks are required.
- `gateway-concurrency-followup.md`: existing cache/OIDC concurrency improvements
  are not presented as missing features or outcomes of our proposed loop.

Agentic SRE inspected at `905ab7d784a72bd15a783c406063e2225a9f80dd`:
`docs/architecture.md` and investigation modules establish bounded read-only
investigation, explicit information gaps, and deterministic downstream verification.
No diagnostic accuracy measurement is transferred to code optimization.

Agentic Customer Service Platform: execution/idempotency/audit and runbook sources
reviewed earlier in this repository's article audit establish relevant authority and
evidence boundaries. The new article links the case study as a neighboring pattern;
it does not claim those controls already protect an optimization harness.

Agentic Security Audit inspected at `04df03d9eb21b9bfc831cfd7da36becb4a7bd7d6`:
README describes a coverage-led review skill following untrusted context to execution
authority. It is not a telemetry product or security validation of the proposed design.

## Explicitly unexecuted

The evidence tool API, controller pseudocode, JSON measurements/trace identifiers,
future gateway regression, and A/B/C experiment are illustrative or proposed. No
optimization success rate, winning condition, provider benchmark, or production
validation is claimed. The Mermaid definition and site SVG present a reference
architecture, not a deployment inventory.
