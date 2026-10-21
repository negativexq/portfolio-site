---
title: "A Research Loop Remembers in Types, Not in Prose"
seoTitle: "Agentic RAG Research Loops: Typed Working Memory With PydanticAI"
description: "How an agentic document research workspace keeps its memory as typed application state: PydanticAI agents propose, the application writes memory, runs the tools and decides when the loop ends. 96 of 120 long-document questions reached an accepted outcome."
slug: research-loop-memory-is-typed-state
datePublished: 2026-10-22
dateModified: 2026-10-22
category: Retrieval & RAG
tags:
  - RAG
  - AI Agents
  - Memory
  - Agent Architecture
  - Evaluation
featured: true
relatedProjects:
  - knowledge-base-rag
relatedLearning:
  - llm-rag-evaluation
relatedWriting:
  - memory-is-context-not-authority
  - rag-citation-integrity
draft: false
---
Ask a document question that needs five numbers from two parts of a 10-K, and a single retrieve-then-generate pass has to get everything right at once: find the balance sheet, find the note with the lease liabilities, read the right period, keep the units, and do the arithmetic. If any one of those slips, the answer is fluent and wrong.

[Knowledge Base RAG](/projects/knowledge-base-rag) answers questions like that with a research loop. It retrieves, notices what is still missing, reads the specific page that holds it, extracts the values, calculates in code, and only then writes the answer. For Costco's FY2021 debt-to-EBITDA, including current long-term debt and lease liabilities, the loop produced:

```text
1.344× = (799 + 6,692 + 3,916) / (6,708 + 1,781)
         current LTD + long-term debt + lease liabilities
         ─────────────────────────────────────────────────
         operating income + depreciation and amortization

68.02 s · 9 model calls · every operand bound to its source page
```

The loop is the visible part. The part that decides whether a loop like this works is its memory: what the system knows between one step and the next, who is allowed to write it, and what survives when the loop stops.

:::diagram research-loop-working-memory

## Memory is the loop's state, not its transcript

The easiest way to give an agent memory is to keep the conversation. Every tool result is appended, the model rereads the whole thing, and at some point a summarizer compresses it so it still fits.

That works for chat. It breaks down for research over numbers. A summary is prose written by a model, and prose is where a value loses its unit, a period drifts from FY2021 to FY2022, or "lease liabilities" quietly becomes "operating lease liabilities". Once the summary is the only copy, nothing downstream can tell that it happened.

So the working memory in this system is not a transcript. It is `ResearchState`, a Pydantic structure that application code creates and updates. It holds:

```text
the original task              evidence needs
source selections              checked observations and facts
calculations                   coverage and source inspections
unresolved issues              answer repairs
execution events
```

Tool results update it directly. No summarizer runs between steps, and numbers, conditions and source bindings stay structured however long the run gets. The statuses are distinct on purpose: a checked fact, a model hypothesis, an extraction error and a search that found nothing are four different things, and invalidating an input also invalidates every result that depended on it.

## Each agent sees a projection, not the whole memory

The research is split across ten small PydanticAI roles rather than one large agent: a reader, an evidence extractor and its checker, a need planner, a source selector, a quantity collector and checker, an answer repair step, a scope validator and a finalizer. Reading and extraction run at low reasoning effort; the stages that interpret the question, select sources, judge quantities and verify scope run at medium.

None of them receives `ResearchState` as a whole. Each role gets a task-specific projection: the evidence and state fields its job needs, serialized for that call. Credentials, internal clients and the full execution log never enter a prompt. In PydanticAI terms, the authorized readers and limits travel in `RunContext.deps`, the role's answer comes back as a typed `output_type`, and the application decides which of those typed answers becomes state.

That last step matters more than the typing. A model proposal arrives as valid JSON, and valid JSON is not proof of source truth. The application validates a proposal before admitting it as state or as executable work. The model can suggest what memory should contain; only the application writes it.

## How the loop decides its next step

Each turn starts from memory and ends by writing to it:

1. A PydanticAI agent reads its projection of the state and either proposes a cited answer or names the specific piece of evidence that is missing.
2. The application decides which operations are available at this stage: search, read a chunk or one physical PDF page, inspect a page for tables and image regions, extract values, or calculate. Hiding a tool is not treated as an authorization boundary; each function rechecks source and access itself.
3. The tool and budget gate validates the arguments, the source version and the remaining request, token, tool and time budget before anything runs.
4. One narrow operation runs. Its checked, source-bound result is written back into `ResearchState`, and the next turn reads the updated memory.

