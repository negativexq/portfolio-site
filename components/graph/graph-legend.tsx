export function GraphLegend() {
  return (
    <details className="graph-legend">
      <summary>Legend</summary>
      <div className="graph-legend-content">
        <div className="graph-legend-categories">
          <span><i className="graph-legend-node graph-legend-node-experience" /> Experience</span>
          <span><i className="graph-legend-node graph-legend-node-project" /> Project</span>
          <span><i className="graph-legend-node graph-legend-node-technology" /> Technology</span>
          <span><i className="graph-legend-node graph-legend-node-concept" /> Concept</span>
          <span><i className="graph-legend-node graph-legend-node-evidence" /> Evidence</span>
          <span><i className="graph-legend-node graph-legend-node-learning" /> Learning</span>
        </div>
        <div className="graph-legend-statuses">
          <span className="graph-legend-status is-current">Current / verified</span>
          <span className="graph-legend-status is-learning">Learning</span>
          <span className="graph-legend-status is-planned">Planned</span>
        </div>
        <p>Status is repeated in node labels and the detail panel—not communicated by color alone.</p>
      </div>
    </details>
  );
}
