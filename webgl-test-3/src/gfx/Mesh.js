export class Mesh {
  constructor(gl, geometry, program, { color = [1, 1, 1] } = {}) {
    this.gl = gl;
    this.geometry = geometry;
    this.program = program;
    this.color = color;

    this.vboPos = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPos);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.positions), gl.STATIC_DRAW);

    this.vboNrm = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboNrm);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geometry.normals), gl.STATIC_DRAW);
  }

  draw(camera, modelMatrix) {
    const gl = this.gl;
    const p = this.program;

    p.use();

    gl.uniformMatrix4fv(p.uni("uVP"), false, camera.vp);
    gl.uniformMatrix4fv(p.uni("uModel"), false, modelMatrix);
    gl.uniform3fv(p.uni("uColor"), new Float32Array(this.color));

    // Simple directional light
    gl.uniform3fv(p.uni("uLightDir"), new Float32Array([0.4, 1.0, 0.2]));

    const locPos = gl.getAttribLocation(p.program, "aPosition");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboPos);
    gl.enableVertexAttribArray(locPos);
    gl.vertexAttribPointer(locPos, 3, gl.FLOAT, false, 0, 0);

    const locNrm = gl.getAttribLocation(p.program, "aNormal");
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vboNrm);
    gl.enableVertexAttribArray(locNrm);
    gl.vertexAttribPointer(locNrm, 3, gl.FLOAT, false, 0, 0);

    gl.drawArrays(gl.TRIANGLES, 0, this.geometry.count);
  }
}
