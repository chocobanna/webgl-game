import { mat4Multiply } from "../math/mat4.js";

/* ---------- helpers ---------- */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

// Column-major lookAt matrix (WebGL-friendly)
function mat4LookAt(eye, target, up) {
  let zx = eye.x - target.x;
  let zy = eye.y - target.y;
  let zz = eye.z - target.z;
  const zLen = Math.hypot(zx, zy, zz) || 1;
  zx /= zLen; zy /= zLen; zz /= zLen;

  let xx = up.y * zz - up.z * zy;
  let xy = up.z * zx - up.x * zz;
  let xz = up.x * zy - up.y * zx;
  const xLen = Math.hypot(xx, xy, xz) || 1;
  xx /= xLen; xy /= xLen; xz /= xLen;

  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  return new Float32Array([
    xx, yx, zx, 0,
    xy, yy, zy, 0,
    xz, yz, zz, 0,
    -(xx * eye.x + xy * eye.y + xz * eye.z),
    -(yx * eye.x + yy * eye.y + yz * eye.z),
    -(zx * eye.x + zy * eye.y + zz * eye.z),
    1
  ]);
}

/* ---------- camera ---------- */

export function createOrbitCamera(canvas, options = {}) {
  const camera = {
    yaw: 0,
    pitch: 0,
    distance: options.distance ?? 6,
    target: { x: 0, y: 0, z: 0 }
  };

  const rotateSpeed = options.rotateSpeed ?? 0.005;
  const zoomSpeed   = options.zoomSpeed   ?? 0.0015;
  const panSpeed    = options.panSpeed    ?? 0.0025;

  const minDistance = options.minDistance ?? 2.5;
  const maxDistance = options.maxDistance ?? 20;
  const maxPitch = Math.PI / 2 - 0.01;

  let isDragging = false;
  let dragMode = "orbit"; // orbit | pan
  let lastX = 0;
  let lastY = 0;

  canvas.style.touchAction = "none";
  canvas.addEventListener("contextmenu", e => e.preventDefault());

  canvas.addEventListener("pointerdown", (e) => {
    // Kill right mouse button behavior entirely.
    if (e.button === 2) return;

    isDragging = true;
    lastX = e.clientX;
    lastY = e.clientY;

    // Pan ONLY when Shift is held (left mouse + Shift).
    dragMode = e.shiftKey ? "pan" : "orbit";

    canvas.setPointerCapture(e.pointerId);
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!isDragging) return;

    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX;
    lastY = e.clientY;

    if (dragMode === "orbit") {
      camera.yaw   -= dx * rotateSpeed; // <-- flip left/right
      camera.pitch += dy * rotateSpeed;
      camera.pitch = clamp(camera.pitch, -maxPitch, maxPitch);
      return;
    }

    // ---- pan ----
    const cy = Math.cos(camera.yaw), sy = Math.sin(camera.yaw);
    const cp = Math.cos(camera.pitch), sp = Math.sin(camera.pitch);

    const fx = sy * cp;
    const fy = sp;
    const fz = cy * cp;

    let rx = fz;
    let ry = 0;
    let rz = -fx;
    const rLen = Math.hypot(rx, ry, rz) || 1;
    rx /= rLen; ry /= rLen; rz /= rLen;

    const ux = ry * fz - rz * fy;
    const uy = rz * fx - rx * fz;
    const uz = rx * fy - ry * fx;

    const scale = camera.distance * panSpeed;

    camera.target.x -= rx * dx * scale;
    camera.target.y -= ry * dx * scale;
    camera.target.z -= rz * dx * scale;

    camera.target.x += ux * dy * scale;
    camera.target.y += uy * dy * scale;
    camera.target.z += uz * dy * scale;
  });

  canvas.addEventListener("pointerup", () => isDragging = false);
  canvas.addEventListener("pointerleave", () => isDragging = false);
  canvas.addEventListener("pointercancel", () => isDragging = false);

  // Keep zoom on scroll wheel (this is NOT what you wanted removed).
  canvas.addEventListener("wheel", (e) => {
    e.preventDefault();
    camera.distance += e.deltaY * zoomSpeed;
    camera.distance = clamp(camera.distance, minDistance, maxDistance);
  }, { passive: false });

  return {
    getViewMatrix() {
      const cy = Math.cos(camera.yaw), sy = Math.sin(camera.yaw);
      const cp = Math.cos(camera.pitch), sp = Math.sin(camera.pitch);

      const eye = {
        x: camera.target.x + sy * cp * camera.distance,
        y: camera.target.y + sp * camera.distance,
        z: camera.target.z + cy * cp * camera.distance
      };

      return mat4LookAt(eye, camera.target, { x: 0, y: 1, z: 0 });
    },

    camera // exposed for debugging / tweaking
  };
}
