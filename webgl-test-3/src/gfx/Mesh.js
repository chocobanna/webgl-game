export class Mesh {
  constructor(gl, geometry, program) {
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;

    this.vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);
  }

  draw(camera, modelMatrix) {
    const gl = this.gl;
    const p = this.program;

    p.use();

    // uniforms
    gl.uniformMatrix4fv(p.uni("uVP"), false, camera.vp);
    gl.uniformMatrix4fv(p.uni("uModel"), false, modelMatrix);

    // attributes
    const locPos = gl.getAttribLocation(p.program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vbo);
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.geometry.count);
  }
}
