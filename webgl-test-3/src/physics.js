import { modelMatrix } from "./math.js";

export class PhysicsSystem {
  constructor(count) {
    this.count = count;

    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.rot = new Float32Array(count);
    this.scale = new Float32Array(count);

    this.modelData = new Float32Array(count * 16);

    this.init();
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      this.pos[i*3+0] = (Math.random() - 0.5) * 40;
      this.pos[i*3+1] = (Math.random() - 0.5) * 20;
      this.pos[i*3+2] = (Math.random() - 0.5) * 40;

      // TRUE 3D STARTING VELOCITY
      this.vel[i*3+0] = (Math.random() - 0.5) * 4;
      this.vel[i*3+1] = (Math.random() - 0.5) * 4;
      this.vel[i*3+2] = (Math.random() - 0.5) * 4;

      this.rot[i] = Math.random() * Math.PI * 2;
      this.scale[i] = 0.6 + Math.random() * 1.4;
    }
  }

  update(dt) {
    const bounds = 50;

    for (let i = 0; i < this.count; i++) {
      this.pos[i*3+0] += this.vel[i*3+0] * dt;
      this.pos[i*3+1] += this.vel[i*3+1] * dt;
      this.pos[i*3+2] += this.vel[i*3+2] * dt;

      // world bounds bounce
      for (let k = 0; k < 3; k++) {
        if (this.pos[i*3+k] > bounds || this.pos[i*3+k] < -bounds)
          this.vel[i*3+k] *= -1;
      }

      this.rot[i] += dt;
    }

    this.solveCollisions();
    this.buildMatrices();
  }

  // ------------------------------------------------
  // FULL 3D AABB COLLISION
  // ------------------------------------------------
  solveCollisions() {
    for (let i = 0; i < this.count; i++) {
      for (let j = i + 1; j < this.count; j++) {

        if (!this.aabbOverlap(i, j)) continue;

        this.resolve(i, j);
      }
    }
  }

  aabbOverlap(i, j) {
    const si = this.scale[i];
    const sj = this.scale[j];

    const dx = Math.abs(this.pos[i*3+0] - this.pos[j*3+0]);
    const dy = Math.abs(this.pos[i*3+1] - this.pos[j*3+1]);
    const dz = Math.abs(this.pos[i*3+2] - this.pos[j*3+2]);

    return (
      dx < (si + sj) &&
      dy < (si + sj) &&
      dz < (si + sj)
    );
  }

  resolve(i, j) {
    const dx = this.pos[j*3+0] - this.pos[i*3+0];
    const dy = this.pos[j*3+1] - this.pos[i*3+1];
    const dz = this.pos[j*3+2] - this.pos[i*3+2];

    const overlapX = (this.scale[i] + this.scale[j]) - Math.abs(dx);
    const overlapY = (this.scale[i] + this.scale[j]) - Math.abs(dy);
    const overlapZ = (this.scale[i] + this.scale[j]) - Math.abs(dz);

    // resolve along smallest axis
    if (overlapX < overlapY && overlapX < overlapZ) {
      const s = Math.sign(dx);
      this.pos[i*3+0] -= overlapX * 0.5 * s;
      this.pos[j*3+0] += overlapX * 0.5 * s;
      this.swapVel(i, j, 0);
    }
    else if (overlapY < overlapZ) {
      const s = Math.sign(dy);
      this.pos[i*3+1] -= overlapY * 0.5 * s;
      this.pos[j*3+1] += overlapY * 0.5 * s;
      this.swapVel(i, j, 1);
    }
    else {
      const s = Math.sign(dz);
      this.pos[i*3+2] -= overlapZ * 0.5 * s;
      this.pos[j*3+2] += overlapZ * 0.5 * s;
      this.swapVel(i, j, 2);
    }
  }

  swapVel(i, j, axis) {
    const vi = this.vel[i*3+axis];
    this.vel[i*3+axis] = this.vel[j*3+axis];
    this.vel[j*3+axis] = vi;
  }

  buildMatrices() {
    for (let i = 0; i < this.count; i++) {
      const m = modelMatrix(
        this.pos[i*3+0],
        this.pos[i*3+1],
        this.pos[i*3+2],
        this.rot[i],
        this.scale[i]
      );

      this.modelData.set(m, i * 16);
    }
  }
}
