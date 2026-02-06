export function createShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    const msg = gl.getShaderInfoLog(s) || "Unknown shader error";
    gl.deleteShader(s);
    throw new Error(msg);
  }
  return s;
}

export function createProgram(gl, vsSrc, fsSrc) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc);
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc);
  const p = gl.createProgram();
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    const msg = gl.getProgramInfoLog(p) || "Unknown link error";
    gl.deleteProgram(p);
    throw new Error(msg);
  }
  return p;
}
