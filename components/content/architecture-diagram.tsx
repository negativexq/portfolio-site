const BOX_W = 150;
const BOX_H = 64;

const boxStyle = {
  fill: "var(--surface)",
  stroke: "var(--border-strong)",
  strokeWidth: 1,
};

const accentBoxStyle = {
  fill: "var(--surface-raised)",
  stroke: "var(--accent)",
  strokeWidth: 1.5,
};

const labelStyle = {
  fill: "var(--text)",
  fontFamily: "var(--mono)",
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: "0.02em",
};

const sublabelStyle = {
  fill: "var(--muted)",
  fontFamily: "var(--mono)",
  fontSize: 9,
  letterSpacing: "0.01em",
};

const captionStyle = {
  fill: "var(--subtle-strong)",
  fontFamily: "var(--mono)",
  fontSize: 9,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
};

function ArrowDefs() {
  return (
    <defs>
      <marker id="arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 z" fill="var(--border-strong)" />
      </marker>
      <marker id="arrow-dashed" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L8,4 L0,8 z" fill="var(--muted)" />
      </marker>
    </defs>
  );
}

function Box({
  x,
  y,
  title,
  subtitle,
  accent = false,
}: {
  x: number;
  y: number;
  title: string;
  subtitle?: string;
  accent?: boolean;
}) {
  return (
    <g>
      <rect x={x} y={y} width={BOX_W} height={BOX_H} style={accent ? accentBoxStyle : boxStyle} />
      <text x={x + BOX_W / 2} y={subtitle ? y + 26 : y + BOX_H / 2 + 4} textAnchor="middle" style={labelStyle}>
        {title}
      </text>
      {subtitle ? (
        <text x={x + BOX_W / 2} y={y + 42} textAnchor="middle" style={sublabelStyle}>
          {subtitle}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({
  x1,
  y1,
  x2,
  y2,
  dashed = false,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={dashed ? "var(--muted)" : "var(--border-strong)"}
      strokeWidth={1.25}
      strokeDasharray={dashed ? "4 3" : undefined}
      markerEnd={dashed ? "url(#arrow-dashed)" : "url(#arrow)"}
    />
  );
}

export function RealTimeCommerceDiagram() {
  const rowY = 30;
  const rowMidY = rowY + BOX_H / 2;
  const gap = 34;
  const x = (i: number) => 16 + i * (BOX_W + gap);

  const dlqX = x(2);
  const dlqY = 176;

  return (
    <svg viewBox="0 0 900 260" role="img" aria-label="Producer publishes to Kafka; a consumer group reads events, checks idempotency in Redis, writes with PostgreSQL in a single unit of work, then relays via the transactional outbox. Messages that exhaust bounded retries route to a dead letter queue instead of blocking the partition.">
      <ArrowDefs />

      <Box x={x(0)} y={rowY} title="Producer" subtitle="commerce events" />
      <Box x={x(1)} y={rowY} title="Kafka" subtitle="partitioned topic" />
      <Box x={x(2)} y={rowY} title="Consumer" subtitle="consumer group" />
      <Box x={x(3)} y={rowY} title="Redis / PostgreSQL" subtitle="idempotency · unit of work" />
      <Box x={x(4)} y={rowY} title="Outbox Relay" subtitle="publishes downstream" accent />

      <Arrow x1={x(0) + BOX_W} y1={rowMidY} x2={x(1)} y2={rowMidY} />
      <Arrow x1={x(1) + BOX_W} y1={rowMidY} x2={x(2)} y2={rowMidY} />
      <Arrow x1={x(2) + BOX_W} y1={rowMidY} x2={x(3)} y2={rowMidY} />
      <Arrow x1={x(3) + BOX_W} y1={rowMidY} x2={x(4)} y2={rowMidY} />

      <Arrow x1={dlqX + BOX_W / 2} y1={rowY + BOX_H} x2={dlqX + BOX_W / 2} y2={dlqY} dashed />
      <Box x={dlqX} y={dlqY} title="Dead Letter Queue" subtitle="bounded retry exhausted" />

      <text x={x(4) + BOX_W / 2} y={rowY + BOX_H + 30} textAnchor="middle" style={captionStyle}>
        republishes to downstream Kafka topic
      </text>
    </svg>
  );
}

export function KnowledgeBaseRagDiagram() {
  const topY = 26;
  const bottomY = 150;
  const gap = 28;
  const topX = (i: number) => 16 + i * (BOX_W + gap);
  const bottomX = (i: number) => topX(4) - i * (BOX_W + gap);
  const midTop = topY + BOX_H / 2;
  const midBottom = bottomY + BOX_H / 2;
  const hubX = topX(4);

  return (
    <svg viewBox="0 0 900 240" role="img" aria-label="Connectors sync sources, chunking and embedding index them into Qdrant. At query time, hybrid retrieval reads from Qdrant, a cross-encoder reranks results, the LLM generates a grounded answer, and citation validation checks it against the source before returning it.">
      <ArrowDefs />

      <Box x={topX(0)} y={topY} title="Connectors" subtitle="multi-source ingest" />
      <Box x={topX(1)} y={topY} title="Sync" subtitle="incremental, source-aware" />
      <Box x={topX(2)} y={topY} title="Chunk" subtitle="segment source docs" />
      <Box x={topX(3)} y={topY} title="Embedding" subtitle="dense vector encode" />
      <Box x={topX(4)} y={topY} title="Qdrant" subtitle="hybrid index" accent />

      <Arrow x1={topX(0) + BOX_W} y1={midTop} x2={topX(1)} y2={midTop} />
      <Arrow x1={topX(1) + BOX_W} y1={midTop} x2={topX(2)} y2={midTop} />
      <Arrow x1={topX(2) + BOX_W} y1={midTop} x2={topX(3)} y2={midTop} />
      <Arrow x1={topX(3) + BOX_W} y1={midTop} x2={topX(4)} y2={midTop} />

      <Arrow x1={hubX + BOX_W / 2} y1={topY + BOX_H} x2={hubX + BOX_W / 2} y2={bottomY} />

      <Box x={bottomX(0)} y={bottomY} title="Hybrid Retrieval" subtitle="dense + sparse, RRF fusion" />
      <Box x={bottomX(1)} y={bottomY} title="Reranker" subtitle="cross-encoder" />
      <Box x={bottomX(2)} y={bottomY} title="LLM" subtitle="grounded generation" />
      <Box x={bottomX(3)} y={bottomY} title="Citation Validation" subtitle="source integrity check" accent />

      <Arrow x1={bottomX(0)} y1={midBottom} x2={bottomX(1) + BOX_W} y2={midBottom} />
      <Arrow x1={bottomX(1)} y1={midBottom} x2={bottomX(2) + BOX_W} y2={midBottom} />
      <Arrow x1={bottomX(2)} y1={midBottom} x2={bottomX(3) + BOX_W} y2={midBottom} />

      <text x={bottomX(0) + BOX_W / 2} y={bottomY - 10} textAnchor="middle" style={captionStyle}>
        user query
      </text>
    </svg>
  );
}
