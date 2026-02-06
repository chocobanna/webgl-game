import { createProgram } from "./gfx/glUtils.js";
import { VERT_SRC, FRAG_SRC } from "./gfx/shaders.js";
import { createCubeMesh } from "./gfx/cubeMesh.js";
import { Mat4 } from "./math/mat4.js";
import { normalize3, sub3, dot3 } from "./math/vec3.js";
import { FreeCamera } from "./camera/freeCamera.js";
import { Keyboard } from "./input/Keyboard.js";
import { PointerLook } from "./input/PointerLook.js";

export class GLSystem {
  /** @param {HTMLCanvasElement} canvas */
  constructor(canvas) {
    const gl = canvas.getContext("webgl2", { antialias: true, alpha: false });
    if (!gl) throw new Error("WebGL2 not supported.");

    this.canvas = canvas;
    this.gl = gl;

    // Timing
    this.time = 0;
    this.dt = 0;
    this._last = performance.now();

    // Input + camera
    this.keyboard = new Keyboard(canvas);
    this.camera = new FreeCamera();
    this.pointerLook = new PointerLook(canvas, this.camera);

    // Resize + GL state
    this._installResize();
    this._setDefaultState();

    // Program + mesh
    this.program = createProgram(gl, VERT_SRC, FRAG_SRC);
    this.mesh = createCubeMesh(gl);

    this.u = {
      uMVP: gl.getUniformLocation(this.program, "uMVP"),
      uModel: gl.getUniformLocation(this.program, "uModel"),
      uLightDir: gl.getUniformLocation(this.program, "uLightDir"),
      uColor: gl.getUniformLocation(this.program, "uColor"),
    };

    this._raf = requestAnimationFrame(this._frame);
  }

  _setDefaultState() {
    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK); // cube is CCW outward

    gl.clearColor(0.06, 0.06, 0.08, 1.0);
  }

  _installResize() {
    const resize = () => {
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const w = Math.floor(this.canvas.clientWidth * dpr);
      const h = Math.floor(this.canvas.clientHeight * dpr);
      if (this.canvas.width !== w || this.canvas.height !== h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.gl.viewport(0, 0, w, h);
      }
    };
    new ResizeObserver(resize).observe(this.canvas);
    window.addEventListener("resize", resize, { passive: true });
    resize();
  }

  _frame = (now) => {
    const gl = this.gl;

    // Timing
    this.dt = (now - this._last) * 0.001;
    this._last = now;
    this.time += this.dt;

    // Update camera
    this.camera.updateFromKeyboard(this.keyboard, this.dt);

    // Render
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = this.canvas.width / this.canvas.height;
    const proj = Mat4.perspective(60 * Math.PI / 180, aspect, 0.1, 200.0);

    const forward = this.camera.forward();
    const worldUp = [0, 1, 0];
    const altUp = [0, 0, 1];
    const upRef = Math.abs(dot3(forward, worldUp)) > 0.999 ? altUp : worldUp;

    const center = [
      this.camera.pos[0] + forward[0],
      this.camera.pos[1] + forward[1],
      this.camera.pos[2] + forward[2],
    ];

    const view = Mat4.lookAt(this.camera.pos, center, upRef);

    // Static model
    const model = Mat4.identity();
    const mvp = Mat4.mul(proj, Mat4.mul(view, model));

    gl.useProgram(this.program);
    gl.bindVertexArray(this.mesh.vao);

    gl.uniformMatrix4fv(this.u.uMVP, false, mvp);
    gl.uniformMatrix4fv(this.u.uModel, false, model);
    gl.uniform3fv(this.u.uLightDir, normalize3([0.6, 1.0, 0.4]));
    gl.uniform3fv(this.u.uColor, [0.25, 0.8, 1.0]);

    gl.drawElements(gl.TRIANGLES, this.mesh.indexCount, gl.UNSIGNED_SHORT, 0);

    gl.bindVertexArray(null);
    this._raf = requestAnimationFrame(this._frame);
  };
}
