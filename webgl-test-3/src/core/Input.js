import { Engine } from "./core/Engine.js";
import { Scene } from "./scene/Scene.js";
import { Camera } from "./scene/Camera.js";
import { Node } from "./scene/Node.js";
import { Mesh } from "./gfx/Mesh.js";
import { Geometry } from "./gfx/Geometry.js";
import { Program } from "./gfx/Program.js";
import { FreeCameraController } from "./scene/FreeCameraController.js";

async function run() {
  const canvas = document.getElementById("glcanvas");
  const engine = new Engine(canvas);
  await engine.init();

  const scene = new Scene();

  // Camera + controller
  const camera = new Camera();
  camera.transform.position[1] = 1.6;
  camera.transform.position[2] = 4.0;
  camera.setPerspective(60, engine.aspect, 0.01, 200);
  camera.controller = new FreeCameraController(engine.input, canvas);
  scene.camera = camera;

  // Shared shader program
  const program = await Program.fromFiles(
    engine.gl,
    "./src/shaders/lit.vert.glsl",
    "./src/shaders/lit.frag.glsl"
  );

  // Floor
  const floor = new Node("Floor");
  floor.mesh = new Mesh(
    engine.gl,
    Geometry.plane(20),
    program,
    { color: [0.25, 0.27, 0.3] }
  );
  scene.root.addChild(floor);

  // Cube (centered, slightly above floor)
  const cube = new Node("Cube");
  cube.transform.position[1] = 0.5;
  cube.mesh = new Mesh(
    engine.gl,
    Geometry.cube(1),
    program,
    { color: [0.85, 0.35, 0.25] }
  );
  scene.root.addChild(cube);

  // Optional: slowly spin cube (comment out if you hate joy)
  cube.update = (dt) => {
    cube.transform.rotation[1] += dt * 0.6;
  };

  engine.setScene(scene);
  engine.start();
}

run().catch(console.error);
