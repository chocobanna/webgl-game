import { Node } from "./Node.js";
import { Mat4 } from "../math/Mat4.js";

export class Camera extends Node {
  constructor() {
    super("Camera");
    this.proj = Mat4.identity();
    this.view = Mat4.identity();
    this.vp = Mat4.identity();
    this._fov = 60;
    this._aspect = 1;
    this._near = 0.01;
    this._far = 100;
  }

  setPerspective(fovDeg, aspect, near, far) {
    this._fov = fovDeg;
    this._aspect = aspect;
    this._near = near;
    this._far = far;
    this.proj = Mat4.perspective(fovDeg, aspect, near, far);
  }

  setAspect(aspect) {
    this.setPerspective(this._fov, aspect, this._near, this._far);
  }

  updateMatrices() {
    // simple: inverse of translation + Y rotation (not full general inverse)
    const t = this.transform.position;
    const ry = this.transform.rotationY;
    let v = Mat4.identity();
    v = Mat4.rotateY(v, -ry);
    v = Mat4.translate(v, [-t[0], -t[1], -t[2]]);
    this.view = v;
    this.vp = Mat4.mul(this.proj, this.view);
  }
}
