
import { createGL, resizeCanvasToDisplaySize, createProgram } from "./gl-utils.js";
import { vsSource, fsSource } from "./shaders.js";
import {
  mat4Multiply,
  mat4Perspective,
  mat4Translate,
  mat4RotateX,
  mat4RotateY
} from "./math.js";

const canvas = document.getElementById("c");
const gl = createGL(canvas);
console.log("WebGL:", gl.getParameter(gl.VERSION));

const program = createProgram(gl, vsSource, fsSource);
gl.useProgram(program);

// ---- Cube data (36 vertices: 6 faces * 2 triangles * 3 verts)
const positions = new Float32Array([
  // Front (z+)
  -1,-1, 1,  1,-1, 1,  1, 1, 1,
  -1,-1, 1,  1, 1, 1, -1, 1, 1,

  // Back (z-)
  -1,-1,-1, -1, 1,-1,  1, 1,-1,
  -1,-1,-1,  1, 1,-1,  1,-1,-1,

  // Top (y+)
  -1, 1,-1, -1, 1, 1,  1, 1, 1,
  -1, 1,-1,  1, 1, 1,  1, 1,-1,

  // Bottom (y-)
  -1,-1,-1,  1,-1,-1,  1,-1, 1,
  -1,-1,-1,  1,-1, 1, -1,-1, 1,

  // Right (x+)
   1,-1,-1,  1, 1,-1,  1, 1, 1,
   1,-1,-1,  1, 1, 1,  1,-1, 1,

  // Left (x-)
  -1,-1,-1, -1,-1, 1, -1, 1, 1,
  -1,-1,-1, -1, 1, 1, -1, 1,-1
]);

// Per-face colors (repeat each face color for its 6 vertices)
function faceColor(r,g,b) {
  const arr = [];
  for (let i = 0; i < 6; i++) arr.push(r,g,b);
  return arr;
}
const colors = new Float32Array([
  ...faceColor(1.0, 0.2, 0.2), // front
  ...faceColor(0.2, 1.0, 0.2), // back
  ...faceColor(0.2, 0.6, 1.0), // top
  ...faceColor(1.0, 1.0, 0.2), // bottom
  ...faceColor(1.0, 0.2, 1.0), // right
  ...faceColor(0.2, 1.0, 1.0)  // left
]);

// ---- Buffers
const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const colBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);

// ---- Attributes
const aPos = gl.getAttribLocation(program, "a_position");
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

const aCol = gl.getAttribLocation(program, "a_color");
gl.bindBuffer(gl.ARRAY_BUFFER, colBuffer);
gl.enableVertexAttribArray(aCol);
gl.vertexAttribPointer(aCol, 3, gl.FLOAT, false, 0, 0);

// ---- Uniform
const uMVP = gl.getUniformLocation(program, "u_mvp");

// ---- GL state
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);

function render(timeMs) {
  resizeCanvasToDisplaySize(canvas, gl);

  const t = timeMs * 0.001;
  const aspect = canvas.width / canvas.height;

  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
  const view = mat4Translate(0, 0, -6);
  const rotY = mat4RotateY(t);
  const rotX = mat4RotateX(t * 0.7);

  // MVP = proj * view * rotY * rotX
  const model = mat4Multiply(rotY, rotX);
  const pv = mat4Multiply(proj, view);
  const mvp = mat4Multiply(pv, model);

  gl.clearColor(0.05, 0.06, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.uniformMatrix4fv(uMVP, false, mvp);
  gl.drawArrays(gl.TRIANGLES, 0, 36);

  requestAnimationFrame(render);
}

requestAnimationFrame(render);