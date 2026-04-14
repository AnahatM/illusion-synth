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

  // Subtle left-to-right gradient on each tile
  float grad = mix(0.92, 1.08, local.x);
  vec3 col = tileColor * grad;

  // Small corner squares, offset inward from the actual corners
  float sz = uDotSize;
  float inset = sz * 0.7; // offset from edge

  // Row-based alternation: even rows → right side, odd rows → left side
  float rowParity = mod(cell.y, 2.0);

  // Corner square 1 (top corner on chosen side)
  vec2 c1 = rowParity < 1.0
    ? vec2(1.0 - inset, 1.0 - inset)
    : vec2(inset, 1.0 - inset);
  float sq1 = step(abs(local.x - c1.x), sz * 0.5) * step(abs(local.y - c1.y), sz * 0.5);

  // Corner square 2 (bottom corner, same side)
  vec2 c2 = rowParity < 1.0
    ? vec2(1.0 - inset, inset)
    : vec2(inset, inset);
  float sq2 = step(abs(local.x - c2.x), sz * 0.5) * step(abs(local.y - c2.y), sz * 0.5);

  col = mix(col, otherColor * grad, max(sq1, sq2));

  // Thin dark border between tiles
  float edgeX = smoothstep(0.0, 0.015, local.x) * smoothstep(1.0, 0.985, local.x);
  float edgeY = smoothstep(0.0, 0.015, local.y) * smoothstep(1.0, 0.985, local.y);
  col = mix(vec3(0.2, 0.18, 0.1), col, edgeX * edgeY);

  gl_FragColor = vec4(col, 1.0);
}
