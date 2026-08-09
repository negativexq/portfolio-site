import { Focus, RotateCcw } from "lucide-react";
import { GRAPH_FILTERS } from "@/lib/graph/graph-filters";
import type { GraphFilterGroup, GraphFilterState } from "@/lib/graph/types";

type GraphToolbarProps = {
  filters: GraphFilterState;
  onToggleFilter: (filter: GraphFilterGroup) => void;
  onOverview: () => void;
  onReset: () => void;
};

export function GraphToolbar({ filters, onToggleFilter, onOverview, onReset }: GraphToolbarProps) {
  return (
    <div className="graph-toolbar" aria-label="Graph controls">
      <div className="graph-filter-list" aria-label="Filter node types">
        {GRAPH_FILTERS.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-pressed={filters[filter.id]}
            onClick={() => onToggleFilter(filter.id)}
          >
            {filter.label}
            <span className="sr-only"> — {filters[filter.id] ? "shown" : "hidden"}</span>
          </button>
        ))}
      </div>
      <div className="graph-view-actions">
        <button type="button" onClick={onOverview} title="Back to full graph (F)">
          <Focus aria-hidden="true" size={14} /> Full graph
        </button>
        <button type="button" onClick={onReset}>
          <RotateCcw aria-hidden="true" size={14} /> Reset
        </button>
      </div>
    </div>
  );
}
