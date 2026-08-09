export type FocusLabelRole = "project" | "technology" | "domain" | "related" | "concept" | "evidence";

export type ScreenPoint = { x: number; y: number };

export type ScreenRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type FocusLabelItem = {
  id: string;
  role: FocusLabelRole;
  position: ScreenPoint;
  radius: number;
  labelWidth: number;
  labelHeight: number;
};

export type FocusViewport = {
  width: number;
  height: number;
  inspectorWidth: number;
  padding: number;
};

export type FocusCollision = {
  first: string;
  second: string;
  clearance: number;
};

export type FocusLayoutValidation = {
  collisions: FocusCollision[];
  clippedLabels: string[];
  minimumClearance: number;
};

export type FocusCollisionResolution = FocusLayoutValidation & {
  positions: Map<string, ScreenPoint>;
  rectangles: Map<string, ScreenRect>;
  initialCollisions: FocusCollision[];
};

const rolePriority: Record<FocusLabelRole, number> = {
  project: 0,
  technology: 1,
  domain: 2,
  related: 2,
  concept: 3,
  evidence: 4,
};

export function requiredFocusClearance(first: FocusLabelRole, second: FocusLabelRole) {
  if (first === "project" || second === "project") return 16;
  if (first === "evidence" || second === "evidence") return 16;
  if (first === "technology" && second === "technology") return 10;
  if (first === "technology" || second === "technology") return 14;
  return 12;
}

export function focusedLabelRectangle(item: FocusLabelItem, position = item.position): ScreenRect {
  const labelLeft = position.x + item.radius + 3;
  const labelTop = position.y - item.labelHeight * 0.72;
  const labelBottom = position.y + item.labelHeight * 0.46;
  const base = {
    left: Math.min(position.x - item.radius, labelLeft),
    top: Math.min(position.y - item.radius, labelTop),
    right: labelLeft + item.labelWidth,
    bottom: Math.max(position.y + item.radius, labelBottom),
  };
  if (item.role !== "project") return base;
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

function clampToViewport(item: FocusLabelItem, position: ScreenPoint, viewport: FocusViewport) {
  const usableRight = viewport.width - viewport.inspectorWidth - viewport.padding;
  const usableBottom = viewport.height - viewport.padding;
  const next = { ...position };
  let rectangle = focusedLabelRectangle(item, next);
  if (rectangle.left < viewport.padding) next.x += viewport.padding - rectangle.left;
  if (rectangle.right > usableRight) next.x -= rectangle.right - usableRight;
  rectangle = focusedLabelRectangle(item, next);
  if (rectangle.top < viewport.padding) next.y += viewport.padding - rectangle.top;
  if (rectangle.bottom > usableBottom) next.y -= rectangle.bottom - usableBottom;
  return next;
}

function collectValidation(
  items: readonly FocusLabelItem[],
  positions: ReadonlyMap<string, ScreenPoint>,
  viewport: FocusViewport,
): FocusLayoutValidation & { rectangles: Map<string, ScreenRect> } {
  const rectangles = new Map<string, ScreenRect>();
  const clippedLabels: string[] = [];
  const usableRight = viewport.width - viewport.inspectorWidth - viewport.padding;
  const usableBottom = viewport.height - viewport.padding;
  for (const item of items) {
    const rectangle = focusedLabelRectangle(item, positions.get(item.id) ?? item.position);
    rectangles.set(item.id, rectangle);
    if (rectangle.left < viewport.padding || rectangle.right > usableRight
      || rectangle.top < viewport.padding || rectangle.bottom > usableBottom) clippedLabels.push(item.id);
  }

  const collisions: FocusCollision[] = [];
  let minimumClearance = Number.POSITIVE_INFINITY;
  for (let firstIndex = 0; firstIndex < items.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < items.length; secondIndex += 1) {
      const first = items[firstIndex];
      const second = items[secondIndex];
      const firstRectangle = rectangles.get(first.id)!;
      const secondRectangle = rectangles.get(second.id)!;
      const clearance = requiredFocusClearance(first.role, second.role);
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

export function validateFocusedLabelLayout(
  items: readonly FocusLabelItem[],
  positions: ReadonlyMap<string, ScreenPoint>,
  viewport: FocusViewport,
) {
  return collectValidation(items, positions, viewport);
}

export function resolveFocusedLabelCollisions(
  items: readonly FocusLabelItem[],
  viewport: FocusViewport,
  maxPasses = 4,
): FocusCollisionResolution {
  const positions = new Map(items.map((item) => [item.id, clampToViewport(item, item.position, viewport)]));
  const initial = collectValidation(items, positions, viewport);
  const project = items.find((item) => item.role === "project");
  const ordered = [...items].sort((first, second) => (
    rolePriority[first.role] - rolePriority[second.role] || first.id.localeCompare(second.id)
  ));

  for (let pass = 0; pass < maxPasses; pass += 1) {
    const placed: FocusLabelItem[] = [];
    let moved = false;
    for (const item of ordered) {
      if (item.role === "project") {
        placed.push(item);
        continue;
      }
      let position = positions.get(item.id) ?? item.position;
      for (let attempt = 0; attempt < 10; attempt += 1) {
        const rectangle = focusedLabelRectangle(item, position);
        const conflict = placed.find((other) => {
          const otherPosition = positions.get(other.id) ?? other.position;
          return rectanglesConflict(
            rectangle,
            focusedLabelRectangle(other, otherPosition),
            requiredFocusClearance(item.role, other.role),
          );
        });
        if (!conflict) break;

        const conflictRectangle = focusedLabelRectangle(conflict, positions.get(conflict.id) ?? conflict.position);
        const clearance = requiredFocusClearance(item.role, conflict.role);
        const moveUp = item.role === "domain" || item.role === "related" || item.role === "concept"
          || (item.role === "technology" && position.y <= (project?.position.y ?? viewport.height / 2));
        const verticalDelta = moveUp
          ? conflictRectangle.top - clearance - rectangle.bottom
          : conflictRectangle.bottom + clearance - rectangle.top;
        const verticalCandidate = clampToViewport(item, { x: position.x, y: position.y + verticalDelta }, viewport);
        const verticalRectangle = focusedLabelRectangle(item, verticalCandidate);
        if (!rectanglesConflict(verticalRectangle, conflictRectangle, clearance)) {
          position = verticalCandidate;
        } else {
          const moveLeft = position.x > (project?.position.x ?? viewport.width / 2);
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
