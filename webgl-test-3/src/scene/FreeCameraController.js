import { Vec3 } from "../math/Vec3.js";

export class FreeCameraController {
  constructor(input, canvas) {
    this.input = input;
    this.canvas = canvas;

    this.yaw = 0;   // radians
    this.pitch = 0; // radians

    this.lookSensitivity = 0.002;
    this.moveSpeed = 5.0; // units/sec

    // Click to lock pointer (so mouse look works like a real app)
    canvas.addEventListener("click", () => {
      if (document.pointerLockElement !== canvas) canvas.requestPointerLock();
    });
  }

  update(camera, dt) {
    // Mouse look
    const { dx, dy } = this.input.consumeMouseDelta();
    this.yaw -= dx * this.lookSensitivity;
    this.pitch -= dy * this.lookSensitivity;

    const lim = Math.PI / 2 - 0.01;
    if (this.pitch > lim) this.pitch = lim;
    if (this.pitch < -lim) this.pitch = -lim;

    camera.yaw = this.yaw;
    camera.pitch = this.pitch;

    // Movement
    const speed = this.moveSpeed * (this.input.down("ShiftLeft") ? 2.0 : 1.0);
    const forward = camera.getForward(); // normalized
    const right = camera.getRight();     // normalized

    let vx = 0, vy = 0, vz = 0;

    if (this.input.down("KeyW")) { vx += forward[0]; vy += forward[1]; vz += forward[2]; }
    if (this.input.down("KeyS")) { vx -= forward[0]; vy -= forward[1]; vz -= forward[2]; }
    if (this.input.down("KeyD")) { vx += right[0];   vy += right[1];   vz += right[2]; }
    if (this.input.down("KeyA")) { vx -= right[0];   vy -= right[1];   vz -= right[2]; }

    if (this.input.down("Space")) vy += 1;
    if (this.input.down("ControlLeft")) vy -= 1;

    // Normalize move vector (so diagonals aren't faster)
    const len = Math.hypot(vx, vy, vz) || 1;
    vx /= len; vy /= len; vz /= len;

    camera.transform.position[0] += vx * speed * dt;
    camera.transform.position[1] += vy * speed * dt;
    camera.transform.position[2] += vz * speed * dt;
  }
}
