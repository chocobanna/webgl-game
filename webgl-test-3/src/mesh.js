export function makeMesh(gl,data){
 const vbo=gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER,vbo);
 gl.bufferData(gl.ARRAY_BUFFER,data.vertices,gl.STATIC_DRAW);

 const ibo=gl.createBuffer();
 gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibo);
 gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,data.idx,gl.STATIC_DRAW);

 return {vbo,ibo,count:data.idx.length};
}
