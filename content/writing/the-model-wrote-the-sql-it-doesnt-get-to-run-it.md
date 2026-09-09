---
title: "The Model Wrote the SQL. It Doesn't Get to Run It."
description: "Between a model writing a query and a database running it sits an admission chain that ends in a capability object. The executor runs an accepted QueryPlan, not raw SQL, so passing every gate is the only path to execution."
slug: the-model-wrote-the-sql-it-doesnt-get-to-run-it
datePublished: 2026-09-09
dateModified: 2026-09-09
category: Governed Text-to-SQL
tags:
  - Text-to-SQL
  - SQL
  - Execution Authority
  - Governance
  - PostgreSQL
featured: false
relatedProjects:
  - decision-sql
relatedLearning:
relatedWriting:
  - a-sum-that-counts-the-parent-three-times
  - your-text-to-sql-benchmark-measures-the-wrong-thing
draft: false
seoTitle: "Execution Authority for Text-to-SQL: The Accepted QueryPlan Capability"
---
A model that writes SQL has done something useful and nothing dangerous. The danger starts one step later, when a string it produced is handed to a database and run. Most of the risk in a Text-to-SQL system lives in that handoff, and the safe design is to make sure the handoff never happens directly.

:::diagram sql-admission-queryplan

DecisionSQL treats the model's `ANSWER + SQL` as a proposal and puts a deterministic admission chain between it and PostgreSQL. The model proposes; software decides what may execute.

## A proposal is not permission

The selected SQL does not run because it parsed. It runs, if it runs at all, after clearing an ordered chain of deterministic gates, each of which can reject it: `sqlglot` parse, then SQL and object policy, then server-owned grain safety, then a PostgreSQL `EXPLAIN`, then a cost gate. Parse enforces a single read-only statement. Policy enforces governed object access, function restrictions and complexity limits. Grain safety checks that a parent measure is not about to be multiplied by a fanout join. `EXPLAIN` and the cost gate reject a query whose planned cost or row count exceeds the frozen limits before a single row is read.

None of these gates trusts the previous one to have been generous. Each is a separate check with its own reason to say no, and a query that fails any of them stops there.

## The QueryPlan is a capability, not a formality

Passing the gates does not hand the SQL to the database either. What comes out of the chain is an accepted, immutable `QueryPlan`, issued by the SQL safety service. That object is the point of the whole design. It is not a wrapper around the SQL string; it is proof that this specific query cleared every gate, and it is the only thing the executor will run.

This is what turns a pipeline of checks into an actual boundary. If execution required only that the SQL had "been validated somewhere," any code path that believed it had validated could execute. Because execution requires a `QueryPlan` the safety service minted, there is exactly one place that can authorize a query, and it is the place that ran the checks.

## No back door: the executor will not take raw SQL from anyone

The rule holds in the awkward direction too. The restricted read-only executor does not accept SQL directly from the model's response, from the grain normalizer, or from the evaluator. Each of those is a plausible source of a query, and each is refused for the same reason: it carries no accepted `QueryPlan`. There is no raw fallback path where an un-admitted query slips through because it came from a trusted-looking component.

That matters most for the normalizer, which rewrites SQL to fix fanout. A rewrite is new SQL, so it does not inherit the original's admission. It re-enters the chain, re-parses, re-checks policy and grain, re-plans and re-costs, and only then can a new plan be issued. The component that fixes a query has no more standing to execute than the model that wrote it.

## What the funnel actually shows

When the boundary works, the failures move somewhere honest. On the frozen benchmark's answerable slice, 53 of the cases where the model chose to answer produced SQL, and across those 53 the admission chain recorded 0 parse rejections, 0 policy rejections, 0 semantic rejections, 0 cost rejections and 0 execution failures. Two results were wrong on their merits, which leaves conditional runtime correctness at 51 of 53, or 96.2%.

The useful reading of that is where the remaining error is not. It is not in parsing, policy, cost admission or execution infrastructure. The bottleneck is model decisioning: whether the model chose to answer at all, and whether the query it wrote meant the right thing. The admission chain did its job, which is to make sure a wrong query fails as a wrong answer rather than as an unsafe execution.

## Why authority belongs in the plan, not the prompt

The alternative most systems reach for is to ask the model, in the prompt, to only write safe read-only queries. That is a request, not a guarantee, and it degrades silently the moment the model is wrong, updated or adversarially nudged. Moving the authority into an accepted `QueryPlan` makes the guarantee independent of the model's cooperation: the executor's contract is with the safety service, not with the text the model happened to emit.

This is the same principle the rest of DecisionSQL runs on. [Grain safety](/writing/a-sum-that-counts-the-parent-three-times) is a server-owned semantic contract rather than something the model is trusted to get right, and [correctness is measured by execution across states](/writing/your-text-to-sql-benchmark-measures-the-wrong-thing) rather than by trusting a string. The admission chain is where those ideas become an enforced boundary: the model can write any SQL it likes, and none of it runs until the safety service says it may. [DecisionSQL](/projects/decision-sql) is built so that sentence is literally true.
