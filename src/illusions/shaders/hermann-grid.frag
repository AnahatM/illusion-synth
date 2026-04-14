uniform float uGridSize;
uniform float uLineWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float cellSize = 1.0 / uGridSize;
  float lineW = uLineWidth * 0.01;

  // Distance from nearest grid line center
  vec2 cell = mod(uv, cellSize);
  float onLineX = step(cell.x, lineW) + step(cellSize - lineW, cell.x);
  float onLineY = step(cell.y, lineW) + step(cellSize - lineW, cell.y);

  float isLine = clamp(onLineX + onLineY, 0.0, 1.0);

  // Background is dark, lines are light gray
  vec3 color = mix(vec3(0.05), vec3(0.85), isLine);

  gl_FragColor = vec4(color, 1.0);
}
