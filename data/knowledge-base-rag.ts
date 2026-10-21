export const knowledgeBaseRagProjectUrl = "https://omerfkoc.dev/projects/knowledge-base-rag";

const repo = "https://github.com/negativexq/knowledge-base-rag";

export const knowledgeBaseRagMeta = {
  keywords: [
    "agentic RAG",
    "agentic document research",
    "PydanticAI",
    "typed research graph",
    "knowledge base RAG",
    "multilingual retrieval",
    "hybrid search",
    "citation integrity",
    "tenant scoped retrieval",
    "RAG evaluation",
  ],
} as const;

export const knowledgeBaseRagCapabilities = [
  {
    title: "Agentic research",
    items: [
      "A short path when the retrieved text already answers the question",
      "Focused research for a concrete gap: search, read a page, inspect a PDF, extract values",
      "Original page images for quantitative reads of image-only PDF pages",
      "Arithmetic, counts and list ordering run in application code",
    ],
  },
  {
    title: "Evidence and trust",
    items: [
      "Tenant and role filters apply before reranking and generation",
      "Every tool call rechecks authorized sources and document versions",
      "The model can cite only evidence it was shown; unknown, hidden or cross-tenant references are rejected",
      "Source, value and question-scope checks run before an answer is released",
    ],
  },
  {
    title: "Research workspace",
    items: [
      "Numbered citations that open the passage, the page and the claim relationship",
      "Inspect mode: retrieval candidates, reranker scores, security decisions, timing and traces",
      "Research library: starred answers, pinned evidence, source-linked notes, projects and collections",
      "Markdown export, with browser storage scoped per tenant and user",
    ],
  },
  {
    title: "Retrieval and ingestion",
    items: [
      "Dense and BM25 search, rank fusion and multilingual BGE reranking",
      "Table-aware PDF ingestion, with Tesseract OCR in English and Turkish for scanned pages",
      "Turkish and English questions against documents in either language",
      "Ollama, OpenAI or Claude behind one provider setting",
    ],
  },
] as const;

export const knowledgeBaseRagResearchFlow = [
  {
    label: "Scoped retrieval",
    detail: "Tenant and role filters constrain dense and BM25 search. Rank fusion and BGE reranking select passages, and section-aware assembly keeps tables next to their headings and captions.",
  },
  {
    label: "Authorized evidence ledger",
    detail: "Admitted evidence becomes one ledger that the rest of the run reads from, so no later step can introduce a source the user was not allowed to see.",
  },
  {
    label: "A typed decision",
    detail: "A PydanticAI agent reads a question-specific projection of the research state and either proposes a cited answer or names the piece of evidence that is missing.",
  },
  {
    label: "The tool and budget gate",
    detail: "A named evidence gap becomes one narrow operation. The application validates its arguments, the source access and the remaining request, token, tool and time budget before it runs. Checked results go back into ResearchState and the agent decides again, until the evidence is enough or the loop stops making progress.",
  },
  {
    label: "Checked inputs",
    detail: "Extraction returns typed labels, values, units, periods and source witnesses. For image-only pages the original page image is read, and an independent check covers the inputs and their coverage.",
  },
  {
    label: "Calculation in code",
    detail: "Prepared operands and formulas run in application code: arithmetic, item counts, total-versus-distinct comparisons, label selection and list ordering. No model invents the result.",
  },
  {
    label: "Independent finalization",
    detail: "Research can stop while successful extraction and calculation results stay available, so a closed loop never throws away work that already succeeded.",
  },
  {
    label: "Release checks",
    detail: "Source, value and question-scope checks run before release. The result is a cited answer or an explicit statement of the evidence limits.",
  },
] as const;

export const knowledgeBaseRagTools = [
  {
    operation: "Search",
    responsibility: "Find missing passages in the authorized document scope.",
    boundary: "Cannot expand tenant access or write an answer.",
  },
  {
    operation: "Read",
    responsibility: "Open admitted chunks or one bounded physical PDF page.",
    boundary: "Keeps source identity, version, headings and page context.",
  },
  {
    operation: "Inspect",
    responsibility: "Locate PDF tables, image regions and structural elements.",
    boundary: "Returns locations; reading values is the extractor's job.",
  },
  {
    operation: "Extract",
    responsibility: "Return structured values or item inventories with source witnesses.",
    boundary: "Cannot guess unreadable values, calculate the result or write the final answer.",
  },
  {
    operation: "Calculate / count",
    responsibility: "Execute a permitted formula or count checked source items.",
    boundary: "Requires source-backed inputs; no arbitrary code execution.",
  },
] as const;

