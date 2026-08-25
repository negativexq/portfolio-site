---
title: "Testing AI Agents Without Pretending They Are Deterministic"
description: "Deterministic integration tests and real-LLM tests answer different questions. How to use both to verify control-plane invariants and probe semantic quality."
slug: testing-ai-agents-without-pretending-they-are-deterministic
datePublished: 2026-08-23
dateModified: 2026-08-25
tags:
  - AI Evaluation
  - LLM
  - Testing
  - Reliability
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
relatedWriting:
  - a-confirmation-is-not-a-boolean
  - production-agent-guardrails
draft: false
seoTitle: "How to Test AI Agents: Deterministic and Real-LLM QA"
---
An agent system has two different testing problems. One is whether the control plane preserves its invariants. The other is whether a real model understands varied language well enough to use that control plane. Treating those as one score makes both results harder to interpret.

:::diagram agent-policy-flow

The split is straightforward:

| Deterministic integration | Real LLM |
| --- | --- |
| Control-plane invariants | Language variability |
| Confirmation safety | Paraphrases and ambiguity |
| Policy and scope checks | Semantic interpretation |
| Idempotency and workflow state | Natural response quality |
| Reproducible regressions | Behavior under a chosen model/provider |

The deterministic suite should be boring in the best possible way. Given the same input and fixture, it should make failures easy to reproduce. A test can assert that a mixed confirmation message suspends a workflow, that an out-of-scope target cannot execute, or that replay does not create a second effect.

## Deterministic tests prove the control plane

The platform keeps a deterministic provider for testing the server-owned path without making language interpretation the variable. That makes it possible to exercise confirmation binding, policy, revalidation, workflow transitions, database invariants, and idempotency with precise assertions.

These tests answer questions such as:

- Was execution authority granted only after the required checks?
- Did the same pending action survive interruption and resume?
- Did a replacement supersede the old workflow?
- Did a replay return the existing result instead of creating a duplicate effect?
- Did an authority-bearing memory claim stay out of the permission path?

They do not prove that every real model will classify every natural-language message correctly.

## Real models probe the language boundary

Real-LLM QA is useful for a different reason. It tests paraphrases, mixed messages, ambiguous references, multilingual wording, retrieval-grounded answers, and the quality of the model's semantic proposal.

Those tests need bounded assertions. A model can produce a lower-quality answer without causing an unauthorized mutation. It can use an awkward phrase while still respecting the confirmation boundary. It can fail to satisfy a quality assertion while the deterministic execution path correctly refuses to act.

The result should preserve that distinction instead of converting every warning into a safety failure or every passing response into proof of safety.

## Reading the current result

The current real-LLM report evaluates 100 samples:

```text
100 real-LLM samples
82 passed all evaluated assertions
18 bounded semantic/quality warnings or partial outcomes
0 safety invariant failures
```

The 82/18 split is a quality-outcome breakdown, not a safety rate. It does not mean that 82 percent of the system is safe. Safety is represented by the separate invariant results: no unauthorized mutations, confirmation bypasses, duplicate effects, authority-bearing memory writes, or customer-data disclosures in the exercised set.

The deterministic evidence also stays separate. The repository reports 540/540 measured semantic-safety attempts, 18/18 operational scenarios across 8/8 phases and 6/6 fault classes, and 28/28 deterministic resilience checks. These denominators answer different questions and should remain visible as different evidence slices.

## Reproducibility and realism are a trade-off

A deterministic fixture is excellent for regression testing. It is not a substitute for the variability of a real provider. A real model exposes interpretation and quality issues. It is not a replacement for exact assertions around authorization and state transitions.

The practical approach is to use the deterministic suite as the release gate for control-plane invariants, then use real-LLM samples to find semantic and quality warnings that need attention. When a real-model sample reveals a safety issue, the behavior should be reduced to a reproducible deterministic test before it becomes a regression.

That separation also makes release language more honest. “Ready with warnings” can describe a release with no exercised safety invariant failures while still acknowledging bounded quality or coverage warnings.

The [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows the evidence slices side by side. The repository's [real-LLM QA report](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/security/real-llm-production-qa-report.md) contains the detailed scenarios and warning outcomes.

Deterministic tests prove what the control plane must never violate. Real-model tests probe how language reaches that control plane. A credible evaluation strategy needs both.
