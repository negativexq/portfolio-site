import type { GraphNodeType } from "./types";

/** Reuses node type as the label's role — priority and clearance rules key off it. */
export type LabelRole = GraphNodeType;

export type ScreenPoint = { x: number; y: number };

export type ScreenRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type LabelItem = {
  id: string;
  role: LabelRole;
  position: ScreenPoint;
  radius: number;
  labelWidth: number;
  labelHeight: number;
};

export type LabelViewport = {
  width: number;
  height: number;
  /** Width of chrome (e.g. the detail panel) reserved on the right edge, 0 when absent. */
  panelWidth: number;
  padding: number;
};

export type LabelCollision = {
  first: string;
  second: string;
  clearance: number;
};

export type LabelLayoutValidation = {
  collisions: LabelCollision[];
  clippedLabels: string[];
  minimumClearance: number;
};

export type LabelCollisionResolution = LabelLayoutValidation & {
  positions: Map<string, ScreenPoint>;
  rectangles: Map<string, ScreenRect>;
  initialCollisions: LabelCollision[];
};

/**
 * Lower = higher priority = less willing to move / gets extra clearance.
 * Anchors a viewer orients by (person, experience, project, domain) stay put;
 * denser, lower-signal labels (technology, concept, evidence) yield around them.
 */
const rolePriority: Record<LabelRole, number> = {
  person: 0,
  experience: 0,
  project: 0,
  domain: 0,
  capability: 1,
  learning: 2,
  roadmap: 2,
  technology: 3,
  concept: 4,
  evidence: 5,
};

function isAnchorRole(role: LabelRole) {
  return rolePriority[role] === 0;
}

export function requiredLabelClearance(first: LabelRole, second: LabelRole) {
  if (isAnchorRole(first) || isAnchorRole(second)) return 16;
  if (first === "evidence" || second === "evidence") return 16;
  if (first === "technology" && second === "technology") return 10;
  if (first === "technology" || second === "technology") return 14;
  return 12;
}

export function labelRectangle(item: LabelItem, position = item.position): ScreenRect {
  const labelLeft = position.x + item.radius + 3;
  const labelTop = position.y - item.labelHeight * 0.72;
  const labelBottom = position.y + item.labelHeight * 0.46;
  const base = {
    left: Math.min(position.x - item.radius, labelLeft),
    top: Math.min(position.y - item.radius, labelTop),
    right: labelLeft + item.labelWidth,
    bottom: Math.max(position.y + item.radius, labelBottom),
  };
  if (!isAnchorRole(item.role)) return base;
  return {
    left: base.left - 10,
    top: base.top - 10,
    right: base.right + 16,
    bottom: base.bottom + 10,
  };
}

function rectanglesConflict(first: ScreenRect, second: ScreenRect, clearance: number) {
  return first.left < second.right + clearance
    && first.right + clearance > second.left
    && first.top < second.bottom + clearance
    && first.bottom + clearance > second.top;
}

function rectangleGap(first: ScreenRect, second: ScreenRect) {
  const horizontal = Math.max(0, Math.max(first.left - second.right, second.left - first.right));
  const vertical = Math.max(0, Math.max(first.top - second.bottom, second.top - first.bottom));
  if (horizontal > 0 && vertical > 0) return Math.hypot(horizontal, vertical);
  return Math.max(horizontal, vertical);
}

function clampToViewport(item: LabelItem, position: ScreenPoint, viewport: LabelViewport) {
  const usableRight = viewport.width - viewport.panelWidth - viewport.padding;
  const usableBottom = viewport.height - viewport.padding;
  const next = { ...position };
  let rectangle = labelRectangle(item, next);
  if (rectangle.left < viewport.padding) next.x += viewport.padding - rectangle.left;
  if (rectangle.right > usableRight) next.x -= rectangle.right - usableRight;
  rectangle = labelRectangle(item, next);
  if (rectangle.top < viewport.padding) next.y += viewport.padding - rectangle.top;
  if (rectangle.bottom > usableBottom) next.y -= rectangle.bottom - usableBottom;
  return next;
}

