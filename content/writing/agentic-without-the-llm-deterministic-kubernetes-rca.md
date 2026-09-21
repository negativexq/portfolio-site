---
title: "Agentic Without the LLM: Building Deterministic Kubernetes RCA"
seoTitle: "Agentic SRE Without an LLM: Deterministic Kubernetes Root Cause Analysis"
description: "How I built a bounded autonomous Kubernetes incident investigator where evidence selection and root-cause diagnosis run deterministically — 21/25 exact-root agreement on a frozen blind holdout with zero model calls."
slug: agentic-without-the-llm-deterministic-kubernetes-rca
datePublished: 2026-09-21
dateModified: 2026-09-21
category: Agent Reliability
tags:
  - SRE
  - Kubernetes
  - Root Cause Analysis
  - Agent Architecture
  - Evaluation
featured: false
draft: false
relatedProjects:
  - agentic-sre
relatedLearning:
relatedWriting:
  - hard-gates-frozen-hashes
  - decision-authority-execution-observability
---

Most "agentic SRE" systems are associated with an LLM deciding what telemetry to inspect and reasoning its way toward a diagnosis. [Agentic SRE](/projects/agentic-sre) can support an LLM policy, but that is not how I measured it.

In the frozen benchmark configuration, no model was used anywhere in the investigation loop. Semantic intent selection, physical evidence selection, evidence normalization, hypothesis rebuilding, confidence, and root-cause resolution were all deterministic.

The system was still autonomous. It could inspect its current diagnosis, identify what information was missing, choose one legal read, acquire new evidence, rebuild its hypotheses, and repeat until its investigation budget was exhausted — on its own, with no human and no model in the loop.

On the first frozen blind evaluation, that deterministic investigator produced **21/25 exact FULL_SOURCE root agreement on the frozen blind synthetic TEST25 holdout, with 0 model calls**.

That result changed the question I was asking. It stopped being "which LLM should run the investigation?" and became a more interesting one: how much of an agent actually needs to be an LLM?

## What I mean by "agentic"

Before defending the title, I should define the word, because half of the disagreement about "agents" is really a disagreement about vocabulary.

I use **agentic** to mean a system that repeatedly observes its own state, selects an action from a bounded action space, executes it, incorporates the result, and decides whether to continue. I do not use it to imply that a language model has to be somewhere in that loop.

By that definition, Agentic SRE is an agent, and it is also — deliberately — a bounded state machine. Those are not competing descriptions. The loop is the agent; the determinism is a property of the policy inside it.

## The benchmark really used zero LLM calls

This is the claim people are most right to be suspicious of, so here is the exact shape of it.

