// CLI entry point: node benchmarks/ai-discoverability/runner.ts
// (wired to `npm run benchmark:ai`). Requires a running server -- this
// script only makes real HTTP requests, it never imports Next.js or starts
// one itself, to keep the benchmark decoupled from the site's own tooling.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  runAccuracyBenchmark,
  runDiscoveryBenchmark,
  runHttpBenchmark,
  runRetrievalBenchmark,
  runTokenEfficiencyBenchmark,
} from "./benchmarks.ts";
import { formatBytes, formatPercent } from "./metrics.ts";
import { writeReportFile } from "./report.ts";
import type { BenchmarkReport, Question } from "./types.ts";

const BENCHMARK_VERSION = "1.0.0";
const here = dirname(fileURLToPath(import.meta.url));

async function main() {
  const baseUrl = (process.env.BENCHMARK_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
  const questions: Question[] = JSON.parse(readFileSync(join(here, "questions.json"), "utf8"));

  console.log("AI Discoverability Benchmark v" + BENCHMARK_VERSION);
  console.log("=".repeat(60));
  console.log(`Target: ${baseUrl}`);
  console.log(`Questions: ${questions.length}\n`);

  await assertServerReachable(baseUrl);

  console.log("Running discovery benchmark...");
  const discovery = await runDiscoveryBenchmark(baseUrl);

  console.log("Running token efficiency benchmark...");
  const tokenEfficiency = await runTokenEfficiencyBenchmark(baseUrl);

  console.log("Running retrieval benchmark...");
  const retrieval = await runRetrievalBenchmark(baseUrl, questions);

  console.log("Running answer accuracy benchmark...");
  const accuracy = await runAccuracyBenchmark(baseUrl, questions);

  console.log("Running HTTP comparison benchmark...\n");
  const http = await runHttpBenchmark(baseUrl);

  const report: BenchmarkReport = {
    generatedAt: new Date().toISOString(),
    baseUrl,
    benchmarkVersion: BENCHMARK_VERSION,
    discovery,
    tokenEfficiency,
    retrieval,
    accuracy,
    http,
    questionCount: questions.length,
  };

  printSummary(report);

  const reportPath = join(here, "report.md");
  writeReportFile(report, reportPath);
  console.log(`\nFull report written to ${reportPath}`);
}

async function assertServerReachable(baseUrl: string) {
  try {
    const response = await fetch(`${baseUrl}/`);
    if (!response.ok) throw new Error(`unexpected status ${response.status}`);
  } catch (error) {
    console.error(
      `\nCould not reach ${baseUrl}. Start the site first (e.g. \`npm run dev\` or \`npm run build && npm start\`), ` +
        `or set BENCHMARK_BASE_URL to a running deployment.\n`,
    );
    throw error;
  }
}

function printSummary(report: BenchmarkReport) {
  console.log("=".repeat(60));
  console.log("\nDiscovery");
  console.log(`  HTML path:       ${report.discovery.html.requestCount} requests, ${formatBytes(report.discovery.html.totalBytes)}`);
  console.log(`  AI path:         ${report.discovery.ai.requestCount} requests, ${formatBytes(report.discovery.ai.totalBytes)}`);

  console.log("\nToken Usage");
  console.log(`  HTML:            ${report.tokenEfficiency.htmlEstimatedTokens.toLocaleString()} tokens (estimated)`);
  console.log(`  Markdown:        ${report.tokenEfficiency.markdownEstimatedTokens.toLocaleString()} tokens (estimated)`);
  console.log(`  Reduction:       ${formatPercent(report.tokenEfficiency.reductionPercent)}`);

  console.log("\nRetrieval (lexical)");
  console.log(`  HTML Recall@5:      ${report.retrieval.html.recallAt5.toFixed(2)}`);
  console.log(`  Markdown Recall@5:  ${report.retrieval.markdown.recallAt5.toFixed(2)}`);

  console.log("\nAnswer Accuracy (fact-presence proxy)");
  console.log(`  HTML:            ${formatPercent(report.accuracy.htmlFactPresenceRate)}`);
  console.log(`  Markdown:        ${formatPercent(report.accuracy.markdownFactPresenceRate)}`);

  console.log("\nHTTP");
  for (const row of report.http) {
    console.log(`  ${row.markdownPath.padEnd(16)} ${formatPercent(row.sizeReductionPercent)} smaller than ${row.htmlPath}`);
  }
  console.log("\n" + "=".repeat(60));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
