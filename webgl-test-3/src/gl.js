export function initGL(id){
  const canvas = document.getElementById(id);
  const gl = canvas.getContext("webgl", { antialias:true });

  if(!gl) throw new Error("WebGL not supported");

  function resize(){
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    gl.viewport(0,0,canvas.width,canvas.height);
  }
  resize();
  addEventListener("resize", resize);

  return { gl, canvas };
}
