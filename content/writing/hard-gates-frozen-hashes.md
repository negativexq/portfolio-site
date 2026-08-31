---
title: "Hard Gates + Frozen Hashes for AI Coding Agents"
description: "Making agentic development verifiable rather than merely autonomous: external gates decide whether work is acceptable, and hashed baselines stop the agent from redefining what acceptable means."
slug: hard-gates-frozen-hashes
datePublished: 2026-08-27
dateModified: 2026-08-27
category: Agent Reliability
tags:
  - AI Agents
  - Guardrails
  - Evaluation
  - Reliability
featured: true
relatedProjects:
  - agentic-customer-service-platform
  - repo-context-forge
relatedLearning:
relatedWriting:
  - testing-ai-agents-without-pretending-they-are-deterministic
  - production-agent-guardrails
draft: false
seoTitle: "Hard Gates and Frozen Hashes for AI Coding Agents"
---
An AI coding agent reporting "done" is a claim, not a result. It tells you the agent's loop terminated. It does not tell you the work is correct, complete, or even in the direction you asked for.

That gap is manageable as long as something outside the agent decides whether the work is acceptable — and as long as the agent cannot reach the thing doing the deciding.

:::diagram agent-authority-boundary

## "Done" is a termination condition, not a verdict

The failure modes are ordinary rather than exotic.

An agent finishes early because its internal notion of completeness was satisfied while the requirement was not. It optimises toward whatever signal it can see, which is often the test output rather than the requirement behind the test. It burns a long loop producing motion without progress, each iteration plausible and none of them closer.

And the one worth designing against specifically: when the requirement is hard and the feedback signal is a file the agent can edit, editing the signal is a locally rational move. The agent is not being adversarial. It is doing what gradient-following does when the gradient is reachable.

None of that is solved by a better prompt, for the same reason that [an agent taking business actions cannot be made safe by instructions alone](/writing/production-agent-guardrails). Prompts shape behaviour. They do not constrain it.

## Hard gates: the agent does not grade its own work

A hard gate is an external, deterministic check that runs after the agent stops and decides whether the change is acceptable. Its defining property is not what it checks but who owns the answer: not the agent.

The gates worth having are unremarkable and mostly already exist in a normal delivery pipeline. In [the agent platform I work on](/projects/agentic-customer-service-platform), a single blocking workflow runs lint and formatting, `mypy` across application, tests, evaluation and scripts, the test suites, a frontend typecheck and build, then dependency audits, secret scanning, filesystem vulnerability and misconfiguration scanning, workflow-semantics validation, deterministic evaluation datasets, image builds and scans, and authenticated lifecycle smoke checks.

That list is not interesting because it is clever. It is interesting because it is fixed, it is external, and it fails the job rather than reporting into a summary the agent then narrates.

The useful mental shift is small: the agent produces a candidate. The gate produces the verdict.

## A gate is only as honest as its assertions

Here is where hard gates on their own stop being sufficient.

Suppose an acceptance test encodes a real safety property:

```python
assert refund_without_confirmation == DENIED
```

The agent cannot make the implementation satisfy it, so the gate stays red. There is a second way to turn it green:

```python
assert refund_without_confirmation == ALLOWED
```

Now every gate passes. Lint passes, types pass, the suite is green, CI reports success, and the system permits unconfirmed refunds. Nothing in the pipeline noticed, because the pipeline's job was to run the assertions, not to have opinions about them.

The same shape appears in duller places. Loosen a threshold in an eval config. Add an `xfail`. Regenerate a golden file so the diff disappears. Relax a lockfile so a failing constraint resolves. Each is a small, defensible-looking edit, and each moves the goalposts rather than reaching them.

So the question a gate cannot answer about itself: **did this pass, or did the rules change?**

## Frozen baselines answer the second question

Split the repository into what the agent may change and what defines whether the change is correct.

Mutable is most of it: `src/`, libraries, internal architecture, helper code, development tests, documentation. The agent needs room, and freezing implementation would defeat the point of having an agent.

Frozen is a much smaller set: acceptance criteria, golden evaluation datasets, security and policy definitions, external API contracts, and benchmark methodology. Hash each of those, keep the digests in a manifest, and verify the manifest before trusting any gate result.

A mismatch is not a test failure. It is a different class of outcome, and it should not be retried — it should stop and surface, because the run's verdict is no longer meaningful. Retrying a gate whose rules changed just produces a confident green.

This pattern is more familiar than it sounds. The same repository's CI installs Python dependencies with `uv sync --frozen`, and the documented behaviour is that **a stale lockfile fails instead of being rewritten**. The rule sitting next to it is written as an instruction to humans and machines alike: *do not replace frozen installation with an updating command in CI*. That is a frozen-hash rule about dependency resolution. Extending the same idea to acceptance criteria is not a new mechanism, just a wider application of one that already earns its place.

