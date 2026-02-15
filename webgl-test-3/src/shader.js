export function createProgram(gl){

const vs=`
attribute vec3 pos;
attribute vec3 normal;

uniform mat4 proj;
uniform mat4 view;

varying vec3 vNormal;
varying vec3 vPos;

void main(){
 vec4 wp=vec4(pos,1.0);
 vPos=(view*wp).xyz;
 vNormal=mat3(view)*normal;
 gl_Position=proj*view*wp;
}`;

const fs=`
precision mediump float;
varying vec3 vNormal;
varying vec3 vPos;

void main(){
 vec3 N=normalize(vNormal);
 vec3 L=normalize(vec3(0.5,1.0,0.3));
 vec3 V=normalize(-vPos);

 float diff=max(dot(N,L),0.0);
 vec3 R=reflect(-L,N);
 float spec=pow(max(dot(R,V),0.0),32.0);

 vec3 base=vec3(0.4,0.7,1.0);
 vec3 color=base*0.15 + base*diff + vec3(1.0)*spec*0.6;

 gl_FragColor=vec4(color,1.0);
}`;

function compile(t,s){
 const sh=gl.createShader(t);
 gl.shaderSource(sh,s);
 gl.compileShader(sh);
 return sh;
}

const p=gl.createProgram();
gl.attachShader(p,compile(gl.VERTEX_SHADER,vs));
gl.attachShader(p,compile(gl.FRAGMENT_SHADER,fs));
gl.linkProgram(p);
return p;
}
