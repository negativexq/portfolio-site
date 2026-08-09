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

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
    updateUrlNode(null);
  }, [updateUrlNode]);

  const focusNode = useCallback((nodeId: string, cameraMode: "none" | "context" | "focus" = "context") => {
    const node = data.nodes.find((candidate) => candidate.id === nodeId);
    if (!node) return;

    const group = filterGroupForNode(node.type);
    setFilters((current) => current[group] ? current : { ...current, [group]: true });
    setSelectedNodeId(nodeId);
    setQuery("");
    updateUrlNode(nodeId);

    if (cameraMode !== "none") {
      window.requestAnimationFrame(() => {
        const renderer = rendererRef.current;
        const displayData = renderer?.getNodeDisplayData(nodeId);
        if (!renderer || !displayData) return;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const currentRatio = renderer.getCamera().getState().ratio;
        const nextState = {
          x: displayData.x,
          y: displayData.y,
          ratio: cameraMode === "focus" ? 0.38 : Math.min(currentRatio, 0.72),
        };
        if (reducedMotion) renderer.getCamera().setState(nextState);
        else renderer.getCamera().animate(nextState, { duration: 240, easing: "quadraticOut" });
      });
    }
  }, [data.nodes, updateUrlNode]);

  const fitGraph = useCallback(() => {
    const camera = rendererRef.current?.getCamera();
    if (!camera) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) camera.setState({ x: 0.5, y: 0.5, ratio: 1, angle: 0 });
    else camera.animatedReset({ duration: 220, easing: "quadraticOut" });
  }, []);

  const resetGraph = useCallback(() => {
    setFilters(DEFAULT_GRAPH_FILTERS);
    setQuery("");
    clearSelection();
    fitGraph();
  }, [clearSelection, fitGraph]);

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

          const activeNode = selectedRef.current ?? hoveredRef.current;
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
          const isActive = nodeId === activeNode;
          const isNeighbor = graph.areNeighbors(nodeId, activeNode);

          if (!isActive && !isNeighbor) {
            return {
              ...attributes,
              color: DIMMED_NODE_COLOR,
              label: "",
              forceLabel: false,
              size: Math.max(2.5, attributes.size * 0.82),
              zIndex: 0,
            };
          }

          return {
            ...attributes,
            highlighted: isActive,
            color: isActive ? SELECTED_NODE_COLOR : attributes.color,
            forceLabel: true,
            size: attributes.size * (isActive ? 1.16 : 1.04),
            zIndex: isActive ? 20 : attributes.zIndex,
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

          const activeNode = selectedRef.current ?? hoveredRef.current;
          if (!activeNode) return { ...attributes, label: "", forceLabel: false };
          const isConnected = source === activeNode || target === activeNode;
          if (!isConnected) return { ...attributes, color: DIMMED_EDGE_COLOR, label: "", size: 0.3 };
          const showRelationshipLabel = selectedRef.current === activeNode
            && !hoveredRef.current
            && graph.degree(activeNode) <= 7;
          return {
            ...attributes,
            forceLabel: showRelationshipLabel,
            label: showRelationshipLabel ? attributes.label : "",
            size: attributes.size * 2,
            zIndex: 10,
          };
        },
      });

      renderer.on("clickNode", ({ node }) => focusNode(node, "none"));
      renderer.on("doubleClickNode", ({ node, preventSigmaDefault }) => {
        preventSigmaDefault();
        focusNode(node, "focus");
      });
      renderer.on("clickStage", clearSelection);
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
  }, [clearSelection, data.nodes, focusNode, graph]);

  useEffect(() => {
    const handleKeyboard = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      } else if (event.key === "Escape") {
        clearSelection();
        setQuery("");
      } else if (event.key.toLocaleLowerCase("en-US") === "f" && !isTyping) {
        event.preventDefault();
        fitGraph();
      }
    };
    window.addEventListener("keydown", handleKeyboard);
    return () => window.removeEventListener("keydown", handleKeyboard);
  }, [clearSelection, fitGraph]);

  const toggleFilter = (filter: GraphFilterGroup) => {
    const selected = data.nodes.find((node) => node.id === selectedNodeId);
    const hidesSelection = Boolean(
      selected
      && filterGroupForNode(selected.type) === filter
      && filters[filter],
    );
    setFilters((current) => ({ ...current, [filter]: !current[filter] }));
    if (hidesSelection) clearSelection();
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

      <GraphToolbar filters={filters} onToggleFilter={toggleFilter} onFit={fitGraph} onReset={resetGraph} />

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
          <p className="graph-onboarding">Scroll or pinch to zoom · select to inspect · double-click to focus</p>
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
          onClose={clearSelection}
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
