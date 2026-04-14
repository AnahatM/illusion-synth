uniform float uGridSize;
uniform float uDotRadius;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  float gridSize = uGridSize;

  vec2 grid = uv * gridSize;
  vec2 cell = floor(grid);
  vec2 local = fract(grid);

  // Standard checkerboard
  float checker = mod(cell.x + cell.y, 2.0);
  float tileVal = checker < 0.5 ? 0.0 : 1.0;

  vec3 col = vec3(tileVal);

  // Dots at each corner of each cell (i.e. at grid intersections).
  // Each dot sits on the corner between 4 tiles.
  // The dot color matches one diagonal pair of tiles, creating
  // asymmetric luminance that produces the bulging effect.
  //
  // Pattern from reference: dots are placed at every intersection,
  // colored to match the diagonal that points toward/away from the
  // pattern center. This selective coloring creates apparent curvature.

  float dotR = uDotRadius;

  // Check all 4 corners of this cell
  for (int cy = 0; cy <= 1; cy++) {
    for (int cx = 0; cx <= 1; cx++) {
      vec2 corner = vec2(float(cx), float(cy));
      float d = length(local - corner);

      if (d < dotR) {
        // Position of this corner in UV space
        vec2 cornerUV = (cell + corner) / gridSize;
        vec2 toCenter = cornerUV - 0.5;

        // Determine which diagonal pair the dot should match.
        // The reference uses a repeating pattern based on grid position
        // that creates "bulge" regions.
        //
        // At each intersection, 4 tiles meet in a 2x2 checkerboard.
        // The dot can be black (matching one diagonal) or white (matching the other).
        // The pattern alternates in zones to create multiple bulge centers.

        // Grid intersection coordinates
        vec2 iPos = cell + corner;

        // Create repeating bulge regions (~8x8 cells per bulge)
        float regionSize = gridSize * 0.5;
        vec2 regionUV = (iPos / regionSize) * PI;
        float zone = sin(regionUV.x) * sin(regionUV.y);

        // The two tiles on one diagonal at this intersection
        // For intersection at (ix, iy), the four tiles are:
        //   (ix-1,iy-1), (ix,iy-1), (ix-1,iy), (ix,iy)
        // One diagonal: (ix-1,iy-1) and (ix,iy) — same checker parity
        // Other diagonal: (ix,iy-1) and (ix-1,iy) — same parity
        // Choose which diagonal's color the dot gets based on zone
        float diagChecker = mod(iPos.x + iPos.y, 2.0);
        float dotVal;
        if (zone > 0.0) {
          dotVal = diagChecker < 1.0 ? 1.0 : 0.0;
        } else {
          dotVal = diagChecker < 1.0 ? 0.0 : 1.0;
        }

        float blend = smoothstep(dotR, dotR * 0.3, d);
        col = mix(col, vec3(dotVal), blend);
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
