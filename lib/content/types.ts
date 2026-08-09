export type ProjectStatus = "current" | "learning" | "planned" | "archived";

export type ProjectCategory =
  | "Distributed Systems / Streaming"
  | "Generative AI / RAG Platform"
  | "MLOps / AI Platform"
  | "Agent Infrastructure / Developer Tooling"
  | "Data Engineering / Lineage"
  | "Generative AI / Retrieval";

export type ProofPoint = {
  label: string;
  value: string;
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
  status: Extract<ProjectStatus, "planned">;
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
  whyItExists: string;
  technologies: readonly string[];
  concepts: readonly string[];
  proofPoints: readonly ProofPoint[];
  roadmap: readonly RoadmapItem[];
  relationships: readonly ProjectRelationship[];
  githubUrl: string;
};

export type ExperienceImpact = {
  id: string;
  title: string;
  summary: string;
  proof?: string;
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

export type LearningArea = "Infrastructure" | "Agent Systems" | "Graph Systems";

export type LearningItem = {
  id: string;
  title: string;
  status: Extract<ProjectStatus, "learning" | "planned">;
  area: LearningArea;
  rationale: string;
  connectedProjectIds: readonly string[];
  connectedAreaIds: readonly string[];
  themes: readonly string[];
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
