uniform float uGridSize;
uniform float uDotSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  float gridSize = uGridSize;

  vec2 grid = uv * gridSize;
  vec2 cell = floor(grid);
  vec2 local = fract(grid);

  // Checkerboard of two colors
  float checker = mod(cell.x + cell.y, 2.0);
  vec3 tileColor = checker < 0.5 ? uColor1 : uColor2;

  // Asymmetric dark/light dots on alternating edges
  // The dot placement creates the motion illusion
  // Each tile has small squares near the edges
  float dotR = uDotSize;

  // Row-based direction: alternate which edge gets the dot
  float rowDir = mod(cell.y, 2.0) < 1.0 ? 1.0 : -1.0;
  // Also alternate per checkerboard phase
  float phase = checker < 0.5 ? 1.0 : -1.0;
  float dir = rowDir * phase;

  vec3 col = tileColor;

  // Dark dot (black) on one side
  vec2 darkDotPos = vec2(dir > 0.0 ? dotR * 0.5 + 0.02 : 1.0 - dotR * 0.5 - 0.02, 0.5);
  float darkDot = step(abs(local.x - darkDotPos.x), dotR * 0.5) *
                  step(abs(local.y - darkDotPos.y), dotR * 0.5);

  // Light border line between tiles for structure
  float edgeX = smoothstep(0.0, 0.02, local.x) * smoothstep(1.0, 0.98, local.x);
  float edgeY = smoothstep(0.0, 0.02, local.y) * smoothstep(1.0, 0.98, local.y);
  float edge = edgeX * edgeY;

  // Mix dark square onto tile
  // The dark square is flanked by a thin bright strip on the inner side
  // creating the asymmetric luminance profile
  vec2 brightDotPos = vec2(dir > 0.0 ? dotR + 0.04 : 1.0 - dotR - 0.04, 0.5);
  float brightDot = step(abs(local.x - brightDotPos.x), dotR * 0.3) *
                    step(abs(local.y - brightDotPos.y), dotR * 0.5);

  col = mix(col, vec3(0.0), darkDot);
  col = mix(col, mix(tileColor, vec3(0.0), 0.3), brightDot);
  col *= edge;

  // Thin dark green/olive border between rows
  float rowBorder = smoothstep(0.0, 0.03, local.y) * smoothstep(1.0, 0.97, local.y);
  col *= mix(0.4, 1.0, rowBorder);

  gl_FragColor = vec4(col, 1.0);
}
