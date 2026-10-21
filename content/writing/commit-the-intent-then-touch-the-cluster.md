---
title: "Commit the Intent, Then Touch the Cluster"
description: "An ML platform API that waits on Kubernetes inherits every timeout, partial apply and crash in the cluster. Why the control plane records desired state in PostgreSQL and returns, and how reconcilers turn that intent into namespaces, workflows and serving revisions safely."
metaDescription: "Why an ML platform API should record desired state and return, and how reconcilers turn it into Kubernetes, Argo and KServe resources safely."
slug: commit-the-intent-then-touch-the-cluster
datePublished: 2026-10-22
dateModified: 2026-10-22
category: AI Platform
tags:
  - AI Platform
  - MLOps
  - Kubernetes
  - Reliability
featured: false
relatedProjects:
  - ml-platform-infrastructure
relatedLearning:
  - ai-platform-kubernetes
  - distributed-systems-reliability
relatedWriting:
  - designing-a-policy-driven-model-promotion-control-plane
  - the-write-may-have-succeeded
draft: false
seoTitle: "Commit the Intent, Then Touch the Cluster"
---
A platform request to deploy a model revision looks like one action. Underneath it are several systems that fail independently: PostgreSQL, the Kubernetes API, KServe, Knative, the model registry and the object store that holds the artifact.

An API handler that calls all of them in sequence has to answer a hard question every time something goes wrong halfway: what exists now? The InferenceService may have been created before the connection dropped. The namespace quota may have been applied while the role binding was not. The caller saw a timeout; the cluster may have done most of the work.

The ML Platform Infrastructure project avoids that question by splitting the request in two:

```text
API request
   │  authorize, validate, write desired state + audit in one transaction
   ▼
202 Accepted                      ← the API is done
   ⋮
reconciler pass
   │  compare desired state with what the external system reports
   │  apply deterministic resources (same spec twice changes nothing)
   ▼
observed state written back       ← READY, FAILED, DRIFTED
```

The API never waits on Kubernetes. It records what the platform should look like and returns.

:::diagram intent-reconcile-loop

## The transaction is the decision

Creating a deployment revision does three things before anything outside the database moves:

1. **Authorizes** the caller against a policy table and their role in the project.
2. **Checks** the model version is `CANDIDATE` or `CHAMPION`, the runtime kind matches, and the requested GPUs fit the project quota.
3. **Commits** one transaction: a new immutable revision, the deployment's desired revision, status `DEPLOYING`, and an audit event carrying the person's identity and the trace ID.

Once that transaction commits, the decision exists independently of whether any process survives the next second. A crash after the commit loses nothing; the next reconciler pass reads the same desired revision and continues.

That ordering also makes the audit trail honest. The audit event says who asked for the change and when, not who happened to be running the process that eventually applied it.

## Reconcilers compare; they do not remember

Each reconciler owns one kind of external state:

| Reconciler | Drives |
| --- | --- |
| `projects` | a namespace per project with labels, ResourceQuota (GPUs included), LimitRange and NetworkPolicy |
| `runs`, `pipeline_runs` | Argo workflows; status, steps and exit codes back into the run |
| `deployments` | the KServe InferenceService for the desired revision; readiness back into the endpoint |
| `rollouts` | canary steps: shift traffic, read metrics, advance or roll back |
| `model_aliases` | the registry's `champion` and `candidate` aliases, kept equal to platform state |

None of them keeps a private memory of what it did last. A pass reads desired state from PostgreSQL, reads observed state from the external system, and applies the difference. External resources are named deterministically from platform identities, so a retried apply finds the half-made resource instead of creating a second one.

The consequence is that "crash-safe" stops being a property of each code path and becomes a property of the loop. Any step can fail and be repeated. The worst outcome of a lost pass is a delay, not a duplicate.

## Concurrency is a compare-and-swap, not a hope

Two operators can click the same button. Two reconciler replicas can briefly believe they are both responsible. Desired-state writes therefore use compare-and-swap on status: a transition applies only if the row is still in the state the writer read. A repeated request returns the existing result rather than creating a new one.

Only one reconciler should drive the cluster at a time, so the reconciler deployment uses a Kubernetes Lease for leader election. In the acceptance cluster, deleting the leader pod let the standby acquire the real Lease and take over in **31.44 seconds**. A PodDisruptionBudget keeps a voluntary eviction from removing both replicas at once: the first eviction was accepted and a concurrent second eviction was denied.

## Drift is a comparison problem

Reconciliation is only as good as its definition of "different". The live acceptance runs found two cases where KServe's own defaulting made identical specs look changed:

- KServe omitted `readinessProbe.initialDelaySeconds: 0` from what it reported. The reconciler read the missing field as drift and kept creating new immutable revisions.
- KServe omitted empty `env` lists. An absent list and an empty list meant the same thing, but the matcher treated them as a change.

Both fixes were narrow. The comparison became default-aware for those fields, while a changed non-zero probe delay or a removed non-empty secret reference is still detected as real drift. Each case has regression coverage in the KServe adapter suite. The rule that came out of it is simple: a reconciler that cannot tell defaulting from change will either churn or ignore real edits, and both are worse than a slower, explicit comparison.

## One trace across the gap

Splitting the request in two creates an observability gap: the API span ends at `202 Accepted`, and the work happens later in another process. The platform closes that gap by storing the request's trace context with the entity it changed. When the reconciler picks up the deployment, its spans continue the same trace.

An operator looking at a slow deployment sees one trace: the authorization and transaction in the API, then the reconciler's apply, then the readiness wait. The audit event names who asked; the trace shows what happened.

## A failure the loop absorbed

The dataset-triggered monitoring acceptance exposed a missing permission on its first live dispatch: the reconciler's database role could not insert the monitoring job definition it needed. Because the intent was already committed, nothing was lost. An owner-issued grant repaired the live role, the pending event retried, and the batch scoring that produced the data was not rerun. A reconciler restart during the same run preserved the same execution and created no duplicate.

The migration and role provisioning now include that permission, with dedicated PostgreSQL role regression checks. The incident is the design working as intended: the failure delayed convergence instead of corrupting state.

## What the split buys

| Concern | API that calls the cluster | Desired state + reconcilers |
| --- | --- | --- |
| Caller timeout | Unknown outcome | Intent committed, outcome observable |
| Process crash mid-apply | Half-made resources, no owner | Next pass finds and finishes them |
| Retried request | Possible duplicate | Same result returned |
| Audit | Who ran the process | Who asked, with the trace |
| Drift | Invisible until something breaks | Detected and repaired every pass |

The cost is latency between intent and reality, and a UI that must show "in flight" honestly. The platform's UI polls while something is moving and shows `DEPLOYING`, `PROGRESSING` or `DRIFTED` rather than pretending a click completed a deployment.

That is the right trade for a platform. Callers get a fast, durable answer to "was my request accepted?", and the cluster converges to that answer under failure, restarts and concurrent operators.

[ML Platform Infrastructure](/projects/ml-platform-infrastructure) contains the reconcilers, the state machines and the live acceptance evidence. The [model promotion control plane](/writing/designing-a-policy-driven-model-promotion-control-plane) applies the same desired-versus-observed idea to traffic routing.
