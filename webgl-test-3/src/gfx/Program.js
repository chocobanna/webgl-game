export class Program {
  constructor(gl, vsSource, fsSource) {
    this.gl = gl;
    this.program = Program._link(gl, vsSource, fsSource);
    this.uniforms = new Map();
  }

  use() {
    this.gl.useProgram(this.program);
  }

  uni(name) {
    if (this.uniforms.has(name)) return this.uniforms.get(name);
    const loc = this.gl.getUniformLocation(this.program, name);
    this.uniforms.set(name, loc);
    return loc;
  }

  static async fromFiles(gl, vsPath, fsPath) {
    const [vs, fs] = await Promise.all([
      fetch(vsPath).then((r) => r.text()),
      fetch(fsPath).then((r) => r.text()),
    ]);
    return new Program(gl, vs, fs);
  }

  static _compile(gl, type, src) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const msg = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error("Shader compile failed:\n" + msg);
    }
    return sh;
  }

  static _link(gl, vsSource, fsSource) {
    const vs = Program._compile(gl, gl.VERTEX_SHADER, vsSource);
    const fs = Program._compile(gl, gl.FRAGMENT_SHADER, fsSource);

    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      const msg = gl.getProgramInfoLog(p);
      gl.deleteProgram(p);
      throw new Error("Program link failed:\n" + msg);
    }
    return p;
  }
}
