export function createCube(){
  const v = new Float32Array([
    // FRONT
    -1,-1, 1, 0,0,1,   1,-1, 1, 0,0,1,   1, 1, 1, 0,0,1,
    -1,-1, 1, 0,0,1,   1, 1, 1, 0,0,1,  -1, 1, 1, 0,0,1,

    // BACK
    -1,-1,-1, 0,0,-1,  1, 1,-1, 0,0,-1,  1,-1,-1, 0,0,-1,
    -1,-1,-1, 0,0,-1, -1, 1,-1, 0,0,-1,  1, 1,-1, 0,0,-1,

    // LEFT
    -1,-1,-1, -1,0,0, -1,-1, 1, -1,0,0, -1, 1, 1, -1,0,0,
    -1,-1,-1, -1,0,0, -1, 1, 1, -1,0,0, -1, 1,-1, -1,0,0,

    // RIGHT
     1,-1,-1, 1,0,0,   1, 1, 1, 1,0,0,   1,-1, 1, 1,0,0,
     1,-1,-1, 1,0,0,   1, 1,-1, 1,0,0,   1, 1, 1, 1,0,0,

    // TOP
    -1, 1,-1, 0,1,0,  -1, 1, 1, 0,1,0,   1, 1, 1, 0,1,0,
    -1, 1,-1, 0,1,0,   1, 1, 1, 0,1,0,   1, 1,-1, 0,1,0,

    // BOTTOM
    -1,-1,-1, 0,-1,0,  1,-1, 1, 0,-1,0, -1,-1, 1, 0,-1,0,
    -1,-1,-1, 0,-1,0,  1,-1,-1, 0,-1,0,  1,-1, 1, 0,-1,0
  ]);

  const idx = new Uint16Array([...Array(36).keys()]);
  return { vertices: v, idx };
}

export function createSphere(r=1, seg=16){
  const v=[], i=[];
  for(let y=0;y<=seg;y++){
    const py=y/seg*Math.PI;
    for(let x=0;x<=seg;x++){
      const tx=x/seg*Math.PI*2;
      const sx=Math.sin(py)*Math.cos(tx);
      const sy=Math.cos(py);
      const sz=Math.sin(py)*Math.sin(tx);
      v.push(sx*r,sy*r,sz*r, sx,sy,sz);
    }
  }
  for(let y=0;y<seg;y++){
    for(let x=0;x<seg;x++){
      const a=y*(seg+1)+x;
      const b=a+seg+1;
      i.push(a,b,a+1, b,b+1,a+1);
    }
  }
  return { vertices:new Float32Array(v), idx:new Uint16Array(i) };
}

export function createCylinder(h=2, r=1, seg=20){
  const v=[], i=[];
  for(let s=0;s<=seg;s++){
    const t=s/seg*Math.PI*2;
    const x=Math.cos(t), z=Math.sin(t);
    v.push(x*r,-h/2,z*r, x,0,z);
    v.push(x*r, h/2,z*r, x,0,z);
  }
  for(let s=0;s<seg;s++){
    const k=s*2;
    i.push(k,k+1,k+2, k+1,k+3,k+2);
  }
  return { vertices:new Float32Array(v), idx:new Uint16Array(i) };
}
