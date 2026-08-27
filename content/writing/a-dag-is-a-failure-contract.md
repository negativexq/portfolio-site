---
title: "A DAG Is a Failure Contract, Not a Schedule"
description: "Orchestration tutorials sell the schedule. The parts that decide whether a pipeline survives are retry semantics, write shape, backfill parameterisation and what a half-finished run leaves behind."
slug: a-dag-is-a-failure-contract
datePublished: 2026-08-26
dateModified: 2026-08-26
category: Data Engineering
tags:
  - Data Engineering
  - Airflow
  - Idempotency
  - Reliability
featured: true
relatedProjects:
  - real-time-commerce-platform
relatedLearning:
  - distributed-systems-reliability
relatedWriting:
  - kafka-at-least-once-idempotency
  - the-write-may-have-succeeded
draft: false
seoTitle: "Airflow DAGs: Retry Semantics, Idempotent Tasks and Backfills"
---
Most orchestration writing is about the schedule. Cron expression, dependencies, a picture of boxes with arrows. That part is easy, and it is not what decides whether a pipeline survives contact with production.

A DAG that runs correctly once is a solved problem. A DAG that runs correctly the *second* time — after a task died halfway through, after someone reran yesterday, after a backfill covered three weeks of windows in parallel — is the actual engineering. What a DAG really encodes is a set of promises about failure.

:::diagram dag-retry-semantics

## A retry is a replay

Set `retries: 3` and the scheduler will run the task again. It will not undo what the failed attempt already did.

That is the whole problem in one sentence, and it is the same question an at-least-once consumer asks: **if this runs twice, is the effect once?** I spent a while on that question in an [event-driven commerce platform](/projects/real-time-commerce-platform), where Kafka may redeliver a record and the processor has to make sure redelivery repeats the control flow without repeating the business effect. Batch orchestration is a different substrate with the identical property.

The answer depends entirely on the shape of the write.

**Overwriting the window is naturally idempotent.** If the task replaces the partition it owns, running it five times produces the same partition. This is the shape to reach for by default, and it is why `INSERT OVERWRITE` semantics and partition swaps exist.

**Upserting on a business key is conditionally idempotent.** A merge keyed on something stable collapses repeats. It stops being idempotent the moment the key is not actually unique, which is usually discovered later and in production.

**Appending, incrementing and notifying are not idempotent at all.** There is no identity for the second run to collide with. An append-mode load that retries produces duplicates, and the failure is quiet: the row count went up, which is what a row count is supposed to do. No freshness check and no volume check calls that wrong.

## Partial success is the normal case, not the edge case

A task that writes to three places and dies on the third has already written two. The run shows red, and the data is in a state no one designed.

There are only two honest responses. Make the unit of work atomic, so the whole task commits or none of it does — one transaction, one partition swap, one staged directory promoted at the end. Or make the task resumable, so it can determine on startup what it already finished and continue from there.

The third response, wrapping the body in a `try/except` and logging the error, is not recovery. It converts a loud failure into a quiet one and leaves the partial state exactly where it was, except now the task is green.

## Backfill is idempotency with a date attached

Backfilling means deliberately rerunning windows that already ran. It works only if the task's output is a function of the window rather than a function of when the task executed.

The distinction shows up in one line of code. A task that reads `data_interval_start` and `data_interval_end` computes the same result whenever you run it. A task that reads `datetime.now()` or "everything since the last successful run" computes something different depending on execution time, which means the window it was supposed to cover and the window it actually covered are not the same thing.

That second shape is the single most common reason a pipeline cannot be backfilled. It usually survives review because it works perfectly on the happy path, where every run happens on time and nothing is ever replayed.

## The declared order is usually stricter than the real dependency

`depends_on_past` exists for genuine cases. Running balances, slowly changing dimensions, anything where the window's result reads the previous window's output — those must run in order, and backfilling them in parallel is wrong.

Most tasks do not have that dependency and get it imposed anyway, usually because it was easier to be safe. The cost arrives during the first large backfill, when three weeks of independent windows crawl through one at a time.

This is the same discovery as decomposing a sequential batch job: the order that exists in the code is an order somebody wrote once, not a constraint the data imposes. Separating the two is most of the work, and it is worth doing before the backfill rather than during it.

## "The DAG is green" is a weak assertion

A task can succeed and produce nothing. The query returned zero rows because an upstream source was empty, the join silently dropped everything, the API returned an empty page. Exit code zero.

So the checks that matter are assertions about the output, and they belong inside the DAG as tasks rather than on a dashboard someone remembers to open: did data arrive for this window, is the volume within the range this window normally produces, do the relationships and null rates still hold. A failing assertion should fail the run, for the same reason a [quality gate belongs in the pipeline rather than in the report](/writing/one-definition-per-feature).

## What this does not solve

Idempotent tasks do not make the DAG atomic. A run that fails at step four leaves steps one through three applied and everything downstream stale, and no amount of task-level correctness fixes that. If a set of tasks has to move together, that has to be designed in explicitly.

Retries hide transient failures, which is their job, and they hide persistent ones just as effectively. A task that fails twice and succeeds on the third attempt every single day is broken, and its light is green. Retry counts are worth alerting on separately from task outcomes.

And an otherwise idempotent task with one non-idempotent side effect is still unsafe to retry. Sending a notification, calling an external API that charges per request, publishing to a topic without a deduplication key — the database write can be perfectly replayable while the email goes out four times.

The schedule tells you when a DAG runs. Everything else in it tells you what happens when it does not.
