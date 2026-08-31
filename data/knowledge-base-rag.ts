export const knowledgeBaseRagProjectUrl = "https://omerfkoc.dev/projects/knowledge-base-rag";

export const knowledgeBaseRagMeta = {
  title: "Knowledge Base RAG",
  description:
    "Local-first multilingual RAG platform with tenant-scoped hybrid retrieval, measured reranking, support-unit evidence construction, occurrence-aware validation and preregistered evaluation gates.",
  image: "/projects/knowledge-base-rag/rag-overview.jpg",
  imageAlt:
    "Knowledge Base RAG operations console showing source health, recent syncs, security state and the active Qdrant index.",
  keywords: [
    "knowledge base RAG",
    "multilingual retrieval",
    "hybrid search",
    "citation integrity",
    "prompt injection resistance",
    "tenant scoped retrieval",
    "RAG evaluation",
  ],
} as const;

export const knowledgeBaseRagCapabilities = [
  {
    title: "Knowledge operations",
    items: [
      "Filesystem and Notion connectors",
      "Incremental sync with content fingerprints",
      "Versioned Qdrant collections and alias activation",
      "Sync history, drift detection and rollback-aware cleanup",
    ],
  },
  {
    title: "Retrieval and answers",
    items: [
      "Qwen3 dense embeddings plus BM25 sparse search",
      "Native reciprocal rank fusion",
      "Multilingual BGE reranking from 20 candidates to 5",
      "Canonical citations and strict output validation",
    ],
  },
  {
    title: "Control and evidence",
    items: [
      "Server-owned tenant ACL and role boundaries",
      "Untrusted context serialization with answer_v3",
      "Artifact-backed evaluation and security results",
      "OpenTelemetry traces inspected through Jaeger",
    ],
  },
] as const;

export const knowledgeBaseRagQueryFlow = [
  {
    label: "Authenticated request",
    detail: "FastAPI resolves the bearer token into a server-owned user, role and tenant context.",
  },
  {
    label: "Mandatory ACL",
    detail: "The tenant filter is applied before reranking or generation. Later stages cannot widen the authorized set.",
  },
  {
    label: "Dense and sparse retrieval",
    detail: "Qwen3 embeddings and Qdrant BM25 search produce separate candidate lists from the active index alias.",
  },
  {
    label: "RRF fusion",
    detail: "Reciprocal rank fusion combines semantic and lexical signals without turning either score into a trust decision.",
  },
  {
    label: "Multilingual reranking",
    detail: "BAAI/bge-reranker-v2-m3 reranks 20 authorized candidates and passes the best 5 onward.",
  },
  {
    label: "SectionAware evidence",
    detail: "Surviving results are packed into request-scoped support units under a bounded context budget. Document text and metadata stay reference data and never receive a system or assistant role.",
  },
  {
    label: "Support-ID validation",
    detail: "The model returns text plus support IDs. Unknown, cross-query, hidden and unauthorized IDs are rejected before anything else runs.",
  },
  {
    label: "Occurrence-aware validation",
    detail: "Architecture V2 checks critical-value consistency against an immutable occurrence ledger, so a role decision stays attached to the occurrence it came from.",
  },
  {
    label: "Inspectable response",
    detail: "The console keeps the answer, authorized sources, retrieval stages, security state and trace waterfall together.",
  },
] as const;

export const knowledgeBaseRagBoundaryRows = [
  {
    side: "Server-owned controls",
    items: [
      "Bearer-token identity and role checks",
      "Tenant and retrieval context",
      "ACL filtering before reranking",
      "Active index alias and pipeline fingerprint",
      "Validation mode and release policy",
      "Canonical citation membership checks",
    ],
  },
  {
    side: "Untrusted or presentational inputs",
    items: [
      "Document text, titles and headings",
      "Source names and location metadata",
      "Delimiter-looking instructions inside documents",
      "Generated answer text before validation",
      "Frontend identity selection and UI state",
      "Client-observed timing data",
    ],
  },
] as const;

