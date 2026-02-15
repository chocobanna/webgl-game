import { initGL } from "./gl.js";
import { Camera, setupMouseLook, setupKeyboard } from "./camera.js";
import { perspective } from "./math.js";
import { createProgram } from "./shader.js";
import { makeMesh } from "./mesh.js";
import { createCube, createSphere, createCylinder } from "./primitives.js";

const { gl, canvas } = initGL("gl");

// --- Instancing extension (WebGL1) ---
const inst = gl.getExtension("ANGLE_instanced_arrays");
if(!inst){
  throw new Error("ANGLE_instanced_arrays not supported on this GPU/browser.");
}

const program = createProgram(gl);
gl.useProgram(program);

const posLoc = gl.getAttribLocation(program, "pos");
const normLoc = gl.getAttribLocation(program, "normal");
const instLoc = gl.getAttribLocation(program, "instanceOffset");

const projLoc = gl.getUniformLocation(program, "proj");
const viewLoc = gl.getUniformLocation(program, "view");

// meshes
const cube = makeMesh(gl, createCube());
const sphere = makeMesh(gl, createSphere());
const cyl = makeMesh(gl, createCylinder());

// camera
const cam = new Camera();
setupMouseLook(canvas, cam);
setupKeyboard(cam);

gl.enable(gl.DEPTH_TEST);

// --- Create instance offsets (THIS is the "show it" part: thousands of cubes) ---
const INSTANCE_COUNT = 8000; // one draw call, thousands of cubes
const offsets = new Float32Array(INSTANCE_COUNT * 3);

let k = 0;
for(let i=0;i<INSTANCE_COUNT;i++){
  // spread in a big area
  const x = (Math.random() - 0.5) * 200;
  const y = (Math.random() - 0.5) * 20;
  const z = (Math.random() - 0.5) * 200;
  offsets[k++] = x;
  offsets[k++] = y;
  offsets[k++] = z;
}

const instanceVBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
gl.bufferData(gl.ARRAY_BUFFER, offsets, gl.STATIC_DRAW);

// helper to bind common vertex attrs for a mesh
function bindMeshAttributes(mesh){
  // interleaved: pos(3) + normal(3) => 24 bytes stride
  gl.bindBuffer(gl.ARRAY_BUFFER, mesh.vbo);

  gl.enableVertexAttribArray(posLoc);
  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);

  gl.enableVertexAttribArray(normLoc);
  gl.vertexAttribPointer(normLoc, 3, gl.FLOAT, false, 24, 12);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.ibo);
}

// draw a single object by giving it a one-off instance offset (no instancing)
function drawOne(mesh, ox, oy, oz){
  bindMeshAttributes(mesh);

  // feed instanceOffset as a constant attribute (divisor 0 + disabled array)
  gl.disableVertexAttribArray(instLoc);
  gl.vertexAttrib3f(instLoc, ox, oy, oz);

  gl.drawElements(gl.TRIANGLES, mesh.count, gl.UNSIGNED_SHORT, 0);
}

// draw instanced cubes (one call)
function drawInstancedCubes(){
  bindMeshAttributes(cube);

  gl.bindBuffer(gl.ARRAY_BUFFER, instanceVBO);
  gl.enableVertexAttribArray(instLoc);
  gl.vertexAttribPointer(instLoc, 3, gl.FLOAT, false, 12, 0);

  // divisor=1 => one offset per instance
  inst.vertexAttribDivisorANGLE(instLoc, 1);

  inst.drawElementsInstancedANGLE(
    gl.TRIANGLES,
    cube.count,
    gl.UNSIGNED_SHORT,
    0,
    INSTANCE_COUNT
  );

  // clean up divisor so non-instanced draws don't get weird later
  inst.vertexAttribDivisorANGLE(instLoc, 0);
}

let last = 0;
function loop(t){
  requestAnimationFrame(loop);
  const dt = (t - last) / 1000;
  last = t;

  cam.update(dt);

  gl.clearColor(0,0,0,1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const proj = perspective(Math.PI/3, canvas.width/canvas.height, 0.1, 500);
  gl.uniformMatrix4fv(projLoc, false, proj);

  const view = cam.view();
  gl.uniformMatrix4fv(viewLoc, false, view);

  // --- THIS is GPU instancing: 8000 cubes in one draw call ---
  drawInstancedCubes();

  // A few non-instanced primitives near origin so you can tell types apart
  drawOne(sphere, 0, 2, 0);
  drawOne(cyl, 3, 2, 0);
  drawOne(cyl, -3, 2, 0);
}
requestAnimationFrame(loop);
