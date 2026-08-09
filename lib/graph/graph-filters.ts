import type {
  GraphFilterGroup,
  GraphFilterState,
  GraphNodeType,
} from "./types";

export const GRAPH_FILTERS: readonly {
  id: GraphFilterGroup;
  label: string;
}[] = [
  { id: "projects", label: "Projects" },
  { id: "technologies", label: "Technologies" },
  { id: "concepts", label: "Concepts" },
  { id: "experience", label: "Experience" },
  { id: "evidence", label: "Evidence" },
  { id: "learning", label: "Learning" },
  { id: "domains", label: "Domains" },
];

export const DEFAULT_GRAPH_FILTERS: GraphFilterState = {
  projects: true,
  technologies: true,
  concepts: true,
  experience: true,
  evidence: true,
  learning: true,
  domains: true,
};

const typeGroups: Record<GraphNodeType, GraphFilterGroup> = {
  person: "experience",
  experience: "experience",
  capability: "experience",
  project: "projects",
  technology: "technologies",
  concept: "concepts",
  learning: "learning",
  roadmap: "learning",
  domain: "domains",
  evidence: "evidence",
};

export function isNodeTypeVisible(
  type: GraphNodeType,
  filters: GraphFilterState,
) {
  return filters[typeGroups[type]];
}

export function filterGroupForNode(type: GraphNodeType) {
  return typeGroups[type];
}
