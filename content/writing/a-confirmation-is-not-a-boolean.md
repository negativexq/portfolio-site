---
title: "A Confirmation Is Not a Boolean: Designing Stateful Agent Workflows"
description: 'Why "yes" is not always approval, and how interruption, suspension, resume, revalidation, and durable state make consequential agent workflows safe.'
slug: a-confirmation-is-not-a-boolean
datePublished: 2026-08-25
dateModified: 2026-08-25
tags:
  - AI Agents
  - Stateful Workflows
  - Reliability
  - LangGraph
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
relatedWriting:
  - production-agent-guardrails
  - agent-prompt-injection-guardrails
  - rag-citation-integrity
draft: false
seoTitle: "Stateful Agent Workflows: Why Confirmation Is Not a Boolean"
---
A consequential agent action does not become safe because the latest message contains the word "yes". The system has to know what the customer is confirming, whether the message is actually an approval, whether the pending action is still valid, and whether the workflow can resume without changing the action behind the user's back.

:::diagram agent-policy-flow

Consider a refund request:

```text
refund proposed
        ↓
confirmation required
        ↓
"Yes, but first, what is your refund policy?"
        ↓
not confirmation
        ↓
workflow suspended
        ↓
grounded RAG answer
        ↓
refund still pending
        ↓
explicit resume
        ↓
fresh confirmation
        ↓
revalidation
        ↓
execution
```

That sequence is the useful part of the design. The customer can ask a question without losing the pending refund, and the question cannot accidentally approve it.

## A confirmation belongs to an action

The model may propose a refund, but it does not own the action that eventually executes. The server creates a pending action with the trusted customer scope, conversation, validated target, typed arguments, policy result, and confirmation state.

The confirmation boundary therefore has something concrete to bind to. It is not a flag attached to the last model response. It is approval for one server-owned action in one conversation and one customer scope.

This distinction matters when a user writes:

> Yes, but first, what is your refund policy?

The first two words look like approval in isolation. The complete message contains a question and changes the conversational task. Treating the message as a boolean would turn a natural interruption into a business mutation.

The safer result is to classify the message as an interruption, keep the pending action unchanged, and answer the policy question through the bounded knowledge path.

## Suspension is a state transition

The refund does not disappear while the system answers the question. It moves from a confirmation-waiting state to a suspended workflow state. The stored action remains available, but it is not executable while the interruption is active.

The distinction is easier to reason about as a state machine:

| State | Meaning |
| --- | --- |
| `proposed` | The model has suggested an intent. No business effect exists. |
| `confirmation_required` | The server has compiled an eligible action and is waiting for approval. |
| `suspended` | The workflow is interrupted by another request, such as a policy question. |
| `resumed` | The customer explicitly returns to the pending workflow. |
| `revalidated` | Current scope, target, policy, and business state still permit the action. |
| `executed` | The typed business path committed the effect once. |

The names are less important than the invariants. A suspended workflow cannot execute because a knowledge answer happened. A resumed workflow does not skip confirmation. A state transition does not grant authority by itself.

The repository walkthrough exercises this behavior: the refund moves to `suspended`, the policy question is answered, and an explicit resume returns the conversation to the confirmation boundary without executing the refund. The [walkthrough evidence](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/demo/walkthrough.md) shows the interruption and resume transitions.

## Resume does not mean continue blindly

Resume means that the customer wants to return to the pending workflow. It does not mean that the old action can run without another check.

During an interruption, the order may change state, the customer scope may change, the pending action may expire, or a newer workflow may supersede the old one. A browser or backend restart may also occur. Durable state preserves enough context to recover, but recovery is not permission to trust stale state.

Before execution, the server revalidates the pending action and its exact arguments. It checks the actor and customer scope, conversation binding, tool registration, typed arguments, policy outcome, current business state, and idempotency boundary. If the action is no longer admissible, execution stops.

This is the same reason a confirmation cannot be represented as a bare `true` value. The value says nothing about which action was approved, who approved it, when it was approved, or whether the world still permits it.

## Replacement is different from interruption

Not every new message should suspend the current workflow. Some messages replace it.

That distinction needs an explicit rule. A policy question can temporarily interrupt a refund. A new request to cancel a different order may supersede the previous workflow, depending on the runtime's replacement rules. In both cases, the old pending action must not remain silently executable in the background.

The server should record the transition and make the previous workflow's status clear. A superseded action is not the same as a suspended action waiting to resume. Keeping those states separate prevents a later generic "continue" message from reviving the wrong business operation.

## Conversation state is not execution authority

Conversation state answers questions such as:

- What was the customer discussing?
- Which workflow is currently suspended?
- What question needs an answer?
- Which pending action can the user explicitly resume?

Execution authority answers a different question:

- Is this authenticated actor allowed to act on this customer?
- Is the target authoritative and in scope?
- Does policy allow the action?
- Has the correct pending action been confirmed?
- Does current business state still permit it?

Memory, retrieved policy text, and model output can help reconstruct context. None of them can grant permission. Remembering that a customer once said "I approve all future refunds" must not turn that sentence into approval for a later refund.

## Idempotency closes the final gap

Even after confirmation and revalidation, the final write can have an unknown outcome. The database may commit a refund while the connection drops before the application receives the response.

That is why the execution path needs a stable action identity and a database-backed idempotency boundary. A retry with the same identity can reconcile the result. A blind retry with a new identity can create a duplicate business effect.

The workflow state and the idempotency receipt answer different questions. Workflow state says whether the action is eligible to execute. The receipt says whether this exact effect was already committed. Neither should be inferred from a model response or a conversational acknowledgement.

## What this buys you

The design adds a small amount of state, but it removes several dangerous assumptions:

- "yes" is not automatically approval;
- a question can interrupt a mutation without confirming it;
- a suspended workflow can survive recovery without becoming executable;
- resume returns to a boundary instead of skipping it;
- revalidation catches stale scope, targets, policy, and business state;
- idempotency protects the final write from replay.

The broader [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows the controlled execution path, the refund interruption scenario, and the current release evidence. The separate notes on [production agent guardrails](/writing/production-agent-guardrails) and [prompt injection boundaries](/writing/agent-prompt-injection-guardrails) cover the policy and security boundaries around this workflow.

The main rule is simple: conversation can change the next question without changing who has authority to execute. A confirmation is not a boolean. It is a server-owned decision about a specific action, checked again when the action is actually allowed to run.
