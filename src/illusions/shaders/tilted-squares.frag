uniform float uGridSize;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float gridSize = uGridSize;

  // The pattern: a grid of squares with 3 luminance levels (white, grey, black)
  // arranged so that each pair of adjacent squares in a column creates
  // a diagonal tilt illusion.
  //
  // Layout: 2-wide columns, each column has grey+white squares.
  // Background is black. Rows shift by 1 cell to offset.

  vec2 grid = uv * gridSize;
  vec2 cell = floor(grid);
  vec2 local = fract(grid);

  // Background is black
  vec3 col = vec3(0.0);

  // Each "unit" is 2 cells wide (grey, white) repeating
  // Rows shift by 1 cell creating diagonal appearance
  float rowShift = cell.y * 1.0;
  float shiftedX = cell.x - rowShift;
  float unitX = mod(shiftedX, 2.0);

  // Square inset — leave black gaps between squares
  float margin = 0.08;
  float inSquare = step(margin, local.x) * step(margin, local.y) *
                   step(local.x, 1.0 - margin) * step(local.y, 1.0 - margin);

  // Luminance based on position in 2-wide unit
  // unitX < 1 → grey, unitX >= 1 → white
  float lum = unitX < 1.0 ? 0.55 : 1.0;

  col = vec3(lum) * inSquare;

  gl_FragColor = vec4(col, 1.0);
}
