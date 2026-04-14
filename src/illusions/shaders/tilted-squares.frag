uniform float uGridSize;
varying vec2 vUv;

void main() {
  vec2 p = vUv * uGridSize;

  // Skewed lattice of axis-aligned squares.
  // Each square's corner sits at the midpoint of a neighbour's face.
  // Lattice basis vectors: e1 = (1, 0.5), e2 = (0.5, -1)
  // Squares are 1×1, axis-aligned, placed at each lattice point.
  // ~20% of the area is black gap — no square covers it.

  // Transform pixel coords to lattice coords.
  // Inverse of [[1, 0.5],[0.5, -1]] = [[0.8, 0.4],[0.4, -0.8]]
  float nf = 0.8 * p.x + 0.4 * p.y;
  float mf = 0.4 * p.x - 0.8 * p.y;

  float n0 = floor(nf);
  float m0 = floor(mf);

  vec3 col = vec3(0.0); // black background
  float mortar = 0.02;

  // Check 4 candidate lattice cells (floor/ceil of n,m)
  for (int dn = 0; dn <= 1; dn++) {
    for (int dm = 0; dm <= 1; dm++) {
      float ni = n0 + float(dn);
      float mi = m0 + float(dm);

      // Bottom-left corner of the square at lattice point (ni, mi)
      float cx = ni + 0.5 * mi;
      float cy = 0.5 * ni - mi;

      // Local position inside this square
      float lx = p.x - cx;
      float ly = p.y - cy;

      // Inside the square (with thin mortar border)?
      if (lx > mortar && lx < 1.0 - mortar &&
          ly > mortar && ly < 1.0 - mortar) {
        // Alternating grey/white
        float parity = mod(ni + mi, 2.0);
        float lum = parity < 1.0 ? 0.55 : 1.0;
        col = vec3(lum);
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
