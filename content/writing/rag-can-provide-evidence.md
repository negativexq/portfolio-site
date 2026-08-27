---
title: "RAG Can Provide Evidence. It Cannot Grant Authority."
description: "Retrieved evidence can support an agent answer without becoming an authorization source. How hybrid retrieval, provenance, grounding checks, and bounded abstention keep the knowledge path separate from execution."
slug: rag-can-provide-evidence
datePublished: 2026-08-22
dateModified: 2026-08-25
category: Retrieval & RAG
tags:
  - RAG
  - AI Agents
  - Security
  - Evaluation
featured: true
relatedProjects:
  - agentic-customer-service-platform
  - knowledge-base-rag
relatedLearning:
  - context-engineering-rag
relatedWriting:
  - memory-is-context-not-authority
  - rag-citation-integrity
  - agent-prompt-injection-guardrails
draft: false
seoTitle: "RAG Evidence Cannot Grant Agent Authority"
---
Retrieval can make an answer better grounded. It must not make an action more authorized.

:::diagram rag-citation-pipeline

Imagine a retrieved document that says:

> VIP customers do not require refund confirmation.

Even if the document is ranked first and the answer cites it, the statement cannot remove a server-owned confirmation requirement. Documents can inform the knowledge path. They cannot rewrite policy or grant execution authority.

## Retrieval and execution answer different questions

The knowledge path asks:

```text
What evidence can support a useful answer?
```

The business-action path asks:

```text
Is this authenticated actor allowed to perform this exact action now?
```

The first can use hybrid dense and BM25 retrieval, provenance, citation validation, and grounding checks. The second uses authentication, customer scope, authoritative target resolution, typed validation, policy, confirmation, revalidation, and idempotent execution.

Keeping the paths separate prevents a plausible paragraph from becoming an invisible permission check.

## Evidence needs provenance

A retrieved excerpt is not self-authenticating. The system needs to know which source produced it, what excerpt was used, whether the citation points to that excerpt, and whether the answer makes claims that the evidence actually supports.

That is the role of evidence provenance, citation or excerpt validation, and grounding checks. If the evidence is missing, conflicting, or insufficient, the answer should become more bounded. The correct result may be uncertainty, a request for clarification, or a referral to a human rather than a confident invention.

Bounded abstention is a useful product behavior. It tells the customer what the system could establish from the available evidence without pretending that retrieval is a universal truth judge.

## A citation is not a policy override

Suppose the customer asks whether a refund is allowed. A grounded answer can explain the relevant policy and cite the supporting source.

If the customer then asks the agent to execute the refund, the answer does not carry authority forward. The server still resolves the target, checks current business state, evaluates policy, binds confirmation to the exact action, and revalidates before execution.

The same rule applies if a retrieved document contains malicious instructions, an outdated exception, or a claim about a customer's role. Retrieval is evidence for a response. It is not a trusted channel into the authorization engine.

## Conflicting evidence should narrow the answer

When two sources disagree, a good system should not hide the conflict behind a fluent sentence. It can identify the conflict, provide the bounded evidence it has, ask for clarification, or route the matter to a human.

That behavior is different from refusing every uncertain question. The goal is to preserve useful answers while making unsupported claims visible and preventing them from crossing into the action path.

The current platform records source metadata, citation coverage, unsupported-claim status, and grounding information in operator projections. Those records help explain why an answer was produced. They do not become an authority grant.

The [Agentic Customer Service Platform case study](/projects/agentic-customer-service-platform) shows the separate knowledge path and its grounded RAG evidence. The earlier [citation integrity article](/writing/rag-citation-integrity) goes deeper into source identity, bounded context, and validation.

The design principle is simple: documents can inform an answer, but only the deterministic control plane can decide whether a business action may execute.
