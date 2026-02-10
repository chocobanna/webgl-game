export class Geometry {
  constructor({ positions, normals }) {
    this.positions = positions;
    this.normals = normals;
    this.count = positions.length / 3;
  }

  static plane(size = 10) {
    const s = size * 0.5;
    // Two triangles, y = 0
    const positions = [
      -s, 0, -s,
       s, 0, -s,
       s, 0,  s,

      -s, 0, -s,
       s, 0,  s,
      -s, 0,  s,
    ];
    const normals = [
      0, 1, 0,  0, 1, 0,  0, 1, 0,
      0, 1, 0,  0, 1, 0,  0, 1, 0,
    ];
    return new Geometry({ positions, normals });
  }

  static cube(size = 1) {
    const s = size * 0.5;

    // 6 faces * 2 triangles * 3 verts = 36 verts
    const positions = [];
    const normals = [];

    const pushFace = (nx, ny, nz, verts) => {
      for (let i = 0; i < verts.length; i += 3) {
        positions.push(verts[i], verts[i + 1], verts[i + 2]);
        normals.push(nx, ny, nz);
      }
    };

    // +Z
    pushFace(0, 0, 1, [
      -s, -s,  s,   s, -s,  s,   s,  s,  s,
      -s, -s,  s,   s,  s,  s,  -s,  s,  s,
    ]);
    // -Z
    pushFace(0, 0, -1, [
       s, -s, -s,  -s, -s, -s,  -s,  s, -s,
       s, -s, -s,  -s,  s, -s,   s,  s, -s,
    ]);
    // +X
    pushFace(1, 0, 0, [
       s, -s,  s,   s, -s, -s,   s,  s, -s,
       s, -s,  s,   s,  s, -s,   s,  s,  s,
    ]);
    // -X
    pushFace(-1, 0, 0, [
      -s, -s, -s,  -s, -s,  s,  -s,  s,  s,
      -s, -s, -s,  -s,  s,  s,  -s,  s, -s,
    ]);
    // +Y
    pushFace(0, 1, 0, [
      -s,  s,  s,   s,  s,  s,   s,  s, -s,
      -s,  s,  s,   s,  s, -s,  -s,  s, -s,
    ]);
    // -Y
    pushFace(0, -1, 0, [
      -s, -s, -s,   s, -s, -s,   s, -s,  s,
      -s, -s, -s,   s, -s,  s,  -s, -s,  s,
    ]);

    return new Geometry({ positions, normals });
  }
}
