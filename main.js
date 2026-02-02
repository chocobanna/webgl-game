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

// ---- Program
const program = createProgram(gl, vsSource, fsSource);
gl.useProgram(program);

// ---- Geometry (36 vertices; positions duplicated per face)
const positions = new Float32Array([
  // Front (z+)
  -1,-1, 1,   1,-1, 1,   1, 1, 1,
  -1,-1, 1,   1, 1, 1,  -1, 1, 1,

  // Back (z-)
  -1,-1,-1,  -1, 1,-1,   1, 1,-1,
  -1,-1,-1,   1, 1,-1,   1,-1,-1,

  // Top (y+)
  -1, 1,-1,  -1, 1, 1,   1, 1, 1,
  -1, 1,-1,   1, 1, 1,   1, 1,-1,

  // Bottom (y-)
  -1,-1,-1,   1,-1,-1,   1,-1, 1,
  -1,-1,-1,   1,-1, 1,  -1,-1, 1,

  // Right (x+)
   1,-1,-1,   1, 1,-1,   1, 1, 1,
   1,-1,-1,   1, 1, 1,   1,-1, 1,

  // Left (x-)
  -1,-1,-1,  -1,-1, 1,  -1, 1, 1,
  -1,-1,-1,  -1, 1, 1,  -1, 1,-1
]);

// UVs: same 0..1 square mapped onto each face
const uvs = new Float32Array([
  // Front
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1,

  // Back
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1,

  // Top
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1,

  // Bottom
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1,

  // Right
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1,

  // Left
  0,0,  1,0,  1,1,
  0,0,  1,1,  0,1
]);

// ---- Buffers
const posBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

const uvBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

// ---- Attributes
const aPos = gl.getAttribLocation(program, "a_position");
gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
gl.enableVertexAttribArray(aPos);
gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

const aUV = gl.getAttribLocation(program, "a_uv");
gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
gl.enableVertexAttribArray(aUV);
gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);

// ---- Uniforms
const uMVP = gl.getUniformLocation(program, "u_mvp");
const uTex = gl.getUniformLocation(program, "u_tex");

// ---- Texture
function loadTexture(gl, url) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);

  // 1x1 debug pixel so rendering works before image loads
  gl.texImage2D(
    gl.TEXTURE_2D, 0, gl.RGBA,
    1, 1, 0,
    gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([255, 0, 255, 255])
  );

  const img = new Image();
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);

    const isPOT = (v) => (v & (v - 1)) === 0;
    if (isPOT(img.width) && isPOT(img.height)) {
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    } else {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  };
  img.src = url;

  return tex;
}

const tex = loadTexture(gl, "./crate.png");

// bind texture unit 0
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, tex);
gl.uniform1i(uTex, 0);

// ---- GL state
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
gl.cullFace(gl.BACK);
gl.frontFace(gl.CCW);

// ---- Render loop
function render(timeMs) {
  resizeCanvasToDisplaySize(canvas, gl);

  const t = timeMs * 0.001;
  const aspect = canvas.width / canvas.height;

  const proj = mat4Perspective(Math.PI / 4, aspect, 0.1, 100);
  const view = mat4Translate(0, 0, -6);
  const rotY = mat4RotateY(t);
  const rotX = mat4RotateX(t * 0.7);

  // MVP = proj * view * (rotY * rotX)
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
