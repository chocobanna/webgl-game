import { Node } from "./Node.js";

export class Scene {
  constructor() {
    this.root = new Node("Root");
    this.camera = null;
  }

  update(dt) {
    this.root.updateWorldMatrix(null);
    this.root.traverse((n) => n.update?.(dt));
  }
}
