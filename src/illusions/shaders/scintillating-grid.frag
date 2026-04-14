uniform float uGridSize;
uniform float uLineWidth;
uniform float uDotSize;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float cellSize = 1.0 / uGridSize;
  float lineW = uLineWidth * 0.01;

  vec2 cell = mod(uv, cellSize);
  float onLineX = step(cell.x, lineW) + step(cellSize - lineW, cell.x);
  float onLineY = step(cell.y, lineW) + step(cellSize - lineW, cell.y);
  float isLine = clamp(onLineX + onLineY, 0.0, 1.0);

  // Find nearest intersection
  vec2 nearest = (floor(uv / cellSize) + 0.5) * cellSize;
  // Snap to corners, not centers
  vec2 corner = round(uv / cellSize) * cellSize;
  float distToCorner = length(uv - corner);

  float dotR = uDotSize * 0.012;
  float dot = smoothstep(dotR, dotR * 0.4, distToCorner);

  // White dots at intersections
  float isDot = 1.0 - dot;

  // Background dark, lines gray
  vec3 color = mix(vec3(0.05), vec3(0.6), isLine);

  // White dots at intersections
  color = mix(color, vec3(1.0), isDot * isLine);

  gl_FragColor = vec4(color, 1.0);
}
