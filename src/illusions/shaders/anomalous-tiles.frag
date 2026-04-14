uniform float uGridSize;
uniform float uDotSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float gridSize = uGridSize;

  vec2 grid = uv * gridSize;
  vec2 cell = floor(grid);
  vec2 local = fract(grid);

  // Checkerboard of two colors
  float checker = mod(cell.x + cell.y, 2.0);
  vec3 tileColor = checker < 0.5 ? uColor1 : uColor2;
  vec3 otherColor = checker < 0.5 ? uColor2 : uColor1;

  // Small corner squares size
  float sz = uDotSize;

  // Determine which two corners get the small squares.
  // Row-based alternation creates the diagonal illusion:
  // Even rows: small squares in top-right and bottom-right corners
  // Odd rows: small squares in top-left and bottom-left corners
  float rowParity = mod(cell.y, 2.0);

  vec3 col = tileColor;

  // Corner square 1 (top corner)
  vec2 c1 = rowParity < 1.0 ? vec2(1.0 - sz * 0.5, 1.0 - sz * 0.5) : vec2(sz * 0.5, 1.0 - sz * 0.5);
  float sq1 = step(abs(local.x - c1.x), sz * 0.5) * step(abs(local.y - c1.y), sz * 0.5);

  // Corner square 2 (bottom corner, same side)
  vec2 c2 = rowParity < 1.0 ? vec2(1.0 - sz * 0.5, sz * 0.5) : vec2(sz * 0.5, sz * 0.5);
  float sq2 = step(abs(local.x - c2.x), sz * 0.5) * step(abs(local.y - c2.y), sz * 0.5);

  col = mix(col, otherColor, max(sq1, sq2));

  gl_FragColor = vec4(col, 1.0);
}
