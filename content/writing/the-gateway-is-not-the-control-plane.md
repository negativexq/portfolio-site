---
title: "The Gateway Is Not the Control Plane"
description: "Prediction traffic and platform management have different callers, failure modes and scaling needs. Why the ML platform runs a separate inference gateway, and how it was moved from Python to Go without changing a single admission decision."
metaDescription: "Why an ML platform separates its inference gateway from the control plane, and how the gateway moved from Python to Go with identical admission behavior."
slug: the-gateway-is-not-the-control-plane
datePublished: 2026-10-22
dateModified: 2026-10-22
category: AI Platform
tags:
  - AI Platform
  - MLOps
  - Go
  - Security
featured: false
relatedProjects:
  - ml-platform-infrastructure
relatedLearning:
  - ai-platform-kubernetes
  - systems-api-engineering
relatedWriting:
  - commit-the-intent-then-touch-the-cluster
  - fail-closed-when-the-limiter-is-down
draft: false
seoTitle: "Separating the Inference Gateway from the Control Plane"
---
An ML platform has two kinds of traffic that are easy to put behind one API and hard to operate that way.

**Management traffic** comes from people and automation changing the platform: create a project, register a model, start a rollout, rotate a key. It is low volume, it needs rich authorization, and it can wait for a database transaction.

**Prediction traffic** comes from services calling models: predict, chat, invoke a function. It is high volume, latency-sensitive, often streamed, and it must keep working while someone is redeploying the management API.

The ML Platform Infrastructure project gives them separate processes:

```text
people, automation ──▶ control plane API ──▶ PostgreSQL ──▶ reconcilers ──▶ cluster
callers, services  ──▶ inference gateway ──▶ KServe ──▶ model server
```

The gateway is the only public way in to a model. It authenticates, resolves the endpoint, applies limits, forwards or streams the reply, and meters usage. It does not create, change or delete anything in the platform.

:::diagram gateway-control-plane-split

## What the gateway decides on every call

1. **Authenticate.** An API key (`mlp_live_<id>_<secret>`, compared by SHA-256 hash) or an OIDC token whose subject holds the `invoker` role in the project.
2. **Resolve the endpoint.** A missing endpoint and an internal one return the same 404, so an outsider cannot enumerate what exists.
3. **Check scope.** The key may call this endpoint, the endpoint is `READY`, the path matches its protocol, and the body is under its limit.
4. **Admit.** Two token buckets must both have room: the endpoint's, which protects the model, and the caller's, which gives each caller a fair share.
5. **Forward.** KServe's v2 protocol for models, OpenAI-compatible chat for LLMs, the unchanged body for functions. Caller credentials are not forwarded; W3C trace context and baggage are.
6. **Record.** Metrics by project, endpoint, caller and status. Label values are never strings an outsider chose.

Because the gateway runs as its own deployment, it scales with prediction load and keeps serving while the API, reconciler or migration processes restart.

## LLM admission charges before it knows the cost

A model call costs one unit. An LLM call costs tokens, and the real count is only known when the reply finishes. Admitting first and charging later lets a burst of long completions overrun every budget.

The gateway therefore reserves before forwarding: a byte-based prompt estimate plus a bounded output cap, in both buckets, atomically. When the reply completes with valid usage, unused units are refunded. An overrun becomes debt against the next calls. A streamed request is asked to include usage, so tokens are counted as the events pass through.

The failure cases are deliberately conservative. Missing usage, invalid usage or an interrupted stream keeps the full reservation charged. Invalid usage never silently becomes zero.

## Moving the data plane to Go

The first gateway ran on the same Python image as the API. That made the release simple, and it coupled prediction traffic to a large runtime image built for management work. The gateway moved to Go as a separate artifact, with one rule: **no admission decision may change**.

That rule was enforced with shared test vectors rather than reimplementation by eye:

- **88 Python-generated vectors** cover the OpenAI model override, stream usage requests, token reservation and completion, debt and refund settlement. The Go gateway matches payload semantics, budgets and rejection text for all of them.
- **Authentication contracts** cover API-key expiry, revocation and hash checks, OIDC discovery and JWKS, asymmetric signature verification, issuer, audience, expiry and subject validation, and project-membership authorization, with negative tests for each.
- **Real PostgreSQL tests** cover two independent connection pools, concurrent admission, debt and refund, a held row-lock timeout and recovery, and readiness that requires the exact schema head and the full least-privilege gateway role.

The Python version's single total deadline became per-operation upstream and read-gap deadlines. An active stream can now outlast a one-second timeout as long as it keeps producing events, while a stalled header or incomplete body still fails.

`go test -race ./...`, `go vet ./...` and the file-backed PostgreSQL acceptance suite pass. The acceptance cluster runs two Go gateway replicas; the Helm chart defaults to the Go runtime and keeps `gateway.runtime=python` as a one-line rollback.

## The image is part of the boundary

The final gateway image is a non-root scratch image with a CA bundle and a read-only filesystem: **6.75 MB**. Its build uses a digest-pinned Go builder from the repository's Dockerfile, and a provenance record ties the runtime binary to source hashes.

The first source-built candidate failed its scan with HIGH and CRITICAL findings from older dependency pins. It was rejected before rollout, the affected libraries were upgraded, and the released image's Trivy report has **zero HIGH or CRITICAL findings**. The rejected scan is kept next to the passing one, so the record shows why the release gate exists.

## Restarts without dropped calls

Separating the gateway made its own availability measurable. In the acceptance cluster, simultaneous rolling restarts of the API and gateway first succeeded on **196 of 200** in-cluster probes. The failures came from pods that stopped receiving traffic later than they stopped serving it.

A 10-second `preStop` drain closed that gap. The rerun succeeded on **200 of 200**, and the failed baseline is retained as the reason the drain exists.

## Why not one service

| Concern | One API for everything | Separate gateway |
| --- | --- | --- |
| Deploying management changes | Interrupts predictions | Predictions unaffected |
| Scaling | Management scales with model load | Each scales on its own signal |
| Attack surface | Callers reach management routes | Callers reach predict, chat, invoke only |
| Runtime | One image for both jobs | 6.75 MB Go data plane, Python control plane |
| Failure | A slow migration can stall inference | Fails closed independently |

The control plane decides what the platform should be. The gateway decides whether one call may run right now. Keeping those decisions in separate processes, with a shared database and a contract enforced by tests, lets each be changed, scaled and rolled back without touching the other.

The gateway's behavior when its shared limit store goes away is covered in [Fail Closed When the Limiter Is Down](/writing/fail-closed-when-the-limiter-is-down). The full design is in [ML Platform Infrastructure](/projects/ml-platform-infrastructure).
