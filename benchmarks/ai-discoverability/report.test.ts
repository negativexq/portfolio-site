import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { test } from "node:test";
import assert from "node:assert/strict";

import { renderReportMarkdown, writeReportFile } from "./report.ts";
import type { BenchmarkReport } from "./types.ts";

const here = dirname(fileURLToPath(import.meta.url));
const fixture: BenchmarkReport = JSON.parse(readFileSync(join(here, "fixtures/sample-report.json"), "utf8"));

test("renders a report with no undefined/null/[object Object] leakage", () => {
  const markdown = renderReportMarkdown(fixture);
  for (const forbidden of ["undefined", "null", "[object Object]", "NaN"]) {
    assert.ok(!markdown.includes(forbidden), `report must not contain literal "${forbidden}"`);
  }
});

test("report reflects the fixture's actual numbers, not placeholder text", () => {
  const markdown = renderReportMarkdown(fixture);
  assert.ok(markdown.includes("78.8%"));
  assert.ok(markdown.includes("36"));
  assert.ok(markdown.includes(fixture.baseUrl));
});

test("rendering is deterministic for the same input", () => {
  assert.equal(renderReportMarkdown(fixture), renderReportMarkdown(fixture));
});

test("changing the fixture changes the report", () => {
  const changed: BenchmarkReport = { ...fixture, tokenEfficiency: { ...fixture.tokenEfficiency, reductionPercent: 12.3 } };
  assert.ok(renderReportMarkdown(changed).includes("12.3%"));
  assert.ok(!renderReportMarkdown(changed).includes("78.8%"));
});

test("writeReportFile writes the same content renderReportMarkdown produces", () => {
  const dir = mkdtempSync(join(tmpdir(), "ai-discoverability-report-"));
  const filePath = join(dir, "report.md");
  try {
    writeReportFile(fixture, filePath);
    const written = readFileSync(filePath, "utf8");
    assert.equal(written, renderReportMarkdown(fixture));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
