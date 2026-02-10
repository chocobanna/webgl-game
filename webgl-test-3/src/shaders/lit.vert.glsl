attribute vec3 aPosition;
attribute vec3 aNormal;

uniform mat4 uVP;
uniform mat4 uModel;

varying vec3 vNormal;

void main() {
  // For now: assume no non-uniform scale (fine for this demo)
  vNormal = mat3(uModel) * aNormal;
  gl_Position = uVP * uModel * vec4(aPosition, 1.0);
}
