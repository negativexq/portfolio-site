"use client";

import Graph from "graphology";
import Sigma from "sigma";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_GRAPH_FILTERS,
  filterGroupForNode,
  isNodeTypeVisible,
} from "@/lib/graph/graph-filters";
import {
  DIMMED_EDGE_COLOR,
  DIMMED_NODE_COLOR,
  FILTER_CONTEXT_NODE_COLOR,
  PROJECT_CONTEXT_EDGE_COLOR,
  PROJECT_CONTEXT_NODE_COLOR,
  SELECTED_NODE_COLOR,
  drawGraphNodeHover,
  getEdgeVisual,
  getNodeVisual,
} from "@/lib/graph/graph-styles";
import type {
  GraphFilterGroup,
  GraphFilterState,
  SigmaEdgeAttributes,
  SigmaNodeAttributes,
  EngineeringGraphData,
  EngineeringGraphNode,
} from "@/lib/graph/types";
import { GraphBrowseList } from "./graph-browse-list";
import { GraphDetailPanel } from "./graph-detail-panel";
import { GraphLegend } from "./graph-legend";
import { GraphSearch } from "./graph-search";
import { GraphToolbar } from "./graph-toolbar";

const focusedLabelTypePriority = {
  person: 0,
  experience: 0,
  project: 0,
  domain: 0,
  capability: 1,
  learning: 2,
  roadmap: 2,
  technology: 3,
  concept: 4,
  evidence: 5,
} as const;

type FocusedDisplayPosition = { x: number; y: number };

type ProjectFocusLayout = {
  positions: Map<string, FocusedDisplayPosition>;
  cameraNodeIds: Set<string>;
};

const projectFocusConceptLabels: Readonly<Record<string, readonly string[]>> = {
  "real-time-commerce-platform": ["Event-Driven Architecture", "Transactional Outbox"],
  "knowledge-base-rag": ["Hybrid Retrieval", "Citation Integrity"],
  "modelops-control-plane": ["Canary Deployment", "Weighted Routing"],
  "repo-context-forge": ["Repository Intelligence", "Source-Grounded Context"],
  "dbt-feature-lineage": ["Column-Level Lineage", "Downstream Impact"],
};

function estimatedLabelWidth(label: string) {
  return Math.max(2.8, label.length * 0.52);
}

function verticalSlots(count: number, gap: number) {
  if (count <= 0) return [];
  return Array.from({ length: count }, (_, index) => (index - (count - 1) / 2) * gap);
}

