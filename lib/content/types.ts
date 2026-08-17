export type ProjectStatus = "current" | "learning" | "planned" | "archived";

export type ProjectCategory =
  | "AI Reliability / Execution Infrastructure"
  | "Agent Systems / AI Platform"
  | "Distributed Systems / Streaming"
  | "Generative AI / RAG Platform"
  | "MLOps / AI Platform"
  | "Agent Infrastructure / Developer Tooling"
  | "Data Engineering / Lineage"
  | "Generative AI / Retrieval"
  | "Infrastructure as Code / Platform Engineering";

export type ProofPoint = {
  label: string;
  value: string;
  /** Short caps/mono tag naming where the number comes from (benchmark,
   * test suite, static analysis, …) so it can't be mistaken for a
   * production-traffic claim at a glance. */
  scope?: string;
  qualifier?: string;
};

export type ProjectRelationshipType =
  | "evolved-into"
  | "related-to"
  | "planned-for";

export type ProjectRelationship = {
  type: ProjectRelationshipType;
  targetProjectId: string;
  label: string;
};

export type RoadmapItem = {
  title: string;
  status: Extract<ProjectStatus, "learning" | "planned">;
};

export type ProjectEvolution = {
  fromProjectId: string;
  /** What the earlier project couldn't do — the concrete gaps that forced the rebuild. */
  limitations: readonly string[];
  /** Short narrative connecting the limitations to what this project changed. */
  narrative: string;
};

export type ProjectHighlight = {
  title: string;
  description: string;
};

/**
 * A single repository inside a SupportingLabGroup. Deliberately not a
 * `Project` — these render only inside Projects -> Supporting Work and
 * must never appear in `data/projects.ts` or reach `lib/graph/build-graph.ts`,
 * so they carry no graph-relevant fields (no id used as a graph node key,
 * no concepts/technologies/proofPoints).
 */
export type SupportingLab = {
  repo: string;
  label: string;
  description: string;
  githubUrl: string;
};

/** A cohesive group of related supporting-work repositories, rendered as one
 * card with an internal progression rather than one card per repository.
 * Graph-excluded by construction — see SupportingLab. */
export type SupportingLabGroup = {
  id: string;
  title: string;
  summary: string;
  theme: string;
  labs: readonly SupportingLab[];
};

export type Project = {
  id: string;
  slug: string;
  order: number;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  flagship: boolean;
  summary: string;
  /** A complete, self-contained sentence answering "What is this project?". */
  directAnswer: string;
  whyItExists: string;
  technologies: readonly string[];
  concepts: readonly string[];
  proofPoints: readonly ProofPoint[];
  /** Optional headline stat strip for the hero — scoped, evidence-backed numbers only. */
  heroMetrics?: readonly Metric[];
  /** Optional short, scannable engineering claims for the top of the case study. */
  highlights?: readonly ProjectHighlight[];
  roadmap: readonly RoadmapItem[];
  relationships: readonly ProjectRelationship[];
  evolvedFrom?: ProjectEvolution;
  githubUrl: string;
};

export type ExperienceImpact = {
  id: string;
  title: string;
  /** One sentence on the situation that made this work necessary. */
  context: string;
  summary: string;
  /** Same scoped shape as project evidence: professional numbers have to be
   * as inspectable as the public ones, not bare strings. */
  proof?: ProofPoint;
  topics: readonly string[];
};

export type Experience = {
  id: string;
  company: string;
  team: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  impacts: readonly ExperienceImpact[];
};

export type EngineeringArea = {
  id: string;
  title: string;
  description: string;
  technologies: readonly string[];
  evidenceProjectIds: readonly string[];
  evidenceExperienceIds: readonly string[];
};

export type LearningArea = "Agent Systems" | "Retrieval & Evaluation" | "Platform Infrastructure" | "Software Systems Engineering";

export type LearningItem = {
  id: string;
  title: string;
  status: Extract<ProjectStatus, "learning" | "planned">;
  area: LearningArea;
  rationale: string;
  previewSummary?: string;
  /** Overrides the status badge's displayed text (e.g. "Deepening") while
   * `status` still drives its color/semantics. */
  maturityLabel?: string;
  topics: readonly string[];
  evidenceTarget: string;
  connectedProjectIds: readonly string[];
  connectedAreaIds: readonly string[];
  connectedLearningIds: readonly string[];
};

export type Metric = {
  value: string;
  label: string;
  context: string;
  detail: string;
};

export type Profile = {
  name: string;
  title: string;
  positioning: string;
  summary: string;
  location: string;
  availability: string;
  timezone: string;
  links: {
    github: string;
    linkedin: string;
    email: string;
    website: string;
  };
  education: {
    institution: string;
    degree: string;
  };
  languages: readonly {
    language: string;
    proficiency: string;
  }[];
};
