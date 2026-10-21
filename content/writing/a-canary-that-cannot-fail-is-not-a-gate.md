---
title: "A Canary That Cannot Fail Is Not a Gate"
description: "A canary rollout earns trust only if it can reject a bad candidate on real traffic. How the ML platform's rollout gate decides PASS, WAIT or FAIL, why an unexercised canary fails closed, and what a live rollback test found in the metrics and the drift detector."
metaDescription: "How an ML platform's canary gate decides PASS, WAIT or FAIL, why an unexercised canary fails closed, and what a live bad-candidate rollback proved."
slug: a-canary-that-cannot-fail-is-not-a-gate
datePublished: 2026-10-22
dateModified: 2026-10-22
category: AI Platform
tags:
  - AI Platform
  - MLOps
  - Progressive Delivery
  - Reliability
featured: false
relatedProjects:
  - ml-platform-infrastructure
  - modelops-control-plane
relatedLearning:
  - ai-platform-observability
  - ai-platform-kubernetes
relatedWriting:
  - designing-a-policy-driven-model-promotion-control-plane
  - commit-the-intent-then-touch-the-cluster
draft: false
seoTitle: "A Canary That Cannot Fail Is Not a Gate"
---
Most canary rollouts are tested on the happy path. A healthy candidate goes from 10% to 100%, the dashboard stays green, and the pipeline is declared safe.

That test proves very little. A gate that has only ever passed has not shown that it can stop anything. The useful question is the opposite one:

> Given a candidate that is broken on real traffic, does the platform reject it, restore the stable revision and keep callers served?

The ML Platform Infrastructure project answers that question with a live failure injection, and the answer exposed two bugs that a happy-path test would never have found.

## The gate is a pure function

Each canary step is judged by one function with no I/O:

```text
evaluate_gate(gate, requests, error_rate, p95_latency_ms, elapsed_seconds)
    → PASS | WAIT | FAIL
```

The defaults:

| Setting | Default | Meaning |
| --- | --- | --- |
| `max_error_rate` | 1% | Above this, the step fails |
| `max_p95_latency_ms` | 500 ms | Above this, the step fails |
| `min_requests` | 20 | Below this there is too little evidence to judge |
| `step_seconds` | 60 s | How long a clean step observes before it may advance |
| Steps | 10 → 25 → 50 → 100 | Strictly increasing, the last step must be 100 |

The decision order is the safety model:

1. **A breach fails immediately**, once there is enough traffic to be sure. A candidate returning errors does not get to finish its observation window.
2. **A clean step waits** until it has observed for `step_seconds`.
3. **Not enough traffic after the window fails.** A canary nobody exercised has proven nothing, so it does not advance.
4. **Traffic without metrics fails.** If requests were seen but error rate or latency is unavailable, the gate does not assume the best.
5. Only then does the step **pass**.

Rules 3 and 4 are the ones that make the gate real. A rollout system that advances on missing data will promote anything during a metrics outage or a quiet hour.

:::diagram canary-gate-decision

## The rollout is reconciled state

A rollout is a durable record, not a running script: `PENDING → PROGRESSING → SUCCEEDED or ROLLED_BACK`. The rollouts reconciler reads the current step, shifts the traffic split on the KServe InferenceService, reads the canary revision's metrics from Prometheus, and applies the gate's verdict.

The stable revision keeps serving the rest of the traffic throughout. Every revision is immutable and binds a model artifact to its runtime settings, so "roll back" means returning traffic to a recorded revision with the exact image and configuration it had, not reconstructing what stable used to be.

## The adversarial test

The acceptance fixture deploys two container images behind one endpoint:

- **Stable:** returns 200.
- **Candidate:** passes its readiness check, then returns **503 on every POST**.

Readiness passing is the important part. A candidate that never becomes ready is caught by the deployment timeout. A candidate that is ready and wrong can only be caught by the gate.

The fixture configured the gate with a 5% maximum error rate. The recorded result:

| Measurement | Value |
| --- | --- |
| Candidate error rate | 1.0 |
| Stable error rate | 0.0 |
| p95 latency, both revisions | 4.75 ms |
| Rollout status | `ROLLED_BACK` |
| Reason | `error rate 100.00% exceeds 5.00%` |
| Candidate model version | `REJECTED` |
| Requests after rollback | 30 of 30 returned 200 |
| Restored | original stable image and platform revision 1 |

Latency could not have caught this candidate; both revisions answered in under 5 ms. Only per-revision error rate separated them, which is why the gate reads metrics per platform revision rather than per endpoint.

## Bug one: an error rate above 100%

An earlier run of the same test recorded a candidate error rate of **1.0016**. More than every request failed.

The adapter computed the error rate from separate instantaneous Prometheus queries for errors and for total requests. Between the two queries, a few more requests arrived, so the numerator and denominator described slightly different moments. On a candidate failing every call, the ratio drifted past 1.

The fix evaluates both series at one shared timestamp. Against the same real Prometheus and a 15-minute window, the corrected reading is exactly **1.0**, and the deployed-image rerun recorded 1.0 for the candidate and 0.0 for the stable revision.

An overshoot past 100% is harmless on a broken candidate. The same skew on a healthy candidate near its threshold could push a passing step over or under the line, so the shared timestamp matters most exactly where decisions are close.

## Bug two: the drift detector fought the rollout

The bad-candidate fixture failed before it reached the gate. KServe omits empty `env` lists from the specs it reports. The deployments reconciler compared desired and observed specs, saw a missing list, called it drift, and kept repairing a revision that had not changed.

The healthy-path lifecycle had already hit the same pattern with `readinessProbe.initialDelaySeconds: 0`, which KServe also omits; the reconciler created new immutable revisions in a loop. Both comparisons are now default-aware: absent and empty mean the same thing, while a removed non-empty secret reference or a changed non-zero probe delay is still detected.

A rollout cannot be judged while the platform is fighting itself over the shape of the spec. Fixing drift detection was a precondition for testing the gate at all.

## What passing means

After both fixes, the platform has two separate pieces of evidence:

- **Healthy path:** a seven-phase CPU lifecycle with real Argo training, MLflow registration, automatic evaluation, gateway inference, a 10% → 100% canary promotion with backend-specific metric samples, credential rotation, drift repair and scale-to-zero reactivation.
- **Failure path:** the bad candidate above, rejected on error rate, with the stable revision serving every request after rollback.

The second is the one that makes the first trustworthy. A canary gate is a claim that the platform will refuse a bad release. That claim is only as good as the last time someone handed it a bad release on purpose.

The [policy-driven promotion control plane](/writing/designing-a-policy-driven-model-promotion-control-plane) applies the same verdict ordering to delayed quality labels. The rollout reconciler and its evidence are in [ML Platform Infrastructure](/projects/ml-platform-infrastructure).
