export class GLContext {
  constructor(canvas) {
    this.canvas = canvas;
  }

  create() {
    const gl =
      this.canvas.getContext("webgl2", { antialias: true, alpha: false }) ||
      this.canvas.getContext("webgl", { antialias: true, alpha: false });

    if (!gl) throw new Error("WebGL not supported");

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    return gl;
  }
}
