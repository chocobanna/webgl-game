export const vsSource = `
  attribute vec3 a_position;
  attribute vec2 a_uv;

  uniform mat4 u_mvp;

  varying vec2 v_uv;

  void main() {
    v_uv = a_uv;
    gl_Position = u_mvp * vec4(a_position, 1.0);
  }
`;

export const fsSource = `
  precision mediump float;

  varying vec2 v_uv;

  uniform sampler2D u_tex;

  void main() {
    gl_FragColor = texture2D(u_tex, v_uv);
  }
`;