The evaluation side goes further. Its operational release gate binds an approval to the experiment identity, the exact source revision, the contract version and its SHA-256, the environment and configuration identity, container image identities, the migration head, the schedule hash, the concurrency parameters and the artifact schema. Every published artifact carries its own SHA-256 and is independently hash-verified, and configuration or source drift is a zero-tolerance failure rather than a warning. The rule that makes it a boundary rather than a checksum is stated plainly: **patch-and-continue is forbidden**, and an invalidated run requires a new approval instead of a repair.

## Two questions, two mechanisms

The division of labour is clean enough to state in one line each.

The hard gate answers: **did the solution pass?**

The frozen hash answers: **did it pass against the same rules?**

Either one alone is insufficient in a predictable way. Gates without frozen baselines verify a moving target. Frozen baselines without gates preserve criteria that nothing enforces.

## A frozen manifest inside an agent-writable workspace is not frozen

This is the detail that decides whether any of the above holds, and it is easy to get wrong because the file looks correct.

If the manifest of hashes lives in the same tree the agent edits, the agent can update the manifest to match whatever it changed. The hashes will verify. The verification will be meaningless. The same applies to the gate scripts, the golden datasets, and the workflow definition that decides which gates run at all — a workflow file is a gate configuration, and an agent that can edit it can delete a job.

So the boundary is not "these files are marked frozen." It is that the verification runs somewhere the agent's write access does not reach: a separate control plane, a CI job whose definition is protected, a checkout the agent process cannot modify, or a manifest held outside the workspace entirely.

Read-only mounting is the same reasoning applied at a lower level. The repository-analysis MCP server in [Repo Context Forge](/projects/repo-context-forge) mounts analysed repositories read-only and exposes an allowlisted set of read-only Git operations, so an agent consuming it can inspect a repository without the tool ever offering a path to modify one. The capability boundary is enforced by the mount, not by the tool's willingness to behave.

## What to freeze, and what to leave alone

Over-freezing fails differently but just as badly: if internal structure is frozen, every real refactor becomes a blocked proposal, the human review queue becomes the bottleneck, and the agent's usefulness disappears.

Freeze the things that define correctness from outside: acceptance criteria, golden datasets, security and policy rules, contracts with other systems, and how benchmarks are computed.

Leave mutable the things that are means rather than ends: implementation, helper code, internal architecture, development tests written to support the work, and documentation.

The test for whether something belongs in the frozen set is not how important it is. It is whether the agent could satisfy the requirement by editing it.

## When a frozen artifact genuinely has to change

Sometimes the frozen artifact is the thing that is wrong. A contract is genuinely incompatible with a new requirement; an acceptance test encodes an assumption that no longer holds. Freezing must not mean "never changes", or the baseline becomes an obstacle people route around, which is worse than not having one.

:::diagram frozen-change-control

The agent's correct behaviour at that point is to stop and say so: what it hit, why the frozen artifact conflicts with the requirement, and what change it would make. A proposal, not a patch. A human approves or rejects it, the artifact is explicitly unfrozen, updated, hashed again and re-frozen.

That loop is what makes the hash a change-control boundary instead of a tamper alarm. The rules can move. Moving them is a reviewed act that leaves a new digest behind, and the history of digests is the history of what "correct" meant over time.

## Bounded loops, and what to measure

More iterations are not more progress. An agent that can retry indefinitely against a failing gate will keep producing candidates long after it has stopped converging, and each attempt costs tokens and wall-clock time whether or not it is closer.

Bounded iterations, deterministic verification, and explicit failure is a healthier shape than an open loop. Failing after a fixed number of attempts with the last gate output attached is more useful than a twentieth attempt, because the output is a debugging artifact and the twentieth attempt is usually the nineteenth with different variable names.

The gate's own execution is worth holding to the same standard. The release gate described above allows zero automatic per-test retries and zero automatic full-run reruns, precisely so that a green result cannot be an artifact of repetition.

If you want one number, **cost per accepted change** is more honest than acceptance rate, because it prices the failed attempts instead of discarding them. I would not attach a target to it. What counts as good depends on the task mix, and a universal threshold would be a claim nobody has the data to make.

## What this does not solve

Gates only test what someone thought to assert. A frozen acceptance suite that is thin is still thin, and hashing it faithfully preserves its blind spots. Integrity verification proves the criteria did not change; it says nothing about whether they were right.

Freezing also adds friction, and friction has a direction. If the review loop is slow, pressure builds to shrink the frozen set until the boundary stops protecting anything. That erosion is gradual and looks reasonable at every individual step.

And none of this makes an agent's output good. It makes an agent's output *checkable*, which is a smaller claim and a more useful one.

Autonomy and authority are separable, and separating them is most of the work. The agent can explore, refactor and rewrite freely inside its workspace. What it cannot do is decide that it succeeded.

The agent is allowed to change the solution. It is not allowed to change the definition of success.
