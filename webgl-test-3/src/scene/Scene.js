import { Node } from "./Node.js";

export class Scene {
  constructor() {
    this.root = new Node("Root");
    this.camera = null;
  }

  update(dt) {
    // Camera controller (if present)
    if (this.camera?.controller) {
      this.camera.controller.update(this.camera, dt);
    }

    // Update transforms
    this.root.updateWorldMatrix(null);

    // Update behaviors
    this.root.traverse((n) => n.update?.(dt));
  }
}
