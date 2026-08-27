---
title: "Designing a Policy-Driven Model Promotion Control Plane"
description: "Model deployment is not complete when a container starts. How progressive traffic, delayed ground truth, explicit policy outcomes, rollback, and desired-versus-observed reconciliation make model promotion a control-plane problem."
slug: designing-a-policy-driven-model-promotion-control-plane
datePublished: 2026-08-25
dateModified: 2026-08-25
category: AI Platform
tags:
  - MLOps
  - AI Platform
  - Progressive Delivery
  - Reliability
featured: true
relatedProjects:
  - modelops-control-plane
relatedLearning:
  - ai-platform-observability
relatedWriting:
  - testing-ai-agents-without-pretending-they-are-deterministic
draft: false
seoTitle: "Designing a Policy-Driven Model Promotion Control Plane"
---
Deploying a new model is easy to describe as a binary event: the container is healthy, so send it traffic. That description leaves out the part that can hurt production. A candidate can be available and still be too slow, too error-prone, or not yet measurable from the quality data that has arrived.

:::diagram model-promotion-control-loop

The real question is not "is version two running?" It is:

> Has this candidate earned the next amount of production traffic from the evidence available so far?

That question needs a control plane. It needs a policy decision, a durable rollout state, an actor that can advance or reverse the rollout, and a way to reconcile the state the database wants with the state the router is actually serving.

## A canary is a sequence of decisions

The ModelOps Control Plane starts a candidate at a small traffic percentage and advances it through explicit stages:

```text
10% canary
    ↓ PASS
25% canary
    ↓ PASS
50% canary
    ↓ PASS
100% traffic
    ↓
promoted
```

The happy path is only one outcome. A failing policy rolls the candidate back. A policy that cannot decide because the data is still insufficient remains inconclusive. That distinction matters because "not enough evidence yet" is not the same as "healthy."

The rollout has a state machine rather than a loose collection of flags:

```text
PENDING → DEPLOYING → CANARY_RUNNING → EVALUATING
                                      ↙          ↘
                              ROLLING_BACK     PROMOTING
                                  ↓               ↓
                            ROLLED_BACK       PROMOTED
```

Every transition becomes part of the deployment timeline. The policy result and the action that followed it are separate records, so an operator can see whether a human or the automated worker made the change.

## The worker should not own rollout state

The automated worker is a separate stateless process. It evaluates deployments through the control plane API and calls the same advance, promote, rollback, or inconclusive paths that a human operator can call.

That choice avoids a fragile split-brain design. If the worker restarts, it does not need a private in-memory index to remember which stage came next. It reads the deployment's current traffic allocation and chooses the smallest configured stage above the current weight. The database remains the source of rollout state.

The worker also uses the persisted policy evaluation timestamp to avoid evaluating the same deployment repeatedly before its policy window has elapsed. The record it needs already exists in the control plane. Restart recovery comes from durable state, not from reconstructing a missing worker session.

## Reliability data arrives now. Quality data arrives later.

Latency and error rate can be measured as traffic flows. Ground truth usually cannot. The actual outcome for a prediction may arrive after the request, through another API call, and possibly before the corresponding metric row has been written.

The platform gives each prediction a stable `prediction_id`. A later label uses that identifier to grade the exact prediction that produced it. The label endpoint is idempotent for the same `(prediction_id, actual_label)` pair and rejects a conflicting label instead of silently replacing ground truth.

The write order is deliberately independent:

```text
prediction metric                  ground-truth label
        │                                  │
        └──────── prediction_id ───────────┘
                         ↓
                 read-time join
                         ↓
                 quality summary
```

An early label is stored even if its metric has not arrived. Quality aggregation joins the two records when it reads the window. This avoids a check-then-act handshake between two independent writers, and it means label arrival order does not decide whether a prediction is eventually measurable.

## One window is not enough

The freshest traffic window is useful for reliability. It is a poor quality window when labels are delayed, because the newest predictions are also the least labeled.

The policy engine therefore evaluates two slices:

| Evidence | Window | Checks |
| --- | --- | --- |
| Reliability | Freshest traffic | Minimum requests, p95 latency increase, error rate |
| Quality | Older matured traffic | Labeled samples, coverage, positive labels, recall |

Quality does not run just because a few labels happen to look good. Before recall is evaluated, the platform checks minimum labeled samples, label coverage, and minimum positive labels. Recall's denominator is the number of positive examples, not the total number of labeled examples. A low-base-rate fraud dataset can have many labels and still contain too few positives to support a trustworthy recall decision.