function createProjectDisplayLayout(
  project: EngineeringGraphNode,
  neighbors: readonly EngineeringGraphNode[],
  visibleConceptIds: ReadonlySet<string>,
  visibleEvidenceIds: ReadonlySet<string>,
  measureLabel: (label: string) => number = estimatedLabelWidth,
): ProjectFocusLayout {
  const positions = new Map<string, FocusedDisplayPosition>();
  const cameraNodeIds = new Set<string>([project.id]);
  const center = { x: project.x, y: project.y };
  const place = (node: EngineeringGraphNode, x: number, y: number) => {
    positions.set(node.id, { x: center.x + x, y: center.y + y });
  };
  // The project remains the visual anchor. Its measured title width defines
  // an exclusion zone that neither technology column can enter.
  place(project, 0, 0);

  const technologies = project.metadata.keyTechnologies
    ?.map((label) => neighbors.find((neighbor) => neighbor.type === "technology" && neighbor.label === label))
    .filter((node): node is EngineeringGraphNode => Boolean(node)) ?? [];
  const technologyIds = new Set(technologies.map((node) => node.id));
  const remainingTechnologies = neighbors
    .filter((neighbor) => neighbor.type === "technology" && !technologyIds.has(neighbor.id))
    .sort((left, right) => left.label.localeCompare(right.label));
  technologies.push(...remainingTechnologies);

  const technologySplit = Math.ceil(technologies.length / 2);
  const leftTechnologies = technologies.slice(0, technologySplit);
  const rightTechnologies = technologies.slice(technologySplit);
  const selectedLabelWidth = measureLabel(project.canvasLabel);
  const leftLabelWidth = Math.max(0, ...leftTechnologies.map((node) => measureLabel(node.canvasLabel)));
  const leftX = -Math.max(13.2, leftLabelWidth + 6.8);
  const rightX = Math.max(12.8, selectedLabelWidth + 6.8);
  verticalSlots(leftTechnologies.length, 3.65).forEach((y, index) => place(leftTechnologies[index], leftX, y));
  verticalSlots(rightTechnologies.length, 3.65).forEach((y, index) => place(rightTechnologies[index], rightX, y));
  technologies.forEach((node) => cameraNodeIds.add(node.id));

  const domains = neighbors.filter((neighbor) => neighbor.type === "domain");
  const domainXs = verticalSlots(domains.length, 5.6);
  domains.forEach((node, index) => {
    place(node, -7.8 + domainXs[index], -13.4);
    cameraNodeIds.add(node.id);
  });

  const relatedAnchors = neighbors.filter((neighbor) => (
    neighbor.type === "person" || neighbor.type === "experience" || neighbor.type === "project"
  ));
  verticalSlots(relatedAnchors.length, 3.2).forEach((x, index) => {
    place(relatedAnchors[index], -7.8 + x, -16.5);
  });

  const concepts = neighbors.filter((neighbor) => neighbor.type === "concept");
  const visibleConcepts = concepts.filter((node) => visibleConceptIds.has(node.id));
  const hiddenConcepts = concepts.filter((node) => !visibleConceptIds.has(node.id));
  const conceptStartX = 5.4;
  const visibleConceptYs = verticalSlots(visibleConcepts.length, 5.4);
  visibleConcepts.forEach((node, index) => {
    place(node, conceptStartX, -13.4 + visibleConceptYs[index] * 0.56);
    cameraNodeIds.add(node.id);
  });
  const visibleConceptWidth = Math.max(0, ...visibleConcepts.map((node) => measureLabel(node.canvasLabel)));
  const hiddenConceptX = Math.max(rightX + 8.4, conceptStartX + visibleConceptWidth + 4.2);
  hiddenConcepts.forEach((node, index) => {
    const column = Math.floor(index / 5);
    const row = index % 5;
    place(node, hiddenConceptX + column * 2.2, -7.2 + row * 2.25);
  });

  const evidence = neighbors.filter((neighbor) => neighbor.type === "evidence");
  const visibleEvidence = evidence.filter((node) => visibleEvidenceIds.has(node.id));
  const hiddenEvidence = evidence.filter((node) => !visibleEvidenceIds.has(node.id));
  const evidenceXs = verticalSlots(visibleEvidence.length, 5.2);
  visibleEvidence.forEach((node, index) => {
    place(node, evidenceXs[index], 13.4);
    cameraNodeIds.add(node.id);
  });
  hiddenEvidence.forEach((node, index) => place(node, 7.2 + index * 2.2, 13.4));

  const learning = neighbors.filter((neighbor) => neighbor.type === "learning" || neighbor.type === "roadmap");
  verticalSlots(learning.length, 2.6).forEach((y, index) => place(learning[index], hiddenConceptX, 10.4 + y));

  const positioned = new Set(positions.keys());
  const remaining = neighbors.filter((neighbor) => !positioned.has(neighbor.id));
  verticalSlots(remaining.length, 2.4).forEach((y, index) => place(remaining[index], leftX - 3.2, y));
  return { positions, cameraNodeIds };
}

function focusProfile(node: EngineeringGraphNode, neighborCount: number, tight: boolean) {
  if (node.type === "person" || node.type === "experience") {
    return { occupancy: tight ? 0.74 : 0.64, minimumRatio: tight ? 0.2 : 0.28, labelPadding: 96 };
  }
  if (node.type === "project") {
    const occupancy = node.metadata.flagship ? (tight ? 0.92 : 0.88) : (tight ? 0.86 : 0.82);
    return { occupancy, minimumRatio: tight ? 0.12 : 0.15, labelPadding: 156 };
  }
  const adaptiveOccupancy = Math.max(0.66, Math.min(0.76, 0.76 - Math.max(0, neighborCount - 5) * 0.008));
  return {
    occupancy: tight ? Math.min(0.86, adaptiveOccupancy + 0.1) : adaptiveOccupancy,
    minimumRatio: tight ? 0.16 : 0.22,
    labelPadding: 104,
  };
}

