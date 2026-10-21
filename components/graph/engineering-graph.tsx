"use client";

import Graph from "graphology";
import Sigma from "sigma";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Minus, Plus, Scan } from "lucide-react";
import type { NodeLabelDrawingFunction, EdgeLabelDrawingFunction } from "sigma/rendering";
import type { EngineeringGraphData, GraphAreaId, SigmaEdgeAttributes, SigmaNodeAttributes } from "@/lib/graph/types";
import { getAreaNodeIds, getFocusedGraph, getOverviewGraph } from "@/lib/graph/graph-view";
import { GRAPH_AREAS, getRelationshipVisual } from "@/lib/graph/graph-presentation";
import { GraphDetailPanel } from "./graph-detail-panel";

gsap.registerPlugin(useGSAP);

const projectColors: Record<string, string> = {
  "project:ml-platform-infrastructure": "#b6c99a",
  "project:modelops-control-plane": "#b6c99a",
  "project:agentic-sre": "#9abfc7",
  "project:agentic-customer-service-platform": "#9abfc7",
  "project:knowledge-base-rag": "#c8b5d9",
  "project:decision-sql": "#c8b5d9",
  "project:real-time-commerce-platform": "#dab992",
};

// Centered, bounded labels keep text attached to its node. Space is reserved
// for two lines rather than moving titles around a dense canvas after drawing.
const drawLabel: NodeLabelDrawingFunction<SigmaNodeAttributes, SigmaEdgeAttributes> = (context, node, settings) => {
  if (!node.label) return;
  const isProject = node.nodeType === "project" || node.nodeType === "person";
  const canvasWidth = context.canvas.width / context.getTransform().a;
  const fontSize = isProject ? 13 : canvasWidth < 540 ? 11 : 12;
  context.font = `${isProject ? 600 : 500} ${fontSize}px ${settings.labelFont}`;
  const maxWidth = canvasWidth < 540 ? (isProject ? 128 : 110) : 158;
  const words = node.label.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) { lines.push(line); line = word; }
    else line = next;
  }
  if (line) lines.push(line);
  context.save();
  context.textAlign = "center";
  context.textBaseline = "top";
  const y = node.y + node.size + 10;
  const widestLine = Math.max(...lines.map((line) => context.measureText(line).width));
  const labelX = Math.max(widestLine / 2 + 8, Math.min(canvasWidth - widestLine / 2 - 8, node.x));
  lines.forEach((text, index) => {
    const width = context.measureText(text).width;
    context.fillStyle = "#111411";
    context.fillRect(labelX - width / 2 - 4, y + index * 17 - 2, width + 8, 17);
    context.fillStyle = node.labelColor ?? (isProject ? "#f0f0e8" : "#c5cec1");
    context.fillText(text, labelX, y + index * 17);
  });
  context.restore();
};

const drawEdgeLabel: EdgeLabelDrawingFunction<SigmaNodeAttributes, SigmaEdgeAttributes> = (context, edge, source, target, settings) => {
  if (!edge.label) return;
  context.save();
  context.font = `600 11px ${settings.labelFont}`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  const width = context.measureText(edge.label).width + 16;
  const x = (source.x + target.x) / 2;
  const y = (source.y + target.y) / 2 - 12;
  context.fillStyle = "#111411";
  context.fillRect(x - width / 2, y - 10, width, 20);
  context.fillStyle = edge.color;
  context.fillText(edge.label, x, y);
  context.restore();
};

