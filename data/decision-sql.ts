export const decisionSqlProjectUrl = "https://omerfkoc.dev/projects/decision-sql";

export const decisionSqlMeta = {
  title: "DecisionSQL",
  description:
    "Governed one-shot Text-to-SQL for enterprise analytics: the model emits one typed decision, deterministic software owns SQL admission and read-only execution, and correctness is measured by execution against counterfactual database states.",
  keywords: [
    "governed text-to-SQL",
    "deterministic SQL safety",
    "execution-based evaluation",
    "read-only execution",
    "grain safety",
    "counterfactual fixtures",
    "one-shot benchmark",
  ],
} as const;

export const decisionSqlCapabilities = [
  {
    title: "Governed decision",
    items: [
      "One typed decision per request: answer, clarification or block",
      "Model-visible governed context, evaluator-only truth kept separate",
      "Authority and policy blocks that never reach the SQL runtime",
    ],
  },
  {
    title: "Deterministic SQL admission",
    items: [
      "sqlglot parse, SQL / object / function policy",
      "Server-owned grain safety with a narrow deterministic normalizer",
      "PostgreSQL EXPLAIN, a frozen cost gate and an accepted QueryPlan",
    ],
  },
  {
    title: "Execution-based evaluation",
    items: [
      "Two reference witnesses and a typed ResultContract",
      "Counterfactual fixtures that make wrong semantics diverge",
      "Restricted read-only execution under reader role and timeout",
    ],
  },
] as const;

export const decisionSqlRuntimeFlow = [
  {
    label: "One typed decision",
    detail: "The model receives the question plus a governed context and emits exactly one decision. Runtime routing follows the parsed submission, not evaluator truth, so only ANSWER + SQL enters the SQL runtime.",
  },
  {
    label: "Parse and global policy",
    detail: "sqlglot parses the selected SQL and the global policy enforces one read-only statement, governed object access, function restrictions and complexity limits before anything else runs.",
  },
  {
    label: "Request-scoped relation authority",
    detail: "Global policy answers whether an object is queryable by the service; request-scoped authority answers whether this request may use it. An immutable relation-level ExecutionAuthority, derived from the same governed SchemaContext, rejects an unauthorized relation before any database connection, EXPLAIN or execution.",
  },
  {
    label: "Grain safety",
    detail: "A GrainSafetyValidator detects parent-measure fanout, where a join to several child rows can silently multiply a SUM. Server-owned metadata, not the model, owns that contract.",
  },
  {
    label: "Narrow normalization, re-validated",
    detail: "For the supported additive-parent, declared 1:N shape a deterministic normalizer preaggregates on the child side. Normalized SQL is never trusted automatically; it re-passes parse, policy and post-grain validation with no raw unsafe fallback.",
  },
  {
    label: "Cost admission",
    detail: "PostgreSQL EXPLAIN runs on a deterministically analyzed state, and a frozen cost gate rejects SQL above the benchmark's max rows or max cost before execution.",
  },
  {
    label: "Accepted QueryPlan, then execution",
    detail: "Execution requires an accepted immutable QueryPlan issued by the SQL safety service. A restricted reader runs it under a read-only transaction, reader role, statement timeout and bounded result rows.",
  },
] as const;

export const decisionSqlBoundaryRows = [
  {
    side: "The model owns",
    items: [
      "The first-pass typed decision",
      "The proposed SQL when it chooses ANSWER",
      "Nothing about authorization or execution",
      "No physical schema truth, relationship authority or grain semantics",
      "No right to run the query it wrote",
    ],
  },
  {
    side: "Deterministic software owns",
    items: [
      "Typed decision validation",
      "SQL parsing, global policy and request-scoped relation authority",
      "Narrow grain-safe normalization",
      "PostgreSQL EXPLAIN, cost admission and QueryPlan creation",
      "Restricted read-only execution and result comparison",
    ],
  },
] as const;

export const decisionSqlEngineeringDecisions = [
  {
    title: "Submission-driven runtime, truth-driven evaluation",
    description:
      "Runtime routing is decided by the parsed model submission, not by evaluator truth. An ANSWER + SQL receives the full parse, policy, semantic, cost, QueryPlan and execution treatment even when the truth is AMBIGUOUS, and the harness records the runtime outcome separately instead of crashing on a wrong governed decision.",
  },
  {
    title: "Server-owned grain safety",
    description:
      "Joining a parent to several child rows can triple a parent measure. The model is not trusted to own that contract. Server-owned metadata describes entity and grain keys, relationship cardinality and aggregation behavior, and the normalizer stays fail-closed outside its frozen additive-parent, declared 1:N shape.",
  },
  {
    title: "Execution-based correctness, not string match",
    description:
      "Candidate SQL is not judged by exact text or AST equality. Two independent reference witnesses, a typed ResultContract and counterfactual fixtures that change distributions decide correctness, so SQL that accidentally returns the right rows on one state fails when the semantics actually diverge.",
  },
  {
    title: "One-shot, with provenance discipline",
    description:
      "One benchmark case yields one semantic attempt with no retry, repair, judge, selector or pass@K, which keeps model decision errors and server enforcement observable instead of letting a repair loop smooth them over. Responses are admitted under exact provider-request fingerprinting and deterministic replay.",
  },
] as const;

