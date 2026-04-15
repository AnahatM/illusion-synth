uniform float uGridSize;
uniform float uLineWidth;
uniform float uCurvature;
uniform vec3 uLineColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  vec2 d = uv - center;

  // Apply barrel distortion to create curved grid
  float r = length(d);
  float distortion = 1.0 + uCurvature * r * r;
  vec2 curved = center + d * distortion;

  float cellSize = 1.0 / uGridSize;
  float lineW = uLineWidth * 0.008;

  // Grid lines on curved coordinates
  vec2 cellPos = mod(curved, cellSize);
  float nearX = min(cellPos.x, cellSize - cellPos.x);
  float nearY = min(cellPos.y, cellSize - cellPos.y);
  float line = min(nearX, nearY);
  float onLine = 1.0 - smoothstep(lineW - 0.003, lineW, line);

  // Fade at edges
  float edge = smoothstep(0.52, 0.48, max(abs(d.x), abs(d.y)));

  vec3 color = mix(uBgColor, uLineColor, onLine * edge);

  gl_FragColor = vec4(color, 1.0);
}
