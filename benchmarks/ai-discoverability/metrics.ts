// Pure, deterministic calculations only -- no fetches, no filesystem, no
// clock reads (the caller supplies any timing data). This is what makes
// metrics.ts independently testable without a running server.

/** Rough token estimate: ~4 characters per token, the same order-of-magnitude
 * approximation OpenAI and Anthropic both publish as a quick heuristic for
 * English/code text. This is NOT a real tokenizer (no BPE, no vocabulary) --
 * it exists to compare *relative* HTML vs Markdown context size, not to
 * predict an exact API token count. Documented here rather than reached for
 * silently: if the repository ever adds a real tokenizer dependency for
 * another reason, swap this out. */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function compressionRatio(baselineChars: number, comparisonChars: number): number {
  if (baselineChars === 0) return 0;
  return ((baselineChars - comparisonChars) / baselineChars) * 100;
}

/** Recall@k over a set of (retrieved-doc-ids, expected-doc-id) pairs: the
 * fraction of questions where the expected document appears in the top k
 * retrieved results. */
export function recallAtK(results: readonly { retrievedDocIds: readonly string[]; expectedDocId: string }[], k: number): number {
  if (results.length === 0) return 0;
  const hits = results.filter((result) => result.retrievedDocIds.slice(0, k).includes(result.expectedDocId));
  return hits.length / results.length;
}

/** Fraction of (question, context) pairs where every expected fact string
 * appears verbatim (case-insensitive) in the context -- a deterministic,
 * no-API proxy for "did the answer have what it needed", not a claim about
 * whether an LLM would actually answer correctly. See README's Limitations. */
export function factPresenceRate(
  results: readonly { context: string; expectedFacts: readonly string[] }[],
): number {
  if (results.length === 0) return 0;
  const hits = results.filter((result) => {
    const haystack = result.context.toLowerCase();
    return result.expectedFacts.every((fact) => haystack.includes(fact.toLowerCase()));
  });
  return hits.length / results.length;
}

export function bytesOf(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
