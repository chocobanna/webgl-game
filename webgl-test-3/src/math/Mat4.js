export class Mat4 {
  static identity() {
    const m = new Float32Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    return m;
  }

  // Column-major multiplication consistent with WebGL expectations
  static mul(a, b) {
    const o = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        o[c * 4 + r] =
          a[0 * 4 + r] * b[c * 4 + 0] +
          a[1 * 4 + r] * b[c * 4 + 1] +
          a[2 * 4 + r] * b[c * 4 + 2] +
          a[3 * 4 + r] * b[c * 4 + 3];
      }
    }
    return o;
  }

  static translate(m, v) {
    const [x, y, z] = v;
    const t = Mat4.identity();
    t[12] = x; t[13] = y; t[14] = z;
    return Mat4.mul(m, t);
  }

  static scale(m, v) {
    const [x, y, z] = v;
    const s = Mat4.identity();
    s[0] = x; s[5] = y; s[10] = z;
    return Mat4.mul(m, s);
  }

  static rotateX(m, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    const r = Mat4.identity();
    r[5] = c;  r[9]  = -s;
    r[6] = s;  r[10] = c;
    return Mat4.mul(m, r);
  }

  static rotateY(m, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    const r = Mat4.identity();
    r[0] = c;  r[8] = -s;
    r[2] = s;  r[10] = c;
    return Mat4.mul(m, r);
  }

  static rotateZ(m, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    const r = Mat4.identity();
    r[0] = c;  r[4] = -s;
    r[1] = s;  r[5] = c;
    return Mat4.mul(m, r);
  }

  static perspective(fovDeg, aspect, near, far) {
    const fov = (fovDeg * Math.PI) / 180;
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1 / (near - far);

    const m = new Float32Array(16);
    m[0] = f / aspect;
    m[5] = f;
    m[10] = (far + near) * nf;
    m[11] = -1;
    m[14] = (2 * far * near) * nf;
    return m;
  }
}
