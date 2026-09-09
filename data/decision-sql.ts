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
    label: "Parse and policy",
    detail: "sqlglot parses the selected SQL and the policy enforces one read-only statement, governed object access, function restrictions and complexity limits before anything else runs.",
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
      "No physical schema truth or grain semantics",
      "No right to run the query it wrote",
    ],
  },
  {
    side: "Deterministic software owns",
    items: [
      "Typed decision validation",
      "SQL parsing, policy and server-owned semantic metadata",
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
      "One benchmark case yields one semantic attempt with no retry, repair, judge, selector or reflection, which keeps model decision errors and server enforcement observable. The corpus was assembled with 0 retries and 0 duplicate attempts under a frozen prompt and planner-statistics contract, with request-hash compatibility verified.",
  },
] as const;

export const decisionSqlGovernedModel = [
  {
    behavior: "ANSWERABLE",
    cases: "60",
    expected: "ANSWER + one read-only SELECT",
    result: "51 / 60 delivered correct",
  },
  {
    behavior: "AUTHORITY_BLOCKED",
    cases: "15",
    expected: "BLOCKED_AUTHORITY",
    result: "15 / 15 · 0 unauthorized answers",
  },
  {
    behavior: "AMBIGUOUS",
    cases: "9",
    expected: "NEEDS_CLARIFICATION",
    result: "6 / 9",
  },
  {
    behavior: "POLICY_BLOCKED",
    cases: "6",
    expected: "BLOCKED_POLICY",
    result: "6 / 6",
  },
] as const;

export const decisionSqlEvidence = [
  {
    area: "Governed task success",
    result: "78 / 90 = 86.7%",
    detail:
      "One-shot governed decisions across all four behaviors on the frozen synthetic benchmark. Answerable end-to-end runtime task success accuracy was 51 / 60 = 85.0%.",
  },
  {
    area: "Runtime admission",
    result: "0 rejections · 0 execution failures",
    detail:
      "Across the 53 answerable cases where the model chose ANSWER, every submission passed parse, policy, semantic admission, cost and execution. 2 result mismatches remained, giving 51 / 53 = 96.2% conditional runtime correctness.",
  },
  {
    area: "Grain normalization",
    result: "4 / 4 · 100% precision",
    detail:
      "Every PARENT_MEASURE_FANOUT state was normalized with 0 regressions, 0 unauthorized relationships introduced and 0 unsafe raw fallback, inside the supported shape only.",
  },
  {
    area: "Semantic discrimination",
    result: "190 / 190 mutants killed",
    detail:
      "120 / 120 reference witnesses and 184 / 184 counterfactual fixture comparisons with 0 invalid and 0 surviving mutants, proving the fixtures actually separate semantic errors.",
  },
  {
    area: "Branch-complete harness",
    result: "360 / 360 scenarios",
    detail:
      "90 cases across 4 valid decisions exercised 90 ANSWER runtime routes and 270 non-ANSWER bypasses, verified before the remaining responses were generated.",
  },
] as const;

export const decisionSqlStackGroups = [
  ["Runtime", "Python 3.12 + FastAPI + PostgreSQL"],
  ["SQL safety", "sqlglot parse + policy + grain safety + cost gate"],
  ["Execution", "Accepted QueryPlan + restricted read-only reader"],
  ["Data", "SQLAlchemy + Alembic + synthetic enterprise packs"],
  ["Evaluation", "Counterfactual fixtures + reference witnesses + mutation testing"],
  ["Quality", "pytest + Ruff + mypy + OpenTelemetry"],
] as const;

export const decisionSqlLimitations = [
  "The evidence supports governed one-shot decision evaluation, deterministic SQL safety, the narrow grain-normalization mechanism, an accepted-QueryPlan execution boundary and reproducible planner state.",
  "It does not establish universal Text-to-SQL correctness, universal fanout or grain repair, or production readiness for arbitrary enterprise schemas.",
  "The SQL policy is a deterministic application boundary, not complete tenant-level authorization or RLS coverage.",
  "Numbers belong to the frozen runtime and benchmark contracts, on synthetic enterprise-style packs, not to production traffic.",
] as const;

export const decisionSqlDeepDiveLinks = [
  {
    label: "Repository README and walkthrough",
    href: "https://github.com/negativexq/decision-sql/blob/main/README.md",
  },
  {
    label: "M48B.2 end-to-end summary",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/reports/m48b2_end_to_end_summary.md",
  },
  {
    label: "Machine-readable summary",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/reports/m48b2_end_to_end_summary.json",
  },
  {
    label: "Branch-complete runtime contract",
    href: "https://github.com/negativexq/decision-sql/blob/main/benchmark/manifests/m48b2_branch_complete_runtime_contract.json",
  },
] as const;
