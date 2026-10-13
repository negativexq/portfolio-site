import type { EngineeringGraphData, GraphAreaId } from "./types";

export function getOverviewGraph(data: EngineeringGraphData): EngineeringGraphData {
  const nodes = data.nodes.filter((node) => node.metadata.overview);
  const ids = new Set(nodes.map((node) => node.id));
  return { nodes, edges: data.edges.filter((edge) => ids.has(edge.source) && ids.has(edge.target)) };
}

export function getFocusedGraph(data: EngineeringGraphData, projectId: string): EngineeringGraphData {
  const project = data.nodes.find((node) => node.id === projectId);
  if (!project) return { nodes: [], edges: [] };
  const nodesById = new Map(data.nodes.map((node) => [node.id, node]));
  const edges = data.edges.filter((edge) => {
    if (edge.source !== projectId) return false;
    const target = nodesById.get(edge.target);
    return target && ((edge.type === "uses" && project.metadata.keyTechnologies?.includes(target.label))
      || (edge.type === "implements" && project.metadata.keyConcepts?.includes(target.label)));
  });
  const ids = new Set([projectId, ...edges.map((edge) => edge.target)]);
  return { nodes: data.nodes.filter((node) => ids.has(node.id)), edges };
}

export function getAreaNodeIds(data: EngineeringGraphData, area: GraphAreaId): Set<string> {
  const projects = new Set(data.nodes.filter((node) => node.type === "project" && node.metadata.areas?.includes(area)).map((node) => node.id));
  const ids = new Set(projects);
  for (const node of data.nodes) if (node.type === "person") ids.add(node.id);
  for (const edge of data.edges) {
    if (projects.has(edge.source) && (edge.type === "uses" || edge.type === "implements")) ids.add(edge.target);
  }
  return ids;
}
