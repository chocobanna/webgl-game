export class Keyboard {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    this.keys = new Set();

    const down = (e) => {
      const k = e.key.toLowerCase();
      if (["w","a","s","d","q","e","shift"].includes(k)) e.preventDefault();
      this.keys.add(k);
    };
    const up = (e) => this.keys.delete(e.key.toLowerCase());

    // Canvas focus + global fallback
    canvas.addEventListener("keydown", down);
    canvas.addEventListener("keyup", up);
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up, { passive: true });
  }

  down(key) {
    return this.keys.has(key);
  }
}
