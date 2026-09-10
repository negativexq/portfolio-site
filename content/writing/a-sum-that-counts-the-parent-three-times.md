---
title: "A SUM That Counts the Parent Three Times"
description: "A join to a one-to-many child table can silently triple a parent measure, and the query still looks correct. This is why grain safety belongs to the server, not to the model that wrote the SQL."
slug: a-sum-that-counts-the-parent-three-times
datePublished: 2026-09-09
dateModified: 2026-09-09
category: Governed Text-to-SQL
tags:
  - Data Engineering
  - SQL
  - Grain
  - Text-to-SQL
  - Governance
featured: false
relatedProjects:
  - decision-sql
relatedLearning:
relatedWriting:
draft: false
seoTitle: "Grain Safety for Text-to-SQL: When a SUM Counts the Parent Three Times"
---
Ask for total order revenue and the natural query joins orders to order lines and sums the amount. If an order has three lines, that join produces three rows for the one order, and `SUM(order.amount)` adds the order's amount three times. The number comes back, the query runs, and nothing reports an error. It is simply wrong.

:::diagram grain-fanout-normalization

This is fanout, and it is one of the oldest ways to get a confidently incorrect analytics answer. It matters more the moment a model is writing the SQL, because a plausible query is exactly the kind of query that produces this bug.

## The join is correct. The number is wrong.

Nothing about the query is malformed. The join condition is right, the tables are the right tables, and the aggregate is a normal `SUM`. The defect is a mismatch between the grain of the rows and the grain of the measure. `order.amount` lives at the order grain; the joined result set lives at the order-line grain. Summing a parent-grain column over child-grain rows counts the parent once per child.

A human analyst learns to distrust this and checks the row counts. A model does not have that reflex, and it has no access to the fact that `amount` is additive at the order level and must not be double counted across a one-to-many join. That fact is not in the SQL. It is in the data model.

## Why the model does not own this

The safe move is to stop treating grain as something the model can be trusted to reason about, and to make it a server-owned contract instead. In DecisionSQL the server holds metadata the model never sees as authority: native entity and grain keys, relationship cardinality, which measures are additive, and the legal rollup structure. A `GrainSafetyValidator` uses that metadata to detect the specific case where an additive parent measure is exposed to a one-to-many join, which it labels `PARENT_MEASURE_FANOUT`.

The point is not that the model is bad at SQL. The point is that grain semantics are a property of the schema and its declared relationships, and the model's proposal is not the place to enforce a property of the schema.

## A normalizer that refuses most of the time

Detection alone does not fix the query, so there is a deterministic normalizer, and its most important quality is how narrow it is. It handles exactly one shape: an additive parent measure, a directly declared one-to-many relationship, and a supported `LEFT JOIN` fanout. For that shape it rewrites the query to preaggregate on the child side first, so the parent is joined once and the measure is counted once.

Outside that shape it does not guess. It stays fail-closed or reports the query as non-target and leaves it alone. That restraint is the feature. A general fanout solver that tries to repair any query is a new and larger source of wrong answers; a narrow rewriter that only acts where the contract is unambiguous is something you can actually trust.

## Normalized is not the same as trusted

A rewrite is still model-adjacent SQL, so the normalized query earns nothing by being normalized. It re-enters the same admission chain as any other SQL: it is re-parsed, re-checked against policy, validated again for grain, planned with PostgreSQL `EXPLAIN`, and passed through the cost gate before an accepted query plan reaches a read-only executor. There is no raw unsafe fallback path where an un-revalidated rewrite slips through.

That is the difference between a normalizer that is a convenience and one that is part of a safety boundary. The rewrite is a proposal too, and it is admitted on the same terms.

## What the evidence does and does not say

The honest version of the result is small on purpose. The normalizer acts only inside its declared shape, and the benchmark still records fail-closed grain rejections whose causes are being investigated rather than assumed to be runtime defects. That is the trade the design makes: a rewriter that refuses everything it cannot prove is worth more than one that guesses, because a wrong rewrite is a wrong answer that looks authoritative.

Everything about the mechanism is scoped to the supported shape and the synthetic domains it was measured on. It is evidence that a narrow, server-owned grain contract works where it applies, not a claim of universal grain repair.

The larger idea generalizes past this one bug. When a model proposes SQL over a real schema, the semantics that make an answer correct, grain included, belong to the server that owns the schema, not to the query that happened to parse. [DecisionSQL](/projects/decision-sql) treats grain safety as one of those server-owned boundaries rather than something to hope the model gets right.
