uniform float uScale;
uniform float uDensity;
uniform float uContrast;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  vec3 col = vec3(0.5);

  float scale = uScale;
  float density = uDensity;

  // Tiled pattern of small rotating elements
  // Each tile has an asymmetric luminance gradient that triggers peripheral drift
  vec2 tileUv = uv * density * 8.0;
  vec2 tileId = floor(tileUv);
  vec2 tileF = fract(tileUv) - 0.5;

  // Checkerboard rotation direction
  float dir = mod(tileId.x + tileId.y, 2.0) * 2.0 - 1.0;

  // Angle within tile
  float a = atan(tileF.y, tileF.x);
  float r = length(tileF);

  // Four-phase sawtooth around the tile center
  float phase = mod(floor((a + PI) / (2.0 * PI) * 4.0) * dir + 4.0, 4.0);
  float lum;
  if (phase < 1.0) lum = 0.05;
  else if (phase < 2.0) lum = 0.35;
  else if (phase < 3.0) lum = 0.95;
  else lum = 0.65;

  // Circular mask per tile
  float mask = smoothstep(0.45, 0.35, r);

  // Background between tiles
  float bg = 0.5;
  col = vec3(mix(bg, lum * uContrast, mask));

  // Thin grid lines between tiles
  vec2 gridDist = abs(tileF);
  float grid = step(0.47, max(gridDist.x, gridDist.y));
  col = mix(col, vec3(0.3), grid * 0.5);

  gl_FragColor = vec4(col, 1.0);
}
