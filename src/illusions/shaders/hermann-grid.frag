uniform float uGridSize;
uniform float uLineWidth;
uniform vec3 uLineColor;
uniform vec3 uBgColor;
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

  vec3 color = mix(uBgColor, uLineColor, isLine);

  gl_FragColor = vec4(color, 1.0);
}
