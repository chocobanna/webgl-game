export function createProgram(gl){
  const vs=`
attribute vec3 pos;
attribute vec3 normal;

// per-instance translation (divisor = 1)
attribute vec3 instanceOffset;

uniform mat4 proj;
uniform mat4 view;

varying vec3 vNormal;
varying vec3 vPos;

void main(){
  vec3 p = pos + instanceOffset;
  vec4 wp = vec4(p,1.0);

  vec3 vp = (view * wp).xyz;
  vPos = vp;

  // normals in view space (OK since we only translate instances)
  vNormal = mat3(view) * normal;

  gl_Position = proj * view * wp;
}`;

  const fs=`
precision mediump float;

varying vec3 vNormal;
varying vec3 vPos;

void main(){
  vec3 N = normalize(vNormal);
  vec3 L = normalize(vec3(0.5,1.0,0.3));
  vec3 V = normalize(-vPos);

  float diff = max(dot(N,L), 0.0);

  vec3 R = reflect(-L, N);
  float spec = pow(max(dot(R, V), 0.0), 32.0);

  vec3 base = vec3(0.4,0.7,1.0);
  vec3 ambient = base * 0.15;
  vec3 diffuse = base * diff;
  vec3 specular = vec3(1.0) * spec * 0.6;

  gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}`;

  function compile(type,src){
    const s=gl.createShader(type);
    gl.shaderSource(s,src);
    gl.compileShader(s);
    if(!gl.getShaderParameter(s, gl.COMPILE_STATUS)){
      throw new Error(gl.getShaderInfoLog(s) || "shader compile failed");
    }
    return s;
  }

  const p=gl.createProgram();
  gl.attachShader(p, compile(gl.VERTEX_SHADER, vs));
  gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);

  if(!gl.getProgramParameter(p, gl.LINK_STATUS)){
    throw new Error(gl.getProgramInfoLog(p) || "program link failed");
  }
  return p;
}