This is the difference between a measurement system and a dashboard that always wants to show a number. When data is insufficient, the policy returns `INCONCLUSIVE` and says why.

## The verdict ordering is part of the safety model

The overall policy result follows a strict order:

```text
FAIL > INCONCLUSIVE > PASS
```

One failing check fails the overall evaluation. An inconclusive check cannot be outvoted by other passing checks. Only when the required checks have enough data and all of them pass can the worker advance traffic or promote the candidate.

This ordering prevents a dangerous kind of optimism. A canary with excellent latency but no mature quality evidence has not passed the rollout. It has not failed either. It is waiting for the evidence required to decide.

## Desired state and observed state are different

The database owns the desired traffic allocation. The router holds an in-memory configuration that can be lost on restart. A successful control-plane update therefore does not prove that the router still serves the same split.

The platform treats this as a reconciliation problem:

```text
database desired state
          ↓ diff
router observed state
          ↓ drift
reconcile and push again
```

Traffic-changing actions commit the desired state first. The router push is best effort afterward. A worker-triggered reconcile tick compares the desired allocation with the router's observed revision and repairs drift. A router restart can therefore lose its cache without permanently losing the rollout decision.

There is intentionally no outbox table in this design. The desired allocation is already durable in the deployment and traffic-allocation records. Adding a second queue of pending router pushes would duplicate the same state and create another consistency boundary. Reconciliation compares two existing states directly, like a controller comparing a resource specification with live status.

## Concurrency needs more than a status check

Two actors can read the same active deployment at the same time. A human may promote it while the worker is responding to a policy failure. Checking `status` before the write is useful for a friendly error, but it does not close that race.

The backend also uses optimistic concurrency on the deployment row. The first transaction to commit wins. A stale writer receives a conflict instead of overwriting the winner's result. A partial unique index provides a database-level guarantee that one model cannot have two unresolved rollouts at once.

Routing revisions are scoped to the model, not only to a deployment. That matters after one rollout is superseded by another. A delayed push from the old deployment must not be able to arrive later and resurrect stale traffic just because it belongs to a different deployment identifier. The router rejects an equal or stale revision, and the reconciler can converge on the authoritative desired state.

There is also a manual automation hold. An operator can pause the worker for one deployment while inspecting it without stopping automation for every other rollout. The worker makes no automated calls for a paused deployment, while manual actions remain available.

## Evidence from the real stack

The project does not treat a mocked worker call as proof of automated promotion. Its integration CI boots the real Docker Compose stack and exercises six scenarios, including:

- a manual create, evaluate, and promote path;
- an injected latency fault that the real worker detects and rolls back;
- a healthy candidate that advances through `10% → 25% → 50% → 100%`;
- a weak candidate that rolls back on a genuine recall failure;
- router restart recovery during a rollout;
- startup recovery after a deployment has already reached a terminal state.

The repository also reports 279 backend tests with roughly 91% statement coverage, plus Ruff and strict mypy checks. Those unit tests and the real-stack integration scenarios answer different questions. The unit suite gives fast, precise regression coverage. The integration job verifies that the worker, API, router, serving containers, database, and dashboard-facing surfaces cooperate as deployed.

The ground truth in the benchmark scenarios is synthetic-sourced, but it travels through the real label ingestion API with delay and partial coverage. That is useful evidence about the control loop. It is not a claim that the project has learned from live production feedback.

## What this control plane does not claim

This is a focused reference implementation, not a complete production MLOps platform. It uses SQLite, supports one logical model in the current dashboard shape, and intentionally leaves authentication, environment separation, cost, drift, data-quality, and long-horizon availability policies for future evolution. Kubernetes, MLflow, and Prometheus are not hidden behind the demo. They are explicitly outside its current scope.

The limitation is explicit. A promotion policy is only as credible as the evidence behind its checks. Adding a `drift` or `cost` status without the data source that measures it would make the UI look more complete while making the decision less trustworthy.

The [ModelOps Control Plane project](/projects/modelops-control-plane) shows the implementation and current evidence. The repository's [README](https://github.com/negativexq/modelops-control-plane/blob/main/README.md) covers the runnable system, while the [design notes](https://github.com/negativexq/modelops-control-plane/blob/main/docs/DESIGN_NOTES.md) explain the reconciliation, policy, concurrency, and label-ingestion decisions in detail.

Model promotion is a sequence of evidence-backed decisions, executed by a durable control loop with rollback and reconciliation as core behavior.
