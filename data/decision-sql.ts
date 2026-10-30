export const decisionSqlProjectUrl = "https://omerfkoc.dev/projects/decision-sql";

const repo = "https://github.com/negativexq/decision-sql";

export const decisionSqlMeta = {
  keywords: [
    "governed text-to-SQL",
    "natural-language analytics",
    "deterministic SQL safety",
    "read-only execution",
    "grain safety",
    "BIRD Mini-Dev",
    "audit log",
  ],
} as const;

export const decisionSqlCapabilities = [
  {
    title: "Ask and check",
    items: [
      "Ask in plain language, read the answer as a table or a chart",
      "The SQL that ran and a one-line reading of what it counts",
      "Follow-up questions in the same conversation",
      "Change a condition and rerun it without the model",
    ],
  },
  {
    title: "Reports",
    items: [
      "Any answer becomes a chart on a shared report",
      "Filters, scheduled refresh and snapshots",
      "Every chart reruns through the same checks",
      "CSV download, print and PDF",
    ],
  },
  {
    title: "Govern",
    items: [
      "Connect PostgreSQL, MySQL, SQL Server, Trino, Snowflake or BigQuery after a preflight",
      "Declare joins when a database has no foreign keys",
      "An audit log of every question and what the checks decided",
      "Questions run on PostgreSQL through a read-only role",
    ],
  },
] as const;

export const decisionSqlScreenshots = [
  {
    src: "/projects/decision-sql/ask-answer.png",
    alt: "A refund-rate question answered as a bar chart by region, with a one-line reading of the query and eleven passed checks above it.",
    caption: "An answer with its chart, a plain reading of the query and the eleven checks it passed.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/ask-answer.png`,
  },
  {
    src: "/projects/decision-sql/ambiguity.png",
    alt: "A question about the best products, read two ways; the answer says which reading it used and offers the other.",
    caption: "A question that can be read two ways runs both readings and lets you switch.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/ambiguity.png`,
  },
  {
    src: "/projects/decision-sql/conversation.png",
    alt: "A follow-up question in the same conversation, being added to the Sales overview report as a pie chart.",
    caption: "A follow-up in the same conversation, added to a report as a chart.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/conversation.png`,
  },
  {
    src: "/projects/decision-sql/query-that-ran.png",
    alt: "The executed SQL shown above an answer.",
    caption: "The SQL that ran, one click above every answer.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/query-that-ran.png`,
  },
] as const;

export const decisionSqlWorkspaceScreenshots = [
  {
    src: "/projects/decision-sql/report.png",
    height: 2000,
    alt: "The Sales overview report with a revenue number, a text card, a monthly line chart, an order-status pie and top products.",
    caption: "A report built from answered questions, with filters and a daily refresh.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/report.png`,
  },
  {
    src: "/projects/decision-sql/report-edit.png",
    height: 2000,
    alt: "Editing a stacked column chart: chart type, series, number format and the run it came from.",
    caption: "Edit mode: chart type, series, number format and the run each chart came from.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/report-edit.png`,
  },
  {
    src: "/projects/decision-sql/connection-preflight.png",
    alt: "A failed connection preflight that marks the field to fix.",
    caption: "A connection is saved only after its preflight passes.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/connection-preflight.png`,
  },
  {
    src: "/projects/decision-sql/audit-log.png",
    alt: "The audit log listing every question with its user, outcome, rows and time.",
    caption: "Every question, who asked it, and what the checks decided.",
    sourceUrl: `${repo}/blob/main/docs/screenshots/audit-log.png`,
  },
] as const;

export const decisionSqlRuntimeFlow = [
  {
    label: "Governed context",
    detail: "The model sees only the queryable tables and columns, their relationships and the SQL functions policy allows. Large schemas are narrowed by retrieval, and the tables left out are listed by name.",
  },
  {
    label: "One model decision",
    detail: "One request with a strict schema returns ANSWER with read-only SQL, NEEDS_CLARIFICATION, BLOCKED_AUTHORITY or BLOCKED_POLICY. Only an answer goes further.",
  },
  {
    label: "Parse and policy",
    detail: "One SELECT statement, allowlisted functions, and joins only along foreign keys or joins an administrator declared.",
  },
  {
    label: "Authority",
    detail: "Every table the query touches must be in this request's context.",
  },
  {
    label: "Grain and stored values",
    detail: "A sum that would count a parent once per child row is stopped. A filter on a value the column does not hold is respelled to the stored value or reported.",
  },
  {
    label: "Plan and cost",
    detail: "EXPLAIN in a read-only transaction; a plan clearly out of scale is refused before it runs.",
  },
  {
    label: "Read-only run and audit",
    detail: "Only the accepted plan runs, on a read-only role with a statement timeout and a row cap. The audit log keeps the question, the SQL and what each check decided.",
  },
] as const;

