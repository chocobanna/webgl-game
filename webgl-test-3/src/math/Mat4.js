export class Mat4 {
  static identity() {
    const m = new Float32Array(16);
    m[0] = m[5] = m[10] = m[15] = 1;
    return m;
  }

  static mul(a, b) {
    const o = new Float32Array(16);
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        o[c + r * 4] =
          a[0 + r * 4] * b[c + 0 * 4] +
          a[1 + r * 4] * b[c + 1 * 4] +
          a[2 + r * 4] * b[c + 2 * 4] +
          a[3 + r * 4] * b[c + 3 * 4];
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

  static rotateY(m, rad) {
    const c = Math.cos(rad), s = Math.sin(rad);
    const r = Mat4.identity();
    r[0] = c;  r[2] = s;
    r[8] = -s; r[10] = c;
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
