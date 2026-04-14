/**
 * Shared mouse-drag rotation handler for ambiguous shape illusions.
 * Tracks drag state and accumulated rotation angles.
 */
export interface MouseRotation {
  rotX: number;
  rotY: number;
  destroy: () => void;
}

export function setupMouseRotation(canvas: HTMLCanvasElement): MouseRotation {
  const state: MouseRotation = { rotX: 0, rotY: 0, destroy: () => {} };
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function onPointerDown(e: PointerEvent) {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    state.rotY += dx * 0.01;
    state.rotX += dy * 0.01;
    lastX = e.clientX;
    lastY = e.clientY;
  }

  function onPointerUp(e: PointerEvent) {
    dragging = false;
    canvas.releasePointerCapture(e.pointerId);
  }

  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);

  state.destroy = () => {
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
  };

  return state;
}
