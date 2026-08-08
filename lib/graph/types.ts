export type GraphNodeType =
  | "person"
  | "experience"
  | "project"
  | "technology"
  | "domain"
  | "concept"
  | "metric"
  | "learning"
  | "roadmap";

export type GraphStatus = "current" | "verified" | "learning" | "planned";

export type GraphEdgeType =
  | "worked-at"
  | "built"
  | "uses"
  | "implements"
  | "supports"
  | "measured-by"
  | "evolved-into"
  | "related-to"
  | "learning"
  | "planned-for"
  | "applied-at";

export type GraphMetadata = {
  category?: string;
  company?: string;
  role?: string;
  period?: string;
  qualifier?: string;
  rationale?: string;
  githubUrl?: string;
  flagship?: boolean;
  keyTechnologies?: readonly string[];
  keyConcepts?: readonly string[];
  proofPoints?: readonly {
    label: string;
    value: string;
    qualifier?: string;
  }[];
  roadmap?: readonly string[];
  foundation?: string;
  direction?: string;
  connectedProject?: string;
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
  metadata: GraphMetadata;
};

export type EngineeringGraphEdge = {
  id: string;
  source: string;
  target: string;
  type: GraphEdgeType;
  label: string;
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
  status?: Extract<GraphStatus, "learning" | "planned">;
};
