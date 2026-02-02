export function createCubeMesh(gl, program) {
  const positions = new Float32Array([
    // Front
    -1,-1, 1,   1,-1, 1,   1, 1, 1,
    -1,-1, 1,   1, 1, 1,  -1, 1, 1,
    // Back
    -1,-1,-1,  -1, 1,-1,   1, 1,-1,
    -1,-1,-1,   1, 1,-1,   1,-1,-1,
    // Top
    -1, 1,-1,  -1, 1, 1,   1, 1, 1,
    -1, 1,-1,   1, 1, 1,   1, 1,-1,
    // Bottom
    -1,-1,-1,   1,-1,-1,   1,-1, 1,
    -1,-1,-1,   1,-1, 1,  -1,-1, 1,
    // Right
     1,-1,-1,   1, 1,-1,   1, 1, 1,
     1,-1,-1,   1, 1, 1,   1,-1, 1,
    // Left
    -1,-1,-1,  -1,-1, 1,  -1, 1, 1,
    -1,-1,-1,  -1, 1, 1,  -1, 1,-1
  ]);

  const uvs = new Float32Array([
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1,
    0,0, 1,0, 1,1,  0,0, 1,1, 0,1
  ]);

  const aPos = gl.getAttribLocation(program, "a_position");
  const aUV  = gl.getAttribLocation(program, "a_uv");
  if (aPos < 0) throw new Error("Attribute a_position not found");
  if (aUV < 0) throw new Error("Attribute a_uv not found");

  const posBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);

  return {
    bind() {
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
      gl.enableVertexAttribArray(aUV);
      gl.vertexAttribPointer(aUV, 2, gl.FLOAT, false, 0, 0);
    },
    draw() {
      gl.drawArrays(gl.TRIANGLES, 0, 36);
    }
  };
}
