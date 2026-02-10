import { Mat4 } from "../math/Mat4.js";
import { Vec3 } from "../math/Vec3.js";

export class Transform {
  constructor() {
    this.position = Vec3.of(0, 0, 0);
    this.rotation = Vec3.of(0, 0, 0); // x,y,z radians
    this.scale = Vec3.of(1, 1, 1);

    this.localMatrix = Mat4.identity();
    this.worldMatrix = Mat4.identity();
  }

  updateLocal() {
    let m = Mat4.identity();
    m = Mat4.translate(m, this.position);
    m = Mat4.rotateX(m, this.rotation[0]);
    m = Mat4.rotateY(m, this.rotation[1]);
    m = Mat4.rotateZ(m, this.rotation[2]);
    m = Mat4.scale(m, this.scale);
    this.localMatrix = m;
  }

  updateWorld(parentWorld) {
    this.updateLocal();
    this.worldMatrix = parentWorld ? Mat4.mul(parentWorld, this.localMatrix) : this.localMatrix;
  }
}
