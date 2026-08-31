---
title: "One Definition Per Feature"
description: "When every pipeline rebuilds the same customer feature, the definitions drift apart silently. Making the feature a shared owned artifact fixes that and creates a change-impact problem that column lineage has to answer."
slug: one-definition-per-feature
datePublished: 2026-08-08
dateModified: 2026-08-08
category: Data Engineering
tags:
  - Data Engineering
  - dbt
  - Feature Platform
  - Lineage
featured: true
relatedProjects:
  - dbt-feature-lineage
relatedLearning:
relatedWriting:
draft: false
seoTitle: "One Definition Per Feature: Shared dbt Features and Column Lineage"
---
A feature is a definition before it is a column. When two workloads both need "active customer," the cheapest available move is to write the logic again inside whichever pipeline needs it. That works until the definitions stop agreeing, and the disagreement is invisible: both pipelines run, both produce a number, and nothing anywhere reports a conflict.

:::diagram feature-definition-lineage

## The drift is silent by construction

One pipeline counts a customer active on ninety days of activity. Another uses a transaction in the current month. A reporting model uses a third rule that made sense to whoever wrote it. Each is defensible on its own. None of them fails.

The system now holds three answers to one question, and no owner for any of them. The failure mode is not a bug that can be caught by a test, because there is nothing to compare against. It is an absence: no single place where the definition lives.

That absence surfaces later, and badly. A model's training data and its serving path disagree. Two dashboards report different customer counts to different people. Someone eventually reconciles them by hand, picks a winner, and the fork survives everywhere it was not found.

## Make the feature an artifact, not a snippet

The fix is unglamorous: the feature becomes a model rather than a fragment of SQL. In dbt terms it has a name, an owner, a description, and tests, and every consumer reaches it through `ref()` instead of reimplementing it.

That gives the definition somewhere to live. There is one place to change it, one place to test it, and one place to argue about whether it is right. The argument is the valuable part. A definition nobody can locate is a definition nobody can dispute.

Consumers stop being authors. Training, batch inference and reporting all read the same artifact, so a change reaches them together instead of reaching whichever pipeline happened to be edited.

## Sharing moves the risk, it does not remove it

Copy-paste has one genuine virtue: its blast radius is one. When each pipeline owns its own version, a careless change breaks exactly one thing. Once ten consumers share a definition, a change to it is a change to ten things at once, and the person making it usually knows about two of them.

So a shared definition is only safer if the question "what breaks if I change this column?" can be answered before the change, not discovered after it. Otherwise the shared model becomes something people are afraid to touch, and fear produces the same outcome as convenience: someone forks it again.

## Direct impact and transitive impact are different questions

That is the problem [dbt-feature-lineage](/projects/dbt-feature-lineage) exists to answer. It reads a local dbt project, with no warehouse connection required, and traces a column backwards through joins, coalesces and renames to its raw sources, or forwards to its consumers, through a project-wide graph.

The part that matters for shared features is that the downstream summary separates the directly affected models from the full transitive chain. Those deserve different responses. Direct consumers reference the column themselves and almost always need review. The transitive tail inherits it, and often does not care. Collapsing them into one number either buries the reviewer in noise or understates the change.

Manifest-aware analysis is preferred over static SQL parsing wherever `target/manifest.json` is available, because the manifest describes what dbt actually compiled rather than what a parser inferred from the source.

There is also a blunter use for the same graph. The Feature Explorer compares every model that produces a given column name side by side with its description, owner, tags and test count. If three models produce `active_customer`, that view is where the drift stops being invisible.

## The check belongs in the pipeline

A shared definition raises the cost of a regression, so the regression has to be caught early.

:::diagram feature-pipeline-gates

The failure mode worth designing against is a data or model regression that first appears as a wrong number in a downstream report, days later, seen by the person furthest from the cause. By then the investigation runs backwards through several systems to find a change nobody flagged.

Expectations that run inside the orchestration fail the run at the point of computation: Great Expectations on the data, model validation on the trained artifact, both as Airflow tasks and delivery-pipeline steps. A check in the pipeline fails a job. A check in the report fails the reader's trust in every number next to it.

## Cheap to change, or it will not stay shared

The economics decide whether the shared definition survives.

If touching the shared model means waiting through a long sequential rebuild, people will avoid touching it, and avoiding it means forking it. Modular models that build in parallel are not only a runtime improvement; they keep the shared path the cheap path. Whichever route is cheapest is the one the next engineer under deadline will take.

## What this does not solve

Shared definitions concentrate correctness risk. A wrong shared feature is wrong everywhere at once, and consistently wrong numbers are harder to notice than inconsistent ones.

Lineage tells you what a change touches. It does not tell you whether the new definition is correct, which is a domain judgement that no graph makes for you.

Column-level lineage from static analysis degrades with dynamic SQL and heavy macro use, which is exactly why manifest-aware analysis is preferred when the compiled artifacts exist.

And tests only catch what someone thought to assert. A shared feature with one row-count test is shared, owned, and still unverified.

One definition per feature is not about tidiness. It is about making a definition into something that can be owned, reviewed, tested and changed deliberately, instead of a rule that silently forks every time somebody needs it again.
