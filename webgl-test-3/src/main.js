import { initGL } from "./gl.js";
import { Camera, setupMouseLook, setupKeyboard } from "./camera.js";
import { perspective } from "./math.js";
import { createProgram } from "./shader.js";
import { makeMesh } from "./mesh.js";
import { createCube, createSphere, createCylinder } from "./primitives.js";

const { gl, canvas } = initGL("gl");

const program = createProgram(gl);
gl.useProgram(program);

const posLoc = gl.getAttribLocation(program,"pos");
const normLoc = gl.getAttribLocation(program,"normal");

const projLoc = gl.getUniformLocation(program,"proj");
const viewLoc = gl.getUniformLocation(program,"view");

const cube = makeMesh(gl, createCube());
const sphere = makeMesh(gl, createSphere());
const cyl = makeMesh(gl, createCylinder());

const cam = new Camera();
setupMouseLook(canvas, cam);
setupKeyboard(cam);

gl.enable(gl.DEPTH_TEST);

let last = 0;

function drawMesh(mesh, view){
 gl.bindBuffer(gl.ARRAY_BUFFER,mesh.vbo);
 gl.vertexAttribPointer(posLoc,3,gl.FLOAT,false,24,0);
 gl.vertexAttribPointer(normLoc,3,gl.FLOAT,false,24,12);
 gl.enableVertexAttribArray(posLoc);
 gl.enableVertexAttribArray(normLoc);

 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,mesh.ibo);
 gl.uniformMatrix4fv(viewLoc,false,view);
 gl.drawElements(gl.TRIANGLES,mesh.count,gl.UNSIGNED_SHORT,0);
}

function loop(t){
 requestAnimationFrame(loop);
 const dt=(t-last)/1000;
 last=t;

 cam.update(dt);

 gl.clearColor(0,0,0,1);
 gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

 const proj=perspective(Math.PI/3,canvas.width/canvas.height,0.1,100);
 gl.uniformMatrix4fv(projLoc,false,proj);

 for(let i=-12;i<=12;i+=6){
   for(let j=-12;j<=12;j+=6){
     const view=cam.viewOffset(i,j);
     const r=Math.abs((i+j)%3);
     if(r===0) drawMesh(cube,view);
     else if(r===1) drawMesh(sphere,view);
     else drawMesh(cyl,view);
   }
 }
}

requestAnimationFrame(loop);
