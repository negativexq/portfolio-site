---
title: "Designing Guardrails for Production AI Agents"
description: "A practical execution model for tool-using agents built from typed proposals, deterministic policy, durable confirmation, revalidation, idempotency, and audit."
slug: production-agent-guardrails
datePublished: 2026-08-12
dateModified: 2026-08-12
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
seoTitle: "Designing Guardrails for Tool-Using AI Agents"
---
An agent guardrail should decide what reaches a real system when the model is wrong. Prompt instructions can improve model behavior, but they cannot enforce customer ownership, make a confirmation survive a restart, prevent duplicate writes, or determine whether an order is still cancellable.

The Agentic Customer Service Platform treats the model's output as an untrusted proposal. A deterministic control plane turns that proposal into one of four outcomes: allow, deny, require confirmation, or require human handling. Execution remains behind typed tools and current business state.

## Start with a typed proposal

The model produces structured intent, request type, semantic references, and proposed arguments. Pydantic validation checks the contract before any policy or tool path sees it. The server then grounds explicit identifiers in the current user message and compiles the semantic decision into a registered tool request.

That compiler boundary keeps the model from owning the tool registry. An unknown tool is denied. A target outside the authenticated customer scope is denied. Missing or ambiguous destructive targets move to clarification instead of being guessed.

The model can still choose the wrong intent or propose an unsafe action. The next layers decide whether that proposal can execute.

## Put risk on the tool registry

Risk belongs to server-owned tool metadata. The current registry maps read operations to Risk 0, support-ticket creation to Risk 1, cancellation and refund to Risk 2, and human escalation to Risk 3.

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

## Make writes replay-aware

Every business write needs a stable action identity. Agent writes use the server-generated `action_id`; direct operator APIs require an `Idempotency-Key`. The service commits the idempotency receipt in the same PostgreSQL transaction as the mutation.

If a read fails transiently, bounded retry may help. Writes follow a stricter rule. When the system cannot tell whether a write committed, it returns `UNKNOWN_WRITE_OUTCOME` with `recovery_action="no_replay"`. Automatically trying again could turn an ambiguous success into a duplicate mutation.

The caller can reconcile with the same key. The database receipt, not an in-memory retry counter, decides whether the effect already exists.

## Audit the lifecycle without using audit as authority

Policy and execution events are written to a bounded audit model. Risk 1 records policy, attempt, and outcome. Risk 2 adds confirmation and revalidation. Risk 3 records the human-required decision and escalation persistence outcome.

Events use deterministic IDs derived from run, action, stage, and outcome, so replayed observations do not append unlimited duplicates. The audit stores structured lifecycle metadata rather than raw prompts, free-form tool arguments, or business payloads.

Audit is evidence. Authentication, policy, business state, confirmation validity, and idempotency never consult it. That separation avoids making an observability store part of the authorization path.

There is one important transaction boundary: pre-write audit must succeed before a protected mutation starts. Post-commit audit failure is surfaced as an operational problem but does not make the business write replayable. The idempotency receipt remains authoritative.

## Evaluate the containment path in layers

The repository separates model semantic quality, deterministic runtime containment, execution safety, and production readiness. A single task-success score would mix those questions.

The deterministic suites cover 110 general scenarios, a 40-scenario safety slice, and 28 resilience scenarios. They use a fake structured-decision provider to exercise the control plane reproducibly. The prospective M6.20B run then measured 540 live-model executions against a frozen bilingual dataset and exact model/provider configuration.

That live run observed 29 unsafe semantic proposals. Guards stopped 26 before executable state. Three survived to a confirmation-required proposal, and none executed. It also recorded 0 confirmation bypasses, 0 unauthorized mutations, and 0 duplicate mutations.

The three survivors prevent a production-readiness claim. They show why "nothing unsafe executed" and "the runtime contained every unsafe proposal before executable state" are different results. The next change must address that exact gap and rerun the frozen evaluation.

## Boundaries are the guardrail

The implementation does not rely on one classifier or one system prompt. Typed contracts reject malformed output. Grounding rejects unsupported targets. Business services enforce ownership and current state. Policy assigns the action path. Confirmation binds approval to durable state. Idempotency controls replay. Audit makes the lifecycle inspectable.

Each boundary has a narrower job and a testable failure mode. Together they keep a probabilistic proposal separate from a privileged effect.

The [Agentic Customer Service Platform](/projects/agentic-customer-service-platform) case study contains the current evidence and known limitation. The focused note on [prompt injection](/writing/agent-prompt-injection-guardrails) examines how retrieved and user-controlled text stays outside the authorization boundary.
