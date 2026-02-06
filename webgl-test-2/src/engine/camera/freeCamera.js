import { clamp } from "../math/vec3.js";
import { cameraForward } from "./freeCameraMath.js";
import { normalize3, cross3 } from "../math/vec3.js";

export class FreeCamera {
  constructor() {
    this.pos = [0, 1.25, 6];
    this.yaw = 0.0;
    this.pitch = 0.0;
  }

  forward() {
    return cameraForward(this.yaw, this.pitch);
  }

  setLookDelta(dx, dy) {
    const lookSpeed = 0.005;
    this.yaw += dx * lookSpeed;
    this.pitch += dy * lookSpeed;

    const limit = (Math.PI / 2) - 0.0001;
    this.pitch = clamp(this.pitch, -limit, limit);
  }

  /** @param {import("../input/Keyboard.js").Keyboard} keyboard */
  updateFromKeyboard(keyboard, dt) {
    const fwd = this.forward();
    const worldUp = [0, 1, 0];

    // IMPORTANT: right = forward x up (not up x forward)
    // This fixes A/D being inverted.
    let right = normalize3(cross3(fwd, worldUp));
    let up = normalize3(cross3(right, fwd));

    let x = 0, y = 0, z = 0;
    if (keyboard.down("a")) x -= 1;
    if (keyboard.down("d")) x += 1;
    if (keyboard.down("q")) y -= 1;
    if (keyboard.down("e")) y += 1;
    if (keyboard.down("w")) z += 1;
    if (keyboard.down("s")) z -= 1;

    const mag = Math.hypot(x, y, z);
    if (mag < 1e-6) return;

    const baseSpeed = 4.0;
    const speed = baseSpeed * (keyboard.down("shift") ? 2.5 : 1.0);
    const step = (speed * dt) / mag;

    this.pos[0] += right[0] * (x * step) + up[0] * (y * step) + fwd[0] * (z * step);
    this.pos[1] += right[1] * (x * step) + up[1] * (y * step) + fwd[1] * (z * step);
    this.pos[2] += right[2] * (x * step) + up[2] * (y * step) + fwd[2] * (z * step);
  }
}