function collectValidation(
  items: readonly LabelItem[],
  positions: ReadonlyMap<string, ScreenPoint>,
  viewport: LabelViewport,
): LabelLayoutValidation & { rectangles: Map<string, ScreenRect> } {
  const rectangles = new Map<string, ScreenRect>();
  const clippedLabels: string[] = [];
  const usableRight = viewport.width - viewport.panelWidth - viewport.padding;
  const usableBottom = viewport.height - viewport.padding;
  for (const item of items) {
    const rectangle = labelRectangle(item, positions.get(item.id) ?? item.position);
    rectangles.set(item.id, rectangle);
    if (rectangle.left < viewport.padding || rectangle.right > usableRight
      || rectangle.top < viewport.padding || rectangle.bottom > usableBottom) clippedLabels.push(item.id);
  }

  const collisions: LabelCollision[] = [];
  let minimumClearance = Number.POSITIVE_INFINITY;
  for (let firstIndex = 0; firstIndex < items.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < items.length; secondIndex += 1) {
      const first = items[firstIndex];
      const second = items[secondIndex];
      const firstRectangle = rectangles.get(first.id)!;
      const secondRectangle = rectangles.get(second.id)!;
      const clearance = requiredLabelClearance(first.role, second.role);
      if (rectanglesConflict(firstRectangle, secondRectangle, clearance)) {
        collisions.push({ first: first.id, second: second.id, clearance });
      } else {
        minimumClearance = Math.min(minimumClearance, rectangleGap(firstRectangle, secondRectangle));
      }
    }
  }

  return {
    rectangles,
    collisions,
    clippedLabels,
    minimumClearance: Number.isFinite(minimumClearance) ? minimumClearance : 0,
  };
}

export function validateLabelLayout(
  items: readonly LabelItem[],
  positions: ReadonlyMap<string, ScreenPoint>,
  viewport: LabelViewport,
) {
  return collectValidation(items, positions, viewport);
}

/**
 * Nudges colliding labels apart. Anchor-role labels (person/experience/project/
 * domain) never move — everything else is displaced outward from the viewport
 * center, in priority order, until clear or `maxPasses` is exhausted.
 *
 * Used for both the project-focus layout (a handful of semantically placed
 * labels around one anchor) and the idle/general view (whatever labels are
 * currently visible on screen) — the two differ only in which items and
 * viewport they're called with.
 */
export function resolveLabelCollisions(
  items: readonly LabelItem[],
  viewport: LabelViewport,
  maxPasses = 4,
): LabelCollisionResolution {
  const positions = new Map(items.map((item) => [item.id, clampToViewport(item, item.position, viewport)]));
  const initial = collectValidation(items, positions, viewport);
  const center = { x: viewport.width / 2, y: viewport.height / 2 };
  const ordered = [...items].sort((first, second) => (
    rolePriority[first.role] - rolePriority[second.role] || first.id.localeCompare(second.id)
  ));

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const placed: LabelItem[] = [];
    let moved = false;
    for (const item of ordered) {
      if (isAnchorRole(item.role)) {
        placed.push(item);
        continue;
      }
      let position = positions.get(item.id) ?? item.position;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const rectangle = labelRectangle(item, position);
        const conflict = placed.find((other) => {
          const otherPosition = positions.get(other.id) ?? other.position;
          return rectanglesConflict(
            rectangle,
            labelRectangle(other, otherPosition),
            requiredLabelClearance(item.role, other.role),
          );
        });
        if (!conflict) break;

        const conflictRectangle = labelRectangle(conflict, positions.get(conflict.id) ?? conflict.position);
        const clearance = requiredLabelClearance(item.role, conflict.role);
        const moveUp = item.role === "domain" || item.role === "concept" || item.role === "learning" || item.role === "roadmap"
          || (item.role === "technology" && position.y <= center.y);
        const verticalDelta = moveUp
          ? conflictRectangle.top - clearance - rectangle.bottom
          : conflictRectangle.bottom + clearance - rectangle.top;
        const verticalCandidate = clampToViewport(item, { x: position.x, y: position.y + verticalDelta }, viewport);
        const verticalRectangle = labelRectangle(item, verticalCandidate);
        if (!rectanglesConflict(verticalRectangle, conflictRectangle, clearance)) {
          position = verticalCandidate;
        } else {
          const moveLeft = position.x > center.x;
          const horizontalDelta = moveLeft
            ? conflictRectangle.left - clearance - rectangle.right
            : conflictRectangle.right + clearance - rectangle.left;
          position = clampToViewport(item, { x: position.x + horizontalDelta, y: position.y }, viewport);
        }
        moved = true;
      }
      positions.set(item.id, position);
      placed.push(item);
    }
    if (!moved) break;
  }

  const final = collectValidation(items, positions, viewport);
  return {
    positions,
    rectangles: final.rectangles,
    initialCollisions: initial.collisions,
    collisions: final.collisions,
    clippedLabels: final.clippedLabels,
    minimumClearance: final.minimumClearance,
  };
}
