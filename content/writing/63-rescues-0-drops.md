---
title: "63 Rescues, 0 Drops, and 2.4 Seconds"
description: "A cross-lingual reranker moved Recall@5 from 0.9563 to 1.0000. The aggregate is the least interesting number in that sentence, and the latency figure means less than it looks like."
slug: 63-rescues-0-drops
datePublished: 2026-08-19
dateModified: 2026-08-19
category: Retrieval & RAG
tags:
  - RAG
  - Evaluation
  - Performance Engineering
  - Reliability
featured: true
relatedProjects:
  - knowledge-base-rag
relatedLearning:
  - llm-rag-evaluation
relatedWriting:
  - rag-citation-integrity
  - rag-can-provide-evidence
draft: false
seoTitle: "Measuring a Cross-Lingual Reranker: Rescues, Drops and Latency Cost"
---
Adding a cross-encoder reranker to a multilingual knowledge base moved cross-lingual Recall@5 from `0.9563` to `1.0000` on a 220-query paired benchmark. Written that way it reads like a rounding correction on a metric that was already fine.

The number that justified shipping it was different: **63 rescues and 0 drops**.

:::diagram reranker-tradeoff

## Rescues and drops are the unit, the aggregate is the summary

The [platform](/projects/knowledge-base-rag) defines both precisely, because the definitions are what make the comparison usable. A *rescue* is a result that enters the post-rerank top five after being absent from the pre-rerank top five. A *drop* is a result that was present before reranking and absent after.

Recall@5 moving from `0.9563` to `1.0000` is the net of those two. It cannot tell you which happened. A reranker that produced 80 rescues and 17 drops could report a similar aggregate improvement while actively breaking seventeen queries that used to work.

That asymmetry matters more than the average suggests. A rescue improves a query that was already failing, so the user's experience goes from bad to good. A drop is a regression on a query that was fine yesterday, and regressions are what people notice and remember. Reporting them separately is the difference between "this model is better" and "this model is better and it broke nothing."

`0 drops` is the claim worth making. `1.0000` is just the consequence.

## A perfect score is a warning, not a victory

Recall@5 of `1.0000` across 220 queries does not mean retrieval is solved. It means the evaluation set has stopped discriminating between candidates.

That distinction decides what the number licenses. It supports a decision made today between specific models on this corpus. It does not support a claim about queries that are not in the set, and the moment a metric saturates, it can no longer rank the next candidate against the current one.

So the honest follow-up to a perfect score is a harder set, not a stronger claim. A benchmark that everything passes has finished being an experiment and become a regression test, which is useful but a different instrument.

## The cost is latency and concurrency, and only one of those gets reported

Total retrieval p95 on the measured local CPU path is `2457.7 ms`. That is a real cost and it is stated next to the quality gain rather than in a footnote.

But the latency figure alone understates the shape of the cost. The cross-encoder call is synchronous. It is isolated with `asyncio.to_thread()` and guarded by a concurrency limit that defaults to one. So the p95 describes a request that had the reranker to itself.

Under concurrent load, that number is not what the second caller experiences, because they queue. A p95 published without the concurrency cap beside it is a single-flight measurement being presented as a service characteristic, which is a common way to be accidentally wrong about capacity.

Stating the cap alongside the percentile costs one sentence and prevents the misreading.

## Where the reranker sits decides what it can cost you

Retrieval runs dense and sparse in parallel, Qwen3 embeddings at 1024 dimensions and Qdrant BM25, and fuses them with reciprocal rank fusion. The reranker then sees twenty candidates and passes five to generation.

Two placement decisions carry most of the cost control.

The candidate count is the knob. Cross-encoder cost scales roughly with how many candidates it scores, while the quality gain saturates: the twentieth candidate is rarely the one that gets rescued. Twenty in and five out is a measured setting for this corpus, not a framework default worth inheriting.

The tenant ACL runs before reranking, not after. Reranking is the most expensive stage in the path, so scoring rows the caller is not allowed to see spends the budget twice: once on compute that gets discarded, and once on the risk that a filtering bug turns discarded work into a disclosure. Filtering first is cheaper and the ordering is also the security boundary.

## A measured "no" is a result too

The same benchmark process rejected a change. Token-aware chunking candidates matched the existing quality and did not reduce context size, chunk count or storage, so the legacy 500/50 configuration was kept.

What got published alongside that decision is the corpus's average chunk of about 69 tokens with a maximum of 100, so the 256–768 token candidate boundaries were never actually exercised. The experiment could not have shown a difference on this data.

That is more valuable than the null result on its own. A null result says "we tried it and nothing happened." A null result with its own power analysis says "this corpus cannot answer this question, and here is what would have to change before asking again."

## What this does not tell you

These are local CPU measurements against four fixture documents and a 220-question set. They are a benchmark, not traffic, and nothing here is a production capacity claim.

Recall and MRR measure whether the right source reached the top of the list. They say nothing about whether the generated answer then used it correctly. That is a separate check with its own separate result, and even there, citation integrity verifies authorized source membership rather than claim-level entailment.

And the reranker choice is bound to this corpus, this language mix and this candidate count. A different chunk-size distribution would move the numbers, which is exactly the limitation the chunking experiment documented rather than concealed.

A retrieval change becomes a decision at the point where you have measured what it broke as carefully as what it fixed.
