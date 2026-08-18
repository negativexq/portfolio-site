// Benchmark logic that actually talks to a running server. Every function
// here does real HTTP fetches against `baseUrl` -- nothing is simulated or
// pre-recorded, so results reflect whatever the site currently returns.
import { projects } from "../../data/projects.ts";
import { resolveExpectedFacts } from "./expected-facts.ts";
import { bytesOf, factPresenceRate, recallAtK } from "./metrics.ts";
import type {
  AccuracyResult,
  DiscoveryResult,
  FetchedResource,
  HttpComparisonResult,
  Question,
  RetrievalResult,
  TokenEfficiencyResult,
} from "./types.ts";

export async function fetchResource(url: string): Promise<FetchedResource> {
  const startedAt = performance.now();
  const response = await fetch(url);
  const text = await response.text();
  const latencyMs = performance.now() - startedAt;
  return { url, bytes: bytesOf(text), status: response.status, latencyMs, text };
}

// ---------------------------------------------------------------------------
// 1. Discovery benchmark
// ---------------------------------------------------------------------------

/** The HTML path a naive crawler follows from the homepage: the same three
 * top-level nav destinations a human would click to learn about this
 * person's work. Fixed, not discovered by parsing <a> tags, so the
 * benchmark stays deterministic run to run. */
const HTML_DISCOVERY_PATHS = ["/", "/projects", "/experience", "/learning"];
const AI_DISCOVERY_PATHS = ["/llms.txt", "/resume.md"];

export async function runDiscoveryBenchmark(baseUrl: string): Promise<{ html: DiscoveryResult; ai: DiscoveryResult }> {
  const html = await Promise.all(HTML_DISCOVERY_PATHS.map((path) => fetchResource(`${baseUrl}${path}`)));
  const ai = await Promise.all(AI_DISCOVERY_PATHS.map((path) => fetchResource(`${baseUrl}${path}`)));

  const toResult = (label: string, resources: readonly FetchedResource[], paths: readonly string[]): DiscoveryResult => ({
    label,
    resources: paths,
    requestCount: resources.length,
    totalBytes: resources.reduce((sum, resource) => sum + resource.bytes, 0),
    totalLatencyMs: resources.reduce((sum, resource) => sum + resource.latencyMs, 0),
    requiredInfoFound: resources.every((resource) => resource.status === 200 && resource.text.length > 0),
  });

  return { html: toResult("HTML path", html, HTML_DISCOVERY_PATHS), ai: toResult("AI path", ai, AI_DISCOVERY_PATHS) };
}

// ---------------------------------------------------------------------------
// 2. Token efficiency benchmark
// ---------------------------------------------------------------------------

const TOKEN_HTML_PATHS = ["/"];
const TOKEN_MARKDOWN_PATHS = ["/llms.txt", "/resume.md", "/projects.md"];

export async function runTokenEfficiencyBenchmark(baseUrl: string): Promise<TokenEfficiencyResult> {
  const [html, markdown] = await Promise.all([
    Promise.all(TOKEN_HTML_PATHS.map((path) => fetchResource(`${baseUrl}${path}`))),
    Promise.all(TOKEN_MARKDOWN_PATHS.map((path) => fetchResource(`${baseUrl}${path}`))),
  ]);

  const htmlCharacters = html.reduce((sum, resource) => sum + resource.text.length, 0);
  const markdownCharacters = markdown.reduce((sum, resource) => sum + resource.text.length, 0);

  return {
    htmlCharacters,
    htmlEstimatedTokens: Math.ceil(htmlCharacters / 4),
    markdownCharacters,
    markdownEstimatedTokens: Math.ceil(markdownCharacters / 4),
    reductionPercent: htmlCharacters === 0 ? 0 : ((htmlCharacters - markdownCharacters) / htmlCharacters) * 100,
  };
}

// ---------------------------------------------------------------------------
// Shared: chunking + a lexical (non-embedding) retriever
// ---------------------------------------------------------------------------

type Chunk = { docId: string; text: string };

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function docIdForText(text: string, fallback: string): string {
  const match = projects.find((project) => text.includes(project.title));
  return match ? `project:${match.slug}` : fallback;
}