export const knowledgeBaseRagEngineeringDecisions = [
  {
    title: "Authorization runs before relevance scoring",
    description:
      "Tenant ACL filtering happens before the reranker sees a candidate. A strong relevance score cannot recover a chunk that the authenticated tenant was not allowed to retrieve.",
  },
  {
    title: "Production answers are validated before release",
    description:
      "Strict mode buffers generation until canonical citation and output-policy checks pass. Fast streaming remains an explicit server-side development option with a documented risk: output can reach the client before the post-stream check finishes.",
  },
  {
    title: "The active index is a versioned artifact",
    description:
      "The kb_active alias points to a compatible collection whose fingerprint covers embedding, parser, index and chunk settings. New collections are built and checked before activation, so a model or dimension change cannot silently reuse an incompatible index.",
  },
  {
    title: "Pipeline changes need comparative evidence",
    description:
      "The multilingual reranker was adopted after a paired 220-query benchmark. Token-aware chunking was implemented but the 500/50 baseline stayed in production because the current short corpus showed no measurable quality or efficiency gain.",
  },
] as const;

export const knowledgeBaseRagScreenshots = [
  {
    src: "/projects/knowledge-base-rag/rag-overview.jpg",
    alt: "RAG operations overview with document, chunk and source counts, recent synchronization runs, system health and active index details.",
    caption:
      "Overview: source health, recent syncs, security state and the active index are visible without entering the chat path.",
    source: "docs/assets/rag-overview.jpg",
    sourceUrl:
      "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/assets/rag-overview.jpg",
  },
  {
    src: "/projects/knowledge-base-rag/rag-playground.jpg",
    alt: "RAG playground showing a cited answer beside the exact retrieved source cards and stage timing.",
    caption:
      "Evidence inspector: the answer stays beside the ranked source set and the latency breakdown that produced it.",
    source: "docs/assets/rag-playground.jpg",
    sourceUrl:
      "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/assets/rag-playground.jpg",
  },
  {
    src: "/projects/knowledge-base-rag/rag-playground-security.jpg",
    alt: "RAG playground security panel showing the applied tenant ACL, isolated untrusted context and validate-before-release policy.",
    caption:
      "Security inspector: tenant authorization, context isolation and release policy are shown as separate controls.",
    source: "docs/assets/rag-playground-security.jpg",
    sourceUrl:
      "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/assets/rag-playground-security.jpg",
  },
  {
    src: "/projects/knowledge-base-rag/rag-playground-trace.jpg",
    alt: "RAG playground trace inspector showing retrieval, reranking, generation and validation spans as a waterfall.",
    caption:
      "Trace waterfall: retrieval, reranking, generation and validation remain one inspectable request path.",
    source: "docs/assets/rag-playground-trace.jpg",
    sourceUrl:
      "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/assets/rag-playground-trace.jpg",
  },
  {
    src: "/projects/knowledge-base-rag/rag-evaluations.jpg",
    alt: "RAG operations evaluation page showing the production baseline and the measured multilingual reranker decision.",
    caption:
      "Evaluation surface: active settings are tied back to committed benchmark artifacts and explicit adopt or keep decisions.",
    source: "docs/assets/rag-evaluations.jpg",
    sourceUrl:
      "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/assets/rag-evaluations.jpg",
  },
] as const;

export const knowledgeBaseRagEvidence = [
  {
    area: "End-to-end answers",
    result: "70% useful · 2% incorrect",
    detail: "Canonical TechQA BGE-ON record. Useful is Correct plus Partial, which is not an accuracy claim; strict full completeness scored separately at 30%.",
  },
  {
    area: "Unavailable or abstained",
    result: "28% of answers",
    detail: "Model self-abstention and deterministic forced abstention together. Reported as an outcome, not assumed to be either a safety success or a quality failure without case-level attribution.",
  },
  {
    area: "Support-ID and citation contracts",
    result: "0 failures",
    detail: "No unknown, cross-query, hidden or unauthorized support IDs accepted. Deterministic contract results on the evaluated corpus, not proven security.",
  },
  {
    area: "Candidate evidence recall",
    result: "95.9% at Top-20",
    detail: "Measured at the shared candidate stage before reranking narrows to five, so it is not a statement about evidence in the model's final context.",
  },
  {
    area: "Multilingual reranker",
    result: "220 queries · Recall@5 1.0000 · MRR 0.9558",
    detail: "63 cross-lingual rescues and 0 drops for the selected BGE model. A retrieval and ranking metric, separate from final-answer accuracy.",
  },
  {
    area: "Preregistered gate",
    result: "BGE_REMOVAL_NOT_SUPPORTED",
    detail: "Removing the reranker improved evidence completeness, but the semantic non-regression gate frozen beforehand failed, so the change was not adopted.",
  },
  {
    area: "Repository verification",
    result: "844 backend · 18 frontend",
    detail: "Last recorded full run; 2 external provider checks skipped, with Ruff, typecheck, lint and production build green.",
  },
] as const;

