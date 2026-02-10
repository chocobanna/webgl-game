import { Node } from "./Node.js";
import { Mat4 } from "../math/Mat4.js";
import { Vec3 } from "../math/Vec3.js";

export class Camera extends Node {
  constructor() {
    super("Camera");
    this.proj = Mat4.identity();
    this.view = Mat4.identity();
    this.vp = Mat4.identity();

    this.yaw = 0;
    this.pitch = 0;

    this._fov = 60;
    this._aspect = 1;
    this._near = 0.01;
    this._far = 100;

    this.controller = null;
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

  // Forward and right from yaw/pitch
  getForward() {
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch), sp = Math.sin(this.pitch);

    // right-handed, -Z forward at yaw=0 pitch=0
    const x = -sy * cp;
    const y = sp;
    const z = -cy * cp;

    const l = Math.hypot(x, y, z) || 1;
    return Vec3.of(x / l, y / l, z / l);
  }

  getRight() {
    const cy = Math.cos(this.yaw), sy = Math.sin(this.yaw);
    // Right is cross(forward, up) simplified for yaw-only in xz plane:
    // at yaw=0: right = +X
    return Vec3.of(cy, 0, -sy);
  }

  updateMatrices() {
    const p = this.transform.position;
    // View = inverse(T * R) = R^-1 * T^-1
    let v = Mat4.identity();
    v = Mat4.rotateX(v, -this.pitch);
    v = Mat4.rotateY(v, -this.yaw);
    v = Mat4.translate(v, [-p[0], -p[1], -p[2]]);
    this.view = v;
    this.vp = Mat4.mul(this.proj, this.view);
  }
}