export default function EngineeringGraph({ data }: { data: EngineeringGraphData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const previousPositionsRef = useRef(new Map<string, { x: number; y: number }>());
  const areaNodeIdsRef = useRef<Set<string> | null>(null);
  const selectedEdgeRef = useRef<string | null>(null);
  const hoveredEdgeRef = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const projectButtonsRef = useRef(new Map<string, HTMLButtonElement>());
  const activeProjectRef = useRef<string | null>(null);
  const rendererRef = useRef<Sigma<SigmaNodeAttributes, SigmaEdgeAttributes> | null>(null);
  const inspectedRef = useRef<string | null>(null);
  const hoveredRef = useRef<string | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [area, setArea] = useState<GraphAreaId | "all">("all");
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [narrow, setNarrow] = useState(false);
  const [error, setError] = useState(false);
  const nodeById = useMemo(() => new Map(data.nodes.map((node) => [node.id, node])), [data.nodes]);
  const projects = useMemo(() => data.nodes.filter((node) => node.type === "project"), [data.nodes]);
  const activeProject = activeProjectId ? nodeById.get(activeProjectId) : null;
  const inspectedNode = inspectedId ? nodeById.get(inspectedId) ?? null : null;
  const filteredProjects = projects.filter((node) => `${node.label} ${node.metadata.category}`.toLowerCase().includes(query.toLowerCase()));

  const selectNode = useCallback((id: string) => {
    const node = nodeById.get(id);
    if (!node) return;
    setSelectedEdgeId(null);
    setArea("all");
    if (node.type === "project") {
      activeProjectRef.current = id;
      setActiveProjectId(id);
    }
    if (node.type === "person") {
      activeProjectRef.current = null;
      setActiveProjectId(null);
    }
    setInspectedId(id);
  }, [nodeById]);
  const overview = useCallback((restoreFocus = true) => {
    const previousProject = activeProjectRef.current;
    activeProjectRef.current = null;
    setActiveProjectId(null);
    setInspectedId(null);
    setSelectedEdgeId(null);
    setArea("all");
    if (!restoreFocus) return;
    window.requestAnimationFrame(() => {
      if (activeProjectRef.current) return;
      const returnTarget = previousProject ? projectButtonsRef.current.get(previousProject) : null;
      (returnTarget ?? searchRef.current)?.focus({ preventScroll: true });
    });
  }, []);

  const visibleData = useMemo(() => activeProjectId
    ? getFocusedGraph(data, activeProjectId)
    : getOverviewGraph(data), [activeProjectId, data]);

  const selectedEdge = visibleData.edges.find((edge) => edge.id === selectedEdgeId);
  const highlightedIds = useMemo(() => area === "all" ? null : getAreaNodeIds(data, area), [area, data]);
  useEffect(() => {
    areaNodeIdsRef.current = highlightedIds;
    selectedEdgeRef.current = selectedEdgeId;
    rendererRef.current?.refresh();
  }, [highlightedIds, selectedEdgeId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => setNarrow(entry.contentRect.width < 540));
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    inspectedRef.current = inspectedId;
    rendererRef.current?.refresh();
  }, [inspectedId]);

  useGSAP(() => {
    const container = containerRef.current;
    if (!container) return;
    const graph = new Graph<SigmaNodeAttributes, SigmaEdgeAttributes>({ type: "directed", multi: true });
    const neighbors = visibleData.nodes.filter((node) => node.id !== activeProjectId);
    for (const node of visibleData.nodes) {
      let position = { x: node.x, y: node.y };
      if (activeProjectId) {
        if (node.id === activeProjectId) position = narrow ? { x: 0, y: 6 } : { x: 0, y: 0 };
        else {
          const slot = neighbors.findIndex((neighbor) => neighbor.id === node.id);
          if (narrow) position = { x: slot % 2 === 0 ? -3.4 : 3.4, y: 2.5 - Math.floor(slot / 2) * 3.8 };
          else {
            const angle = (slot / neighbors.length) * Math.PI * 2 + Math.PI / 6;
            position = { x: Math.cos(angle) * 6.7, y: Math.sin(angle) * 5.4 };
          }
        }
      } else if (narrow) {
        const overviewPositions: Record<string, { x: number; y: number }> = {
          "person:omer-faruk-koc": { x: 0, y: 0 },
          "project:ml-platform-infrastructure": { x: -9, y: 12 },
          "project:agentic-sre": { x: 9, y: 12 },
          "project:modelops-control-plane": { x: -9, y: 2 },
          "project:agentic-customer-service-platform": { x: 9, y: 2 },
          "project:real-time-commerce-platform": { x: -9, y: -9 },
          "project:decision-sql": { x: 9, y: -9 },
          "project:knowledge-base-rag": { x: 0, y: -16 },
          "technology:kubernetes": { x: -3, y: 10 },
          "technology:langgraph": { x: 9, y: 7 },
          "technology:opentelemetry": { x: 0, y: 5 },
          "technology:postgresql": { x: -9, y: -3 },
          "technology:fastapi": { x: 9, y: -3 },
          "technology:qdrant": { x: 0, y: -11 },
          "technology:go": { x: -9, y: 17 },
          "technology:mlflow": { x: 1, y: 17 },
          "technology:prometheus": { x: -2, y: -6 },
          "technology:kafka": { x: -9, y: -14 },
        };
        position = overviewPositions[node.id] ?? position;
      }
      graph.addNode(node.id, {
        ...position,
        label: node.canvasLabel,
        size: node.type === "person" ? 20 : node.type === "project" ? 13 : node.type === "technology" ? 7 : 4.5,
        color: node.type === "person" ? "#d2e7ae" : projectColors[node.id] ?? (node.type === "technology" ? "#a3b39c" : "#a59ab3"),
        type: "circle", forceLabel: true, zIndex: node.type === "person" ? 5 : node.type === "project" ? 3 : 1,
        nodeType: node.type, status: node.status, importance: node.importance,
      });
    }
    for (const edge of visibleData.edges) {
      const visual = getRelationshipVisual(edge.type);
      graph.addDirectedEdgeWithKey(edge.id, edge.source, edge.target, {
        color: visual.color, size: visual.size,
        type: visual.directed ? "arrow" : "line", label: visual.label, edgeType: edge.type,
      });
    }
    try {
      const renderer = new Sigma(graph, container, {
        renderEdgeLabels: true,
        enableEdgeEvents: true,
        defaultDrawEdgeLabel: drawEdgeLabel,
        defaultDrawNodeLabel: drawLabel,
        defaultDrawNodeHover: (context, node, settings) => {
          context.beginPath();
          context.arc(node.x, node.y, node.size + 5, 0, Math.PI * 2);
          context.strokeStyle = "#e0e9d9";
          context.lineWidth = 1.5;
          context.stroke();
          drawLabel(context, node, settings);
        },
        labelFont: getComputedStyle(container).fontFamily, labelSize: 13, labelWeight: "600",
        labelColor: { color: "#f0f0e8" }, labelDensity: 1, labelGridCellSize: 1,
        stagePadding: narrow ? (activeProjectId ? 90 : 40) : 95,
        minCameraRatio: 0.45, maxCameraRatio: 1.8,
        zIndex: true,
        nodeReducer: (id, attributes) => {
          const active = inspectedRef.current;
          const isTechnologyFocus = active && graph.hasNode(active) && graph.getNodeAttribute(active, "nodeType") === "technology";
          const isContext = isTechnologyFocus && id !== active && id !== hoveredRef.current && !graph.areNeighbors(id, active);
          const isAreaMember = (!areaNodeIdsRef.current || areaNodeIdsRef.current.has(id)) && !isContext;
          return {
            ...attributes,
            label: isContext ? "" : attributes.label,
            forceLabel: !isContext,
            color: isAreaMember ? attributes.color : "#354039",
            labelColor: isAreaMember ? (attributes.nodeType === "technology" || attributes.nodeType === "concept" ? "#c5cec1" : "#f0f0e8") : "#7c877d",
            highlighted: id === hoveredRef.current || id === inspectedRef.current,
            size: attributes.size + (id === inspectedRef.current ? 3 : 0),
          };
        },
        edgeReducer: (id, attributes) => {
          const source = graph.source(id);
          const target = graph.target(id);
          const activeNode = hoveredRef.current ?? inspectedRef.current;
          const activeEdge = hoveredEdgeRef.current ?? selectedEdgeRef.current;
          const connected = (activeNode && (source === activeNode || target === activeNode)) || id === activeEdge;
          const inArea = !areaNodeIdsRef.current || (areaNodeIdsRef.current.has(source) && areaNodeIdsRef.current.has(target));
          const muted = id !== activeEdge && (!inArea || ((activeNode || activeEdge) && !connected));
          return {
            ...attributes,
            color: muted ? "#303b32" : attributes.color,
            size: connected ? 2.4 : muted ? 0.6 : attributes.size,
            label: id === activeEdge ? attributes.label : "",
            forceLabel: id === activeEdge,
          };
        },
      });
      rendererRef.current = renderer;
      const targets = new Map(graph.nodes().map((id) => [id, { x: graph.getNodeAttribute(id, "x"), y: graph.getNodeAttribute(id, "y") }]));
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      container.dataset.layoutMotion = "idle";
      if (previousPositionsRef.current.size && !reducedMotion) {
        container.dataset.layoutMotion = "running";
        const points = [...targets.values()];
        renderer.setCustomBBox({ x: [Math.min(...points.map((p) => p.x)), Math.max(...points.map((p) => p.x))], y: [Math.min(...points.map((p) => p.y)), Math.max(...points.map((p) => p.y))] });
        const starts = new Map<string, { x: number; y: number }>();
        const origin = targets.get(activeProjectId ?? "person:omer-faruk-koc") ?? { x: 0, y: 0 };
        for (const id of graph.nodes()) {
          const previous = previousPositionsRef.current.get(id);
          starts.set(id, previous ? renderer.viewportToGraph(previous) : origin);
        }
        const progress = { value: 0 };
        const applyPositions = () => {
          for (const [id, target] of targets) {
            const start = starts.get(id)!;
            graph.mergeNodeAttributes(id, { x: start.x + (target.x - start.x) * progress.value, y: start.y + (target.y - start.y) * progress.value });
          }
          renderer.refresh();
        };
        applyPositions();
        gsap.to(progress, { value: 1, duration: 0.65, ease: "expo.out", onUpdate: applyPositions, onComplete: () => { renderer.setCustomBBox(null); container.dataset.layoutMotion = "idle"; } });
      }
      renderer.on("clickEdge", ({ edge }) => setSelectedEdgeId(edge));
      renderer.on("enterEdge", ({ edge }) => { hoveredEdgeRef.current = edge; renderer.refresh(); });
      renderer.on("leaveEdge", () => { hoveredEdgeRef.current = null; renderer.refresh(); });
      renderer.on("clickNode", ({ node }) => selectNode(node));
      renderer.on("enterNode", ({ node }) => {
        hoveredRef.current = node;
        container.style.cursor = "pointer";
        renderer.refresh();
      });
      renderer.on("leaveNode", () => {
        hoveredRef.current = null;
        container.style.cursor = "grab";
        renderer.refresh();
      });
      return () => {
        container.dataset.layoutMotion = "idle";
        previousPositionsRef.current = new Map(graph.nodes().map((id) => [id, renderer.graphToViewport({ x: graph.getNodeAttribute(id, "x"), y: graph.getNodeAttribute(id, "y") })]));
        hoveredRef.current = null;
        hoveredEdgeRef.current = null;
        rendererRef.current = null;
        renderer.kill();
      };
    } catch {
      queueMicrotask(() => setError(true));
    }
  }, { scope: rootRef, dependencies: [visibleData, activeProjectId, narrow, selectNode], revertOnUpdate: true });

  useGSAP(() => {
    const renderer = rendererRef.current;
    if (!renderer || activeProjectId) return;
    const camera = renderer.getCamera();
    const point = inspectedNode?.type === "technology" ? renderer.getNodeDisplayData(inspectedNode.id) : null;
    const state = { ...camera.getState() };
    const target = point ? { x: point.x, y: point.y, ratio: 0.92 } : { x: 0.5, y: 0.5, ratio: 1 };
    const container = containerRef.current!;
    container.dataset.cameraMotion = "idle";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) camera.setState(target);
    else {
      container.dataset.cameraMotion = "running";
      gsap.to(state, { ...target, duration: 0.55, ease: "expo.out", onUpdate: () => camera.setState(state), onComplete: () => { container.dataset.cameraMotion = "idle"; } });
    }
    return () => { container.dataset.cameraMotion = "idle"; };
  }, { scope: rootRef, dependencies: [inspectedId, activeProjectId], revertOnUpdate: true });

  useEffect(() => {
    const requested = new URL(window.location.href).searchParams.get("node");
    if (requested) {
      const match = data.nodes.find((node) => node.type === "project" && (node.id === requested || node.id.endsWith(`:${requested}`)));
      if (match) queueMicrotask(() => selectNode(match.id));
    }
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") overview(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [data.nodes, overview, selectNode]);

  const zoom = (factor: number) => {
    const renderer = rendererRef.current;
    if (!renderer) return;
    const camera = renderer.getCamera();
    const ratio = Math.max(0.45, Math.min(1.8, camera.getState().ratio * factor));
    camera.animate({ ratio }, { duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 180 });
  };

  return (
    <div ref={rootRef} className="engineering-graph graph-atlas">
      <div className="atlas-topbar">
        <div>
          {activeProject ? <button type="button" className="atlas-back" onClick={() => overview()}><ArrowLeft size={15} aria-hidden="true" /> All projects</button> : <strong>Engineering graph</strong>}
          <span>{activeProject ? activeProject.canvasLabel : `${projects.length} projects · ${visibleData.nodes.filter((node) => node.metadata.overview && node.type === "technology").length} technologies`}</span>
        </div>
        <div className="atlas-key" aria-label="Node types">
          <span><i className="atlas-key-person" /> Me</span>
          <span><i className="atlas-key-project" /> Project</span>
          <span><i className="atlas-key-technology" /> Technology</span>
          <span><i className="atlas-key-concept" /> Concept</span>
        </div>
      </div>
      <div className="atlas-exploration-tools">
        <nav className="atlas-areas" aria-label="Highlight engineering areas">
          <button type="button" aria-pressed={area === "all"} onClick={() => { overview(false); }}>All areas</button>
          {GRAPH_AREAS.map((item) => <button type="button" key={item.id} aria-pressed={area === item.id} onClick={() => { overview(false); setArea(item.id); }}>{item.label}</button>)}
        </nav>
        <div className="atlas-edge-key" aria-label="Relationship types">
          {["built", "uses", "related-to", ...(activeProjectId ? ["implements"] : [])].map((type) => {
            const visual = getRelationshipVisual(type as "built" | "uses" | "related-to" | "implements");
            return <span key={type}><i style={{ background: visual.color }} />{visual.label}{visual.directed ? " →" : ""}</span>;
          })}
        </div>
      </div>
      {area !== "all" ? <p className="atlas-area-status" role="status">{GRAPH_AREAS.find((item) => item.id === area)?.label}: {projects.filter((node) => node.metadata.areas?.includes(area)).length} {projects.filter((node) => node.metadata.areas?.includes(area)).length === 1 ? "project" : "projects"} highlighted. Other areas remain visible.</p> : null}
      <div className={`atlas-workspace${!activeProjectId ? " is-overview" : ""}${inspectedNode ? " has-selection" : ""}`}>
        <div className="atlas-stage">
          <div ref={containerRef} className="atlas-canvas" data-layout-motion="idle" data-camera-motion="idle" role="img" aria-label={activeProject ? `${activeProject.label} with ${visibleData.nodes.length - 1} key technologies and concepts. Use the project selector or relationships panel for keyboard access.` : "Ömer Faruk Koç connected to seven core projects, with ten technology nodes linking and defining the work. Use the project selector below for keyboard access."} />
          <div className="atlas-stage-caption">
            {selectedEdge ? <div className="atlas-relationship" role="status"><strong>{nodeById.get(selectedEdge.source)?.canvasLabel}</strong><span>{getRelationshipVisual(selectedEdge.type).label} {getRelationshipVisual(selectedEdge.type).directed ? "→" : "↔"} {nodeById.get(selectedEdge.target)?.canvasLabel}</span></div> : <>
            <strong>{activeProject ? "One system, up close." : "My engineering network."}</strong>
            <span>{activeProject ? "Select a foundation to inspect its relationships." : "Shared technologies connect the projects. Select a node or connection to explore."}</span>
            </>}
          </div>
          <div className="atlas-camera" aria-label="Graph camera controls">
            <button type="button" aria-label="Zoom in" onClick={() => zoom(0.8)}><Plus size={16} /></button>
            <button type="button" aria-label="Zoom out" onClick={() => zoom(1.25)}><Minus size={16} /></button>
            <button type="button" aria-label="Fit graph" onClick={() => rendererRef.current?.getCamera().setState({ x: 0.5, y: 0.5, ratio: 1, angle: 0 })}><Scan size={16} /></button>
          </div>
          {error ? <div className="graph-fallback" role="alert"><strong>The graph could not load.</strong><p>Select a project below to read its foundations and evidence.</p></div> : null}
        </div>
        <GraphDetailPanel node={inspectedNode} data={data} onClose={overview} onSelectNode={selectNode} />
      </div>
      <div className="atlas-project-selector">
        <label className="atlas-search"><span className="sr-only">Find a core project</span><input ref={searchRef} type="search" placeholder="Find a project…" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        <nav aria-label="Engineering network">
          {!query ? <button type="button" aria-pressed={inspectedNode?.type === "person"} onClick={() => selectNode("person:omer-faruk-koc")}><i style={{ background: "#d2e7ae" }} />Ömer Faruk Koç</button> : null}
          {filteredProjects.map((node) => <button type="button" key={node.id} ref={(button) => { if (button) projectButtonsRef.current.set(node.id, button); else projectButtonsRef.current.delete(node.id); }} aria-pressed={activeProjectId === node.id} onClick={() => selectNode(node.id)}><i style={{ background: projectColors[node.id] }} />{node.canvasLabel}</button>)}
          {filteredProjects.length === 0 ? <p>No matching projects.</p> : null}
        </nav>
      </div>
      {!activeProjectId ? <nav className="atlas-foundations" aria-label="Engineering technologies">
        <span>Key technologies</span>
        {data.nodes.filter((node) => node.type === "technology" && node.metadata.overview).map((node) => <button type="button" key={node.id} aria-pressed={inspectedId === node.id} onClick={() => selectNode(node.id)}>{node.label}</button>)}
      </nav> : null}
      <p className="atlas-footnote">{activeProject ? `${visibleData.nodes.length - 1} selected foundations · evidence in the details panel` : "Built: my work · Uses: documented technology · Related: documented project relationship."} <span>Drag to pan · scroll to zoom · Esc for overview</span></p>
      <p className="sr-only" aria-live="polite">{inspectedNode ? `${inspectedNode.label} selected.` : "Ömer Faruk Koç at the center, connected to seven core projects and eleven technologies."}</p>
    </div>
  );
}
