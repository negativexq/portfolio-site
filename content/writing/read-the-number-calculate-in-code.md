---
title: "Read the Number From the Page, Calculate in Code"
description: "A language model can find the right two numbers in a 10-K and still return the wrong ratio. How an agentic document research workspace lets the model transcribe sourced inputs, while application code applies units and scale, executes the arithmetic and proves it again at release."
metaDescription: "Let the model transcribe sourced numbers and let code apply units, run the arithmetic and re-check it at release. Lessons from a document research agent."
slug: read-the-number-calculate-in-code
datePublished: 2026-10-22
dateModified: 2026-10-23
category: Retrieval & RAG
tags:
  - RAG
  - AI Agents
  - Evaluation
  - Observability
featured: false
relatedProjects:
  - knowledge-base-rag
relatedLearning:
  - context-engineering-rag
  - llm-rag-evaluation
relatedWriting:
  - research-loop-memory-is-typed-state
  - rag-citation-integrity
draft: false
seoTitle: "Read the Number From the Page, Calculate in Code"
---
Ask a document agent for Costco's FY2021 debt-to-EBITDA ratio and it has three separate jobs. It must find the right line items in a 10-K. It must read their values, units and periods correctly. Then it must do the arithmetic.

Language models are good at the first job, fallible at the second, and should not be doing the third at all. A model that writes `1.344` has produced text that looks like a ratio. It has not produced a calculation anyone can check.

The Knowledge Base RAG research workspace splits those jobs on purpose:

> The model selects an interpretation and transcribes source inputs. Application code executes the operation.

There is no "calculation model call". Arithmetic is not something the model is asked to get right.

:::diagram quantity-calculation-path

## An input is more than a number

A transcribed input carries everything needed to judge it later: the value as displayed in the source, a canonical `Decimal` value, its unit and scale, the period, the label it belongs to, and the support ID of the passage or page it came from.

Keeping the source display separate from the canonical value matters more than it sounds. An Indian annual report states amounts in lakhs. One tracked question asked for income less shareholders' funds for the year ended 31 March 2003:

```text
income              109,638.91 lacs
shareholders' funds  25,966.14 lacs
```

An earlier version of the arithmetic subtracted the raw numbers correctly and then labeled the result in rupees. The difference was right; the unit was off by a factor of 100,000.

The fix moved scale into application code. Lakh, crore, thousand, million and billion factors are applied by the application, and a typed conversion record stores the units, the factors, the named-input formula and the expanded expression:

```text
(109638.91 × 100000) − (25966.14 × 100000) = 8,367,277,000 rupees
```

Same-currency factors cancel in ratios. A requested output scale is applied once. Mismatched units and unsupported compound dimensions fail before anything executes, and no currency exchange is ever inferred.

## The expression language is deliberately small

The model proposes a formula over named inputs. The application parses and executes it with a bounded grammar:

- Arithmetic operators plus `abs`, `min`, `max` and `mean`.
- No attributes, imports, keyword arguments or other functions.
- Every argument needs source support, including the values an extremum did not select.
- `Decimal` precision is preserved throughout; only the final result is rounded.
- Expression complexity and numeric magnitude are bounded; division by zero and invalid arity fail locally.

That is enough for the ratios, differences, totals and percentages that financial and survey questions ask for, and nothing more.

## The release re-executes the proof

A computed answer carries a conversion receipt: the operation, its inputs and its conversions. Before the answer is released, the final semantic projection executes the operation again and compares the result and the receipt.

An absent or altered receipt cannot borrow the authority of the arithmetic check. Source bindings, period, scale, formula interpretation and scope are still checked independently; arithmetic correctness alone never certifies an answer.

The effect is visible in the ledger. For Costco's FY2021 debt-to-EBITDA, the workspace rejected **three incorrect intermediate calculation drafts** before releasing:

```text
1.344× = (799 + 6692 + 3916) / (6708 + 1781)
68.02 s · 9 model calls
```

A wrong draft is not an answer with a lower score. It is a draft the release path refuses, and the run report keeps each refusal.

## Some numbers come from the image, not the text

The arithmetic is only as good as its inputs, and the indexed text of a PDF is not always the document. For quantitative questions on image-only pages, the extractor reads the original page image, and an independent checker reviews the inputs before any calculation depends on them.

