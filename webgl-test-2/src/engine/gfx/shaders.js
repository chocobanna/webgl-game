export const VERT_SRC = `#version 300 es
precision highp float;

layout(location=0) in vec3 aPos;
layout(location=1) in vec3 aNormal;

uniform mat4 uMVP;
uniform mat4 uModel;

out vec3 vN;
out vec3 vWPos;

void main() {
  vec4 wPos = uModel * vec4(aPos, 1.0);
  vWPos = wPos.xyz;
  vN = mat3(uModel) * aNormal;
  gl_Position = uMVP * vec4(aPos, 1.0);
}
`;

export const FRAG_SRC = `#version 300 es
precision highp float;

in vec3 vN;
in vec3 vWPos;

uniform vec3 uLightDir;
uniform vec3 uColor;

out vec4 outColor;

void main() {
  vec3 N = normalize(vN);
  vec3 L = normalize(uLightDir);

  float diff = max(dot(N, L), 0.0);
  float ambient = 0.18;

  vec3 V = normalize(-vWPos);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 64.0) * 0.25;

  vec3 col = uColor * (ambient + diff) + spec;
  outColor = vec4(col, 1.0);
}
`;
