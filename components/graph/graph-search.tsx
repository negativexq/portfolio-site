import { Search } from "lucide-react";
import type { RefObject } from "react";
import type { EngineeringGraphNode } from "@/lib/graph/types";
import { NODE_TYPE_LABELS } from "@/lib/graph/graph-styles";

type GraphSearchProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  query: string;
  results: readonly EngineeringGraphNode[];
  activeIndex: number;
  onQueryChange: (value: string) => void;
  onActiveIndexChange: (index: number) => void;
  onSelect: (nodeId: string) => void;
};

export function GraphSearch({
  inputRef,
  query,
  results,
  activeIndex,
  onQueryChange,
  onActiveIndexChange,
  onSelect,
}: GraphSearchProps) {
  const isOpen = query.trim().length > 0;

  return (
    <div className="graph-search">
      <label htmlFor="graph-search-input">Search graph</label>
      <div className="graph-search-input-wrap">
        <Search aria-hidden="true" size={15} />
        <input
          ref={inputRef}
          id="graph-search-input"
          type="search"
          role="combobox"
          value={query}
          placeholder="Project, technology, concept…"
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls="graph-search-results"
          aria-expanded={isOpen}
          aria-activedescendant={results[activeIndex] ? `graph-result-${results[activeIndex].id}` : undefined}
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown" && results.length > 0) {
              event.preventDefault();
              onActiveIndexChange((activeIndex + 1) % results.length);
            } else if (event.key === "ArrowUp" && results.length > 0) {
              event.preventDefault();
              onActiveIndexChange((activeIndex - 1 + results.length) % results.length);
            } else if (event.key === "Enter" && results[activeIndex]) {
              event.preventDefault();
              onSelect(results[activeIndex].id);
            } else if (event.key === "Escape") {
              onQueryChange("");
            }
          }}
        />
        <kbd aria-label="Keyboard shortcut: slash">/</kbd>
      </div>

      {isOpen ? (
        <div className="graph-search-results" id="graph-search-results" role="listbox">
          {results.length > 0 ? (
            results.map((node, index) => (
              <button
                id={`graph-result-${node.id}`}
                key={node.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "is-active" : undefined}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => onSelect(node.id)}
              >
                <span>{node.label}</span>
                <small>{NODE_TYPE_LABELS[node.type]}</small>
              </button>
            ))
          ) : (
            <p>No matching node. Try “Kafka”, “RAG”, “Repo Context” or “LangGraph”.</p>
          )}
        </div>
      ) : null}
    </div>
  );
}
