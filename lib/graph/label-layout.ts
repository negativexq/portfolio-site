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
  /**
   * Never moves — the caller decides this, not the role. Project-focus pins
   * only the single focused node (every neighbor, including domains, stays
   * movable, same as before this module was generalized). The idle view
   * pins the always-visible structural anchors (person/experience/project/
   * domain) so they don't jitter while panning.
   */
  pinned?: boolean;
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
 * Movement order among *non-pinned* items, and a tie-breaker for clearance —
 * NOT a pin/no-pin decision (see `LabelItem.pinned`). Mirrors the original
 * project-focus tiers (technology tightest, domain/concept/evidence looser)
 * with the idle-only roles slotted alongside their closest original analog.
 */
const rolePriority: Record<LabelRole, number> = {
  project: 0,
  person: 0,
  experience: 0,
  technology: 1,
  domain: 2,
  capability: 2,
  learning: 2,
  roadmap: 2,
  concept: 3,
  evidence: 4,
};

export function requiredLabelClearance(first: LabelItem, second: LabelItem) {
  if (first.pinned || second.pinned) return 16;
  if (first.role === "evidence" || second.role === "evidence") return 16;
  if (first.role === "technology" && second.role === "technology") return 10;
  if (first.role === "technology" || second.role === "technology") return 14;
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
  if (!item.pinned) return base;
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
      const clearance = requiredLabelClearance(first, second);
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
 * Nudges colliding labels apart. `item.pinned` labels never move — everyone
 * else is displaced outward from the viewport center, in priority order,
 * until clear or `maxPasses` is exhausted.
 *
 * Used for both the project-focus layout (a handful of semantically placed
 * labels around one pinned anchor) and the idle/general view (whatever
 * labels are currently visible on screen, with several pinned structural
 * anchors) — the two differ only in which items/pins and viewport they're
 * called with.
 */
export function resolveLabelCollisions(
  items: readonly LabelItem[],
  viewport: LabelViewport,
  maxPasses = 6,
): LabelCollisionResolution {
  const positions = new Map(items.map((item) => [item.id, clampToViewport(item, item.position, viewport)]));
  const initial = collectValidation(items, positions, viewport);
  const center = { x: viewport.width / 2, y: viewport.height / 2 };
  // Pinned items must be placed before any movable item is processed —
  // otherwise a movable item earlier in role-priority order (e.g. a
  // technology label) never sees a later-priority pinned obstacle (e.g. a
  // domain) as a conflict, since collisions are only checked against
  // already-`placed` items within a pass.
  const ordered = [...items].sort((first, second) => (
    Number(!first.pinned) - Number(!second.pinned)
    || rolePriority[first.role] - rolePriority[second.role]
    || first.id.localeCompare(second.id)
  ));

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const placed: LabelItem[] = [];
    let moved = false;
    for (const item of ordered) {
      if (item.pinned) {
        placed.push(item);
        continue;
      }
      let position = positions.get(item.id) ?? item.position;
      const totalAttempts = 18;
      for (let attempt = 0; attempt < totalAttempts; attempt += 1) {
        const rectangle = labelRectangle(item, position);
        const conflicts = placed.filter((other) => rectanglesConflict(
          rectangle,
          labelRectangle(other, positions.get(other.id) ?? other.position),
          requiredLabelClearance(item, other),
        ));
        if (conflicts.length === 0) break;

        // Clearing one obstacle at a time (even picking the worst overlap)
        // can ping-pong forever when several obstacles box an item in: fix A,
        // it lands on B; fix B, it's back on A. Spend most attempts on the
        // precise single-worst-conflict clear (it converges fast for the
        // common case), then fall back to a bounded step directly away from
        // the combined center of every current conflict for the last few —
        // enough to break a cluster without the unbounded jumps that used
        // to overshoot into a *new* collision elsewhere.
        const useClusterEscape = conflicts.length > 1 && attempt >= totalAttempts - 5;

        if (!useClusterEscape) {
          const conflict = conflicts.reduce((worst, candidate) => {
            const worstRect = labelRectangle(worst, positions.get(worst.id) ?? worst.position);
            const candidateRect = labelRectangle(candidate, positions.get(candidate.id) ?? candidate.position);
            const overlapArea = (rect: ScreenRect) => (
              Math.max(0, Math.min(rectangle.right, rect.right) - Math.max(rectangle.left, rect.left))
              * Math.max(0, Math.min(rectangle.bottom, rect.bottom) - Math.max(rectangle.top, rect.top))
            );
            return overlapArea(candidateRect) > overlapArea(worstRect) ? candidate : worst;
          });
          const conflictRectangle = labelRectangle(conflict, positions.get(conflict.id) ?? conflict.position);
          const clearance = requiredLabelClearance(item, conflict);
          const moveUp = item.role === "domain" || item.role === "concept" || item.role === "person" || item.role === "experience"
            || item.role === "capability" || item.role === "learning" || item.role === "roadmap"
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
        } else {
          const conflictRectangles = conflicts.map((other) => (
            labelRectangle(other, positions.get(other.id) ?? other.position)
          ));
          const centroidX = conflictRectangles.reduce((sum, r) => sum + (r.left + r.right) / 2, 0) / conflictRectangles.length;
          const centroidY = conflictRectangles.reduce((sum, r) => sum + (r.top + r.bottom) / 2, 0) / conflictRectangles.length;
          const itemCenterX = (rectangle.left + rectangle.right) / 2;
          const itemCenterY = (rectangle.top + rectangle.bottom) / 2;
          let awayX = itemCenterX - centroidX;
          let awayY = itemCenterY - centroidY;
          const magnitude = Math.hypot(awayX, awayY) || 1;
          awayX /= magnitude;
          awayY /= magnitude;
          position = clampToViewport(
            item,
            { x: position.x + awayX * 22, y: position.y + awayY * 22 },
            viewport,
          );
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