One question summed tweets attributed to Germanwings, Lufthansa and Airbus. The text layer gave a wrong value for Lufthansa; the page image gave the right one:

```text
41 = 24 + 12 + 5
39.27 s · 6 model calls
```

Visual readings keep their own contract. They are marked as independently confirmed page-image readings, not presented as if a text validator had verified them.

## When the source does not define the metric

Some questions have a correct input set and more than one defensible formula. The source states India's forecast growth as 6.7% and actual growth as 4.3%, and the question asks for the shortfall.

Two answers are arithmetically correct:

- a relative shortfall of **35.821%**, from `abs((6.7 − 4.3) / 6.7) × 100`;
- an absolute gap of **2.4 percentage points**.

The workspace publishes the relative shortfall with its formula written out, so a reader who wanted the absolute gap can see the difference at once. The ledger counts it as a **qualified interpreted calculation**, separately from source-verified answers. Three more sit in the same column. Best Buy's 10-K never defines return on capital employed, so that answer names the formula it used. Two survey questions ask for a headcount the release never reports, so the answers, about 541 and about 738 people, are published as sample-equivalent estimates calculated from the reported rates, not as exact counts.

Counting these as plain correct answers would make the score look better and the system less honest. Keeping them in their own column records exactly what the source can and cannot establish.

## What the calculations look like

A selection from the answered-question ledger, each checked against the original PDF:

| Question | Released answer | Time / model calls |
| --- | --- | ---: |
| Costco FY2021 operating cash flow / current liabilities | **0.304** = 8958 / 29441 | 34.74 s / 6 |
| Best Buy gross profit / total assets, FY ending 28 Jan 2023 | **0.627** = 9912 / 15803 | 29.86 s / 5 |
| Best Buy effective tax rate | **20.7%** = 370 / 1788 × 100 | 39.91 s / 6 |
| Costco FY2021 long-term debt incl. leases / total liabilities | **25.04%** = (6692 + 2642 + 980) / 41190 | 50.67 s / 8 |
| Costco FY2021 total debt incl. all lease liabilities | **USD 11,407 million** = 799 + 6692 + 222 + 2642 + 72 + 980 | 114.99 s / 9 |
| Men 65+, internet use vs home broadband | **12 percentage points** = 65 − 53 | 40.20 s / 6 |

Every one of these formulas was written by the model and executed by the application. The model call count includes reading, transcription and checking; none of the calls performed the arithmetic.

## Seeing where the calls went

Each chat request gets a server-generated trace. Its OpenTelemetry subtree holds query rewriting, retrieval and evidence preparation, the agent run, every real `llm.request`, each `tool.*` call, document reads, validation and retries, and the final release check. Operand resolution and visual reading calls nest under the tool that made them, so a slow calculation shows whether time went to finding inputs, reading a page or checking them.

The spans carry operational values only: provider and model, call counts, tokens and cache use, tool names, retry counts, validator reason codes and outcomes. Prompts, evidence, answers and raw exception messages stay out of normal tracing. Traces export to Jaeger, and optionally to a self-hosted Langfuse through the same OpenTelemetry configuration.

Cost follows the same rule as the arithmetic: it is computed, not guessed. Prices come from operator-configured rates per provider and model. Missing usage or an unpriced model makes the total **Unknown**; an unpriced model is never assigned zero cost.

## The result

The ledger tracks 120 distinct long-document questions across 10-K filings, annual reports, research papers, manuals and survey releases. Each question counts once, whatever the number of reruns.

| Outcome | Questions |
| --- | ---: |
| Source-correct answers | 81 |
| Qualified interpreted calculations | 4 |
| Correct refusals | 18 |
| **Accepted outcomes** | **103/120** |

The split of responsibilities is what makes those numbers checkable. The model does what it is good at: finding the passage, reading the value, choosing the formula. The application does what it is good at: units, scale, exact arithmetic and re-proving the result before anyone sees it.

How the research loop keeps its memory as typed state is covered in [A Research Loop Remembers in Types, Not in Prose](/writing/research-loop-memory-is-typed-state). The workspace, its tools and the ledger are in [Knowledge Base RAG](/projects/knowledge-base-rag).