export const decisionSqlGovernedModel = [
  {
    behavior: "ANSWERABLE",
    cases: "120",
    expected: "ANSWER + one read-only SELECT",
    result: "103 / 120 runtime TSA correct",
  },
  {
    behavior: "AUTHORITY_BLOCKED",
    cases: "30",
    expected: "BLOCKED_AUTHORITY",
    result: "28 / 30 · runtime blocks the unauthorized relation",
  },
  {
    behavior: "AMBIGUOUS",
    cases: "18",
    expected: "NEEDS_CLARIFICATION",
    result: "12 / 18",
  },
  {
    behavior: "POLICY_BLOCKED",
    cases: "12",
    expected: "BLOCKED_POLICY",
    result: "12 / 12",
  },
] as const;

export const decisionSqlEvidence = [
  {
    area: "Governed task success",
    result: "155 / 180 = 86.11%",
    detail:
      "One-shot governed decisions across four behavior classes on one 180-case benchmark spanning 12 synthetic domains. 25 governed misses overall.",
  },
  {
    area: "Answerable runtime TSA",
    result: "103 / 120 = 85.83%",
    detail:
      "Answerable queries that survived the real runtime and satisfied the result contract on BASE and every required counterfactual state. healthcare_10 passes BASE but fails a counterfactual.",
  },
  {
    area: "Authority",
    result: "28 / 30 = 93.33%",
    detail:
      "Model authority decisioning. telecom_15 is the known case where the model wrongly chose ANSWER; request-scoped relation authority rejected the unauthorized relation with zero database connection, EXPLAIN or execution.",
  },
  {
    area: "Governance blocks",
    result: "policy 12 / 12 · ambiguity 12 / 18",
    detail:
      "Policy blocking is exact at 100%; ambiguity recognition is the weaker axis at 66.67%. Refusing SQL is a measured, expected outcome on these cases.",
  },
  {
    area: "Execution boundary",
    result: "QueryPlan-gated · no raw unsafe fallback",
    detail:
      "Accepted execution requires an immutable QueryPlan issued by the SQL safety service; raw SQL or copied plan objects cannot bypass planning, and the reader runs under a read-only transaction, reader role, statement timeout and bounded rows.",
  },
] as const;

export const decisionSqlStackGroups = [
  ["Runtime", "Python 3.12 + FastAPI + PostgreSQL"],
  ["SQL safety", "sqlglot parse + global policy + request authority + grain safety + cost gate"],
  ["Execution", "Accepted QueryPlan + restricted read-only reader"],
  ["Data", "SQLAlchemy + Alembic + synthetic enterprise packs"],
  ["Evaluation", "Counterfactual fixtures + reference witnesses + result contracts"],
  ["Quality", "pytest + Ruff + mypy + OpenTelemetry"],
] as const;

export const decisionSqlLimitations = [
  "The evidence supports governed one-shot decision evaluation, deterministic SQL safety, the narrow grain-normalization mechanism, request-scoped relation authority and an accepted-QueryPlan execution boundary.",
  "It does not establish universal Text-to-SQL correctness, universal fanout or grain repair, or production readiness for arbitrary enterprise schemas.",
  "The authority contract is relation-level; column-level and relationship-path authorization are separate boundaries and are not claimed as universally enforced.",
  "Ambiguity recognition is the weaker governance axis on this benchmark, and remaining fail-closed grain cases are still under investigation.",
  "Numbers belong to one frozen 180-case synthetic benchmark, not to production traffic.",
] as const;

export const decisionSqlDeepDiveLinks = [
  {
    label: "Repository README and walkthrough",
    href: "https://github.com/negativexq/decision-sql/blob/main/README.md",
  },
  {
    label: "Benchmark specification",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/SPEC.md",
  },
  {
    label: "Current benchmark evaluation",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/reports/m532_post_m53_repaired_expansion_evaluation.md",
  },
  {
    label: "Runtime authority safety report",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/reports/m52s_runtime_authority_execution_safety.md",
  },
  {
    label: "Machine-readable evaluation manifest",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/manifests/m532_post_m53_repaired_expansion_evaluation_manifest.json",
  },
] as const;
