import { normalize3, sub3, cross3, dot3 } from "./vec3.js";

export const Mat4 = {
  identity() {
    return new Float32Array([
      1,0,0,0,
      0,1,0,0,
      0,0,1,0,
      0,0,0,1
    ]);
  },

  perspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    const out = new Float32Array(16);
    out[0] = f / aspect;
    out[5] = f;
    out[10] = (far + near) * nf;
    out[11] = -1;
    out[14] = (2 * far * near) * nf;
    return out;
  },

  lookAt(eye, center, up) {
    const z = normalize3(sub3(eye, center));
    const x = normalize3(cross3(up, z));
    const y = cross3(z, x);

    const out = Mat4.identity();
    out[0] = x[0]; out[4] = x[1]; out[8]  = x[2];
    out[1] = y[0]; out[5] = y[1]; out[9]  = y[2];
    out[2] = z[0]; out[6] = z[1]; out[10] = z[2];

    out[12] = -dot3(x, eye);
    out[13] = -dot3(y, eye);
    out[14] = -dot3(z, eye);
    return out;
  },

  mul(a, b) {
    const out = new Float32Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) {
        out[c*4 + r] =
          a[0*4 + r] * b[c*4 + 0] +
          a[1*4 + r] * b[c*4 + 1] +
          a[2*4 + r] * b[c*4 + 2] +
          a[3*4 + r] * b[c*4 + 3];
      }
    }
    return out;
  }
};
