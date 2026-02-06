export class PointerLook {
  /** @param {HTMLCanvasElement} canvas @param {{setLookDelta(dx:number,dy:number):void}} camera */
  constructor(canvas, camera) {
    this.canvas = canvas;
    this.camera = camera;
    this.dragging = false;
    this.lastX = 0;
    this.lastY = 0;

    canvas.addEventListener("pointerdown", (e) => {
      canvas.focus();
      this.dragging = true;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointerup", (e) => {
      this.dragging = false;
      canvas.releasePointerCapture(e.pointerId);
    });

    canvas.addEventListener("pointercancel", () => {
      this.dragging = false;
    });

    canvas.addEventListener("pointermove", (e) => {
      if (!this.dragging) return;
      const dx = e.clientX - this.lastX;
      const dy = e.clientY - this.lastY;
      this.lastX = e.clientX;
      this.lastY = e.clientY;
      camera.setLookDelta(dx, dy);
    });

    // Wheel = forward/back nudge
    canvas.addEventListener("wheel", (e) => {
      e.preventDefault();
      const forward = camera.forward();
      const step = e.deltaY * 0.01;
      camera.pos[0] += forward[0] * step;
      camera.pos[1] += forward[1] * step;
      camera.pos[2] += forward[2] * step;
    }, { passive: false });
  }
}
