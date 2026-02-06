import { normalize3 } from "../math/vec3.js";

export function cameraForward(yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  return normalize3([cp * sy, sp, cp * cy]);
}
