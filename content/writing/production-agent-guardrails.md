---
title: "Designing Guardrails for Production AI Agents"
description: "A practical execution model for tool-using agents built from typed proposals, deterministic policy, durable confirmation, revalidation, idempotency, and audit."
slug: production-agent-guardrails
datePublished: 2026-08-12
dateModified: 2026-10-04
category: Agent Reliability
tags:
  - AI Agents
  - Guardrails
  - Reliability
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
relatedWriting:
  - agent-prompt-injection-guardrails
  - rag-citation-integrity
draft: false
seoTitle: "Designing Guardrails for Production AI Agents"
---
An agent guardrail should decide what reaches a real system when the model is wrong. Prompt instructions can improve model behavior, but they cannot enforce customer ownership, make a confirmation survive a restart, prevent duplicate writes, or determine whether an order is still cancellable.

The Agentic Customer Service Platform treats the model's output as an untrusted proposal. A deterministic control plane turns that proposal into one of four outcomes: allow, deny, require confirmation, or require human handling. Execution remains behind typed tools and current business state.

## Start with a typed proposal

The model produces structured intent, request type, semantic references, and proposed arguments. Pydantic validation checks the contract before any policy or tool path sees it. The server then grounds explicit identifiers in the current user message and compiles the semantic decision into a registered tool request.

That compiler boundary keeps the model from owning the tool registry. An unknown tool is denied. A target outside the authenticated customer scope is denied. Missing or ambiguous destructive targets move to clarification instead of being guessed.

The model can still choose the wrong intent or propose an unsafe action. The next layers decide whether that proposal can execute.

## Put risk on the tool registry

Risk belongs to server-owned tool metadata. In this application's registry, read operations map to Risk 0, support-ticket creation to Risk 1, cancellation and refund to Risk 2, and human escalation to Risk 3. These are application-specific routing categories, not a universal scale of agent risk.

The default policy is small enough to inspect:

| Risk | Policy outcome | Execution path |
| ---: | --- | --- |
| 0 | `allow` | Execute after validation. |
| 1 | `allow` | Execute the validated write with idempotency. |
| 2 | `require_confirmation` | Persist a pending action and stop. |
| 3 | `require_human` | Use the dedicated escalation path. |

The policy also checks that a customer exists in the execution context and that any requested customer matches it. Unknown tools return `deny`. An exception during policy evaluation fails closed.

This policy is intentionally deterministic. The model does not estimate risk or decide that a confirmation is inconvenient.

:::diagram agent-policy-flow

## Confirmation is a state machine

A Risk 2 proposal creates a `PendingAction`. It contains a stable `action_id`, actor and customer scope, conversation ID, tool name, validated arguments, risk level, creation time, and status. The action persists with the agent checkpoint, so a backend restart does not erase the confirmation boundary.

The initial request does not mutate business state. A later confirmation is parsed against a bounded set of accepted and rejected phrases. Ambiguous text does not execute. The default TTL is 300 seconds.

Before execution, revalidation checks:

- the pending action is confirmed;
- actor, actor type, customer, and conversation still match;
- the tool remains registered and revalidatable;
- stored arguments still pass the tool schema;
- the customer scope still matches;
- the current order or refund state still permits the action.

The tests cover the lifecycle directly. They verify that a Risk 2 request stays pending, confirmation executes the exact stored action once, stale business state blocks execution, expired actions fail, and pending actions cannot cross customer or conversation boundaries.

Revalidation is not enough if business state can change between the check and the write. The business service must enforce the relevant preconditions at the mutation boundary, using a transaction with appropriate locking or a conditional update. Otherwise, an order could become ineligible after the agent checks it but before cancellation commits. Confirmation authorizes the stored action; it does not override current business rules.

For a refund request, two invariants need separate protection: the order must be eligible when the request is created, and the order must not acquire multiple active refund requests. A partial unique index can enforce the second invariant. The first requires a concurrency-safe eligibility check held through the mutation transaction, such as validation under a row lock. Other order-state writers must follow compatible business rules; a lock around request creation cannot prevent an incompatible transition after commit.

## Follow one refund through the boundaries

Consider an illustrative request: "Refund order ORD-1042 because the item arrived damaged." The identifier and reason come from the user's message; eligibility comes from authenticated business data. The model's interpretation alone establishes neither ownership nor permission to refund. The sequence below describes the safety contract for creating a local refund request.

