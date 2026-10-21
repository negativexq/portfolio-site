---
title: "One Million Rows, One Schedule, No Hand-Run Monitoring"
description: "Batch inference is trustworthy when every output can be traced to the exact data, model and run that produced it, and checked against ground truth without a person starting the check. A walk through one million real NYC taxi trips scored and monitored by the ML platform."
metaDescription: "One million real NYC taxi trips scored on a schedule, versioned with lineage and checked against ground truth automatically by an ML platform."
slug: one-million-rows-one-schedule
datePublished: 2026-10-22
dateModified: 2026-10-22
category: AI Platform
tags:
  - AI Platform
  - MLOps
  - Data Engineering
  - Evaluation
featured: false
relatedProjects:
  - ml-platform-infrastructure
relatedLearning:
  - ai-platform-observability
relatedWriting:
  - commit-the-intent-then-touch-the-cluster
  - a-dag-is-a-failure-contract
draft: false
seoTitle: "One Million Rows Scored and Monitored on a Schedule"
---
A batch inference job that "ran successfully" answers almost none of the questions that matter a week later. Which input data did it read? Which model version scored it? If it ran twice, are both outputs the same? Did anyone compare the predictions with what actually happened?

The ML Platform Infrastructure project treats those questions as platform features rather than conventions. The clearest way to show that is one real run: **one million NYC taxi trips** scored on a schedule and checked against ground truth with no manual step in between.

## The data is real and pinned

The input is the public NYC TLC Yellow Taxi trip records for January and February 2025, downloaded from the official Parquet files. The target is the recorded `fare_amount` in USD.

| Month | Source rows | Eligible after cleaning | Sampled |
| --- | ---: | ---: | ---: |
| January 2025 | 3,475,226 | 2,808,158 | 1,000,000 |
| February 2025 | 3,577,543 | 2,652,940 | 1,000,000 |

Cleaning keeps trips whose pickup falls in the stated month, with distance 0.1–50 miles, 1–6 passengers and a fare between USD 2 and 200. Exactly one million rows per month are sampled without replacement with a fixed seed, and each row keeps its source identity as `month:source_row`.

The model is a gradient-boosted fare regressor on four features: distance, passenger count, pickup hour and weekday. It is trained on 200,000 January rows, registered as an MLflow package, and its SHA-256 manifest is frozen into the batch definition. The platform will not score with a model whose bytes differ from that manifest.

## Every dataset is a version

The project's catalog holds six immutable dataset versions:

| Dataset | Version | Meaning | Rows |
| --- | --- | --- | ---: |
| `taxi-features` | v1 | January reference features | 1,000,000 |
| `taxi-features` | v2 | February scoring features | 1,000,000 |
| `taxi-ground-truth` | v1 | January recorded fares | 1,000,000 |
| `taxi-ground-truth` | v2 | February recorded fares | 1,000,000 |
| `fare-predictions` | v1 | Scheduled pipeline's February predictions | 1,000,000 |
| `fare-predictions` | v2 | Independent rerun, separate output object | 1,000,000 |

Ground truth is separated from the features before scoring. The scoring job cannot see the labels it will later be judged against.

## The schedule resolves data, then freezes it

The schedule `scheduled-february-scoring` dispatches the pipeline `monthly-fare-scoring` through the platform scheduler and Argo Workflows. It does not point at "the latest data". It uses a processing-date rule: `2025-02-01` resolves to `taxi-features` v2, and that identity is frozen into the run's execution snapshot.

That snapshot is what makes the run reproducible. If someone publishes `taxi-features` v3 tomorrow, this run's record still says exactly which bytes it read. A historical window can be replayed today without pretending the observations were collected today.

The scheduled run published `fare-predictions` v1 with producer and step lineage and a verified checksum.

:::diagram batch-lineage-monitoring

## Running it twice must not mean two answers

A second, independent pipeline run published `fare-predictions` v2 to a different S3 object. The prediction bytes are **identical** to v1. Same frozen input, same pinned model, same output.

Replaying the creation request with the same idempotency key returned the existing run instead of starting a new one. Retries from a flaky client do not multiply jobs, and deliberate reruns produce comparable, separately addressable outputs.

## Monitoring starts itself

Scoring is half the job. The other half is checking the predictions against reality.

In the dataset-triggered acceptance, a cron schedule started the February scoring pipeline, which published `fare-predictions` v3. A monitoring rule, `nyc-published-fare-quality`, saw the new version and created the monitoring run automatically. No one started it.

The monitoring job pins the produced dataset version and joins it to the separate February ground truth on a unique `trip_id`:

| Measurement | Result |
| --- | ---: |
| Rows matched | 1,000,000 |
| Coverage | 100% |
| Unmatched predictions / labels | 0 / 0 |
| MAE | 2.082 USD |
| RMSE | 4.466 USD |
| R² | 0.920 |
| Distance PSI | 0.000405 |
| Passenger count PSI | 0.001404 |
| Pickup hour PSI | 0.000835 |
| Weekday PSI | 0.007974 |

Every selected feature reports **STABLE** against a PSI threshold of 0.2 and a missing-rate threshold of 0.1. An independent pandas join and scikit-learn metric calculation agrees with the platform's report within floating-point rounding.

Monitoring success is independent of what it finds. A report that detects drift is a successful monitoring run; a monitoring job that crashes is a failure, whatever the data looked like.

A reconciler restart during the automated run preserved the same execution and run, and created no duplicate monitoring job.

## The resource contract held

Both jobs ran with an explicit **1 CPU / 1 GiB** request and limit:

| Job | Duration (incl. Argo lifecycle) | Highest sampled memory peak |
| --- | ---: | ---: |
| Scoring | 18.95 s | 262.52 MiB |
| Monitoring | 28.17 s | 276.96 MiB |

The first definition asked for 2 GiB and stayed pending, because the node had already reserved most of its allocatable memory. Rather than bypass the namespace quota, that run was cancelled and a new immutable 1 GiB definition version was created. The pipeline that succeeded is a different version from the one that waited, and the record shows both.

## What the platform guarantees here

| Question | Where the answer lives |
| --- | --- |
| Which data was scored? | Frozen dataset version in the execution snapshot |
| Which model? | Pinned MLflow package with a SHA-256 manifest |
| Which run produced this output? | Producer and step lineage on the dataset version |
| Is a rerun the same? | Identical bytes, separate version and object |
| Was a retry a new job? | Idempotency key returns the existing run |
| Did anyone check the predictions? | Rule-created monitoring report, 100% ground-truth coverage |

The datasets, paused schedule, output versions and report stay in the platform's catalog and UI after the run. Anyone reviewing a prediction can follow it back to its input rows, model bytes and the report that judged it.

The orchestration side of the same idea, where a pipeline graph is a contract about failure rather than a diagram, is in [A DAG Is a Failure Contract](/writing/a-dag-is-a-failure-contract). The catalog, scheduler and monitoring code are in [ML Platform Infrastructure](/projects/ml-platform-infrastructure).
