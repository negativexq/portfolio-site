import { test } from "node:test";
import assert from "node:assert/strict";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url, { alias: { "@": new URL("../..", import.meta.url).pathname } });
const { buildCuratedEngineeringGraph } = await jiti.import("./curated-graph.ts");
const { buildEngineeringGraph } = await jiti.import("./build-graph.ts");
const { getOverviewGraph, getFocusedGraph, getAreaNodeIds } = await jiti.import("./graph-view.ts");
const { flagshipProjects } = await jiti.import("../../data/projects.ts");

const curated = buildCuratedEngineeringGraph();
const source = buildEngineeringGraph();
const projectIds = new Set(curated.nodes.filter((node) => node.type === "project").map((node) => node.id));

test("overview includes all and only current flagship projects", () => {
  assert.deepEqual([...projectIds].sort(), flagshipProjects.map((project) => `project:${project.id}`).sort());
  assert.equal(projectIds.size, 7);
  assert.ok(curated.nodes.every((node) => ["person", "project", "technology", "concept"].includes(node.type)));
  assert.ok(source.nodes.length > curated.nodes.length);
});

// Knowledge Base RAG keeps a fifth: its agent framework and its trace sink are
// both part of what the project is, alongside the shared foundations.
const technologyCounts = { "project:knowledge-base-rag": 5 };

test("each project reveals four technologies (five where listed) and two concepts", () => {
  for (const id of projectIds) {
    const details = getFocusedGraph(curated, id).edges;
    assert.equal(details.filter((edge) => edge.type === "uses").length, technologyCounts[id] ?? 4);
    assert.equal(details.filter((edge) => edge.type === "implements").length, 2);
    for (const edge of details) assert.ok(source.edges.some((item) => item.id === edge.id));
  }
});

test("overview connects the owner, seven projects and ten documented technologies", () => {
  const overview = getOverviewGraph(curated);
  assert.equal(overview.nodes.length, 18);
  const identity = overview.nodes.find((node) => node.type === "person");
  assert.ok(identity);
  assert.deepEqual({ x: identity.x, y: identity.y }, { x: 0, y: 0 });
  const ownership = overview.edges.filter((edge) => edge.type === "built");
  assert.equal(ownership.length, 7);
  assert.ok(ownership.every((edge) => edge.source === identity.id && projectIds.has(edge.target)));
  const bridges = overview.nodes.filter((node) => node.type === "technology");
  assert.equal(bridges.length, 10);
  assert.equal(overview.edges.length, 37);
  for (const bridge of bridges) {
    const uses = overview.edges.filter((edge) => edge.type === "uses" && edge.target === bridge.id);
    assert.ok(uses.length >= 1, `${bridge.label} is used by a core project`);
  }
  for (const edge of overview.edges) assert.ok(source.edges.some((item) => item.id === edge.id));
});

test("every edge has endpoints and scoped evidence remains intact", () => {
  const ids = new Set(curated.nodes.map((node) => node.id));
  for (const edge of curated.edges) {
    assert.ok(ids.has(edge.source));
    assert.ok(ids.has(edge.target));
  }
  for (const node of curated.nodes.filter((node) => node.type === "project")) {
    const original = source.nodes.find((item) => item.id === node.id);
    assert.deepEqual(node.metadata.proofPoints, original.metadata.proofPoints.slice(0, 2));
  }
});

test("only the requested new technology nodes extend the existing overview", () => {
  const labels = getOverviewGraph(curated).nodes.filter((node) => node.type === "technology").map((node) => node.label).sort();
  assert.deepEqual(labels, ["Kubernetes", "LangGraph", "Qdrant", "PostgreSQL", "OpenTelemetry", "FastAPI", "Kafka", "Prometheus", "MLflow", "Go"].sort());
});

test("area highlights include the owner and technologies of matching projects", () => {
  const ids = getAreaNodeIds(curated, "agent-infrastructure");
  assert.ok(ids.has("person:omer-faruk-koc"));
  assert.ok(ids.has("project:agentic-sre"));
  assert.ok(ids.has("project:agentic-customer-service-platform"));
  assert.ok(ids.has("technology:langgraph"));
  assert.ok(!ids.has("project:real-time-commerce-platform"));
  assert.ok(!ids.has("technology:kafka"));
  assert.ok(curated.nodes.filter((node) => node.type === "project").every((node) => node.metadata.areas?.length));
});
