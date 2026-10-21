import { flagshipProjects } from "@/data/projects";
import { buildEngineeringGraph } from "./build-graph";
import { technologyNodeId } from "./canonical";
import type { EngineeringGraphData, GraphAreaId } from "./types";

// This is a presentation projection. The complete source graph stays available
// to machine-readable consumers; the explorer carries only the flagship work.
const projectPositions: Record<string, { x: number; y: number }> = {
  "ml-platform-infrastructure": { x: -6, y: 5 },
  "agentic-sre": { x: 1, y: 6 },
  "agentic-customer-service-platform": { x: 7, y: 3 },
  "knowledge-base-rag": { x: 6, y: -3 },
  "decision-sql": { x: 0, y: -6 },
  "real-time-commerce-platform": { x: -7, y: -4 },
  "modelops-control-plane": { x: -7.5, y: 0.8 },
};
const projectLabels: Record<string, string> = {
  "ml-platform-infrastructure": "ML Platform",
  "agentic-customer-service-platform": "Agentic Customer Service",
  "agentic-sre": "Agentic SRE",
  "knowledge-base-rag": "Knowledge Base RAG",
  "modelops-control-plane": "ModelOps",
  "decision-sql": "DecisionSQL",
  "real-time-commerce-platform": "Real-Time Commerce",
};
const featuredTechnologies: Record<string, readonly string[]> = {
  "ml-platform-infrastructure": ["Kubernetes", "Go", "Argo Workflows", "MLflow"],
  "agentic-sre": ["Kubernetes", "LangGraph", "gRPC", "OpenTelemetry"],
  "agentic-customer-service-platform": ["LangGraph", "PostgreSQL", "Qdrant", "OpenTelemetry"],
  "knowledge-base-rag": ["PydanticAI", "Qdrant", "FastAPI", "OpenTelemetry", "Langfuse"],
  "modelops-control-plane": ["PostgreSQL", "FastAPI", "scikit-learn", "Docker Compose"],
  "decision-sql": ["DuckDB", "SQLGlot", "FastAPI", "Pydantic"],
  "real-time-commerce-platform": ["Kafka", "PostgreSQL", "Redis", "Prometheus"],
};

// A bounded selection of shared foundations and defining technologies.
const bridgePositions: Record<string, { x: number; y: number }> = {
  Kubernetes: { x: -3, y: 3.4 },
  LangGraph: { x: 2.6, y: 3.2 },
  Qdrant: { x: 4, y: -0.5 },
  PostgreSQL: { x: -2.8, y: -2.3 },
  OpenTelemetry: { x: -0.5, y: 2.1 },
  FastAPI: { x: 1.6, y: -3.3 },
  Kafka: { x: -8.4, y: -6.3 },
  Prometheus: { x: -5.2, y: -1.8 },
  MLflow: { x: -4.4, y: 7.7 },
  Go: { x: -7.5, y: 7.3 },
  Langfuse: { x: 8.6, y: -5.4 },
};

export function buildCuratedEngineeringGraph(): EngineeringGraphData {
  const source = buildEngineeringGraph();
  const person = source.nodes.find((node) => node.type === "person")!;
  const identity = { ...person, x: 0, y: 0, metadata: { ...person.metadata, overview: true } };
  const projectIds = new Set(flagshipProjects.map((project) => `project:${project.id}`));
  const projects = source.nodes.filter((node) => projectIds.has(node.id)).map((node) => {
    const slug = node.id.slice("project:".length);
    const documented = node.metadata.keyTechnologies ?? [];
    const featured = (featuredTechnologies[slug] ?? []).filter((label) => documented.includes(label));
    const fallback = documented.filter((label) => !featured.includes(label));
    return {
      ...node,
      ...projectPositions[slug],
      canvasLabel: projectLabels[slug] ?? node.canvasLabel,
      metadata: {
        ...node.metadata,
        overview: true,
        areas: source.edges.filter((edge) => edge.source === node.id && edge.type === "supports" && edge.target.startsWith("domain:")).map((edge) => edge.target.slice("domain:".length) as GraphAreaId),
        // Four by default; a project that lists more featured technologies keeps them all.
        keyTechnologies: [...featured, ...fallback].slice(0, Math.max(4, featured.length)),
        keyConcepts: node.metadata.keyConcepts?.slice(0, 2),
        proofPoints: node.metadata.proofPoints?.slice(0, 2),
        roadmap: [],
      },
    };
  });
  const detailEdges = source.edges.filter((edge) => {
    const project = projects.find((node) => node.id === edge.source);
    const target = source.nodes.find((node) => node.id === edge.target);
    if (!project || !target) return false;
    return (edge.type === "uses" && project.metadata.keyTechnologies?.includes(target.label))
      || (edge.type === "implements" && project.metadata.keyConcepts?.includes(target.label));
  });
  const bridgeIds = new Set(Object.keys(bridgePositions).map(technologyNodeId));
  const bridgeEdges = source.edges.filter((edge) => projectIds.has(edge.source) && bridgeIds.has(edge.target) && edge.type === "uses");
  const detailIds = new Set([...detailEdges, ...bridgeEdges].map((edge) => edge.target));
  const detailNodes = source.nodes.filter((node) => detailIds.has(node.id)).map((node) => ({
    ...node,
    ...(bridgePositions[node.label] ?? {}),
    metadata: { ...node.metadata, overview: bridgeIds.has(node.id) },
  }));
  const explicit = source.edges.filter((edge) => projectIds.has(edge.source) && projectIds.has(edge.target));
  const ownership = source.edges.filter((edge) => edge.source === person.id && projectIds.has(edge.target) && edge.type === "built");
  const edges = [...new Map([...ownership, ...explicit, ...bridgeEdges, ...detailEdges].map((edge) => [edge.id, edge])).values()];
  return { nodes: [identity, ...projects, ...detailNodes], edges };
}
