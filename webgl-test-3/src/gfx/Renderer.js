export class Renderer {
  constructor(gl) {
    this.gl = gl;
  }

  render(scene) {
    const gl = this.gl;

    gl.clearColor(0.06, 0.06, 0.07, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    if (!scene.camera) return;
    scene.camera.updateMatrices();

    scene.root.traverse((node) => {
      if (!node.mesh) return;
      node.mesh.draw(scene.camera, node.transform.worldMatrix);
    });
  }
}
