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
  - llm-rag-evaluation
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

## The provider is a test variable, not a test strategy

It is tempting to replace the deterministic provider with a real model everywhere and call the result more realistic. That usually makes the suite harder to diagnose without making its safety claims stronger.

The provider answers one question: where did the semantic proposal come from? The test still needs to answer a second question: what did the server do with that proposal?

With a deterministic provider, the test can supply a known proposal and focus on the control plane. With a real provider, the same scenario can explore whether the model reaches the intended proposal across paraphrases and ambiguity. Both runs should end at the same typed decision and execution boundary.

```text
deterministic provider                 real provider
known proposal                         variable interpretation
        ↓                                      ↓
invariant validation                   semantic and quality checks
        ↓                                      ↓
reproducible result                    behavior under a chosen model
```

This separation also prevents a common mistake: treating a model's structured output as if its schema made the values trustworthy. A valid JSON object can still contain an out-of-scope target, an unsupported reason, or an action that policy does not permit. The deterministic checks remain necessary after parsing.

## Build the suite in layers

A useful evaluation stack moves from the most stable boundary to the most variable one.

First, test pure decision and policy rules. These tests should not need a model at all. They can check whether a target is in scope, whether a typed argument is admissible, and which policy outcome follows from the current state.

Next, test workflow and persistence behavior with the deterministic provider. This is where confirmation binding, interruption, resume, replacement, revalidation, idempotency, and restart recovery belong. The assertions should inspect state transitions and business effects, not just the assistant's final sentence.

Then, run real-LLM scenarios against the same server-owned boundaries. Vary the language, not the authority model. Ask the model to handle paraphrases, mixed confirmation and question messages, multilingual requests, ambiguous references, and grounded knowledge questions. The deterministic path should still decide whether execution is possible.

Finally, keep operational scenarios separate from both. Concurrency, dependency faults, restart behavior, and observability checks answer whether the deployed system behaves correctly under stress. They are not model-quality measurements.

## Assertions should match the layer

The assertion "the answer was helpful" is too broad to be a useful safety gate. It can be a quality assertion in a real-model sample, provided the report says exactly what was evaluated.

More precise assertions look like this:

```text
Deterministic assertion:
mixed confirmation does not execute a refund

Real-LLM quality assertion:
the policy answer cites the retrieved evidence and avoids an unsupported claim

Cross-layer safety invariant:
no provider output can bypass scope, policy, confirmation, or idempotency
```

The cross-layer invariant should not depend on whether the model used the best wording. It should be enforced by the server-owned path and checked in deterministic tests. Real-model tests can then tell us how often language reaches the right branch and how useful the resulting answer is.

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

## What to do with a failure

When a real-model sample warns, the first task is classification. Was the problem semantic quality, retrieval grounding, workflow interpretation, or a safety invariant?

If the model gave an awkward but harmless answer, it belongs in the quality backlog. If the answer used evidence incorrectly, it belongs in grounding or retrieval evaluation. If a mixed message was interpreted as approval, the behavior must be treated as a control-plane risk and reduced to a reproducible regression case. If the server denied the action correctly, that fact should remain visible even when the model response was poor.

This triage avoids two bad outcomes. Teams can overreact to harmless wording and hide useful warnings, or they can average away a serious authorization failure inside a high passing score. A report that preserves the category of each outcome is more useful than a single percentage.

The same principle applies when a deterministic test fails. Fixing the fixture until it passes is not evaluation. The failure should identify which invariant was broken, which state transition made it possible, and whether a real-model scenario needs to be added to exercise the same boundary.

## Reproducibility and realism are a trade-off

A deterministic fixture is excellent for regression testing. It is not a substitute for the variability of a real provider. A real model exposes interpretation and quality issues. It is not a replacement for exact assertions around authorization and state transitions.

The practical approach is to use the deterministic suite as the release gate for control-plane invariants, then use real-LLM samples to find semantic and quality warnings that need attention. When a real-model sample reveals a safety issue, the behavior should be reduced to a reproducible deterministic test before it becomes a regression.

That separation also makes release language more honest. "Ready with warnings" can describe a release with no exercised safety invariant failures while still acknowledging bounded quality or coverage warnings.

The [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows the evidence slices side by side. The repository's [real-LLM QA report](https://github.com/negativexq/agentic-customer-service-platform/blob/main/docs/security/real-llm-production-qa-report.md) contains the detailed scenarios and warning outcomes.

Deterministic tests prove what the control plane must never violate. Real-model tests probe how language reaches that control plane. A credible evaluation strategy needs both.
