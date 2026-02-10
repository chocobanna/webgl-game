export class Geometry {
  constructor(positions) {
    this.positions = positions;
    this.count = positions.length / 3;
  }

  static triangle() {
    return new Geometry([
      0.0,  0.6, 0.0,
     -0.6, -0.6, 0.0,
      0.6, -0.6, 0.0,
    ]);
  }
}
