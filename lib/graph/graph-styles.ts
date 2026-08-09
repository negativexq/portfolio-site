import type { NodeHoverDrawingFunction, NodeLabelDrawingFunction } from "sigma/rendering";
import type {
  GraphEdgeType,
  GraphNodeType,
  GraphStatus,
  SigmaEdgeAttributes,
  SigmaNodeAttributes,
} from "./types";

export const NODE_TYPE_LABELS: Record<GraphNodeType, string> = {
  person: "Person",
  experience: "Professional experience",
  capability: "Platform capability",
  project: "Public project",
  technology: "Technology",
  domain: "Engineering domain",
  concept: "Engineering concept",
  evidence: "Evidence",
  learning: "Learning direction",
  roadmap: "Planned direction",
};

export const STATUS_LABELS: Record<GraphStatus, string> = {
  current: "Current",
  verified: "Verified",
  learning: "Learning",
  planned: "Planned",
};

const nodeColors: Record<GraphNodeType, string> = {
  person: "#2f4325",
  experience: "#72856f",
  capability: "#61745f",
  project: "#789071",
  technology: "#647068",
  domain: "#78925f",
  concept: "#4f5c52",
  evidence: "#6e795d",
  learning: "#777f6d",
  roadmap: "#565e56",
};

const nodeSizes: Record<GraphNodeType, number> = {
  person: 18,
  experience: 14,
  capability: 8,
  project: 12,
  technology: 5.5,
  domain: 9,
  concept: 4.8,
  evidence: 6,
  learning: 7,
  roadmap: 6.5,
};

export const SELECTED_NODE_COLOR = "#2b3d22";
export const DIMMED_NODE_COLOR = "#29302a";
export const FILTER_CONTEXT_NODE_COLOR = "#313832";
export const DIMMED_EDGE_COLOR = "#1d221e";
export const PROJECT_CONTEXT_NODE_COLOR = "#242a24";
export const PROJECT_CONTEXT_EDGE_COLOR = "#151916";

export function getNodeVisual(
  type: GraphNodeType,
  status: GraphStatus,
  importance: number,
) {
  const statusColor = status === "planned" ? nodeColors.roadmap : nodeColors[type];
  const isPersistentAnchor = type === "person"
    || type === "experience"
    || type === "project"
    || type === "domain";

  return {
    color: statusColor,
    size: nodeSizes[type] + importance * 0.62,
    forceLabel: isPersistentAnchor,
    zIndex: importance,
  };
}

export function getEdgeVisual(type: GraphEdgeType): SigmaEdgeAttributes {
  const base: SigmaEdgeAttributes = {
    color: "#303731",
    size: 0.78,
    type: "line",
    label: "",
    edgeType: type,
  };

  if (type === "evolved-into") {
    return { ...base, color: "#8dbb56", size: 2.5, type: "arrow" };
  }

  if (type === "learning-direction") {
    return { ...base, color: "#65705e", size: 1.25, type: "arrow", status: "learning" };
  }

  if (type === "planned-for") {
    return { ...base, color: "#505950", size: 1.15, type: "arrow", status: "planned" };
  }

  if (type === "worked-at" || type === "built" || type === "part-of") {
    return { ...base, color: "#607258", size: 1.35, type: "arrow" };
  }

  if (type === "evidence-for") {
    return { ...base, color: "#6f7d55", size: 1.2, type: "arrow" };
  }

  if (type === "built-on") {
    return { ...base, color: "#59665a", size: 1.05, type: "arrow" };
  }

  return base;
}

/**
 * Draws a node label at its de-collided screen offset (if any) instead of
 * sigma's default fixed anchor point, with a thin leader line back to the
 * node so the displacement stays legible. `getLabelOffset` is a stable
 * getter (backed by a ref) rather than a closed-over value, since sigma
 * calls this function every label-layer repaint.
 */
export function createGraphNodeLabelDrawer(
  getLabelOffset: (nodeId: string) => { x: number; y: number } | undefined,
): NodeLabelDrawingFunction<SigmaNodeAttributes, SigmaEdgeAttributes> {
  return (context, data, settings) => {
    if (!data.label) return;
    const size = settings.labelSize;
    const font = settings.labelFont;
    const weight = settings.labelWeight;
    const color = (settings.labelColor.attribute
      ? (data as Record<string, unknown>)[settings.labelColor.attribute] as string ?? settings.labelColor.color
      : settings.labelColor.color) ?? "#000";

    const offset = getLabelOffset(data.key as string);
    const baseX = data.x + data.size + 3;
    const baseY = data.y + size / 3;
    const labelX = baseX + (offset?.x ?? 0);
    const labelY = baseY + (offset?.y ?? 0);

    if (offset && (Math.abs(offset.x) > 0.5 || Math.abs(offset.y) > 0.5)) {
      context.save();
      context.strokeStyle = "rgba(208, 212, 204, 0.32)";
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(data.x + data.size + 1, data.y);
      context.lineTo(labelX - 2, labelY - size * 0.32);
      context.stroke();
      context.restore();
    }

    context.fillStyle = color;
    context.font = `${weight} ${size}px ${font}`;
    context.fillText(data.label, labelX, labelY);
  };
}

export const drawGraphNodeHover: NodeHoverDrawingFunction<SigmaNodeAttributes, SigmaEdgeAttributes> = (
  context,
  data,
  settings,
) => {
  context.save();
  context.beginPath();
  context.arc(data.x, data.y, data.size + 4, 0, Math.PI * 2);
  context.fillStyle = "#1d2719";
  context.fill();
  context.strokeStyle = "#a3d65a";
  context.lineWidth = 2;
  context.stroke();

  if (data.label) {
    const fontSize = settings.labelSize;
    context.font = `${settings.labelWeight} ${fontSize}px ${settings.labelFont}`;
    const textWidth = context.measureText(data.label).width;
    const labelX = data.x + data.size + 9;
    const labelY = data.y - fontSize / 2 - 5;
    context.fillStyle = "#151815";
    context.fillRect(labelX - 5, labelY, textWidth + 10, fontSize + 10);
    context.strokeStyle = "#66795a";
    context.lineWidth = 1;
    context.strokeRect(labelX - 5, labelY, textWidth + 10, fontSize + 10);
    context.fillStyle = "#f0f0e8";
    context.fillText(data.label, labelX, data.y + fontSize / 3);
  }
  context.restore();
};