// Both representations are chunked into the same fixed-size word windows
// (WORDS_PER_CHUNK) so Recall@k compares *representation* (Markdown vs
// HTML), not an accidental difference in chunk granularity -- a coarser
// chunk size structurally scores worse under scoreChunk()'s size
// normalization regardless of content quality, which would confound the
// result if only one side used it.
const WORDS_PER_CHUNK = 120;

function chunkByWords(text: string, docId: string): Chunk[] {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks: Chunk[] = [];
  for (let index = 0; index < words.length; index += WORDS_PER_CHUNK) {
    const chunkText = words.slice(index, index + WORDS_PER_CHUNK).join(" ");
    if (chunkText.trim().length > 0) chunks.push({ docId, text: chunkText });
  }
  return chunks;
}

function chunkMarkdown(text: string, fallback: string): Chunk[] {
  // Split into sections first purely to attribute each word-window to the
  // right project/doc id reliably (a title only appears once, at the top
  // of its own section) -- the sections themselves are not the chunks.
  const sections = text
    .split(/\n(?=##\s)/g)
    .map((section) => section.trim())
    .filter((section) => section.length > 0);
  return sections.flatMap((section) => chunkByWords(section, docIdForText(section, fallback)));
}

function chunkHtml(text: string, fallback: string): Chunk[] {
  const plain = stripHtml(text);
  // Real project titles appear once each in a page's rendered text, so
  // attributing per fixed-size window (not per full page) still lets a
  // window that happens to include a title get that doc id; anything else
  // falls back to the page-level doc id, same rule as Markdown sections.
  const words = plain.split(" ").filter(Boolean);
  const chunks: Chunk[] = [];
  for (let index = 0; index < words.length; index += WORDS_PER_CHUNK) {
    const chunkText = words.slice(index, index + WORDS_PER_CHUNK).join(" ");
    if (chunkText.trim().length > 0) chunks.push({ docId: docIdForText(chunkText, fallback), text: chunkText });
  }
  return chunks;
}

/** Builds the retrieval corpus for one representation. `docId` per chunk
 * matches the `expectedDocId` values expected-facts.ts produces
 * ("experience", "skills", "learning", "project:<slug>"), so Recall@k is
 * comparing like with like across representations. */
export async function buildCorpus(baseUrl: string, representation: "html" | "markdown"): Promise<Chunk[]> {
  if (representation === "markdown") {
    const pages = await Promise.all(
      [
        { path: "/experience.md", fallback: "experience" },
        { path: "/skills.md", fallback: "skills" },
        { path: "/learning.md", fallback: "learning" },
        { path: "/projects.md", fallback: "projects" },
      ].map(async ({ path, fallback }) => ({ text: (await fetchResource(`${baseUrl}${path}`)).text, fallback })),
    );
    return pages.flatMap(({ text, fallback }) => chunkMarkdown(text, fallback));
  }

  // Human HTML surface: note there is deliberately no /skills page, so
  // skills-sourced questions cannot be satisfied by this corpus at all --
  // that gap is real signal, not a benchmark bug (see README Limitations).
  const pages = await Promise.all(
    [
      { path: "/experience", fallback: "experience" },
      { path: "/learning", fallback: "learning" },
      { path: "/projects", fallback: "projects" },
    ].map(async ({ path, fallback }) => ({ text: (await fetchResource(`${baseUrl}${path}`)).text, fallback })),
  );
  return pages.flatMap(({ text, fallback }) => chunkHtml(text, fallback));
}

function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 2),
  );
}

/** Lexical keyword-overlap retriever (Jaccard-style score), not an embedding
 * retriever. No model, no API key, no new dependency -- see README for why
 * this is a deliberate, documented simplification of "RAG". */
function scoreChunk(questionWords: Set<string>, chunk: Chunk): number {
  const chunkWords = tokenize(chunk.text);
  let overlap = 0;
  for (const word of questionWords) if (chunkWords.has(word)) overlap += 1;
  return overlap / Math.sqrt(chunkWords.size || 1);
}

