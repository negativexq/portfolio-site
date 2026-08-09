"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { NODE_TYPE_LABELS, STATUS_LABELS } from "@/lib/graph/graph-styles";
import type { EngineeringGraphData, EngineeringGraphNode } from "@/lib/graph/types";

const relationshipGroups = [
  { title: "Professional experience", types: ["experience", "capability", "person"] },
  { title: "Projects", types: ["project"] },
  { title: "Technologies", types: ["technology"] },
  { title: "Engineering concepts", types: ["concept", "domain"] },
  { title: "Evidence", types: ["evidence"] },
  { title: "Learning directions", types: ["learning", "roadmap"] },
] as const;

function actionLabel(node: EngineeringGraphNode) {
  if (node.type === "project" || node.projectSlug) return "Open project";
  if (node.type === "experience" || node.type === "capability") return "Open experience";
  if (node.type === "learning" || node.type === "roadmap") return "Open learning item";
  return "Open source page";
}

type GraphDetailPanelProps = {
  node: EngineeringGraphNode | null;
  data: EngineeringGraphData;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
};

export function GraphDetailPanel({ node, data, onClose, onSelectNode }: GraphDetailPanelProps) {
  const panelRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (node) panelRef.current?.focus({ preventScroll: true });
  }, [node]);

  if (!node) return null;

  const connections = data.edges
    .filter((edge) => edge.source === node.id || edge.target === node.id)
    .map((edge) => {
      const isOutgoing = edge.source === node.id;
      const connectedId = isOutgoing ? edge.target : edge.source;
      return {
        edge,
        relationship: isOutgoing ? edge.label : edge.inverseLabel,
        node: data.nodes.find((candidate) => candidate.id === connectedId),
      };
    })
    .filter((item): item is {
      edge: (typeof data.edges)[number];
      relationship: string;
      node: EngineeringGraphNode;
    } => Boolean(item.node));

  return (
    <aside ref={panelRef} className="graph-detail-panel" aria-label={`${node.label} details`} aria-live="polite" tabIndex={-1}>
      <button className="graph-detail-close" type="button" onClick={onClose} aria-label="Close node details">
        <X aria-hidden="true" size={16} />
      </button>
      <p className="detail-kicker">{NODE_TYPE_LABELS[node.type]}</p>
      <h2>{node.label}</h2>
      <span className={`status-badge status-${node.status}`}>{STATUS_LABELS[node.status]}</span>
      <p className="graph-detail-description">{node.description}</p>

      {node.metadata.category ? (
        <p className="graph-detail-category">{node.metadata.category}</p>
      ) : null}

      {node.metadata.role || node.metadata.period ? (
        <dl className="graph-detail-metadata">
          {node.metadata.role ? <div><dt>Role</dt><dd>{node.metadata.role}</dd></div> : null}
          {node.metadata.period ? <div><dt>Period</dt><dd>{node.metadata.period}</dd></div> : null}
        </dl>
      ) : null}

      {node.metadata.scope ? <p className="proof-scope">{node.metadata.scope}</p> : null}

      {node.metadata.qualifier ? (
        <div className="graph-detail-proof">
          <span>Context / qualifier</span>
          <p>{node.metadata.qualifier}</p>
        </div>
      ) : null}

      {node.type === "project" && node.metadata.keyTechnologies?.length ? (
        <div className="graph-detail-group">
          <h3>Key technologies</h3>
          <ul>{node.metadata.keyTechnologies.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}

      {node.type === "project" && node.metadata.keyConcepts?.length ? (
        <div className="graph-detail-group">
          <h3>Key concepts</h3>
          <ul>{node.metadata.keyConcepts.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      ) : null}

      {node.type === "project" && node.metadata.proofPoints?.length ? (
        <div className="graph-detail-group graph-detail-project-proof">
          <h3>Proof</h3>
          {node.metadata.proofPoints.map((proof) => (
            <div key={`${proof.label}-${proof.value}`}>
              <strong>{proof.value}</strong>
              <span>{proof.label}</span>
              {proof.scope ? <p className="proof-scope">{proof.scope}</p> : null}
              {proof.qualifier ? <p>{proof.qualifier}</p> : null}
            </div>
          ))}
        </div>
      ) : null}

      {node.type === "project" && node.metadata.roadmap?.length ? (
        <div className="graph-detail-group graph-detail-roadmap">
          <h3>Planned roadmap</h3>
          <ul>{node.metadata.roadmap.map((item) => <li key={item}>PLANNED · {item}</li>)}</ul>
        </div>
      ) : null}

      {node.type === "learning" ? (
        <dl className="graph-learning-context">
          <div><dt>Current foundation</dt><dd>{node.metadata.foundation}</dd></div>
          <div><dt>Intended direction</dt><dd>{node.metadata.direction}</dd></div>
        </dl>
      ) : null}

      {node.type === "roadmap" && node.metadata.connectedProject ? (
        <dl className="graph-learning-context">
          <div><dt>Connected project</dt><dd>{node.metadata.connectedProject}</dd></div>
          <div><dt>Rationale</dt><dd>{node.metadata.rationale ?? node.description}</dd></div>
        </dl>
      ) : null}

      {node.status === "learning" || node.status === "planned" ? (
        <p className="graph-status-disclaimer">
          {node.status === "learning"
            ? "Learning direction—not presented as implemented production experience."
            : "Planned direction—not part of the connected project's current stack."}
        </p>
      ) : null}

      {connections.length > 0 ? (
        <div className="graph-connections">
          <h3>Direct relationships</h3>
          {relationshipGroups.map((group) => {
            const groupedConnections = connections.filter(({ node: connectedNode }) => (
              (group.types as readonly string[]).includes(connectedNode.type)
            ));
            if (groupedConnections.length === 0) return null;
            return (
              <section className="graph-connection-group" key={group.title}>
                <h4>{group.title}</h4>
                <div>
                  {groupedConnections.map(({ edge, relationship, node: connectedNode }) => (
                    <button key={edge.id} type="button" onClick={() => onSelectNode(connectedNode.id)}>
                      <span>{relationship}</span>
                      <strong>{connectedNode.label}</strong>
                      <small>{NODE_TYPE_LABELS[connectedNode.type]}</small>
                    </button>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      ) : null}

      {node.href || node.metadata.githubUrl ? (
        <div className="graph-detail-actions">
          {node.href ? (
            <Link href={node.href}>
              {actionLabel(node)} <ArrowRight aria-hidden="true" size={14} />
            </Link>
          ) : null}
          {node.metadata.githubUrl ? (
            <a href={node.metadata.githubUrl} target="_blank" rel="noreferrer">
              GitHub <ArrowUpRight aria-hidden="true" size={14} />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
