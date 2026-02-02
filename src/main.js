import { createGL, resizeCanvasToDisplaySize, createProgram } from "./core/gl-utils.js";
import { vsSource, fsSource } from "./render/shaders.js";
import { createCubeMesh } from "./geometry/cube.js";
import { loadTexture2D } from "./core/texture.js";
import {
  mat4Multiply,
  mat4Perspective,
  mat4Translate,
  mat4RotateX,
  mat4RotateY
} from "./math/mat4.js";

const canvas = document.getElementById("c");
const gl = createGL(canvas);

const program = createProgram(gl, vsSource, fsSource);
gl.useProgram(program);

// GL state
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);

// Mesh
const cube = createCubeMesh(gl, program);
cube.bind();

// Texture
const tex = loadTexture2D(gl, "../assets/textures/crate.png");
const uTex = gl.getUniformLocation(program, "u_tex");
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.uniform1i(uTex, 0);

// Uniforms
const uMVP = gl.getUniformLocation(program, "u_mvp");

const camera = {
  yaw: 0,
  pitch: 0,
  distance: 6,
  target: { x: 0, y: 0, z: 0 }
};

let isDragging = false;
let lastX = 0;
let lastY = 0;
const rotateSpeed = 0.005;
const zoomSpeed = 0.0015;
const moveSpeed = 4;
const minDistance = 2.5;
const maxDistance = 20;
const maxPitch = Math.PI / 2 - 0.01;

canvas.style.touchAction = "none";

const pressedKeys = new Set();
window.addEventListener("keydown", (event) => {
  pressedKeys.add(event.code);
});

window.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.code);
});

canvas.addEventListener("pointerdown", (event) => {
  isDragging = true;
  lastX = event.clientX;
  lastY = event.clientY;
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const dx = event.clientX - lastX;
  const dy = event.clientY - lastY;
  lastX = event.clientX;
  lastY = event.clientY;

  camera.yaw += dx * rotateSpeed;
  camera.pitch += dy * rotateSpeed;
  camera.pitch = Math.max(-maxPitch, Math.min(maxPitch, camera.pitch));
});

canvas.addEventListener("pointerup", (event) => {
  isDragging = false;
  canvas.releasePointerCapture(event.pointerId);
});

canvas.addEventListener("pointercancel", () => {
  isDragging = false;
});

canvas.addEventListener("pointerleave", () => {
  isDragging = false;
});

canvas.addEventListener("wheel", (event) => {
  event.preventDefault();
  camera.distance += event.deltaY * zoomSpeed;
  camera.distance = Math.max(minDistance, Math.min(maxDistance, camera.distance));
}, { passive: false });

let lastTimeMs = 0;

function render(timeMs) {
  resizeCanvasToDisplaySize(canvas, gl);

  const t = timeMs * 0.001;
  const deltaSeconds = Math.min(0.05, (timeMs - lastTimeMs) * 0.001);
  lastTimeMs = timeMs;
  const aspect = canvas.width / canvas.height;

  const forwardX = Math.sin(camera.yaw);
  const forwardZ = -Math.cos(camera.yaw);
  const rightX = Math.cos(camera.yaw);
  const rightZ = Math.sin(camera.yaw);
  const movement = moveSpeed * deltaSeconds;

  if (pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp")) {
    camera.target.x += forwardX * movement;
    camera.target.z += forwardZ * movement;
  }
  if (pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown")) {
    camera.target.x -= forwardX * movement;
    camera.target.z -= forwardZ * movement;
  }
  if (pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft")) {
    camera.target.x -= rightX * movement;
    camera.target.z -= rightZ * movement;
  }
  if (pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight")) {
    camera.target.x += rightX * movement;
    camera.target.z += rightZ * movement;
  }
  if (pressedKeys.has("KeyQ")) {
    camera.target.y += movement;
  }
  if (pressedKeys.has("KeyE")) {
    camera.target.y -= movement;
  }

  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
  const viewTranslate = mat4Translate(0, 0, -camera.distance);
  const viewRotX = mat4RotateX(camera.pitch);
  const viewRotY = mat4RotateY(camera.yaw);
  const viewCenter = mat4Translate(-camera.target.x, -camera.target.y, -camera.target.z);
  const view = mat4Multiply(
    viewRotY,
    mat4Multiply(viewRotX, mat4Multiply(viewTranslate, viewCenter))
  );
  const rotY = mat4RotateY(t);
  const rotX = mat4RotateX(t * 0.7);

  const model = mat4Multiply(rotY, rotX);
  const pv = mat4Multiply(proj, view);
  const mvp = mat4Multiply(pv, model);

  gl.clearColor(0.05, 0.06, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(uMVP, false, mvp);
  cube.draw();

  requestAnimationFrame(render);
}

requestAnimationFrame(render);
