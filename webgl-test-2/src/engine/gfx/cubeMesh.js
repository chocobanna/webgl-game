export function createCubeMesh(gl) {
  // 24 verts (4 per face), each face CCW when viewed from outside
  const positions = new Float32Array([
    // +X
     1,-1, 1,   1,-1,-1,   1, 1,-1,   1, 1, 1,
    // -X
    -1,-1,-1,  -1,-1, 1,  -1, 1, 1,  -1, 1,-1,
    // +Y
    -1, 1, 1,   1, 1, 1,   1, 1,-1,  -1, 1,-1,
    // -Y
    -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,
    // +Z
    -1,-1, 1,   1,-1, 1,   1, 1, 1,  -1, 1, 1,
    // -Z
     1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1
  ]);

  const normals = new Float32Array([
    // +X
     1,0,0,  1,0,0,  1,0,0,  1,0,0,
    // -X
    -1,0,0, -1,0,0, -1,0,0, -1,0,0,
    // +Y
     0,1,0,  0,1,0,  0,1,0,  0,1,0,
    // -Y
     0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
    // +Z
     0,0,1,  0,0,1,  0,0,1,  0,0,1,
    // -Z
     0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1
  ]);

  const indices = new Uint16Array([
     0, 1, 2,   0, 2, 3,
     4, 5, 6,   4, 6, 7,
     8, 9,10,   8,10,11,
    12,13,14,  12,14,15,
    16,17,18,  16,18,19,
    20,21,22,  20,22,23
  ]);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const posBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);

  const nrmBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, nrmBuf);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0);

  const idxBuf = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

  gl.bindVertexArray(null);
  return { vao, indexCount: indices.length };
}
