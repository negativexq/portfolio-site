// Shared types for the AI Discoverability Benchmark. Deliberately
// framework-free (no Next.js imports) so every module here runs under
// plain `node` — see README.md "Why plain Node" for the reasoning.

export type SourcePointer =
  | { type: "experience-summary"; id: string }
  | { type: "experience-impact"; id: string; impactId: string }
  | { type: "project-technologies"; id: string; slug: string }
  | { type: "project-proof"; id: string; slug: string }
  | { type: "project-concepts"; id: string; slug: string }
  | { type: "engineering-area"; id: string }
  | { type: "learning-area"; id: string }
  | { type: "learning-item"; id: string; itemId: string };

export type Question = {
  id: string;
  question: string;
  source: SourcePointer;
};

export type ExpectedFacts = {
  /** Strings a correct, well-grounded answer's context should contain.
   * Derived at run time from data/*.ts — never typed by hand — so this
   * benchmark can't silently drift from the site's actual content. */
  facts: readonly string[];
  /** Which document a retriever should surface for this question, expressed
   * as a doc id resolvable in both the HTML and Markdown corpora
   * (see corpus.ts). */
  expectedDocId: string;
};

export type FetchedResource = {
  url: string;
  bytes: number;
  status: number;
  latencyMs: number;
  text: string;
};

export type DiscoveryResult = {
  label: string;
  resources: readonly string[];
  requestCount: number;
  totalBytes: number;
  totalLatencyMs: number;
  requiredInfoFound: boolean;
};

export type TokenEfficiencyResult = {
  htmlCharacters: number;
  htmlEstimatedTokens: number;
  markdownCharacters: number;
  markdownEstimatedTokens: number;
  reductionPercent: number;
};

export type RetrievalResult = {
  recallAt1: number;
  recallAt3: number;
  recallAt5: number;
  questionsEvaluated: number;
};

export type AccuracyResult = {
  htmlFactPresenceRate: number;
  markdownFactPresenceRate: number;
  questionsEvaluated: number;
};

export type HttpComparisonResult = {
  htmlPath: string;
  markdownPath: string;
  htmlBytes: number;
  markdownBytes: number;
  htmlLatencyMs: number;
  markdownLatencyMs: number;
  sizeReductionPercent: number;
};

export type BenchmarkReport = {
  generatedAt: string;
  baseUrl: string;
  benchmarkVersion: string;
  discovery: { html: DiscoveryResult; ai: DiscoveryResult };
  tokenEfficiency: TokenEfficiencyResult;
  retrieval: { html: RetrievalResult; markdown: RetrievalResult };
  accuracy: AccuracyResult;
  http: readonly HttpComparisonResult[];
  questionCount: number;
};
