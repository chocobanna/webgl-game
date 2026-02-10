import { Transform } from "./Transform.js";

export class Node {
  constructor(name = "Node") {
    this.name = name;
    this.transform = new Transform();
    this.children = [];
    this.parent = null;

    this.mesh = null; // optional renderable
    this.update = null; // optional per-frame callback
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  traverse(fn) {
    fn(this);
    for (const c of this.children) c.traverse(fn);
  }

  updateWorldMatrix(parentWorld) {
    this.transform.updateWorld(parentWorld);
    for (const c of this.children) c.updateWorldMatrix(this.transform.worldMatrix);
  }
}
