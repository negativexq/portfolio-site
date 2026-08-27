import type { Metric } from "@/lib/content/types";

export const dbtFeatureLineageMeta = {
  title: "dbt Feature Lineage",
  description:
    "A local-first developer tool for exploring dbt model dependencies, column lineage, query flow and downstream impact without a live warehouse connection.",
  keywords: [
    "dbt",
    "dbt Core",
    "data lineage",
    "column lineage",
    "SQL analysis",
    "data engineering",
  ],
} as const;

export const dbtFeatureLineageMetrics: readonly Metric[] = [
  {
    value: "2 MODES",
    label: "One normalized project model",
    context: "MANIFEST + STATIC",
    detail:
      "Manifest and compiled SQL are preferred when available; direct SQL and YAML analysis keeps the path useful without generated artifacts.",
  },
  {
    value: "5 VIEWS",
    label: "One shared selection context",
    context: "NEXT.JS WEB APP",
    detail:
      "Dashboard, Model Explorer, Model DAG, Column Lineage and Feature Explorer share the same project and model-group selection.",
  },
  {
    value: "LOCAL ONLY",
    label: "No warehouse connection required",
    context: "DEMO STATIC PATH",
    detail:
      "The demo project runs through static analysis, so the exploration loop stays local and the dbt project is not changed.",
  },
];

export const dbtFeatureLineageHighlights = [
  {
    title: "Artifact-first, fallback-ready",
    description:
      "Loaders prefer dbt's manifest and catalog artifacts, then fall back to recursive SQL/YAML scanning instead of making the whole experience depend on a successful dbt parse.",
  },
  {
    title: "Impact is not one number",
    description:
      "Downstream analysis separates models that reference a column directly from the full transitive chain, giving review decisions a useful blast-radius boundary.",
  },
  {
    title: "One analysis layer, two interfaces",
    description:
      "Typer and the FastAPI-backed Next.js web app consume shared domain models and services. The CLI and web app do not carry separate lineage logic that can drift apart.",
  },
  {
    title: "Readable partial results",
    description:
      "The parsing strategy returns partial results with a warning when a query cannot be fully understood, making uncertainty visible rather than silently dropping a model.",
  },
] as const;

export const dbtFeatureLineageModes = [
  {
    label: "Manifest mode",
    input: "target/manifest.json + catalog.json",
    detail:
      "Uses dbt's own dependency and compiled-SQL artifacts when they exist. `--generate-artifacts` can run `dbt parse` on demand.",
  },
  {
    label: "Static mode",
    input: "SQL + YAML on disk",
    detail:
      "Discovers model layers, sources, ref()/source() dependencies, output columns and SQL structures without executing macros or requiring a warehouse.",
  },
] as const;

export const dbtFeatureLineageSurfaces = [
  {
    name: "Select Project",
    purpose: "Point at a local directory or clone from a git URL, choose a dbt project and optionally scope the app to a model group.",
  },
  {
    name: "Model Explorer",
    purpose: "Inspect one model through overview, query flow, columns and raw SQL views.",
  },
  {
    name: "Model DAG",
    purpose: "See model-level dependencies and inspect materialization, owner, tests, description and tags.",
  },
  {
    name: "Column Lineage",
    purpose: "Trace a column upstream to raw sources or downstream to consumers, with an impact summary for the latter.",
  },
  {
    name: "Feature Explorer",
    purpose: "Compare every model producing a given column name by layer, description, owner, tags and test count.",
  },
] as const;

export const dbtFeatureLineageDecisions = [
  {
    title: "Normalize before analyzing",
    description:
      "Manifest-aware and static loading resolve into the same domain representation. Every graph, trace and query-flow view can therefore stay ignorant of where the project came from.",
  },
  {
    title: "Keep analysis outside the presentation layer",
    description:
      "The service layer builds schema and lineage graphs, model DAGs, column search, query-flow steps, impact summaries and model health. Typer and the FastAPI backend remain thin adapters over that behavior, with Next.js handling presentation.",
  },
  {
    title: "Treat parsing uncertainty as product state",
    description:
      "The parser handles Jinja relations through SQL-safe placeholders and reports partial results when a query is not fully parseable. A warning is more useful than a confident blank screen.",
  },
] as const;