export const decisionSqlBoundaryRows = [
  {
    side: "The model owns",
    items: [
      "Understanding the question",
      "One typed decision",
      "The proposed SQL when it answers",
      "A few gated probes to see how values are stored",
    ],
  },
  {
    side: "Deterministic code owns",
    items: [
      "What the model is allowed to see",
      "Parsing, policy and request authority",
      "Grain safety and stored-value checks",
      "Cost limits and the read-only run",
      "The audit record",
    ],
  },
] as const;

export const decisionSqlEngineeringDecisions = [
  {
    title: "A non-answer always has a reason",
    description:
      "A clarification comes with the readings to choose from, and a refusal names the missing join. When a question can be read two ways, each reading runs: the same result is answered, and different results come with the other readings one click away.",
  },
  {
    title: "A fixed budget of model calls",
    description:
      "One decision per question. A rejection the model can fix, such as a parse error, an unknown column or a fan-out, gets one repair round, and an authority or write rejection is final. With the default settings a question makes at most seven model calls, and most make one.",
  },
  {
    title: "Change an answer without the model",
    description:
      "Edit a condition such as a date range or a status, or drop it, and the query runs again through every check with no model call. A report chart keeps the SQL that passed and reruns it through the same gates whenever the report refreshes.",
  },
  {
    title: "Joins are declared, not guessed",
    description:
      "When a database has no foreign keys, an administrator declares the joins questions may use, and each one is checked against the data before it is saved. Until then, a question that needs the join is refused with the join it is missing.",
  },
] as const;

export const decisionSqlEvidence = [
  {
    area: "BIRD Mini-Dev 2026, PostgreSQL",
    result: "76 / 100 execution accuracy",
    detail:
      "A fixed random 100 of the 500 questions, 93 of them challenging, with gpt-6-luna. Median 20 s per question. The public leaderboard lists gpt-6-luna at 51.8 on the full 500.",
  },
  {
    area: "Own field set",
    result: "124 / 126 behaved as expected",
    detail:
      "31 questions, 3 runs each, on a wholesale schema with no foreign keys and no column descriptions. All 30 join questions were refused before joins were declared; afterwards 67/69 answers matched and none returned wrong rows.",
  },
  {
    area: "Clarify, refuse, stay quiet",
    result: "12/12, 6/6, 6/6",
    detail:
      "Ambiguous questions asked for clarification, write requests were refused, and questions about data the database does not hold were not answered.",
  },
  {
    area: "BIRD Mini-Dev, stratified 100",
    result: "59 / 100 execution accuracy",
    detail:
      "30 simple, 50 moderate, 20 challenging. 59/82 without the 18 questions whose gold SQL is disputed.",
  },
] as const;

export const decisionSqlStackGroups = [
  ["API", "Python 3.12 + FastAPI + Pydantic"],
  ["SQL safety", "sqlglot parse + policy + authority + grain + EXPLAIN cost gate"],
  ["Data", "PostgreSQL 16 + SQLAlchemy + Alembic"],
  ["Connectors", "MySQL, SQL Server, Trino, Snowflake, BigQuery (optional drivers)"],
  ["Frontend", "React + TypeScript + Vite"],
  ["Observability", "OpenTelemetry + a run trace for every question"],
  ["Runtime", "Docker Compose"],
] as const;

export const decisionSqlDeepDiveLinks = [
  { label: "README", href: `${repo}/blob/main/README.md` },
  { label: "Architecture", href: `${repo}/blob/main/docs/architecture.md` },
  { label: "Security posture", href: `${repo}/blob/main/docs/security.md` },
  { label: "Earlier research benchmarks", href: `${repo}/tree/archive/research/benchmark` },
] as const;