function retrieveDocIds(question: string, corpus: readonly Chunk[], limit = 5): string[] {
  const questionWords = tokenize(question);
  const ranked = [...corpus]
    .map((chunk) => ({ chunk, score: scoreChunk(questionWords, chunk) }))
    .sort((a, b) => b.score - a.score);

  const docIds: string[] = [];
  for (const { chunk } of ranked) {
    if (!docIds.includes(chunk.docId)) docIds.push(chunk.docId);
    if (docIds.length >= limit) break;
  }
  return docIds;
}

// ---------------------------------------------------------------------------
// 4. Retrieval benchmark
// ---------------------------------------------------------------------------

export async function runRetrievalBenchmark(baseUrl: string, questions: readonly Question[]): Promise<{ html: RetrievalResult; markdown: RetrievalResult }> {
  const [htmlCorpus, markdownCorpus] = await Promise.all([buildCorpus(baseUrl, "html"), buildCorpus(baseUrl, "markdown")]);

  const evaluate = (corpus: readonly Chunk[]): RetrievalResult => {
    const results = questions.map((question) => {
      const expected = resolveExpectedFacts(question.source);
      return { retrievedDocIds: retrieveDocIds(question.question, corpus), expectedDocId: expected.expectedDocId };
    });
    return {
      recallAt1: recallAtK(results, 1),
      recallAt3: recallAtK(results, 3),
      recallAt5: recallAtK(results, 5),
      questionsEvaluated: results.length,
    };
  };

  return { html: evaluate(htmlCorpus), markdown: evaluate(markdownCorpus) };
}

// ---------------------------------------------------------------------------
// 5. Answer accuracy benchmark (deterministic fact-presence proxy)
// ---------------------------------------------------------------------------

export async function runAccuracyBenchmark(baseUrl: string, questions: readonly Question[]): Promise<AccuracyResult> {
  const [homeHtml, projectsHtml, experienceHtml, learningHtml] = await Promise.all(
    ["/", "/projects", "/experience", "/learning"].map((path) => fetchResource(`${baseUrl}${path}`)),
  );
  const htmlContext = [homeHtml, projectsHtml, experienceHtml, learningHtml].map((r) => stripHtml(r.text)).join("\n");

  const [llms, resumeMd, projectsMd, experienceMd, skillsMd, learningMd] = await Promise.all(
    ["/llms.txt", "/resume.md", "/projects.md", "/experience.md", "/skills.md", "/learning.md"].map((path) =>
      fetchResource(`${baseUrl}${path}`),
    ),
  );
  const markdownContext = [llms, resumeMd, projectsMd, experienceMd, skillsMd, learningMd].map((r) => r.text).join("\n");

  const factSets = questions.map((question) => resolveExpectedFacts(question.source).facts);

  return {
    htmlFactPresenceRate: factPresenceRate(factSets.map((facts) => ({ context: htmlContext, expectedFacts: facts }))) * 100,
    markdownFactPresenceRate:
      factPresenceRate(factSets.map((facts) => ({ context: markdownContext, expectedFacts: facts }))) * 100,
    questionsEvaluated: questions.length,
  };
}

// ---------------------------------------------------------------------------
// 6. HTTP performance benchmark
// ---------------------------------------------------------------------------

const HTTP_COMPARISON_PATHS: readonly [string, string][] = [
  ["/projects", "/projects.md"],
  ["/experience", "/experience.md"],
  ["/learning", "/learning.md"],
  ["/resume", "/resume.md"],
];

export async function runHttpBenchmark(baseUrl: string): Promise<HttpComparisonResult[]> {
  const results: HttpComparisonResult[] = [];
  for (const [htmlPath, markdownPath] of HTTP_COMPARISON_PATHS) {
    const [html, markdown] = await Promise.all([
      fetchResource(`${baseUrl}${htmlPath}`),
      fetchResource(`${baseUrl}${markdownPath}`),
    ]);
    results.push({
      htmlPath,
      markdownPath,
      htmlBytes: html.bytes,
      markdownBytes: markdown.bytes,
      htmlLatencyMs: html.latencyMs,
      markdownLatencyMs: markdown.latencyMs,
      sizeReductionPercent: html.bytes === 0 ? 0 : ((html.bytes - markdown.bytes) / html.bytes) * 100,
    });
  }
  return results;
}
