uniform float uGridSize;
uniform float uLineWidth;
uniform float uDotSize;
uniform float uTime;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float cellSize = 1.0 / uGridSize;
  float lineW = uLineWidth * 0.01;

  vec2 cell = mod(uv, cellSize);
  float onLineX = step(cell.x, lineW) + step(cellSize - lineW, cell.x);
  float onLineY = step(cell.y, lineW) + step(cellSize - lineW, cell.y);
  float isLine = clamp(onLineX + onLineY, 0.0, 1.0);

  vec2 corner = round(uv / cellSize) * cellSize;
  float distToCorner = length(uv - corner);

  float dotR = uDotSize * 0.012;
  float dot = smoothstep(dotR, dotR * 0.4, distToCorner);

  float isDot = 1.0 - dot;

  vec3 color = mix(uColor1, mix(uColor1, uColor2, 0.6), isLine);
  color = mix(color, uColor2, isDot * isLine);

  gl_FragColor = vec4(color, 1.0);
}
