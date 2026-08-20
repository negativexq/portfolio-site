---
title: "Building Citation Integrity into a Production RAG Pipeline"
description: "How retrieved source identity, bounded context construction, citation validation, and evaluation turn RAG citations into testable system behavior."
slug: rag-citation-integrity
datePublished: 2026-08-11
dateModified: 2026-08-11
tags:
  - RAG
  - LLM
  - Evaluation
featured: true
relatedProjects:
  - agentic-customer-service-platform
relatedLearning:
  - llm-rag-evaluation
relatedWriting:
  - agent-prompt-injection-guardrails
  - production-agent-guardrails
draft: false
seoTitle: "Citation Integrity in a Production RAG Pipeline"
---
A citation is useful only when the system can explain where it came from and verify that the cited source was available to the answer path. Rendering bracketed text after generation is not enough. The RAG pipeline in the Agentic Customer Service Platform carries source identity from ingestion through retrieval, context selection, generation, response metadata, and evaluation.

The implementation makes a deliberately narrow integrity claim. It verifies that citations refer to retrieved chunks with valid source metadata. It does not claim that every sentence is semantically entailed by its citation.

## Preserve source identity through retrieval

Each chunk has a stable identity and source fields: `chunk_id`, `document_id`, `section`, `source`, title, category, and content. Retrieved chunks add retrieval and optional reranking scores without replacing that identity.

Both retrieval backends return the same ranked chunk schema. The local backend combines deterministic dense retrieval with BM25-style lexical scoring and weighted fusion. The configured Qdrant path stores an unnamed dense vector and a named `lexical` sparse vector, then uses reciprocal-rank fusion. Optional reranking follows fusion in both paths.

The exact fusion algorithms differ, so evaluation records the backend and strategy. Citation handling does not depend on those score details. It depends on the selected chunks retaining their source fields.

:::diagram rag-citation-pipeline

## Build a bounded context

`construct_context` sorts chunks by rerank score and retrieval score, removes duplicate normalized content, and stops at a configured maximum. The default generation path uses at most four chunks.

The grounded answer generator creates its citation list from that selected context:

When no context survives, the generator returns a bounded fallback with no citations and `grounded=False`. It does not manufacture a policy answer or a source reference.

This distinction also appears in resilience behavior. A reranker failure preserves the fused ranking and marks the result as degraded. A retrieval outage allows valid business results to survive, but the agent suppresses unsupported policy claims and returns no citations.

## Validate membership, not typography

The evaluation helper `citation_integrity` builds a set of valid citation IDs from the retrieved chunks. A citation passes only when its `citation_id` belongs to that set and it has a source. The runtime evaluation hook separately records whether retrieval succeeded, citations were available, reranking ran, fallback was used, the backend, and latency.

This catches several concrete failures:

- a citation points to a chunk that retrieval did not return;
- a citation loses its source metadata;
- a malformed Qdrant payload would require fabricated citation fields;
- a retrieval failure still produces citation-shaped output;
- concurrent requests leak retrieval or degradation metadata into one another.

The repository has focused tests for each boundary. `test_grounded_generation_emits_only_retrieved_citations_and_bounded_fallback` covers the generator. `test_qdrant_runtime_retrieval_preserves_metadata_and_citation` covers the production retrieval adapter. `test_qdrant_skips_malformed_payload_without_fabricating_citations` checks malformed storage data. Request-scoped metadata is tested under concurrent retrieval.

## Keep citations separate from authorization

Retrieved content is evidence for an answer, not authority for an action. A chunk can explain a refund policy, but PostgreSQL still decides whether the customer's order is eligible. The customer-scoped tool path validates ownership and current state independently.

For a request that combines knowledge and action, the agent can cite the policy context and report the business system's resource status. The response identifies business state as authoritative for the specific customer request. A retrieved instruction cannot select or authorize a tool.

This separation prevents a valid-looking citation from becoming a trust token. Source membership tells us where text came from. It does not make that text an authorization rule.

## Snapshot identity is part of citation integrity

The Qdrant knowledge base is built as an immutable physical snapshot behind an atomic alias. Snapshot identity includes the corpus plus embedding provider, model, dimension, dense and sparse schema, knowledge schema, chunking, and lexical-index semantics.

Ingestion builds and validates a complete snapshot before switching the alias. Failed or incomplete inactive snapshots can be rebuilt. Active snapshots are never silently repaired or deleted. A rollback switches the alias only to a compatible completed snapshot.

That lifecycle matters because a citation points into a particular index artifact. Reusing a collection after changing embedding or chunking semantics would make source IDs look stable while their retrieval meaning changed. Snapshot provenance makes the active artifact inspectable and rejects incompatible state at readiness.

## What the current metric does not prove

The deterministic evaluation suite reports 100% citation integrity for its covered scenarios. That means every emitted citation in those scenarios belonged to the retrieved evidence and retained source metadata. The suite is an offline regression gate with a fake structured-decision provider. It is not a claim about unrestricted live-model answer quality.

The current metric also does not check claim-level entailment, citation completeness for every factual sentence, or whether retrieval found the best source. Those require separate evaluation data and scoring. Treating them as one "grounded" number would hide which layer failed.

The next useful extension is a versioned evaluation set that scores retrieval recall, citation membership, claim support, and citation completeness separately. Until that evidence exists, the implementation's claim remains precise: cited sources are drawn from the context the system actually retrieved, source identity is preserved, and failure paths do not fabricate citations.

The [Agentic Customer Service Platform](/projects/agentic-customer-service-platform) case study provides the surrounding RAG, snapshot, and evaluation architecture. The [prompt injection guardrails](/writing/agent-prompt-injection-guardrails) note explains why retrieved evidence never receives tool authority.
