import type {
  GraphEdgeType,
  GraphNodeType,
  GraphStatus,
  SigmaEdgeAttributes,
} from "./types";

export const NODE_TYPE_LABELS: Record<GraphNodeType, string> = {
  person: "Person",
  experience: "Experience",
  project: "Project",
  technology: "Technology",
  domain: "Domain",
  concept: "Concept",
  metric: "Proof / metric",
  learning: "Learning topic",
  roadmap: "Roadmap item",
};

export const STATUS_LABELS: Record<GraphStatus, string> = {
  current: "Current",
  verified: "Verified",
  learning: "Learning",
  planned: "Planned",
};

const nodeColors: Record<GraphNodeType, string> = {
  person: "#b8f36b",
  experience: "#f0f0e8",
  project: "#d8e3d0",
  technology: "#8fa493",
  domain: "#a9c68f",
  concept: "#a8afa7",
  metric: "#b8f36b",
  learning: "#c8cec4",
  roadmap: "#737b73",
};

const nodeSizes: Record<GraphNodeType, number> = {
  person: 18,
  experience: 14,
  project: 12,
  technology: 5.5,
  domain: 9,
  concept: 4.7,
  metric: 6.5,
  learning: 7,
  roadmap: 6.5,
};

export function getNodeVisual(
  type: GraphNodeType,
  status: GraphStatus,
  importance: number,
) {
  const statusColor =
    status === "learning"
      ? "#c5ccbf"
      : status === "planned"
        ? "#707870"
        : nodeColors[type];

  return {
    color: statusColor,
    size: nodeSizes[type] + importance * 0.7,
    forceLabel: importance >= 6 || type === "learning" || type === "roadmap",
    zIndex: importance,
  };
}

export function getEdgeVisual(type: GraphEdgeType): SigmaEdgeAttributes {
  const base: SigmaEdgeAttributes = {
    color: "#2d332e",
    size: 0.82,
    type: "line",
    label: "",
    edgeType: type,
  };

  if (type === "evolved-into") {
    return { ...base, color: "#9fd55d", size: 2.7, type: "arrow" };
  }

  if (type === "learning") {
    return { ...base, color: "#687461", size: 1.35, type: "arrow", status: "learning" };
  }

  if (type === "planned-for") {
    return { ...base, color: "#555d55", size: 1.2, type: "arrow", status: "planned" };
  }

  if (type === "worked-at" || type === "built") {
    return { ...base, color: "#65765c", size: 1.45, type: "arrow" };
  }

  if (type === "measured-by") {
    return { ...base, color: "#718052", size: 1.25 };
  }

  return base;
}

export const DIMMED_NODE_COLOR = "#303630";
export const DIMMED_EDGE_COLOR = "#222722";
