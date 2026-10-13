import type { GraphAreaId, GraphEdgeType } from "./types";

export const GRAPH_AREAS: readonly { id: GraphAreaId; label: string }[] = [
  { id: "ai-ml-platform", label: "AI / ML Platform" },
  { id: "generative-ai-rag", label: "AI / RAG" },
  { id: "agent-infrastructure", label: "Agent Systems" },
  { id: "data-engineering", label: "Data Engineering" },
  { id: "distributed-systems", label: "Distributed Systems" },
];

export function getRelationshipVisual(type: GraphEdgeType) {
  if (type === "built") return { label: "Built", color: "#bfd6a0", size: 1.7, directed: true };
  if (type === "uses") return { label: "Uses", color: "#819da3", size: 1.3, directed: true };
  if (type === "implements") return { label: "Implements", color: "#b8a6cd", size: 1.3, directed: true };
  return { label: "Related", color: "#c6acd8", size: 1.8, directed: false };
}
