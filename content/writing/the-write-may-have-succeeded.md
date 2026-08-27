---
title: "The Write May Have Succeeded: Handling Unknown Outcomes in AI Agents"
description: "A timeout after a customer-impacting action does not mean the action failed. How action identity, idempotency, database constraints, and unknown-write handling prevent agents from duplicating business effects."
slug: the-write-may-have-succeeded
datePublished: 2026-08-24
dateModified: 2026-08-25
tags:
  - AI Agents
  - Distributed Systems
  - Idempotency
  - Reliability
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
  - distributed-systems-reliability
  - systems-api-engineering
relatedWriting:
  - a-confirmation-is-not-a-boolean
  - kafka-at-least-once-idempotency
draft: false
seoTitle: "Unknown Write Outcomes in AI Agents"
---
An agent can receive a timeout after a refund request and still have caused a refund. The timeout describes what the caller observed. It does not prove what the database committed.

:::diagram agent-policy-flow

The failure story is short:

```text
refund requested
        ↓
database commits
        ↓
connection drops
        ↓
application sees timeout
        ↓
did the refund happen?
```

For a read, retrying is often a reasonable way to recover the answer. For a write, retrying the business operation blindly can create a second effect. Customer-service agents make this distinction more important because a natural-language retry can look harmless while repeating a refund, cancellation, or ticket mutation.

## An exception is not a transaction result

The application knows that its request did not complete normally. It may not know whether the database accepted the write, whether a downstream service accepted it, or whether the response was lost after the commit.

That is an unknown outcome. Treating it as an ordinary failure is unsafe because the next step is usually a retry. Treating it as success without checking is also unsafe because the customer may be told that something happened when it did not.

The control plane therefore needs an explicit state for uncertainty. The action should be recoverable and inspectable rather than immediately replayed with a new identity.

## Read retry and write retry are different

A read retry asks the system for the current state again. It does not normally create a second business effect.

A write retry asks the system to perform the effect again. Unless the operation has a stable identity and the storage layer recognizes the replay, the second request may be indistinguishable from a new refund.

The safe sequence is closer to this:

```text
attempt write
        ↓
outcome is uncertain
        ↓
reconcile using the same action identity
        ↓
return the existing receipt or continue safely
```

The important word is same. A retry that creates a new action identity has thrown away the information needed to decide whether it is a replay.

## Idempotency belongs to the business action

In an agent platform, idempotency should not be an afterthought around an HTTP request. It belongs to the server-owned action that passed authentication, scope checks, target resolution, policy, and confirmation.

That action can carry a stable identity and an idempotency receipt. The receipt records enough outcome information for a later attempt to distinguish an already-applied effect from an action that still needs work. Database constraints then provide a second line of defence against duplicate effects.

The model does not decide whether a retry is safe. It may propose a refund again, but the execution path decides whether that proposal maps to an existing action, a new action, or an unresolved outcome that needs operator attention.

## Revalidation still matters after reconciliation

Idempotency answers whether this exact effect has already been applied. It does not make every later attempt valid.

Before a new execution attempt, the server still revalidates the authenticated actor, customer scope, authoritative target, policy result, confirmation binding, and current business state. An order can change while a request is in flight. A pending action can expire or be superseded. A customer can lose access to a scope.

The right outcome may therefore be “already applied”, “safe to continue”, or “cannot continue without a fresh decision”. Those are different states, and collapsing them into a single retry path hides the risk.

## What this changes for an agent

The agent should not respond to a timeout by confidently saying “I failed, so I will try again.” It should preserve the action identity, record the uncertain result, and let the deterministic control plane reconcile the business state.

That is also why the repository describes unknown write outcomes as a condition that is not blindly retried. The rule protects refunds and cancellations from conversational repetition becoming duplicate business effects.

The [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows how confirmation, revalidation, and idempotent execution fit together. The repository's [architecture notes](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/architecture.md) describe PostgreSQL ownership of business state, idempotency, and durable projections.

An exception tells you what the caller observed. A receipt, a current-state check, and a stable action identity tell you what happened. AI agents need the second set of facts before they repeat a customer-impacting write.
