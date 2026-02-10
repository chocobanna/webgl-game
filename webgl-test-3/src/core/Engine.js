import { GLContext } from "./GLContext.js";
import { Time } from "./Time.js";
import { setupResize } from "./Resize.js";
import { Renderer } from "../gfx/Renderer.js";
import { Input } from "./Input.js";

export class Engine {
  constructor(canvas) {
    this.canvas = canvas;
    this.scene = null;
    this.time = new Time();
    this.ctx = new GLContext(canvas);
    this.gl = null;
    this.renderer = null;
    this.input = null;

    this._running = false;
    this._frame = this._frame.bind(this);
  }

  get aspect() {
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  async init() {
    this.gl = this.ctx.create();
    this.renderer = new Renderer(this.gl);
    this.input = new Input(window);

    setupResize(this.canvas, this.gl, () => {
      if (this.scene?.camera) this.scene.camera.setAspect(this.aspect);
    });
  }

  setScene(scene) {
    this.scene = scene;
  }

  start() {
    if (!this.scene) throw new Error("Engine.start(): no scene set");
    this._running = true;
    this.time.reset();
    requestAnimationFrame(this._frame);
  }

  stop() {
    this._running = false;
  }

  _frame(nowMs) {
    if (!this._running) return;

    this.time.update(nowMs);

    this.scene.update(this.time.dt);

    this.renderer.render(this.scene);

    requestAnimationFrame(this._frame);
  }
}
