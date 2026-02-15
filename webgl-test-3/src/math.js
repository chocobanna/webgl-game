export function perspective(fov, aspect, near, far){
 const f=1/Math.tan(fov/2);
 return new Float32Array([
  f/aspect,0,0,0,
  0,f,0,0,
  0,0,(far+near)/(near-far),-1,
  0,0,(2*far*near)/(near-far),0
 ]);
}

export function viewMatrix(pos,yaw,pitch){
 const cy=Math.cos(yaw), sy=Math.sin(yaw);
 const cp=Math.cos(pitch), sp=Math.sin(pitch);

 const x=[cy,0,-sy];
 const y=[sy*sp,cp,cy*sp];
 const z=[sy*cp,-sp,cy*cp];

 return new Float32Array([
  x[0],y[0],z[0],0,
  x[1],y[1],z[1],0,
  x[2],y[2],z[2],0,
 -(x[0]*pos[0]+x[1]*pos[1]+x[2]*pos[2]),
 -(y[0]*pos[0]+y[1]*pos[1]+y[2]*pos[2]),
 -(z[0]*pos[0]+z[1]*pos[1]+z[2]*pos[2]),
 1
 ]);
}