export const knowledgeBaseRagRerankerComparison = [
  {
    configuration: "Reranking off",
    recall: "0.9563",
    mrr: "0.7448",
    latency: "268.4 ms",
    decision: "Baseline",
  },
  {
    configuration: "Previous cross-encoder",
    recall: "0.4511",
    mrr: "0.3670",
    latency: "453.0 ms",
    decision: "Reject",
  },
  {
    configuration: "BGE multilingual",
    recall: "1.0000",
    mrr: "0.9558",
    latency: "2457.7 ms",
    decision: "Adopt",
  },
] as const;

export const knowledgeBaseRagStackGroups = [
  ["Operations console", "React · TypeScript · Vite"],
  ["API", "FastAPI · HTTP · SSE · read-only UI aggregation"],
  ["Identity", "Bearer tokens · tenant ACL · USER / OPERATOR / ADMIN roles"],
  ["Retrieval", "Qdrant dense + BM25 sparse · RRF · BGE multilingual reranker"],
  ["Models", "Qwen3-Embedding-4B @ 1024 · Ollama generation"],
  ["Generation", "answer_v3 · untrusted context · strict output policy"],
  ["Index lifecycle", "SQLite registry · versioned collections · kb_active alias"],
  ["Observability", "OpenTelemetry · Jaeger · artifact-backed evaluations"],
  ["Runtime", "Python 3.11+ · Docker Compose · native Ollama"],
] as const;

export const knowledgeBaseRagLimitations = [
  "The BGE reranker is a synchronous local model call inside the async retrieval path; concurrent model serving is not implemented.",
  "The current chunking corpus is too short to distinguish the tested 256 to 768 token boundaries, so the 500/50 baseline remains active.",
  "Citation integrity checks source membership, not claim-level semantic support. Calibrated answerability and abstention are also still open.",
  "The 28% unavailable bucket is not attributed case by case, so it cannot be split into abstentions that were correct and abstentions caused by reranker loss, evidence packing or validator over-rejection.",
  "Local tokens and development identities are demo authentication. A production deployment needs an external identity provider or verifier.",
  "Sync coordination is process-local, and each configured source type maps to a server-owned tenant in the current connector model.",
] as const;

export const knowledgeBaseRagDeepDiveLinks = [
  {
    label: "Architecture",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/architecture.md",
  },
  {
    label: "Security model",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/security.md",
  },
  {
    label: "Reranking decision",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/reranking.md",
  },
  {
    label: "Chunking decision",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/chunking.md",
  },
  {
    label: "Embedding migration",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/embedding-migration.md",
  },
  {
    label: "Architecture decisions",
    href: "https://github.com/negativexq/knowledge-base-rag/blob/main/docs/adr/README.md",
  },
] as const;

export const knowledgeBaseRagRelatedWriting = [
  {
    href: "/writing/rag-citation-integrity",
    title: "Building Citation Integrity into a Production RAG Pipeline",
    description:
      "How source identity, bounded context and citation checks turn a reference into testable system behavior.",
  },
  {
    href: "/writing/rag-can-provide-evidence",
    title: "RAG Can Provide Evidence. It Cannot Grant Authority.",
    description:
      "Why retrieved text can support an answer without becoming a permission or policy channel.",
  },
] as const;
