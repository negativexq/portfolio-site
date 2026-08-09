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

export default function EngineeringGraph({ data }: { data: EngineeringGraphData }) {
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

  const exitFocusedView = useCallback(() => {
    const selectionOrigin = selectionOriginRef.current;
    selectionOriginRef.current = null;
    clearSelectionState();
    fitGraph();
    window.requestAnimationFrame(() => {
      if (selectionOrigin?.isConnected) selectionOrigin.focus({ preventScroll: true });
    });
  }, [clearSelectionState, fitGraph]);

  const focusNeighborhood = useCallback((nodeId: string, tight = false) => {
    const renderer = rendererRef.current;
    if (!renderer || !graph.hasNode(nodeId)) return;

    const visibleNeighbors = graph.neighbors(nodeId).filter((neighborId) => (
      isNodeTypeVisible(graph.getNodeAttribute(neighborId, "nodeType"), filtersRef.current)
    ));
    const clusterIds = [nodeId, ...visibleNeighbors];
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
    const spanX = Math.max(72, Math.max(...viewportPoints.map((point) => point.x)) - Math.min(...viewportPoints.map((point) => point.x)));
    const spanY = Math.max(72, Math.max(...viewportPoints.map((point) => point.y)) - Math.min(...viewportPoints.map((point) => point.y)));
    const occupancy = tight ? 0.78 : 0.66;
    const desiredRatio = Math.max(spanX / (usableWidth * occupancy), spanY / (dimensions.height * occupancy));
    const ratio = Math.min(tight ? 0.58 : 0.9, Math.max(tight ? 0.18 : 0.24, desiredRatio));
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
  }, [graph]);

  const focusNode = useCallback((nodeId: string, cameraMode: "context" | "focus" = "context") => {
    const node = data.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return;

    if (!selectedRef.current && document.activeElement instanceof HTMLElement) {
      selectionOriginRef.current = document.activeElement;
    }
    const group = filterGroupForNode(node.type);
    setFilters((current) => current[group] ? current : { ...current, [group]: true });
    const labelBudget = window.matchMedia("(max-width: 640px)").matches ? 4 : graph.degree(nodeId) > 14 ? 7 : 9;
    const prioritizedNeighbors = graph.neighbors(nodeId)
      .sort((left, right) => {
        const leftAttributes = graph.getNodeAttributes(left);
        const rightAttributes = graph.getNodeAttributes(right);
        return focusedLabelTypePriority[leftAttributes.nodeType] - focusedLabelTypePriority[rightAttributes.nodeType]
          || rightAttributes.importance - leftAttributes.importance
          || left.localeCompare(right);
      })
      .slice(0, labelBudget);
    focusedLabelIdsRef.current = new Set([nodeId, ...prioritizedNeighbors]);
    setSelectedNodeId(nodeId);
    setQuery("");
    updateUrlNode(nodeId);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => focusNeighborhood(nodeId, cameraMode === "focus"));
    });
  }, [data.nodes, focusNeighborhood, graph, updateUrlNode]);

  const resetGraph = useCallback(() => {
    setFilters(DEFAULT_GRAPH_FILTERS);
    setQuery("");
    clearSelectionState();
    fitGraph();
  }, [clearSelectionState, fitGraph]);

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
              ...attributes,
              label: showLabel ? attributes.label : "",
              forceLabel: isHighLevel || showAtMediumZoom,
            };
          }
          const isSelected = nodeId === selectedNode;
          const isSelectedNeighbor = Boolean(selectedNode && graph.areNeighbors(nodeId, selectedNode));
          const isHovered = nodeId === hoveredNode;
          const isHoveredNeighbor = Boolean(hoveredNode && graph.areNeighbors(nodeId, hoveredNode));
          const isLocal = selectedNode ? isSelected || isSelectedNeighbor : nodeId === activeNode || graph.areNeighbors(nodeId, activeNode);

          if (!isLocal && !isHovered && !isHoveredNeighbor) {
            return {
              ...attributes,
              color: DIMMED_NODE_COLOR,
              label: "",
              forceLabel: false,
              size: Math.max(2.4, attributes.size * 0.72),
              zIndex: 0,
            };
          }

          const showFocusedLabel = focusedLabelIdsRef.current.has(nodeId) || isHovered;
          return {
            ...attributes,
            highlighted: isSelected || isHovered,
            color: isSelected ? SELECTED_NODE_COLOR : attributes.color,
            label: showFocusedLabel ? attributes.label : "",
            forceLabel: isSelected || isHovered,
            size: attributes.size * (isSelected ? 1.18 : isHovered ? 1.1 : 1.03),
            zIndex: isSelected ? 20 : isHovered ? 18 : attributes.zIndex,
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
          if (!isSelectedEdge && !isHoveredEdge) return { ...attributes, color: DIMMED_EDGE_COLOR, label: "", size: 0.22 };
          const showRelationshipLabel = Boolean(selectedNode)
            && !hoveredNode
            && graph.degree(selectedNode!) <= 7;
          return {
            ...attributes,
            forceLabel: showRelationshipLabel,
            label: showRelationshipLabel ? attributes.label : "",
            size: attributes.size * (isSelectedEdge ? 2.2 : 1.65),
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