1. The model proposes a refund intent with the order reference and stated reason. Schema validation checks its structure, and grounding checks that the proposed arguments are supported.
2. The server resolves the order within the authenticated customer's scope and checks refund eligibility. An unrelated order or unsupported argument stops the request here.
3. Policy routes the validated refund to confirmation. The server persists the exact action under a stable `action_id`; no refund mutation has occurred.
4. The user reviews and confirms that action. A changed order, amount, or reason must be treated as a changed proposal, with fresh validation and approval.
5. Revalidation checks identity, conversation, expiry, arguments, and current eligibility. To close the check-to-write race, the business service must also protect the relevant preconditions at the write boundary.
6. For the local database effect, the mutation and its idempotency receipt commit together. The response describes the committed outcome rather than the model's intended outcome.

:::diagram refund-execution-sequence

Suppose another operator creates an active refund request while the user is considering the confirmation. The stored proposal can still be the one the user approved, but creating another active request is no longer eligible. Execution must stop and explain that a refund request already exists. Approval does not reserve the business state.

The confirmation surface is part of this design. It should show the operation, order identifier, affected items where relevant, and the amount and currency when money is involved. Those details should come from the validated action and authoritative business data. A generic "Proceed?" or a model-written summary can hide a mismatch between what the user thinks they approved and what the tool will receive.

## Make writes replay-aware

Every business write needs a stable action identity. Agent writes use the server-generated `action_id`; direct operator APIs require an `Idempotency-Key`. The service commits the idempotency receipt in the same PostgreSQL transaction as the mutation.

If a read fails transiently, bounded retry may help. Writes follow a stricter recovery contract. When the system cannot tell whether a write committed, it returns `UNKNOWN_WRITE_OUTCOME` with `recovery_action="no_replay"`. Recovery must preserve the original action identity and reconcile using the same stable key. Creating a replacement action with a new key could turn an ambiguous success into a duplicate mutation.

The database receipt determines whether the effect already exists. The idempotent service returns the prior result when the same scoped key and request match a committed receipt; a same-key retry does not create a second effect. The agent runtime's `no_replay` response is a recovery policy that stops automatic execution after an uncertain commit, not a claim that same-key retries inherently duplicate writes. The key remains bound to the actor, tenant, operation, customer, and request fingerprint; it cannot authorize a different write.

## Keep external effects outside the local guarantee

The PostgreSQL transaction protects effects committed inside that database. It cannot atomically commit a refund at an external payment provider. A local receipt alone therefore cannot establish that money moved exactly once.

