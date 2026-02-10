precision mediump float;

uniform vec3 uColor;
uniform vec3 uLightDir;

varying vec3 vNormal;

void main() {
  vec3 n = normalize(vNormal);
  vec3 l = normalize(uLightDir);

  float ndl = max(dot(n, l), 0.0);
  float ambient = 0.25;
  float diff = ambient + ndl * 0.75;

  gl_FragColor = vec4(uColor * diff, 1.0);
}