export const knowledgeBaseRagAgentRoles = [
  { role: "Research / Reader", job: "Reads the research state and chooses the next step: a cited answer, or one narrow tool call.", reasoning: "low" },
  { role: "Evidence extraction", job: "Extracts typed values and item inventories, each with its source witnesses.", reasoning: "low" },
  { role: "Extraction checker", job: "Checks extracted evidence against the source before anything depends on it.", reasoning: "low" },
  { role: "Need planner", job: "Turns the question into the evidence it needs.", reasoning: "medium" },
  { role: "Source selector", job: "Chooses the numeric and contextual sources a need depends on.", reasoning: "medium" },
  { role: "Quantity collector", job: "Collects the labelled quantities a calculation needs.", reasoning: "medium" },
  { role: "Quantity checker", job: "Judges input accuracy, coverage and the chosen operation separately.", reasoning: "medium" },
  { role: "Answer repair", job: "Applies a bounded repair when a check names a specific problem.", reasoning: "medium" },
  { role: "Scope validator / judge", job: "Judges whether the claims and their evidence answer the question as asked.", reasoning: "medium" },
  { role: "Finalizer", job: "Writes the answer from saved results.", reasoning: "medium" },
] as const;

export const knowledgeBaseRagBoundaryRows = [
  {
    side: "Application-owned",
    items: [
      "Identity, role and tenant resolution",
      "Source and version access, rechecked on every tool call",
      "Graph transitions, tool permissions and stopping rules",
      "Request, token, tool and time budgets that user requests cannot widen",
      "Calculations and counts",
      "Source, value and question-scope verification before release",
    ],
  },
  {
    side: "Model or untrusted",
    items: [
      "Retrieved text, titles, headings and source names",
      "Instruction-looking text inside documents",
      "A model proposal until it is validated as state or work",
      "Extracted values until the input check passes",
      "Image readings and semantic judgments until they are checked",
      "Generated answer text before release",
    ],
  },
] as const;

export const knowledgeBaseRagEngineeringDecisions = [
  {
    title: "The model names the gap; the application decides what may run",
    description:
      "PydanticAI agents handle the semantic work: interpreting the question, naming missing evidence, choosing source regions and judging whether a result answers it. A typed proposal is validated before it becomes state or executable work, because valid JSON is not proof of source truth.",
  },
  {
    title: "A calculation is never a model's guess",
    description:
      "Once operands and a formula are prepared they run directly in application code. Arithmetic, item counts and total-versus-distinct comparisons do not ask another model to produce the result, and computed answers keep their reviewed output units and explicit interpretation.",
  },
  {
    title: "Image-only pages are read from the original image",
    description:
      "Quantitative reads of image-only PDF pages are routed to the original page image. Category, series, period, unit and label-value relationships stay attached to each input, and an independent check reviews the inputs and their coverage, so every value is checked before a calculation depends on it.",
  },
  {
    title: "Stopping research does not erase successful work",
    description:
      "Research stop, extraction, review, finalization and release are separate statuses. A stopped loop can still yield a verified answer from saved results, and a budget or API failure is not treated as proof that the source has no answer.",
  },
  {
    title: "Authorization is rechecked at every step",
    description:
      "Server-side filters apply before reranking and generation, and each tool call revalidates the authorized sources and versions. Numeric sources and contextual sources are tracked apart, so a table value travels with the evidence naming the entity or definition it belongs to.",
  },
  {
    title: "Results are counted once, and failures stay on the record",
    description:
      "The answered-question ledger lists each question once, with its run, answer, latency and model-call count. A rerun does not raise the total, failed runs stay in the local history, and an operational stop is never presented as evidence that an answer is absent.",
  },
] as const;

export const knowledgeBaseRagScreenshots = [
  {
    src: "/projects/knowledge-base-rag/research-workspace.jpg",
    alt: "Research workspace answering a pricing question with numbered citations and an evidence inspector showing the cited handbook page.",
    caption:
      "Research workspace: every answer carries numbered citations, and the evidence inspector opens the cited passage and its claim relationship.",
    source: "docs/assets/research-workspace.jpg",
    sourceUrl: `${repo}/blob/main/docs/assets/research-workspace.jpg`,
  },
  {
    src: "/projects/knowledge-base-rag/inspect-why.jpg",
    alt: "Inspect mode showing the reasoning steps, prompt budget, model finish state and stage timing behind an answer.",
    caption:
      "Inspect mode: the question as searched, retrieval and reranking counts, prompt budget, model state and validation sit beside the answer.",
    source: "docs/assets/inspect-why.jpg",
    sourceUrl: `${repo}/blob/main/docs/assets/inspect-why.jpg`,
  },
  {
    src: "/projects/knowledge-base-rag/inspect-retrieval.jpg",
    alt: "Inspect mode retrieval tab listing retrieval candidates with their reranker scores.",
    caption:
      "Retrieval inspector: candidates and reranker scores, so a lost or misranked passage can be located instead of guessed at.",
    source: "docs/assets/inspect-retrieval.jpg",
    sourceUrl: `${repo}/blob/main/docs/assets/inspect-retrieval.jpg`,
  },
  {
    src: "/projects/knowledge-base-rag/research-notes.jpg",
    alt: "A research note linked to a specific page of a handbook source.",
    caption:
      "Source-linked notes: a note stays attached to the page it was written about, inside the research library.",
    source: "docs/assets/research-notes.jpg",
    sourceUrl: `${repo}/blob/main/docs/assets/research-notes.jpg`,
  },
  {
    src: "/projects/knowledge-base-rag/projects.jpg",
    alt: "A project grouping research sessions, notes and sources.",
    caption:
      "Projects: research sessions, notes and sources can be grouped, with browser storage scoped per tenant and user.",
    source: "docs/assets/projects.jpg",
    sourceUrl: `${repo}/blob/main/docs/assets/projects.jpg`,
  },
] as const;

