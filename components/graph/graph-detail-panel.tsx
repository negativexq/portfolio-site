import Link from "next/link";
import { ArrowRight, ArrowUpRight, X } from "lucide-react";
import { NODE_TYPE_LABELS, STATUS_LABELS } from "@/lib/graph/graph-styles";
import type { EngineeringGraphData, EngineeringGraphNode } from "@/lib/graph/types";

type GraphDetailPanelProps = {
  node: EngineeringGraphNode | null;
  data: EngineeringGraphData;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
};

export function GraphDetailPanel({ node, data, onClose, onSelectNode }: GraphDetailPanelProps) {
  if (!node) {
    return (
      <aside className="graph-detail-panel graph-detail-empty" aria-label="Selected node details">
        <p className="detail-kicker">Explore the graph</p>
        <h2>Select a node</h2>
        <p>Inspect its evidence, current relationships, learning paths and planned extensions.</p>
        <ul>
          <li>Click or tap a node</li>
          <li>Search by name or concept</li>
          <li>Use <kbd>/</kbd> to focus search</li>
        </ul>
      </aside>
    );
  }

  const connections = data.edges
    .filter((edge) => edge.source === node.id || edge.target === node.id)
    .map((edge) => {
      const connectedId = edge.source === node.id ? edge.target : edge.source;
      return { edge, node: data.nodes.find((candidate) => candidate.id === connectedId) };
    })
    .filter((item): item is { edge: (typeof data.edges)[number]; node: EngineeringGraphNode } => Boolean(item.node));
  const connectedProjects = connections.filter((item) => item.node.type === "project");
  const connectionHeading = node.type === "technology" || node.type === "concept"
    ? "Connected projects"
    : "Connected relationships";

  return (
    <aside className="graph-detail-panel" aria-label={`${node.label} details`} aria-live="polite">
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
          <h3>{connectionHeading}</h3>
          <div>
            {(connectedProjects.length > 0 ? connectedProjects : connections).slice(0, 12).map(({ edge, node: connectedNode }) => (
              <button key={edge.id} type="button" onClick={() => onSelectNode(connectedNode.id)}>
                <span>{edge.label}</span>
                <strong>{connectedNode.label}</strong>
                <small>{NODE_TYPE_LABELS[connectedNode.type]}</small>
              </button>
            ))}
          </div>
          {connections.length > 12 ? <p>Showing the highest-signal direct relationships.</p> : null}
        </div>
      ) : null}

      {node.projectSlug ? (
        <div className="graph-detail-actions">
          <Link href={`/projects/${node.projectSlug}`}>
            View project <ArrowRight aria-hidden="true" size={14} />
          </Link>
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