Known transitions do not need a model. When operands and a formula are ready, the calculation runs directly in application code, with `Decimal` arithmetic over named inputs; unknown or unused operands fail. Item counts run over checked inventories, and total occurrences and distinct entities are separate operations. The model is called where a semantic decision is needed, not to choose an operation that is already determined.

PydanticAI also offers GraphBuilder for composing steps and decisions. The runner uses explicit async Python hand-offs instead, because the transitions are known and the application has to own them anyway: authorization, accounting and release policy sit between every pair of stages.

## Progress is a change in memory, not new text

A research loop needs a rule for when to stop, and the obvious rule is wrong. An early version stopped when a turn added no new text to the context. An offline reproduction showed what that cost: a calculation had succeeded, no new text block was added in that turn, and the loop concluded it was stuck and abstained, throwing away a correct result.

Progress is now defined by what changed in memory. A checked extraction, a corrected binding, a resolved ambiguity and a completed calculation all count, even when no new passage arrived. Repeating an identical operation does not count, and a repeated search for the same gap moves on to the next slice of the document instead of rereading the first.

The limits are shared across every stage of a run and live server-side, where a user request cannot widen them. The profile used for recent document runs:

| Limit | Value |
| --- | ---: |
| Model requests | 10 |
| Tokens | 120,000 |
| Wall time | 240 s |
| Research requests and tool attempts | 6 each |
| Rounds without progress before stopping | 2 |
| Finalization reserve | 60 s |

## When the loop stops, the memory survives

Research stop, extraction status, review status, finalization and release are separate states. Closing the research loop does not end the run. Finalization first works from the checked results already in `ResearchState`, so a loop that ran out of research turns can still release a verified answer, and nothing asks another model to guess the same numbers again.

The 60-second reserve exists for that step. It is held back from the research budget so that the most valuable moment in the run, turning saved results into a checked answer, always has time left. A budget stop or a provider error is recorded as an operational outcome, never as evidence that the document lacks the answer.

## Reading the page the memory came from

Memory is only as good as what is written into it. On image-only PDF pages, the indexed text can be wrong in ways no amount of reasoning recovers. One of the tracked questions asked how many more tweets were attributed to Germanwings than to Lufthansa. The indexed text said Lufthansa had 42. The original page image said 12.

For quantitative reads of image-only pages, the extractor reads the original page image. Category, series, period, unit and the label-value relationship stay attached to every input, and an independent checker reviews the inputs and their coverage before any calculation depends on them. The checked reading, not the indexed one, went into memory:

```text
12 = 24 − 12    reading the original image corrected an indexed 42 to 12
42.16 s · 6 model calls
```

## The memory layers, kept apart

Working memory for one question is the layer the research loop needs, and it is the one implemented and round-trip tested. Around it sit layers with different jobs, each with its own rules:

| Layer | What it holds | Rule | Status |
| --- | --- | --- | --- |
| Working state | Facts, gaps, attempts, calculations and review state for one question | Typed, written by the application, serializable | Implemented |
| Checkpoint | State and schema versions, sources, pending work, continuation point, consumed budget | Resume revalidates access and document versions and never resets spent budget | Designed |
| Extraction cache | Structured data for one source version and region | Keyed by source hash, region, render settings, model and schema versions; a hit cannot bypass authorization | Designed |
| Long-term memory | Preferences or reviewed knowledge across sessions | Separate purpose and lifecycle | Designed |

One rule runs through all of them: previous model answers and gold answers are not verified document memory. A remembered answer is context, never a source. That is the same boundary as in [Memory Is Context, Not Authority](/writing/memory-is-context-not-authority), applied to research instead of conversation.

## What 120 questions showed

The answered-question ledger tracks 120 distinct questions over long documents: 10-K filings, annual reports, research papers, manuals and survey releases. Each question is counted once, with its run, answer, latency and model-call count, and checked against the original PDF.

| Outcome | Questions |
| --- | ---: |
| Source-correct answers | 79 |
| Qualified calculations | 2 |
| Correct refusals | 15 |
| **Accepted outcomes** | **96/120** |

The correct refusals matter as much as the answers. Fifteen questions asked for something the source does not contain, and the loop said so instead of filling the gap with a plausible number.

## The model proposes, the memory decides

The design comes down to one division of labour. Agents do the semantic work: interpreting the question, naming what is missing, choosing where on the page to look, judging whether a result answers what was asked. The application owns everything that has to be right: the memory, the tools, the budgets, the arithmetic and the release.

A research loop is only as reliable as what it remembers between steps. Keep that memory typed, written by code, bound to its sources and alive past the end of the loop, and the agents on top of it can afford to be small.
