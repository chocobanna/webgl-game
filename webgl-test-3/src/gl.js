export function initGL(id){
 const canvas=document.getElementById(id);
 const gl=canvas.getContext("webgl");

 function resize(){
   canvas.width=innerWidth;
   canvas.height=innerHeight;
   gl.viewport(0,0,canvas.width,canvas.height);
 }
 resize();
 addEventListener("resize",resize);

 return {gl,canvas};
}