export const dbtFeatureLineageStack = [
  ["Backend", "Python 3.12 · FastAPI · Typer · Uvicorn"],
  ["Analysis", "dbt Core · sqlglot · NetworkX · Jinja2 · PyYAML · Pydantic"],
  ["Frontend", "Next.js · TypeScript · Tailwind CSS · React Flow"],
  ["Delivery", "Docker · Docker Compose · Make"],
  ["Quality", "pytest · Ruff"],
] as const;

export const dbtFeatureLineageCommands = [
  "make build",
  "make test",
  "make api",
  "make web",
  "dbt-feature-lineage analyze examples/sample_banking_dbt",
  "dbt-feature-lineage lineage examples/sample_banking_dbt customer_id --direction downstream --impact",
] as const;

export const dbtFeatureLineageScreenshots = [
  {
    src: "/projects/dbt-feature-lineage/web-dashboard.jpg",
    alt: "dbt Feature Lineage dashboard showing model, column and dependency counts, model health, layers, materializations and documentation coverage.",
    caption: "Dashboard: project scale, model health and documentation gaps are visible in one overview.",
    source: "docs/photos/web-dashboard.jpg",
    sourceUrl: "https://github.com/negativexq/dbt-feature-lineage/blob/main/docs/photos/web-dashboard.jpg",
    width: 1249,
    height: 946,
  },
  {
    src: "/projects/dbt-feature-lineage/web-column-lineage.jpg",
    alt: "dbt Feature Lineage column lineage view showing a customer_id path from a staging model through transformations to a downstream mart.",
    caption: "Column lineage: source path, transformations and downstream impact stay together.",
    source: "docs/photos/web-column-lineage.jpg",
    sourceUrl: "https://github.com/negativexq/dbt-feature-lineage/blob/main/docs/photos/web-column-lineage.jpg",
    width: 1249,
    height: 1121,
  },
  {
    src: "/projects/dbt-feature-lineage/web-model-dag.jpg",
    alt: "dbt Feature Lineage model DAG showing staging, intermediate and marts models with a details panel.",
    caption: "Model DAG: graph context and selected-node detail share the same inspection surface.",
    source: "docs/photos/web-model-dag.jpg",
    sourceUrl: "https://github.com/negativexq/dbt-feature-lineage/blob/main/docs/photos/web-model-dag.jpg",
    width: 1249,
    height: 904,
  },
  {
    src: "/projects/dbt-feature-lineage/web-select-project.jpg",
    alt: "dbt Feature Lineage project selector showing local directory and clone from git options, a selected project and manifest mode.",
    caption: "Select project: local directory and clone-from-git inputs converge on the same project context.",
    source: "docs/photos/web-select-project.jpg",
    sourceUrl: "https://github.com/negativexq/dbt-feature-lineage/blob/main/docs/photos/web-select-project.jpg",
    width: 1249,
    height: 832,
  },
] as const;

export const dbtFeatureLineageDeepDiveLinks = [
  {
    label: "Repository README and walkthrough",
    href: "https://github.com/negativexq/dbt-feature-lineage/blob/main/README.md",
  },
  {
    label: "v0.8 plan — web interface",
    href: "https://github.com/negativexq/dbt-feature-lineage/blob/main/docs/v0.8-plan.md",
  },
  {
    label: "FastAPI backend",
    href: "https://github.com/negativexq/dbt-feature-lineage/tree/main/src/dbt_feature_lineage/api",
  },
  {
    label: "Next.js frontend",
    href: "https://github.com/negativexq/dbt-feature-lineage/tree/main/frontend/src",
  },
] as const;
