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

function render(timeMs) {
  resizeCanvasToDisplaySize(canvas, gl);

  const t = timeMs * 0.001;
  const aspect = canvas.width / canvas.height;

  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
  const view = mat4Translate(0, 0, -6);
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
