export function GraphLegend() {
  return (
    <details className="graph-legend">
      <summary>Legend</summary>
      <div className="graph-legend-content">
        <div>
          <span className="graph-legend-node graph-legend-node-person" /> Project / experience
          <span className="graph-legend-node graph-legend-node-small" /> Technology / concept
          <span className="graph-legend-node graph-legend-node-domain" /> Learning / roadmap
        </div>
        <div>
          <span className="graph-legend-status is-current">Current / verified</span>
          <span className="graph-legend-status is-learning">Learning</span>
          <span className="graph-legend-status is-planned">Planned</span>
        </div>
        <p>Status is repeated in node labels and the detail panel—not communicated by color alone.</p>
      </div>
    </details>
  );
}
