import { Engine } from "./core/Engine.js";
import { Scene } from "./scene/Scene.js";
import { Camera } from "./scene/Camera.js";
import { Node } from "./scene/Node.js";
import { Mesh } from "./gfx/Mesh.js";
import { Geometry } from "./gfx/Geometry.js";
import { Program } from "./gfx/Program.js";
import { Mat4 } from "./math/Mat4.js";

async function run() {
  const canvas = document.getElementById("glcanvas");
  const engine = new Engine(canvas);
  await engine.init();

  const scene = new Scene();

  const camera = new Camera();
  camera.transform.position[2] = 2.5;
  camera.setPerspective(60, engine.aspect, 0.01, 100);
  scene.camera = camera;

  // Triangle demo node
  const tri = new Node("Triangle");
  tri.mesh = new Mesh(
    engine.gl,
    Geometry.triangle(),
    await Program.fromFiles(engine.gl, "./src/shaders/basic.vert.glsl", "./src/shaders/basic.frag.glsl")
  );
  scene.root.addChild(tri);

  engine.setScene(scene);
  engine.start();
}

run().catch(console.error);