For a deployment that adds an external payment integration, the design needs a durable payment-operation identity, provider-side idempotency, and reconciliation of uncertain outcomes. One option is to commit the refund request and an outbox record together, then let a worker submit the provider request under a stable key. The [transactional outbox pattern](https://docs.aws.amazon.com/prescriptive-guidance/latest/cloud-design-patterns/transactional-outbox.html) closes the gap between a local state change and recording work for delivery; duplicate delivery still requires idempotent handling.

Provider guarantees must be checked separately, including key retention and parameter matching. [Stripe's idempotency contract](https://docs.stripe.com/api/idempotent_requests), for example, defines how repeated keys and changed parameters are handled. If the provider response is lost, keep the operation unresolved until its outcome can be reconciled. The user-facing status should distinguish a recorded refund request from a completed payment refund. These are requirements for that integration, not capabilities established by the local database evidence in this article.

## Audit the lifecycle without using audit as authority

Policy and execution events are written to a bounded audit model. Risk 1 records policy, attempt, and outcome. Risk 2 adds confirmation and revalidation. Risk 3 records the human-required decision and escalation persistence outcome.

Events use deterministic IDs derived from run, action, stage, and outcome, so replayed observations do not append unlimited duplicates. The audit stores structured lifecycle metadata rather than raw prompts, free-form tool arguments, or business payloads.

Audit is evidence. Authentication, policy, business state, confirmation validity, and idempotency never consult it. That separation avoids making an observability store part of the authorization path.

There is one important execution boundary: pre-write audit must succeed before a protected mutation starts. This is a fail-closed availability tradeoff: if that audit step is unavailable, the protected write is blocked. Post-commit audit failure is surfaced as an operational problem but does not justify submitting a new business action. The idempotency receipt remains authoritative.

The lifecycle makes the expected failure behavior explicit:

| Failure | Required behavior |
| --- | --- |
| Backend restarts while confirmation is pending | Recover the stored action; check scope and expiry before accepting confirmation. Recovery does not grant approval. |
| Confirmation arrives twice or concurrently | Resolve both attempts against the same action identity; prevent a second business effect at the database boundary. |
| Eligibility changes before the write | Block the mutation and explain the changed business state. |
| Confirmation expires | Reject execution; any renewed proposal needs validation and fresh confirmation. |
| Write outcome is unknown | Preserve the original key and reconcile; do not create a replacement action. |
| Pre-write audit fails | Block the protected mutation. |
| Post-commit audit fails | Surface the audit failure while preserving the committed business outcome. |

## Make blocked requests recoverable for the user

Strict grounding and bounded confirmation parsing have a usability cost: they can stop a legitimate request whose target or approval is unclear. The recovery path should ask for the missing detail and show the stored action again, rather than silently relax the execution rule.

For example, "Yes, but first, what is your refund policy?" should not count as approval. The agent can answer the question while keeping the refund unexecuted, then request explicit confirmation when the user returns to it. If the target remains ambiguous or the request requires an exception to business rules, the dedicated human-handling path should carry the validated context. Escalation transfers the unresolved request; it does not authorize the original mutation.

## Evaluate the containment path in layers

The repository keeps semantic, operational, resilience, and real-LLM evidence separate, with each denominator preserved rather than merged into one score. A single task-success number would blur questions that need different answers.

The deterministic suites cover 110 general scenarios, a 40-scenario safety slice, and 28 resilience scenarios. They use a fake structured-decision provider to exercise the control plane reproducibly. Prospective runs then measure live-model evaluation attempts against a frozen bilingual dataset and an exact model and provider configuration. An attempt can be blocked before any business tool executes.

The evaluation distinguishes unsafe semantic proposals, proposals that survive deterministic pre-execution containment, and unsafe executions. The report names the middle metric `unsafe executable survivors`. Here, these containment survivors include unsafe proposals admitted to a pending-action workflow that still requires confirmation. They have survived the earlier guards, but they do not yet have permission to execute.

An earlier prospective run observed 29 unsafe semantic proposals. Deterministic guards stopped 26 before admission to that workflow, and three reached a confirmation-required pending action without executing. The confirmation boundary prevented an immediate effect, but the system still held unsafe actions that a later approval could potentially authorize. Zero unsafe executions therefore did not establish that every unsafe proposal was stopped before entering a pending-action workflow.

Closing most of that gap was architectural: semantic grounding and destructive-target admissibility checks. The remaining provenance failure was then addressed with a targeted prompt-contract fix. The reported sequence of five evaluations reduced containment survivors from 15 to 3, then recorded zero in each of the next three evaluations. Those counts describe successive runs, not a pooled success rate.

The current prospective run reports 0 unsafe executions across 540 measured semantic-safety attempts:

| Observation | Count |
| --- | ---: |
| Unsafe semantic proposals | 30 |
| Deterministic guard interventions on those proposals | 30 |
| Unsafe executable survivors | 0 |
| Unsafe executions | 0 |
| Confirmation bypasses | 0 |
| Unauthorized mutations | 0 |
| Duplicate mutations | 0 |

The repository's [release evidence](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/release-evidence.md) identifies the D2c experiment as `d2c_m6_29_semantic_v3_20260822T011436Z`, bound to source commit `3ae1489fcb9350ddf7f6319e3a67bf7aa5d7f859`, contract `semantic_decision_v3`, and dataset `live_eval_v2`. The [real-LLM QA report](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/security/real-llm-production-qa-report.md) provides additional QA context. The 540 attempts are the full measured run, including attempts stopped by guards; the 30 unsafe proposals are the observed subset used to assess this containment funnel.

That is evidence for one source, prompt, model, provider, and contract binding. It does not claim that model errors stopped happening. It claims that deterministic containment stopped the observed unsafe proposals before admission to an execution workflow.

## Boundaries are the guardrail

The implementation does not rely on one classifier or one system prompt. Typed contracts reject malformed output. Grounding rejects unsupported targets. Business services enforce ownership and current state. Policy assigns the action path. Confirmation binds approval to durable state. Idempotency controls replay. Audit makes the lifecycle inspectable.

Each boundary has a narrower job and a testable failure mode. Together they keep a probabilistic proposal separate from a privileged effect.

The [Agentic Customer Service Platform](/projects/agentic-customer-service-platform) case study contains the current evidence and the limits of what it claims. The focused note on [prompt injection](/writing/agent-prompt-injection-guardrails) examines how retrieved and user-controlled text stays outside the authorization boundary.
