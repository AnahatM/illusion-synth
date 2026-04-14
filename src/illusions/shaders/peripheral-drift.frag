uniform float uTime;
uniform float uCount;
uniform float uContrast;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  // Grid of elements
  vec2 grid = uv * uCount;
  vec2 cell = floor(grid);
  vec2 local = fract(grid) - 0.5;

  // Each cell has a circular element with asymmetric luminance gradient
  float dist = length(local);
  float circle = smoothstep(0.38, 0.33, dist);

  // Asymmetric luminance pattern that creates peripheral drift
  float angle = atan(local.y, local.x);
  // Alternate direction per cell for the "drift" effect
  float dir = mod(cell.x + cell.y, 2.0) * 2.0 - 1.0;
  float luminance = 0.5 + uContrast * 0.4 * sin(angle * 4.0 + dir * PI * 0.5);

  // Subtle time-based shimmer (very slow to enhance illusion)
  luminance += 0.02 * sin(uTime * 0.5 + cell.x * 2.0 + cell.y * 3.0);

  float bg = 0.0;
  float t = mix(bg, luminance, circle);
  vec3 result = mix(uColor1, uColor2, t);

  gl_FragColor = vec4(result, 1.0);
}
