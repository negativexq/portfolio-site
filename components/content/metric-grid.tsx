import type { Metric } from "@/lib/content/types";

type MetricGridProps = {
  metrics: readonly Metric[];
};

export function MetricGrid({ metrics }: MetricGridProps) {
  return (
    <dl className="metric-grid">
      {metrics.map((metric) => (
        <div className="metric-item" key={metric.value}>
          <dt>
            <span className="metric-context">{metric.context}</span>
            <span className="metric-value">{metric.value}</span>
          </dt>
          <dd>{metric.label}</dd>
        </div>
      ))}
    </dl>
  );
}
