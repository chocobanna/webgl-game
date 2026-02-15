import { initGL } from "./gl.js";
import { Camera, setupMouseLook, setupKeyboard } from "./camera.js";
import { perspective } from "./math.js";
import { createProgram } from "./shader.js";
import { makeMesh } from "./mesh.js";
import { createCube } from "./primitives.js";
import { PhysicsSystem } from "./physics.js";

const { gl, canvas } = initGL("gl");

const inst = gl.getExtension("ANGLE_instanced_arrays");
if (!inst) throw new Error("Instancing not supported");

const program = createProgram(gl);
gl.useProgram(program);

const posLoc = gl.getAttribLocation(program, "pos");
const normLoc = gl.getAttribLocation(program, "normal");

const m0Loc = gl.getAttribLocation(program, "m0");
const m1Loc = gl.getAttribLocation(program, "m1");
const m2Loc = gl.getAttribLocation(program, "m2");
const m3Loc = gl.getAttribLocation(program, "m3");

const projLoc = gl.getUniformLocation(program, "proj");
const viewLoc = gl.getUniformLocation(program, "view");

const cube = makeMesh(gl, createCube());

const cam = new Camera();
setupMouseLook(canvas, cam);
setupKeyboard(cam);

gl.enable(gl.DEPTH_TEST);

// ---------------- PHYSICS ----------------
const INSTANCE_COUNT = 300;
const physics = new PhysicsSystem(INSTANCE_COUNT);

const modelVBO = gl.createBuffer();

// ---------------- HELPERS ----------------
function bindMesh(mesh) {
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);

  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);

  gl.enableVertexAttribArray(normLoc);
  gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 24, 12);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
}

function bindInstanceMatrices() {
  gl.bindBuffer(gl.ARRAY_BUFFER, modelVBO);
  gl.bufferData(gl.ARRAY_BUFFER, physics.modelData, gl.DYNAMIC_DRAW);

  const stride = 64;

  gl.enableVertexAttribArray(m0Loc);
  gl.vertexAttribPointer(m0Loc, 4, gl.FLOAT, false, stride, 0);
  inst.vertexAttribDivisorANGLE(m0Loc, 1);

  gl.enableVertexAttribArray(m1Loc);
  gl.vertexAttribPointer(m1Loc, 4, gl.FLOAT, false, stride, 16);
  inst.vertexAttribDivisorANGLE(m1Loc, 1);

  gl.enableVertexAttribArray(m2Loc);
  gl.vertexAttribPointer(m2Loc, 4, gl.FLOAT, false, stride, 32);
  inst.vertexAttribDivisorANGLE(m2Loc, 1);

  gl.enableVertexAttribArray(m3Loc);
  gl.vertexAttribPointer(m3Loc, 4, gl.FLOAT, false, stride, 48);
  inst.vertexAttribDivisorANGLE(m3Loc, 1);
}

function drawInstanced(mesh) {
  bindMesh(mesh);
  bindInstanceMatrices();

  inst.drawElementsInstancedANGLE(
    gl.TRIANGLES,
    mesh.count,
    gl.UNSIGNED_SHORT,
    0,
    INSTANCE_COUNT
  );
}

// ---------------- LOOP ----------------
let last = 0;

function loop(t) {
  requestAnimationFrame(loop);

  const dt = (t - last) / 1000;
  last = t;

  cam.update(dt);
  physics.update(dt);

  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const proj = perspective(Math.PI / 3, canvas.width / canvas.height, 0.1, 500);
  gl.uniformMatrix4fv(projLoc, false, proj);

  const view = cam.view();
  gl.uniformMatrix4fv(viewLoc, false, view);

  drawInstanced(cube);
}

requestAnimationFrame(loop);
