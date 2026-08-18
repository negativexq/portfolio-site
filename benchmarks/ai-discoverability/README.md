# AI Discoverability Benchmark

Measures whether the site's machine-readable layer (`/llms.txt`,
`/resume.md`, `/projects.md`, `/experience.md`, `/skills.md`,
`/learning.md`, and `Accept: text/markdown` negotiation) actually makes the
portfolio easier for an AI agent to consume — not whether the site is fast
or ranks well in a search engine. This is **not a Lighthouse/SEO
benchmark**: a page can score perfectly on Core Web Vitals and still cost
an agent 5x the tokens and a fact it never found.

The question this suite answers: *can an agent understand this engineer's
background, experience, projects and skills faster, with fewer tokens, and
with higher accuracy using the machine-readable layer than using the plain
HTML site?*

## Isolation

This directory is **not** part of the Next.js app. Nothing under `app/`
imports from `benchmarks/`, so it can never be bundled into the production
site, and it does not read or write `data/*.ts`, `lib/graph/*`, or any
graph dataset. It only makes outbound HTTP requests to a server you already
have running, and it writes exactly one file: `report.md` in this
directory (regenerated on every run — never hand-edited).

## Methodology

Five dimensions, each comparing the human-facing HTML surface against the
Markdown/`llms.txt` surface, against the **same running instance of the
site** (no separate/mocked content):

1. **Discovery** — how many requests and bytes does an agent need to go
   from "nothing" to "the required background information", following the
   HTML nav (`/`, `/projects`, `/experience`, `/learning`) versus following
   `/llms.txt` (`/llms.txt`, `/resume.md`)?
2. **Token efficiency** — character/estimated-token count of the HTML
   homepage versus `/llms.txt` + `/resume.md` + `/projects.md`.
3. **Retrieval** — treating the site as a tiny two-corpus search problem
   (HTML pages vs Markdown pages), Recall@1/3/5 for `questions.json` against
   each corpus.
4. **Answer accuracy** — a deterministic fact-presence check: for each
   question, does the fetched context contain every fact
   `expected-facts.ts` derives from canonical data, comparing an
   HTML-only context against a Markdown-only context?
5. **HTTP comparison** — response size and latency, `/projects` vs
   `/projects.md`, and the same for `/experience`, `/learning`, `/resume`.

### Where the questions and expected answers come from

`questions.json` holds 36 natural-language questions and, for each, a
`source` pointer (e.g. `{ "type": "project-technologies", "slug":
"real-time-commerce-platform" }`). **No expected answer is typed by hand
anywhere in this suite.** `expected-facts.ts` resolves that pointer by
importing the real `data/projects.ts`, `data/experience.ts`,
`data/engineering-areas.ts`, `data/learning.ts` and reading the actual
current field values. If a project's technologies list changes, the next
benchmark run checks against the *new* list automatically — there is
nothing here to keep in sync by hand. `questions.json` itself was produced
by `generate-questions.ts`, which also only reads canonical data (run it
again after adding/removing projects, experience impacts, engineering
areas or learning items to regenerate the question set; the question
*text* is authored there, but every `id` it uses is pulled from real data,
so a stale reference fails loudly in `questions.test.ts` rather than
resolving to nothing).

## Deliberate simplifications (read before trusting a number)

- **Token counts are `chars / 4`**, not a real tokenizer. This is the same
  order-of-magnitude heuristic OpenAI and Anthropic both publish for quick
  estimates. It is good enough to compare *relative* context size between
  representations; it is not a prediction of exact API token usage. No
  tokenizer dependency was added for this — see `metrics.ts`.
- **Retrieval is lexical (keyword overlap / Jaccard-style scoring), not
  semantic embeddings.** A real RAG benchmark would use an embedding model;
  that means either a paid API or a local model dependency, both of which
  the brief for this suite ruled out. The lexical retriever is a real,
  working, dependency-free retriever — it is just not as good as a modern
  embedding retriever, and its results should be read as "does the
  representation surface the right document for an obvious keyword match",
  not as a full RAG quality score.
- **Answer accuracy is fact-presence in context, not a graded answer.** It
  checks whether every expected fact string appears in the fetched context,
  case-insensitively. That measures whether an agent's context *contains
  what it needs*, not whether an agent would actually compose a correct
  sentence from it. An LLM-judge step would answer that more directly; see
  "Optional LLM evaluation" below for why it isn't implemented by default.
- **Both corpora are chunked into the same fixed-size (120-word) windows**
  before retrieval scoring. This was a deliberate fix during development:
  an earlier version chunked Markdown by `##` section (large chunks) and
  HTML by fixed windows (small chunks), and the size difference alone
  changed Recall@k, independent of content quality. Chunking strategy is
  now identical across both arms so the comparison isolates the
  representation, not the chunker.
- **HTTP latency is single-request wall-clock time** against one local
  process, not a statistically robust multi-run benchmark across real
  network conditions.

## A result worth reading directly, not summarizing away

Retrieval recall does **not** clearly favor Markdown the way the other four
metrics do — in one real run, HTML actually scored a higher Recall@5 than
Markdown. That's not a bug: this site's HTML is already server-rendered
with real text (titles, summaries, technology tags all come from the same
`data/*.ts` the Markdown does), so a keyword-overlap retriever finds much
of the same vocabulary either way. Markdown's real advantage here is
conciseness and fact completeness, not raw keyword-retrievability by a
purely lexical method — see `report.md`'s own Limitations section, which
is regenerated with this same caveat every run.

## Optional LLM evaluation

Not implemented. The brief for this suite required it to not need a paid
API and to be optional via an environment variable if added. Rather than
half-build a fragile integration against a specific provider's API shape,
the extension point is documented instead: `runAccuracyBenchmark` in
`benchmarks.ts` returns the raw HTML/Markdown context and the per-question
expected facts; a real implementation would gate an LLM-judge call behind
an env var (e.g. `BENCHMARK_LLM_JUDGE=1`) and an API key check, fall back
to the current deterministic method when unset, and report both numbers
side by side.

## Running it

Requires a running instance of the site:

```bash
npm run dev
# or: npm run build && npm start
```

Then, in another terminal:

```bash
npm run benchmark:ai
# or against a deployed instance:
BENCHMARK_BASE_URL=https://omerfkoc.dev npm run benchmark:ai
```

This prints a console summary and writes `benchmarks/ai-discoverability/report.md`.

Run the test suite (pure functions only — no server required):

```bash
npm run test:benchmark
```

Regenerate `questions.json` after canonical content changes:

```bash
node benchmarks/ai-discoverability/generate-questions.ts
```

## Files

| File | Purpose |
|---|---|
| `types.ts` | Shared types for questions, results, and the report |
| `expected-facts.ts` | Resolves a question's `source` pointer to real facts from `data/*.ts` |
| `metrics.ts` | Pure calculations (token estimate, recall@k, fact-presence rate, formatting) — no I/O |
| `benchmarks.ts` | The five benchmark functions — the only module that makes HTTP requests |
| `runner.ts` | CLI entry point (`npm run benchmark:ai`): loads questions, runs the five benchmarks, prints a summary, writes `report.md` |
| `report.ts` | Pure function from a `BenchmarkReport` to Markdown, plus a thin file writer |
| `questions.json` | 36 questions with canonical-data source pointers |
| `generate-questions.ts` | One-off generator for `questions.json` |
| `fixtures/sample-report.json` | Fixture input for `report.test.ts` |
| `*.test.ts` | Node's built-in test runner (`node --test`) — zero new dependencies |
