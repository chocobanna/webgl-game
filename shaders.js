export const vsSource = `
  attribute vec3 a_position;
  attribute vec3 a_color;

  uniform mat4 u_mvp;

  varying vec3 v_color;

  void main() {
    v_color = a_color;
    gl_Position = u_mvp * vec4(a_position, 1.0);
  }
`;

export const fsSource = `
  precision mediump float;

  varying vec3 v_color;

  void main() {
    gl_FragColor = vec4(v_color, 1.0);
  }
`;
