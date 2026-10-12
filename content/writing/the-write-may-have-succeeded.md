---
title: "The Write May Have Succeeded: Handling Unknown Outcomes in AI Agents"
description: "A timeout after a customer-impacting action does not mean the action failed. How action identity, idempotency, database constraints, and reconciliation reduce duplicate writes, and where local guarantees stop."
slug: the-write-may-have-succeeded
datePublished: 2026-08-24
dateModified: 2026-10-12
category: Agent Reliability
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
  - production-agent-guardrails
  - a-confirmation-is-not-a-boolean
  - kafka-at-least-once-idempotency
draft: false
seoTitle: "Unknown Write Outcomes in AI Agents"
---
An agent can time out after creating a refund request. The timeout describes what the caller observed. It does not prove what the database committed.

:::diagram unknown-write-outcome

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
was the request recorded?
```

For a read, retrying is often a reasonable way to recover the answer. For a write, retrying the business operation blindly can create a second effect. A natural-language retry can look harmless while repeating a customer-impacting mutation.

## An exception is not a transaction result

The application knows its request did not complete normally. It may not know whether the database or downstream service accepted the write, or whether the response was lost after commit.

That is an unknown outcome. Treating it as failure invites a retry. Treating it as success without checking may tell the customer something happened when it did not.

The control plane needs an explicit `UNKNOWN` state, preserving the action identity for recovery.

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
return prior result, wait, retry under checks, or remain UNKNOWN
```

Stable identity enables correlation and reconciliation; it does not prove an effect occurred. The recovery contract is:

| Evidence for the same scoped action | Decision |
| --- | --- |
| Matching committed receipt | Return the previous result. |
| Pending or in progress | Wait, poll, or return pending. |
| Authoritative evidence proves no effect occurred | Consider a controlled retry after current authorization, policy, confirmation, and business-state checks. |
| Outcome remains uncertain | Keep `UNKNOWN`; no blind replay. Escalate or reconcile later. |
| Identity matches but payload/fingerprint conflicts | Reject. |

An absent receipt is not proof of no effect. Reconciliation must account for concurrent attempts, in-flight writes, stale reads, and the store's consistency guarantees before ruling out a commit.

## Idempotency belongs to the business action

Idempotency belongs to the server-owned business action that passed authentication, scope checks, target resolution, policy, and confirmation.

For a local database operation, the business mutation and its idempotency receipt must commit atomically. Otherwise, the effect could commit without its receipt, leaving recovery unable to recognize the replay. The [idempotency service](https://github.com/negativexq/agentic-customer-service-platform/blob/main/app/services/idempotency.py) stages both in one savepoint within the caller's transaction; releasing it is not the final commit.

With a matching committed receipt, the same action and key resolve to the original resource, reloaded from current state. Keep keys stable across retries, scoped here by tenant, actor, and operation, and bound to a request fingerprint and customer. Retention must cover the retry/reconciliation window; expiry can remove replay protection.

The same business intent with a different key may create another operation. The [active-refund unique index](https://github.com/negativexq/agentic-customer-service-platform/blob/main/app/models/entities.py) provides a second layer: one active request per tenant and order, covering `REQUESTED`, `APPROVED`, and `PROCESSING`. It does not prohibit every later refund request.

The [refund tool](https://github.com/negativexq/agentic-customer-service-platform/blob/main/app/tools/refunds.py) creates a `RefundRequest` with `REQUESTED` status. Agent → local PostgreSQL transaction records the request; worker/service → external payment provider would issue the monetary refund. The local transaction does not span that provider. Atomic writes and receipts do not provide exactly-once external effects; the provider needs its own idempotency or reliable reconciliation contract.

The model may propose a refund again. The execution path decides whether it maps to an existing action, a new action, or an unresolved outcome needing operator attention.

## Revalidation still matters after reconciliation

A matching committed receipt establishes the recorded local effect. It does not make a new execution attempt valid.

Before a new execution attempt, the server still revalidates the authenticated actor, customer scope, authoritative target, policy result, confirmation binding, and current business state. Business state and authorization can change while a request is in flight.

Revalidation must also hold at the mutation boundary through suitable locking or conditional writes; a prior check alone leaves a race.

## Implementation evidence

In [the tests](https://github.com/negativexq/agentic-customer-service-platform/blob/main/tests/test_idempotency.py), `test_timeout_after_commit_reconciles_without_duplicate_replay` commits, injects a timeout, expects `UnknownWriteOutcomeError`, then asserts the same-key call returns the original ID with one refund-request row.

`test_concurrent_workers_share_one_refund_effect` checks that two workers using the same key return one ID, with one request and one receipt. It uses SQLite and `BEGIN IMMEDIATE`, serializing writes; it does not establish PostgreSQL or distributed deployment concurrency behavior, or payment-provider effects.

## What this changes for an agent

The agent should not respond to a timeout by confidently saying “I failed, so I will try again.” It should preserve the action identity, record the uncertain result, prevent blind replay, and route the outcome through an explicit reconciliation procedure.

The execution path reports `UNKNOWN_WRITE_OUTCOME` with `recovery_action="no_replay"`; configured audit records an `unknown` execution event. The [incident runbook](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/runbooks/idempotency-incident.md) describes receipt lookup and an approved reconciliation path. These are detection and recovery controls, not an automated background reconciliation workflow.

The [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows how confirmation, revalidation, and idempotent execution fit together. The [architecture notes](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/architecture.md) describe PostgreSQL ownership of business state, idempotency, and durable projections. [Designing Guardrails for Production AI Agents](/writing/production-agent-guardrails) explains the authorization boundary.

An exception tells you what the caller observed. Committed evidence establishes the effect within its transaction boundary. When that evidence remains inconclusive, the agent must preserve the uncertainty.