export default function EngineeringGraph({ data }: { data: EngineeringGraphData }) {
  const nodeById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes]);
  const graph = useMemo(() => {
    const nextGraph = new Graph<SigmaNodeAttributes, SigmaEdgeAttributes>({
      type: "directed",
      multi: true,
    });

    for (const node of data.nodes) {
      const visual = getNodeVisual(node.type, node.status, node.importance);
      nextGraph.addNode(node.id, {
        x: node.x,
        y: node.y,
        label: node.canvasLabel,
        color: visual.color,
        size: visual.size,
        type: "circle",
        forceLabel: visual.forceLabel,
        zIndex: visual.zIndex,
        nodeType: node.type,
        status: node.status,
        importance: node.importance,
      });
    }

    for (const edge of data.edges) {
      const visual = getEdgeVisual(edge.type);
      nextGraph.addDirectedEdgeWithKey(edge.id, edge.source, edge.target, {
        ...visual,
        label: edge.label,
        status: edge.status ?? visual.status,
      });
    }

    return nextGraph;
  }, [data]);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const rendererRef = useRef<Sigma<SigmaNodeAttributes, SigmaEdgeAttributes> | null>(null);
  const selectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const filtersRef = useRef<GraphFilterState>(DEFAULT_GRAPH_FILTERS);
  const focusedLabelIdsRef = useRef<Set<string>>(new Set());
  const forcedProjectLabelIdsRef = useRef<Set<string>>(new Set());
  const focusedEdgeLabelIdsRef = useRef<Set<string>>(new Set());
  const focusedProjectRef = useRef<string | null>(null);
  const focusedDisplayPositionsRef = useRef<Map<string, FocusedDisplayPosition>>(new Map());
  const focusedCameraNodeIdsRef = useRef<Set<string>>(new Set());
  const focusedLayoutProgressRef = useRef(0);
  const layoutAnimationFrameRef = useRef<number | null>(null);
  const selectionOriginRef = useRef<HTMLElement | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [filters, setFilters] = useState<GraphFilterState>(DEFAULT_GRAPH_FILTERS);
  const [query, setQuery] = useState("");
  const [activeSearchIndex, setActiveSearchIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const selectedNode = data.nodes.find((node) => node.id === selectedNodeId) ?? null;
  const visibleCount = data.nodes.filter((node) => isNodeTypeVisible(node.type, filters)).length;
  const mobileShortcuts = [
    { id: "project:real-time-commerce-platform", label: "Commerce" },
    { id: "project:knowledge-base-rag", label: "RAG" },
    { id: "project:modelops-control-plane", label: "ModelOps" },
    { id: "project:repo-context-forge", label: "Repo Context" },
    { id: "project:dbt-feature-lineage", label: "Lineage" },
    { id: "learning:langgraph", label: "Learning" },
    { id: "roadmap:real-time-commerce-platform:terraform", label: "Roadmap" },
  ].filter((shortcut) => data.nodes.some((node) => node.id === shortcut.id));

  const searchResults = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("en-US");
    if (!normalized) return [];
    const typePriority = {
      project: 0,
      experience: 1,
      person: 1,
      domain: 2,
      capability: 2,
      learning: 3,
      roadmap: 3,
      technology: 4,
      concept: 5,
      evidence: 6,
    } as const;
    return data.nodes
      .filter((node) => `${node.label} ${node.description}`.toLocaleLowerCase("en-US").includes(normalized))
      .sort((left, right) => {
        const leftStarts = left.label.toLocaleLowerCase("en-US").startsWith(normalized) ? 0 : 1;
        const rightStarts = right.label.toLocaleLowerCase("en-US").startsWith(normalized) ? 0 : 1;
        return leftStarts - rightStarts
          || typePriority[left.type] - typePriority[right.type]
          || right.importance - left.importance
          || left.label.localeCompare(right.label);
      })
      .slice(0, 8);
  }, [data.nodes, query]);

  const updateUrlNode = useCallback((nodeId: string | null) => {
    const url = new URL(window.location.href);
    if (nodeId) url.searchParams.set("node", nodeId.replace(/^[^:]+:/, ""));
    else url.searchParams.delete("node");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, []);

  const clearSelectionState = useCallback(() => {
    focusedLabelIdsRef.current = new Set();
    forcedProjectLabelIdsRef.current = new Set();
    focusedEdgeLabelIdsRef.current = new Set();
    focusedProjectRef.current = null;
    focusedCameraNodeIdsRef.current = new Set();
    setSelectedNodeId(null);
    updateUrlNode(null);
  }, [updateUrlNode]);

  const fitGraph = useCallback(() => {
    const camera = rendererRef.current?.getCamera();
    if (!camera) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) camera.setState({ x: 0.5, y: 0.5, ratio: 1, angle: 0 });
    else camera.animatedReset({ duration: 220, easing: "quadraticOut" });
  }, []);

  const animateProjectLayout = useCallback((target: 0 | 1, onComplete?: () => void) => {
    if (layoutAnimationFrameRef.current !== null) cancelAnimationFrame(layoutAnimationFrameRef.current);
    const renderer = rendererRef.current;
    const start = focusedLayoutProgressRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!renderer || reducedMotion || Math.abs(start - target) < 0.001) {
      focusedLayoutProgressRef.current = target;
      renderer?.refresh();
      onComplete?.();
      return;
    }

    const startedAt = performance.now();
    const duration = target === 1 ? 240 : 180;
    const step = (time: number) => {
      const elapsed = Math.min(1, (time - startedAt) / duration);
      const eased = 1 - (1 - elapsed) ** 3;
      focusedLayoutProgressRef.current = start + (target - start) * eased;
      renderer.refresh();
      if (elapsed < 1) layoutAnimationFrameRef.current = requestAnimationFrame(step);
      else {
        layoutAnimationFrameRef.current = null;
        onComplete?.();
      }
    };
    layoutAnimationFrameRef.current = requestAnimationFrame(step);
  }, []);

  const exitFocusedView = useCallback(() => {
    const selectionOrigin = selectionOriginRef.current;
    selectionOriginRef.current = null;
    clearSelectionState();
    fitGraph();
    animateProjectLayout(0, () => {
      focusedDisplayPositionsRef.current = new Map();
      focusedCameraNodeIdsRef.current = new Set();
      rendererRef.current?.refresh();
    });
    window.requestAnimationFrame(() => {
      if (selectionOrigin?.isConnected) selectionOrigin.focus({ preventScroll: true });
    });
  }, [animateProjectLayout, clearSelectionState, fitGraph]);

  const focusNeighborhood = useCallback((nodeId: string, tight = false) => {
    const renderer = rendererRef.current;
    const selectedNode = nodeById.get(nodeId);
    if (!renderer || !selectedNode || !graph.hasNode(nodeId)) return;

    const visibleNeighbors = graph.neighbors(nodeId).filter((neighborId) => (
      isNodeTypeVisible(graph.getNodeAttribute(neighborId, "nodeType"), filtersRef.current)
    ));
    const projectCameraIds = focusedProjectRef.current === nodeId
      ? [...focusedCameraNodeIdsRef.current]
      : [];
    const clusterIds = projectCameraIds.length > 0 ? projectCameraIds : [nodeId, ...visibleNeighbors];
    const cluster = clusterIds
      .map((id) => renderer.getNodeDisplayData(id))
      .filter((node): node is NonNullable<ReturnType<typeof renderer.getNodeDisplayData>> => Boolean(node));
    if (cluster.length === 0) return;

    const center = {
      x: (Math.min(...cluster.map((node) => node.x)) + Math.max(...cluster.map((node) => node.x))) / 2,
      y: (Math.min(...cluster.map((node) => node.y)) + Math.max(...cluster.map((node) => node.y))) / 2,
    };
    const dimensions = renderer.getDimensions();
    const panel = containerRef.current?.closest(".graph-workspace")?.querySelector<HTMLElement>(".graph-detail-panel");
    const panelWidth = panel && getComputedStyle(panel).position === "absolute"
      ? panel.getBoundingClientRect().width
      : 0;
    const usableWidth = Math.max(280, dimensions.width - panelWidth);
    const baseState = { x: center.x, y: center.y, ratio: 1, angle: 0 };
    const viewportPoints = cluster.map((node) => renderer.framedGraphToViewport(node, { cameraState: baseState }));
    const profile = focusProfile(selectedNode, visibleNeighbors.length, tight);
    const spanX = Math.max(72, Math.max(...viewportPoints.map((point) => point.x)) - Math.min(...viewportPoints.map((point) => point.x))) + profile.labelPadding;
    const spanY = Math.max(72, Math.max(...viewportPoints.map((point) => point.y)) - Math.min(...viewportPoints.map((point) => point.y))) + 64;
    const desiredRatio = Math.max(spanX / (usableWidth * profile.occupancy), spanY / (dimensions.height * profile.occupancy));
    const ratio = Math.max(profile.minimumRatio, desiredRatio);
    const centeredState = { ...baseState, ratio };
    const targetViewport = { x: usableWidth * 0.48, y: dimensions.height * 0.5 };
    const graphPointAtTarget = renderer.viewportToFramedGraph(targetViewport, { cameraState: centeredState });
    const nextState = {
      ...centeredState,
      x: centeredState.x + center.x - graphPointAtTarget.x,
      y: centeredState.y + center.y - graphPointAtTarget.y,
    };
    const camera = renderer.getCamera();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) camera.setState(nextState);
    else camera.animate(nextState, { duration: tight ? 260 : 240, easing: "quadraticOut" });
  }, [graph, nodeById]);

  const focusNode = useCallback((nodeId: string, cameraMode: "context" | "focus" = "context") => {
    const node = nodeById.get(nodeId);
    if (!node) return;

    if (!selectedRef.current && document.activeElement instanceof HTMLElement) {
      selectionOriginRef.current = document.activeElement;
    }
    const group = filterGroupForNode(node.type);
    setFilters((current) => current[group] ? current : { ...current, [group]: true });
    const neighbors = graph.neighbors(nodeId).filter((neighborId) => (
      isNodeTypeVisible(graph.getNodeAttribute(neighborId, "nodeType"), filtersRef.current)
    ));
    let prioritizedNeighbors: string[];
    const isProjectFocus = node.type === "project";
    const restoreProjectLayoutBeforeFocus = !isProjectFocus
      && focusedDisplayPositionsRef.current.size > 0
      && focusedLayoutProgressRef.current > 0;
    if (node.type === "project" && node.projectSlug) {
      const neighborNodes = neighbors.map((id) => nodeById.get(id)).filter((item): item is EngineeringGraphNode => Boolean(item));
      const technologies = node.metadata.keyTechnologies
        ?.map((label) => neighborNodes.find((neighbor) => neighbor.type === "technology" && neighbor.label === label))
        .filter((item): item is EngineeringGraphNode => Boolean(item)) ?? [];
      const highLevel = neighborNodes
        .filter((neighbor) => neighbor.type === "domain")
        .sort((left, right) => right.importance - left.importance)
        .slice(0, 3);
      const relatedAnchors = neighborNodes
        .filter((neighbor) => neighbor.type === "project" || neighbor.type === "experience")
        .sort((left, right) => right.importance - left.importance)
        .slice(0, 1);
      const conceptNeighbors = neighborNodes.filter((neighbor) => neighbor.type === "concept");
      const concepts = (projectFocusConceptLabels[node.projectSlug] ?? [])
        .map((label) => conceptNeighbors.find((neighbor) => neighbor.label === label))
        .filter((item): item is EngineeringGraphNode => Boolean(item));
      if (concepts.length < 2) {
        concepts.push(...conceptNeighbors
          .filter((neighbor) => !concepts.some((concept) => concept.id === neighbor.id))
          .sort((left, right) => right.importance - left.importance || left.label.localeCompare(right.label))
          .slice(0, 2 - concepts.length));
      }
      const evidence = neighborNodes.filter((neighbor) => neighbor.type === "evidence").slice(0, 1);
      prioritizedNeighbors = [...highLevel, ...technologies, ...relatedAnchors, ...concepts, ...evidence].map((neighbor) => neighbor.id);
      focusedProjectRef.current = nodeId;
      focusedLayoutProgressRef.current = 0;
      const measurementContext = document.createElement("canvas").getContext("2d");
      if (measurementContext) measurementContext.font = "600 11px Geist, ui-sans-serif, system-ui, sans-serif";
      const measureLabel = (label: string) => Math.max(
        2.8,
        (measurementContext?.measureText(label).width ?? label.length * 6.2) / 12,
      );
      const projectLayout = createProjectDisplayLayout(
        node,
        neighborNodes,
        new Set(concepts.map((neighbor) => neighbor.id)),
        new Set(evidence.map((neighbor) => neighbor.id)),
        measureLabel,
      );
      focusedDisplayPositionsRef.current = projectLayout.positions;
      focusedCameraNodeIdsRef.current = projectLayout.cameraNodeIds;
      const forceTechnologyLabels = window.matchMedia("(min-width: 821px)").matches;
      forcedProjectLabelIdsRef.current = new Set([
        nodeId,
        ...highLevel.map((neighbor) => neighbor.id),
        ...(forceTechnologyLabels ? technologies.map((neighbor) => neighbor.id) : []),
        ...(forceTechnologyLabels ? concepts.map((neighbor) => neighbor.id) : []),
        ...(forceTechnologyLabels ? evidence.map((neighbor) => neighbor.id) : []),
      ]);
    } else {
      const labelBudget = window.matchMedia("(max-width: 640px)").matches ? 4 : graph.degree(nodeId) > 14 ? 7 : 9;
      prioritizedNeighbors = neighbors
        .sort((left, right) => {
          const leftAttributes = graph.getNodeAttributes(left);
          const rightAttributes = graph.getNodeAttributes(right);
          return focusedLabelTypePriority[leftAttributes.nodeType] - focusedLabelTypePriority[rightAttributes.nodeType]
            || rightAttributes.importance - leftAttributes.importance
            || left.localeCompare(right);
        })
        .slice(0, labelBudget);
      focusedProjectRef.current = null;
      forcedProjectLabelIdsRef.current = new Set();
      if (!restoreProjectLayoutBeforeFocus) {
        focusedDisplayPositionsRef.current = new Map();
        focusedCameraNodeIdsRef.current = new Set();
        focusedLayoutProgressRef.current = 0;
      }
    }
    focusedLabelIdsRef.current = new Set([nodeId, ...prioritizedNeighbors]);
    const incidentEdges = graph.edges(nodeId);
    const labelCounts = new Map<string, number>();
    for (const edgeId of incidentEdges) {
      const label = graph.getEdgeAttribute(edgeId, "label").toLocaleLowerCase("en-US");
      labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1);
    }
    const highValueLabels = new Set(["worked at", "evolved into", "orchestrates docker containers"]);
    focusedEdgeLabelIdsRef.current = new Set(incidentEdges.filter((edgeId) => {
      const label = graph.getEdgeAttribute(edgeId, "label").toLocaleLowerCase("en-US");
      return highValueLabels.has(label) || ((labelCounts.get(label) ?? 0) === 1 && incidentEdges.length <= 7);
    }));
    setSelectedNodeId(nodeId);
    setQuery("");
    updateUrlNode(nodeId);

    window.requestAnimationFrame(() => {
      if (isProjectFocus) {
        animateProjectLayout(1, () => focusNeighborhood(nodeId, cameraMode === "focus"));
      } else if (restoreProjectLayoutBeforeFocus) {
        animateProjectLayout(0, () => {
          focusedDisplayPositionsRef.current = new Map();
          focusedCameraNodeIdsRef.current = new Set();
          rendererRef.current?.refresh();
          focusNeighborhood(nodeId, cameraMode === "focus");
        });
      } else {
        window.requestAnimationFrame(() => focusNeighborhood(nodeId, cameraMode === "focus"));
      }
    });
  }, [animateProjectLayout, focusNeighborhood, graph, nodeById, updateUrlNode]);

  const resetGraph = useCallback(() => {
    setFilters(DEFAULT_GRAPH_FILTERS);
    setQuery("");
    exitFocusedView();
  }, [exitFocusedView]);

  useEffect(() => {
    selectedRef.current = selectedNodeId;
    hoveredRef.current = hoveredNodeId;
    filtersRef.current = filters;
    rendererRef.current?.refresh();
  }, [filters, hoveredNodeId, selectedNodeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    try {
      const compactCanvas = window.matchMedia("(max-width: 640px)").matches;
      const renderer = new Sigma(graph, container, {
        defaultNodeType: "circle",
        defaultEdgeType: "line",
        renderLabels: true,
        renderEdgeLabels: true,
        defaultDrawNodeHover: drawGraphNodeHover,
        labelFont: "Geist, ui-sans-serif, system-ui, sans-serif",
        labelSize: 11,
        labelWeight: "600",
        labelColor: { color: "#d0d4cc" },
        edgeLabelFont: "Geist Mono, ui-monospace, monospace",
        edgeLabelSize: 9,
        edgeLabelWeight: "600",
        edgeLabelColor: { color: "#aeb7aa" },
        labelDensity: compactCanvas ? 0.26 : 0.32,
        labelGridCellSize: compactCanvas ? 172 : 150,
        labelRenderedSizeThreshold: compactCanvas ? 11 : 8.5,
        hideEdgesOnMove: true,
        stagePadding: compactCanvas ? 28 : 52,
        minCameraRatio: 0.16,
        maxCameraRatio: 2.2,
        enableCameraRotation: false,
        zIndex: true,
        nodeReducer: (nodeId, attributes) => {
          const visible = isNodeTypeVisible(attributes.nodeType, filtersRef.current);
          if (!visible) {
            const preservesContext = graph.neighbors(nodeId).some((neighbor) => (
              isNodeTypeVisible(graph.getNodeAttribute(neighbor, "nodeType"), filtersRef.current)
            ));
            if (!preservesContext) return { ...attributes, hidden: true };
            return {
              ...attributes,
              color: FILTER_CONTEXT_NODE_COLOR,
              forceLabel: false,
              label: "",
              size: Math.max(2.4, attributes.size * 0.48),
              zIndex: 0,
            };
          }

          const focusedPosition = focusedDisplayPositionsRef.current.get(nodeId);
          const layoutProgress = focusedLayoutProgressRef.current;
          const displayAttributes = focusedPosition && layoutProgress > 0
            ? {
                ...attributes,
                x: attributes.x + (focusedPosition.x - attributes.x) * layoutProgress,
                y: attributes.y + (focusedPosition.y - attributes.y) * layoutProgress,
              }
            : attributes;
          const selectedNode = selectedRef.current;
          const hoveredNode = hoveredRef.current;
          const activeNode = selectedNode ?? hoveredNode;
          if (!activeNode) {
            const cameraRatio = rendererRef.current?.getCamera().getState().ratio ?? 1;
            const isHighLevel = attributes.nodeType === "person"
              || attributes.nodeType === "experience"
              || attributes.nodeType === "project"
              || attributes.nodeType === "domain";
            const showAtMediumZoom = cameraRatio <= 0.72
              && attributes.importance >= 6
              && (attributes.nodeType === "technology"
                || attributes.nodeType === "capability"
                || attributes.nodeType === "learning");
            const showAtCloseZoom = cameraRatio <= 0.44;
            const showLabel = isHighLevel || showAtMediumZoom || showAtCloseZoom;
            return {
              ...displayAttributes,
              label: showLabel ? displayAttributes.label : "",
              forceLabel: isHighLevel || showAtMediumZoom,
            };
          }
          const isSelected = nodeId === selectedNode;
          const isSelectedNeighbor = Boolean(selectedNode && graph.areNeighbors(nodeId, selectedNode));
          const isHovered = nodeId === hoveredNode;
          const isHoveredNeighbor = Boolean(hoveredNode && graph.areNeighbors(nodeId, hoveredNode));
          const isLocal = selectedNode ? isSelected || isSelectedNeighbor : nodeId === activeNode || graph.areNeighbors(nodeId, activeNode);

          if (!isLocal && !isHovered && !isHoveredNeighbor) {
            const isProjectContext = Boolean(focusedProjectRef.current);
            return {
              ...displayAttributes,
              color: isProjectContext ? PROJECT_CONTEXT_NODE_COLOR : DIMMED_NODE_COLOR,
              label: "",
              forceLabel: false,
              size: Math.max(1.8, attributes.size * (isProjectContext ? 0.46 : 0.72)),
              zIndex: 0,
            };
          }

          const isProjectFocusedNeighbor = focusedProjectRef.current === selectedNode && isSelectedNeighbor;
          const showFocusedLabel = focusedLabelIdsRef.current.has(nodeId) || isHovered;
          const forceFocusedLabel = forcedProjectLabelIdsRef.current.has(nodeId);
          const projectLabelScale = isProjectFocusedNeighbor && showFocusedLabel
            ? attributes.nodeType === "technology"
              ? 1.14
              : attributes.nodeType === "domain"
                ? 1.1
                : attributes.nodeType === "project" || attributes.nodeType === "person"
                  ? 1.05
                  : 1
            : 1;
          return {
            ...displayAttributes,
            highlighted: isSelected || isHovered,
            color: isSelected ? SELECTED_NODE_COLOR : attributes.color,
            label: showFocusedLabel ? attributes.label : "",
            forceLabel: isSelected || isHovered || forceFocusedLabel,
            size: attributes.size * (isSelected ? 1.18 : isHovered ? 1.1 : 1.03) * projectLabelScale,
            zIndex: isSelected ? 20 : isHovered ? 18 : isProjectFocusedNeighbor && attributes.nodeType === "technology" ? 14 : attributes.zIndex,
          };
        },
        edgeReducer: (edgeId, attributes) => {
          const source = graph.source(edgeId);
          const target = graph.target(edgeId);
          const sourceVisible = isNodeTypeVisible(graph.getNodeAttribute(source, "nodeType"), filtersRef.current);
          const targetVisible = isNodeTypeVisible(graph.getNodeAttribute(target, "nodeType"), filtersRef.current);
          if (!sourceVisible && !targetVisible) return { hidden: true };
          if (!sourceVisible || !targetVisible) {
            return { ...attributes, color: DIMMED_EDGE_COLOR, label: "", size: 0.24 };
          }

          const selectedNode = selectedRef.current;
          const hoveredNode = hoveredRef.current;
          const activeNode = selectedNode ?? hoveredNode;
          if (!activeNode) return { ...attributes, label: "", forceLabel: false };
          const isSelectedEdge = Boolean(selectedNode && (source === selectedNode || target === selectedNode));
          const isHoveredEdge = Boolean(hoveredNode && (source === hoveredNode || target === hoveredNode));
          if (!isSelectedEdge && !isHoveredEdge) {
            const isProjectContext = Boolean(focusedProjectRef.current);
            return {
              ...attributes,
              color: isProjectContext ? PROJECT_CONTEXT_EDGE_COLOR : DIMMED_EDGE_COLOR,
              label: "",
              size: isProjectContext ? 0.1 : 0.22,
            };
          }
          const showRelationshipLabel = !hoveredNode && focusedEdgeLabelIdsRef.current.has(edgeId);
          const connectedNode = selectedNode && isSelectedEdge ? (source === selectedNode ? target : source) : null;
          const connectedType = connectedNode ? graph.getNodeAttribute(connectedNode, "nodeType") : null;
          const projectEdgeScale = focusedProjectRef.current === selectedNode && isSelectedEdge
            ? connectedType === "technology" || connectedType === "domain"
              ? 2.5
              : connectedType === "concept" || connectedType === "evidence"
                ? 1.7
                : 1.35
            : isSelectedEdge ? 2.2 : 1.65;
          return {
            ...attributes,
            forceLabel: showRelationshipLabel,
            label: showRelationshipLabel ? attributes.label : "",
            size: attributes.size * projectEdgeScale,
            zIndex: isSelectedEdge ? 10 : 8,
          };
        },
      });

      renderer.on("clickNode", ({ node }) => focusNode(node, "context"));
      renderer.on("doubleClickNode", ({ node, preventSigmaDefault }) => {
        preventSigmaDefault();
        focusNode(node, "focus");
      });
      renderer.on("clickStage", exitFocusedView);
      renderer.on("enterNode", ({ node }) => {
        setHoveredNodeId(node);
        container.classList.add("is-node-hovered");
      });
      renderer.on("leaveNode", () => {
        setHoveredNodeId(null);
        container.classList.remove("is-node-hovered");
      });
      rendererRef.current = renderer;

      const requested = new URL(window.location.href).searchParams.get("node");
      if (requested) {
        const match = data.nodes.find((node) => node.id === requested || node.id.endsWith(`:${requested}`));
        if (match) window.requestAnimationFrame(() => focusNode(match.id, "context"));
      }

      return () => {
        if (layoutAnimationFrameRef.current !== null) cancelAnimationFrame(layoutAnimationFrameRef.current);
        renderer.kill();
        rendererRef.current = null;
      };
    } catch (initializationError) {
      const message = initializationError instanceof Error ? initializationError.message : "Unknown graph initialization error";
      queueMicrotask(() => setError(message));
    }
  }, [data.nodes, exitFocusedView, focusNode, graph]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "Escape") {
        exitFocusedView();
        setQuery("");
      } else if (event.key.toLocaleLowerCase("en-US") === "f" && !isTyping) {
        event.preventDefault();
        exitFocusedView();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [exitFocusedView]);

  const toggleFilter = (filter: GraphFilterGroup) => {
    const selected = data.nodes.find((node) => node.id === selectedNodeId);
    const hidesSelection = Boolean(
      selected
      && filterGroupForNode(selected.type) === filter
      && filters[filter],
    );
    setFilters((current) => ({ ...current, [filter]: !current[filter] }));
    if (hidesSelection) exitFocusedView();
  };

  return (
    <div className="engineering-graph">
      <div className="graph-control-row">
        <GraphSearch
          inputRef={searchRef}
          query={query}
          results={searchResults}
          activeIndex={activeSearchIndex}
          onQueryChange={(value) => {
            setQuery(value);
            setActiveSearchIndex(0);
          }}
          onActiveIndexChange={setActiveSearchIndex}
          onSelect={focusNode}
        />
        <GraphLegend />
      </div>

      <GraphToolbar filters={filters} onToggleFilter={toggleFilter} onOverview={exitFocusedView} onReset={resetGraph} />

      <nav className="graph-mobile-shortcuts" aria-label="Quick graph exploration">
        <span>Explore</span>
        <div>
          {mobileShortcuts.map((shortcut) => (
            <button key={shortcut.id} type="button" onClick={() => focusNode(shortcut.id)}>
              {shortcut.label}
            </button>
          ))}
        </div>
      </nav>

      <div className="graph-workspace">
        <div className="graph-canvas-shell">
          <div
            ref={containerRef}
            className="graph-canvas"
            role="img"
            aria-label="Interactive source-grounded engineering graph. Use search, category filters, or the accessible list to inspect professional experience, public projects, technologies, concepts, evidence, and learning directions."
          />
          <p className="graph-onboarding">Scroll or pinch to zoom · select to focus and inspect · double-click for a tighter view</p>
          {!selectedNode ? <p className="graph-selection-hint">Select a node to inspect relationships.</p> : null}
          <p className="sr-only" aria-live="polite">
            {selectedNode ? `${selectedNode.label} selected. ${selectedNode.description}` : "No graph node selected."}
          </p>
          {error ? (
            <div className="graph-fallback" role="alert">
              <strong>The interactive graph could not initialize.</strong>
              <p>{error}</p>
              <p>Use the accessible list below to browse projects and learning directions.</p>
            </div>
          ) : null}
          {visibleCount === 0 ? (
            <div className="graph-fallback">
              <strong>No node categories are visible.</strong>
              <button type="button" onClick={resetGraph}>Reset graph</button>
            </div>
          ) : null}
        </div>
        <GraphDetailPanel
          key={selectedNode?.id ?? "graph-detail-empty"}
          node={selectedNode}
          data={data}
          onClose={exitFocusedView}
          onSelectNode={focusNode}
        />
      </div>

      <GraphBrowseList data={data} onSelect={focusNode} />
      <p className="graph-data-summary">
        {data.nodes.length} source-grounded nodes · {data.edges.length} validated relationships · no external API data
      </p>
    </div>
  );
}
