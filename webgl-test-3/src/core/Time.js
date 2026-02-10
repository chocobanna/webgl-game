export class Time {
  constructor() {
    this.t = 0;
    this.dt = 0;
    this._last = 0;
  }

  reset() {
    this.t = 0;
    this.dt = 0;
    this._last = 0;
  }

  update(nowMs) {
    const now = nowMs * 0.001;
    if (this._last === 0) this._last = now;
    this.dt = Math.min(0.05, now - this._last);
    this.t += this.dt;
    this._last = now;
  }
}
