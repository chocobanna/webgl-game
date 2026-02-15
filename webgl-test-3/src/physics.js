import { modelMatrix } from "./math.js";

export class PhysicsSystem {
  constructor(count) {
    this.count = count;

    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    this.rot = new Float32Array(count);
    this.scale = new Float32Array(count);
    this.radius = new Float32Array(count);

    this.modelData = new Float32Array(count * 16);

    this.init();
  }

  init() {
    for (let i = 0; i < this.count; i++) {
      this.pos[i*3+0] = (Math.random() - 0.5) * 60;
      this.pos[i*3+1] = (Math.random() - 0.5) * 10;
      this.pos[i*3+2] = (Math.random() - 0.5) * 60;

      this.vel[i*3+0] = (Math.random() - 0.5) * 3;
      this.vel[i*3+1] = (Math.random() - 0.5) * 1;
      this.vel[i*3+2] = (Math.random() - 0.5) * 3;

      this.rot[i] = Math.random() * Math.PI * 2;
      this.scale[i] = 0.5 + Math.random() * 2;

      this.radius[i] = this.scale[i];
    }
  }

  update(dt) {
    const bounds = 50;

    for (let i = 0; i < this.count; i++) {
      this.pos[i*3+0] += this.vel[i*3+0] * dt;
      this.pos[i*3+1] += this.vel[i*3+1] * dt;
      this.pos[i*3+2] += this.vel[i*3+2] * dt;

      for (let k = 0; k < 3; k++) {
        if (this.pos[i*3+k] > bounds || this.pos[i*3+k] < -bounds)
          this.vel[i*3+k] *= -1;
      }

      this.rot[i] += dt;
    }

    this.solveCollisions();
    this.buildMatrices();
  }

  solveCollisions() {
    for (let i = 0; i < this.count; i++) {
      for (let j = i + 1; j < this.count; j++) {

        const dx = this.pos[j*3+0] - this.pos[i*3+0];
        const dy = this.pos[j*3+1] - this.pos[i*3+1];
        const dz = this.pos[j*3+2] - this.pos[i*3+2];

        const distSq = dx*dx + dy*dy + dz*dz;
        const minDist = this.radius[i] + this.radius[j];

        if (distSq < minDist * minDist) {
          const dist = Math.sqrt(distSq) || 0.0001;

          const nx = dx / dist;
          const ny = dy / dist;
          const nz = dz / dist;

          const overlap = minDist - dist;

          this.pos[i*3+0] -= nx * overlap * 0.5;
          this.pos[i*3+1] -= ny * overlap * 0.5;
          this.pos[i*3+2] -= nz * overlap * 0.5;

          this.pos[j*3+0] += nx * overlap * 0.5;
          this.pos[j*3+1] += ny * overlap * 0.5;
          this.pos[j*3+2] += nz * overlap * 0.5;

          const vix = this.vel[i*3+0];
          const viy = this.vel[i*3+1];
          const viz = this.vel[i*3+2];

          this.vel[i*3+0] = this.vel[j*3+0];
          this.vel[i*3+1] = this.vel[j*3+1];
          this.vel[i*3+2] = this.vel[j*3+2];

          this.vel[j*3+0] = vix;
          this.vel[j*3+1] = viy;
          this.vel[j*3+2] = viz;
        }
      }
    }
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
