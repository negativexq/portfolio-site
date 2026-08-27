---
title: "How I Keep Prompt Injection Away from Agent Tools"
description: "A defense-in-depth boundary that treats model output, retrieved text, and remembered context as evidence while deterministic software keeps execution authority."
slug: agent-prompt-injection-guardrails
datePublished: 2026-08-13
dateModified: 2026-08-27
category: Agent Reliability
tags:
  - AI Agents
  - Security
  - RAG
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
  - agent-memory
relatedWriting:
  - production-agent-guardrails
  - rag-citation-integrity
draft: false
seoTitle: "Prompt Injection Guardrails for Agent Tools"
---
I treat tool execution as a privileged boundary. User text, retrieved documents, persistent memory, and model output can provide context, but none of them can grant permission to mutate customer state. The Agentic Customer Service Platform keeps that rule in ordinary software: authenticated scope, typed schemas, target grounding, business validation, policy, confirmation, idempotency, and audit.

This does not make the model immune to prompt injection. It limits what a successful injection can authorize.

:::diagram agent-trust-boundary

## Keep identity outside the prompt

Authentication resolves a typed principal before the agent handles protected work. The server builds an `ExecutionContext` with the actor, roles, effective customer ID, request ID, and conversation ID. Request bodies and model output cannot replace those values.

Every tool receives that context explicitly. Before execution, the runtime checks that the tool argument's `customer_id` matches `effective_customer_id`. The policy engine repeats the ownership check and denies unknown tools. Business services then validate resource ownership and current state against PostgreSQL.

This gives customer scope a source that is independent of language-model interpretation. A retrieved sentence such as "use customer 42" remains text. It cannot change the authenticated customer's scope.

## Ground destructive targets in the current request

The semantic model path does not pass model-generated IDs directly to tools. For explicit order and ticket references, `validate_semantic_grounding` extracts integer IDs from the current user message and compares them with the proposed target. A model-produced identifier that is absent from that message is `ungrounded`.

Symbolic references such as `latest_order` are allowed for authenticated reads. They are not authoritative targets for cancellation or refund. Destructive requests need a grounded explicit identifier or they move to clarification.

```text
model proposal
  -> server-owned target grounding
  -> target admissibility
  -> deterministic decision compiler
  -> customer-scoped resolver
  -> business validation
```

The grounding check deliberately avoids fuzzy matching and model-supplied trust flags. Its trusted source is exactly `current_user_message`. Retrieved knowledge and persistent memory cannot prove that the user supplied a required destructive argument.

## Retrieved text is not an instruction channel

The RAG path returns ranked chunks with document, section, source, and citation metadata. The response layer can use those chunks to explain policy. Tool selection and authorization happen elsewhere.

The repository tests this boundary with a retrieved chunk that contains a prompt-injection instruction. `test_retrieved_prompt_injection_is_evidence_only` verifies that the text can appear as retrieved evidence without causing an unauthorized action. The Qdrant runtime has a parallel test, `test_retrieved_instruction_remains_evidence_and_cannot_authorize_tool`.

The same rule applies to memory. Remembered text can help with preferences or unresolved support context, but it cannot select a tool, confirm a Risk 2 action, bypass policy, or override business state.

The resulting authority order is explicit:

1. Policy engine.
2. Validated business state.
3. Current user request.
4. Retrieved knowledge.
5. Persistent memory.

That order is more useful than asking the model to distinguish "trusted" and "untrusted" prose inside one context window. The model can still misunderstand the text, but the lower layers cannot promote themselves above authenticated scope and deterministic policy.

## Bind confirmation to stored state

Cancellation and refund are Risk 2 actions. A proposal does not execute immediately. The runtime stores a typed pending action with a stable `action_id`, actor identity, actor type, customer scope, conversation, tool name, validated arguments, risk level, and creation time.

Confirmation parsing accepts a small fixed set of responses. Text such as `yes, and refund order 999` is ambiguous rather than permission to substitute a new action. The model does not regenerate the confirmed tool call.

The pending action has a default 300-second TTL. On confirmation, the runtime checks ownership and status, validates the stored arguments again, and reads current business state before execution. Expired, rejected, already executed, failed, cross-customer, or cross-conversation actions cannot run.

This matters for prompt injection because approval attaches to one server-owned object. An injected instruction cannot turn "yes" into approval for a different target or tool.

## Fail closed at policy and execution

Tool risk is registry metadata, not a model judgment. The policy engine returns one of four bounded outcomes:

| Outcome | Meaning |
| --- | --- |
| `allow` | The validated action may execute automatically. |
| `require_confirmation` | Store the action and wait for explicit confirmation. |
| `require_human` | Route the work to the dedicated human path. |
| `deny` | Stop the action. |

Unknown tools, invalid customer scope, and policy evaluation failures deny execution. Tool inputs are validated against registered Pydantic models. Writes require an `action_id`, which becomes an actor-scoped idempotency key. An unknown write outcome is reported as ambiguous and is not replayed automatically.

These boundaries address different failures. Grounding limits invented targets. Policy controls which valid actions need confirmation or human handling. Revalidation catches stale business state. Idempotency protects against repeated execution. Audit records what each boundary decided without becoming an authorization input itself.

## What the evidence says

The repository evidence separates model behavior from runtime containment. In the current prospective run, 30 unsafe semantic proposals were observed. Deterministic guards intervened on all 30, none survived to executable state, and none executed. The run recorded 0 confirmation bypasses and 0 unauthorized mutations across 540 measured executions.

Those numbers do not prove that prompt injection is solved. They describe one source, prompt, model, provider, and contract binding, and unsafe executable survivors reached zero only after architectural containment work rather than better wording; the measured sequence went 15 → 3 → 0 → 0 → 0. The useful result stays narrower than "solved": unsafe model output did not receive execution authority in the measured runs.

The [Agentic Customer Service Platform](/projects/agentic-customer-service-platform) case study links the guardrail path to its tests and evaluation evidence. The broader [production agent guardrails](/writing/production-agent-guardrails) note covers risk policy, confirmation, idempotency, and audit as one execution lifecycle.
