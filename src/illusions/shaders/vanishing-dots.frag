uniform vec3 uDotColor;
uniform vec3 uLineColor;
uniform vec3 uBgColor;
uniform float uDotSize;
uniform float uGridSize;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float cells = uGridSize;
  float cellSize = 1.0 / cells;
  float lineW = 0.005;

  // Grid lines
  vec2 cellPos = mod(uv, cellSize);
  float nearX = min(cellPos.x, cellSize - cellPos.x);
  float nearY = min(cellPos.y, cellSize - cellPos.y);
  float line = min(nearX, nearY);
  float onLine = 1.0 - smoothstep(lineW - 0.002, lineW, line);

  // Dots at intersections
  vec2 nearest = floor(uv / cellSize + 0.5) * cellSize;
  float dist = length(uv - nearest);
  float dotR = uDotSize * 0.012;
  float dot = 1.0 - smoothstep(dotR - 0.004, dotR, dist);

  // Exclude dots on outer edges
  float margin = cellSize * 0.3;
  float edgeOk = step(margin, nearest.x) * step(nearest.x, 1.0 - margin) *
                 step(margin, nearest.y) * step(nearest.y, 1.0 - margin);
  dot *= edgeOk;

  vec3 color = uBgColor;
  color = mix(color, uLineColor, onLine * 0.7);
  color = mix(color, uDotColor, dot);

  gl_FragColor = vec4(color, 1.0);
}
