export function createProgram(gl){
  const vs=`
attribute vec3 pos;
attribute vec3 normal;

// model matrix split across 4 attributes
attribute vec4 m0;
attribute vec4 m1;
attribute vec4 m2;
attribute vec4 m3;

uniform mat4 proj;
uniform mat4 view;

varying vec3 vNormal;
varying vec3 vPos;

void main(){
  mat4 model = mat4(m0, m1, m2, m3);

  vec4 worldPos = model * vec4(pos,1.0);
  vec4 viewPos  = view * worldPos;

  vPos = viewPos.xyz;

  mat3 normalMat = mat3(model);
  vNormal = mat3(view) * (normalMat * normal);

  gl_Position = proj * viewPos;
}`;

  const fs=`
precision mediump float;

varying vec3 vNormal;
varying vec3 vPos;

void main(){
  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(0.5,1.0,0.3));
  vec3 V = normalize(-vPos);

  float diff = max(dot(N,L),0.0);

  vec3 H = normalize(L+V);
  float spec = pow(max(dot(N,H),0.0),32.0);

  vec3 base = vec3(0.4,0.7,1.0);
  vec3 color = base*0.15 + base*diff + vec3(1.0)*spec*0.6;

  gl_FragColor = vec4(color,1.0);
}`;

  function compile(type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    return s;
  }

  const p=gl.createProgram();
  gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));
  gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));
  gl.linkProgram(p);
  return p;
}
