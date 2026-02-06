export function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

export function sub3(a, b) { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
export function dot3(a, b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2]; }
export function cross3(a, b) {
  return [
    a[1]*b[2] - a[2]*b[1],
    a[2]*b[0] - a[0]*b[2],
    a[0]*b[1] - a[1]*b[0]
  ];
}
export function len3(v) { return Math.hypot(v[0], v[1], v[2]); }
export function normalize3(v) {
  const L = len3(v) || 1;
  return [v[0]/L, v[1]/L, v[2]/L];
}
