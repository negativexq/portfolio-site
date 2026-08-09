export type GraphNodeType =
  | "person"
  | "experience"
  | "capability"
  | "project"
  | "technology"
  | "domain"
  | "concept"
  | "evidence"
  | "learning"
  | "roadmap";

export type GraphStatus = "current" | "verified" | "learning" | "planned";

export type GraphEdgeType =
  | "worked-at"
  | "built"
  | "uses"
  | "implements"
  | "supports"
  | "evidence-for"
  | "evolved-into"
  | "related-to"
  | "learning-direction"
  | "planned-for"
  | "part-of"
  | "built-on";

export type GraphMetadata = {
  category?: string;
  company?: string;
  role?: string;
  period?: string;
  qualifier?: string;
  scope?: string;
  rationale?: string;
  githubUrl?: string;
  flagship?: boolean;
  keyTechnologies?: readonly string[];
  keyConcepts?: readonly string[];
  proofPoints?: readonly {
    label: string;
    value: string;
    scope?: string;
    qualifier?: string;
  }[];
  roadmap?: readonly string[];
  foundation?: string;
  direction?: string;
  evidenceTarget?: string;
  connectedProject?: string;
  impactId?: string;
};

export type EngineeringGraphNode = {
  id: string;
  label: string;
  canvasLabel: string;
  type: GraphNodeType;
  status: GraphStatus;
  description: string;
  importance: number;
  x: number;
  y: number;
  projectSlug?: string;
  href?: string;
  metadata: GraphMetadata;
};

export type EngineeringGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label: string;
  inverseLabel: string;
  status?: Extract<GraphStatus, "learning" | "planned">;
};

export type EngineeringGraphData = {
  nodes: readonly EngineeringGraphNode[];
  edges: readonly EngineeringGraphEdge[];
};

export type GraphFilterGroup =
  | "projects"
  | "technologies"
  | "concepts"
  | "experience"
  | "evidence"
  | "learning"
  | "domains";

export type GraphFilterState = Record<GraphFilterGroup, boolean>;

export type SigmaNodeAttributes = {
  x: number;
  y: number;
  size: number;
  label: string;
  color: string;
  type: "circle";
  forceLabel: boolean;
  zIndex: number;
  nodeType: GraphNodeType;
  status: GraphStatus;
  importance: number;
};

export type SigmaEdgeAttributes = {
  size: number;
  color: string;
  type: "line" | "arrow";
  label: string;
  edgeType: GraphEdgeType;
  forceLabel?: boolean;
  status?: Extract<GraphStatus, "learning" | "planned">;
};