export const knowledgeBaseRagCoverage = [
  {
    outcome: "Source-correct answers",
    count: "79",
    meaning: "The published answer matches the original PDF on independent review.",
  },
  {
    outcome: "Qualified calculations",
    count: "2",
    meaning: "An interpreted calculation, published together with the interpretation it depends on.",
  },
  {
    outcome: "Correct refusals",
    count: "15",
    meaning: "Questions the source cannot answer, where the system said so instead of guessing.",
  },
  {
    outcome: "Unresolved",
    count: "24",
    meaning: "Open questions, kept on the record for the next iteration.",
  },
] as const;

export const knowledgeBaseRagCoverageExamples = [
  {
    question: "Costco FY2021 total liabilities",
    answer: "USD 41,190 million",
    effort: "20.41 s · 3 model calls",
  },
  {
    question: "Costco FY2021 debt to EBITDA, including current long-term debt and lease liabilities",
    answer: "1.344× = (799 + 6692 + 3916) / (6708 + 1781)",
    effort: "68.02 s · 9 model calls",
  },
  {
    question: "Other-company directorships held by three directors",
    answer: "30, with total and distinct-company counts agreeing",
    effort: "61.63 s · 7 model calls",
  },
  {
    question: "Germanwings tweets minus Lufthansa tweets",
    answer: "12 = 24 − 12; reading the original image corrected an indexed 42 to 12",
    effort: "42.16 s · 6 model calls",
  },
] as const;

export const knowledgeBaseRagEvidence = [
  {
    area: "Agentic question coverage",
    result: "96/120 accepted outcomes",
    detail: "79 source-correct answers, 2 qualified calculations and 15 correct refusals across 120 distinct long-document questions, each counted once.",
  },
  {
    area: "Research budget",
    result: "10 requests · 120k tokens · 240 s",
    detail: "The profile used for recent document runs: at most six research tool attempts, a stop after two rounds without progress and a 60-second finalization reserve. These are configurable server-side limits that user requests cannot widen.",
  },
  {
    area: "Backend tests",
    result: "2,125 passed",
    detail: "Latest recorded run. The normal suite makes no paid provider calls; a separate target runs the checks that use a local model.",
  },
  {
    area: "Trust boundary",
    result: "Verified references only",
    detail: "Unknown, hidden and cross-tenant source references are rejected before release, and tenant and role filters run before reranking and generation.",
  },
] as const;

export const knowledgeBaseRagStackGroups = [
  ["Agentic research", "PydanticAI · typed research graph · application-owned ResearchState"],
  ["Workspace", "React · TypeScript · Vite · research library · inspect mode"],
  ["API", "FastAPI · HTTP · SSE · read-only UI aggregation"],
  ["Identity", "Bearer tokens · tenant and document permissions · USER / OPERATOR / ADMIN roles"],
  ["Retrieval", "Qdrant dense + BM25 sparse · rank fusion · BGE multilingual reranker"],
  ["Models", "Ollama, OpenAI or Claude · Qwen3 embeddings · image-capable model for visual reads"],
  ["Ingestion", "Table-aware PDF parsing · Tesseract OCR (English, Turkish)"],
  ["Observability", "OpenTelemetry · Jaeger · bounded-metadata traces"],
  ["Runtime", "Python 3.11+ · Docker Compose"],
] as const;

export const knowledgeBaseRagDeepDiveLinks = [
  { label: "Agentic workflow, graph, tools and budgets", href: `${repo}/blob/main/docs/adaptive-workflow.md` },
  { label: "Answered questions and run summaries", href: `${repo}/blob/main/docs/adaptive-solved-questions.md` },
  { label: "System architecture", href: `${repo}/blob/main/docs/architecture.md` },
  { label: "Design rationale and roadmap", href: `${repo}/blob/main/docs/adaptive-rag-research-design.md` },
  { label: "PydanticAI orchestration research", href: `${repo}/blob/main/docs/pydantic-workflow-research.md` },
  { label: "Security model", href: `${repo}/blob/main/docs/security.md` },
  { label: "Reranking decision", href: `${repo}/blob/main/docs/reranking.md` },
  { label: "Architecture decisions", href: `${repo}/blob/main/docs/adr/README.md` },
] as const;

export const knowledgeBaseRagRelatedWriting = [
  {
    href: "/writing/research-loop-memory-is-typed-state",
    title: "A Research Loop Remembers in Types, Not in Prose",
    description:
      "Why the research loop's working memory is typed application state, how progress is measured, and what survives when the loop stops.",
  },
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