The measured run used the deterministic investigation policy with model calls disabled. The recorded configuration allowed a budget of six turns and `max_model_calls=6`, but that is the generic investigation budget, not observed usage — the deterministic policy made **0 model calls**. The full run and its immutable prediction artifact are published in the [frozen benchmark report](https://github.com/negativexq/agentic-sre/blob/main/evals/results/v1.1.2/README.md).

"Zero LLM calls" does not mean the architecture forbids an LLM. It means correctness did not depend on one. Nothing in the investigation loop — not the choice of what to read, not the interpretation of what came back, not the final root — required a model to run.

That distinction is the whole article, so it is worth stating plainly:

> **Autonomy does not require model authority.**

## Autonomy and model authority are different things

It helps to separate three questions that "agentic" usually smears together:

```text
AUTONOMY
Does the system run the investigation loop itself?
→ Yes. It chooses its own next observation and decides when to stop.

POLICY
What selects the next thing to inspect?
→ In the measured run, a deterministic policy. An LLM policy is optional.

AUTHORITY
What is allowed to decide the diagnosis?
→ Only deterministic code. Evidence interpretation, confidence, and
  root-cause selection are never delegated to a model.
```

Most of the fear around autonomous agents is really fear about the third row — a model with authority over a consequential decision. But autonomy lives in the first row. You can keep the closed-loop behavior that makes an agent useful while giving the model none of the authority that makes it risky.

An agent is a control loop. An LLM is one possible policy inside it.

## How deterministic investigation selects the next read

If no model chose the reads, something had to. Here is the loop that did:

:::diagram deterministic-investigation-loop

Each of those steps is code. Intent selection ranks the semantic categories of evidence that could close an open gap. Physical selection turns the top intent into one specific, allowlisted observation — a particular log, event, or dependency read — under an exact-workload focus. A discovery obligation orders the surface so that decisive change evidence is not skipped. None of it asks a model what to do next; it computes what to do next from the current state of the evidence.

The investigator selects **one** read at a time. In the frozen holdout it made six validated physical reads per incident — 150 tool calls across 25 incidents, with zero tool errors — and every one of those reads has an explicit, inspectable reason it was chosen.

## The investigator and the judge have different authority

The investigator decides **where to look**. It does not decide **what is true**.

Every observation returns through the same path before it is allowed to change anything: it enters an evidence store, is normalized into a typed Finding, and only then can it move a hypothesis. Verification, confidence, and the selection of the root entity are downstream of that normalization, and all of it is deterministic.

That separation is what makes a diagnosis auditable. The output is not an opinion; it is a root entity with a causal path, a confidence state, and the specific Findings that support it. You can replay how it got there.

## Where an LLM can still fit

Keeping the model out of the measured path does not mean rejecting it everywhere. There are places where an LLM is genuinely useful and does not need authority:

```text
semantic ambiguity in noisy signals
runbook and prose interpretation
novel hypothesis suggestions
human-readable explanations of a finished diagnosis
```

And there are places it is never allowed:

```text
creating evidence
creating Findings
verification and confidence
root-cause selection
```

The rule is not "no models." The rule is that a model may help **propose**, and may never **decide**.

## What happened when I tried an LLM policy

I did experiment with an LLM-backed semantic policy during development. This is a development experiment, and it is not part of the frozen TEST25 result — I am keeping those two things separate on purpose.

Giving the model broader intent-selection authority did not improve the system on the development split, so I progressively narrowed its role until it could only choose among intents that deterministic ranking had already scored as equivalent — a tie-break, nothing more. It could not invent a physical target, write a query, interpret evidence, or produce a Finding, hypothesis, confidence, or root. When the deterministic ranking left only one top candidate, the model was not called at all.

By the final audit, that narrow tie-break path had almost nothing to do: in practice a legitimate multiway tie among top-ranked intents did not come up. The model had been constrained to exactly the place where, on this workload, there was no remaining decision to make.

That is the more interesting engineering lesson than any accuracy number. The useful question turned out not to be "how do I make the model more reliable?" but:

> **How little authority does the model actually need?**

## 21/25 on the frozen blind holdout

The headline result is a single frozen, blind measurement:

| Measurement | Result |
| --- | ---: |
| Blind TEST25 holdout | 21/25 |
| Exact-root agreement | 84% |
| Model calls | 0 |
| Reads per incident | 6 |
| Tool errors | 0 |

Exact-root agreement is deliberately harsh. A prediction counted as correct only when its canonical root entity exactly equaled the separate FULL_SOURCE canonical root for the same scenario. A nearby pod or a same-workload entity did not earn partial credit.

The development split (10/10) and the combined figure (31/35, 88.6%) are useful context, but they are context. The primary generalization measurement is the 21/25 on TEST25, because that is the only split that was frozen and hashed before it was graded. The methodology behind that — the architecture freeze, the prediction hashing, and why exact-root grading is the honest choice — is its own topic, and I'll cover it separately rather than compress it here.

Confidence calibration mattered as much to me as accuracy:

| Confidence | Correct | Total |
| --- | ---: | ---: |
| VERIFIED | 9 | 9 |
| LIKELY | 11 | 12 |
| UNVERIFIED | 1 | 4 |

Every diagnosis the system labeled VERIFIED in the holdout was correct. For an incident tool, a diagnosis that knows when it is uncertain is often more operationally useful than one extra point of raw accuracy.

## What the four failures taught me

The four misses were not random noise. Three were bounded query-window or projection misses — the decisive evidence existed but fell outside what the investigator read under its budget. One was a semantic intent miss, where the investigation pursued the wrong category of evidence for the incident.

That split points at two different kinds of future work rather than one. The projection misses are an evidence-acquisition problem: the loop stopped reading before it reached the deciding signal. The intent miss is a selection problem: the deterministic ranking pointed the investigation at the wrong question. Neither is fixed by adding a model with more authority; both are fixed by improving the deterministic policy that already owns those decisions.

## How much of an agent actually needs an LLM?

I started from the assumption that autonomous incident investigation would need an LLM to run it. Building the system and then taking authority away from the model, piece by piece, until I could measure what was left, produced a more useful conclusion than the assumption did.

On a frozen blind Kubernetes holdout, evidence selection and root-cause diagnosis ran with zero model calls and still matched the reference root in 21 of 25 incidents. The model was optional. The autonomy was not.

An agent is a control loop. An LLM is one possible policy inside it — and, at least for this problem, a smaller one than I expected.
