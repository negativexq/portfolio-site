---
title: "Your Text-to-SQL Benchmark Is Measuring the Wrong Thing"
description: "Exact-match and single-state checks pass wrong SQL that happens to return the right rows. Correctness has to be execution across counterfactual database states, and mutation testing is how you prove the test can tell right from wrong."
slug: your-text-to-sql-benchmark-measures-the-wrong-thing
datePublished: 2026-09-09
dateModified: 2026-09-09
category: Data Engineering
tags:
  - Data Engineering
  - SQL
  - Text-to-SQL
  - Evaluation
  - Testing
featured: false
relatedProjects:
  - decision-sql
relatedLearning:
relatedWriting:
  - a-sum-that-counts-the-parent-three-times
draft: false
seoTitle: "Execution-Based Evaluation for Text-to-SQL: Counterfactual Fixtures and Mutants"
---
Most Text-to-SQL benchmarks score a generated query by comparing it to a gold SQL string, or by running it once and checking the rows. Both are easy to compute, and both let wrong queries pass. A query can match the intended result on one database state for the wrong reason, and a string comparison punishes a correct query that simply phrased the join differently. The number you report is not the number you think you are reporting.

:::diagram execution-based-evaluation

The problem is that SQL correctness is a property of semantics, and neither exact text nor a single execution measures semantics directly.

## One database state can hide a wrong query

Take a query that is supposed to return active customers with at least one order. On a database where every active customer happens to have an order, a version that forgets the `active` filter returns the same rows. It is wrong, and the state cannot tell you that. The rows match, the check passes, and the benchmark records a success.

This is not a rare edge case. Real distributions are full of coincidences that make a wrong query and a right query agree, and those coincidences are exactly what a single fixed dataset bakes in. Any evaluation that runs each query once, against one state, inherits every one of them.

## String equality measures the wrong thing in the other direction

Comparing generated SQL to a canonical string has the opposite failure. Two queries can be semantically identical and textually different: a different join order, a `WHERE` clause instead of a `HAVING`, a CTE instead of a subquery, an alias renamed. Exact match calls the correct one wrong, and AST equality only widens the target slightly. You end up measuring how closely the model imitates one author's style, not whether the query answers the question.

So a reference query should be treated as evidence that a valid implementation exists, not as the one string the model has to reproduce. In DecisionSQL each answerable case carries two independent reference witnesses for exactly this reason: the point is to pin the semantics, not a spelling.

## A counterfactual fixture makes the semantics diverge

The fix is to stop relying on one state. Alongside the base database, each case has counterfactual fixtures: variants that change the rows or the distribution specifically so that a wrong query and a correct query stop agreeing. On the base state both might return the same result; on the counterfactual state, the query that dropped the `active` filter now returns customers it should not, and the typed `ResultContract` rejects it. The correct query keeps satisfying the contract across every state.

That is what turns "returned the expected rows once" into "means the same thing as the reference across states." Correctness becomes a claim about behavior under changing data, which is the claim you actually wanted to make about a query.

## Mutation testing proves the fixtures can tell right from wrong

There is one more gap. A fixture suite that passes every correct query is only half the guarantee. You also need to know the fixtures would catch a wrong one, because a test that never fails is not evidence of anything.

Mutation testing closes that gap. You take the correct behavior and deliberately break it in known ways, producing mutants that are wrong by construction, then check that the fixtures kill them. On the frozen benchmark this ran to 190 of 190 mutants killed, 0 surviving, with 0 invalid mutants, across 120 reference witnesses and 184 fixture comparisons. A surviving mutant would have meant a wrong query the fixtures could not distinguish, which is the specific thing you cannot afford to leave unmeasured.

## What this costs and what it buys

This is more expensive than an exact-match script. It needs reference witnesses, a typed result contract, counterfactual states, and a mutation pass, and those have to be built per case rather than scraped. The payoff is that a passing score means the query behaves correctly under data it was not tuned against, instead of meaning it echoed a gold string or got lucky on one snapshot.

It also keeps the scope honest. These results belong to the frozen synthetic packs and the contracts they were measured under, not to Text-to-SQL in general. But within that scope the claim is a real one, because the evaluation was built to fail when the query is wrong. [DecisionSQL](/projects/decision-sql) treats that as the baseline for what a Text-to-SQL benchmark has to do before its accuracy number means anything.
