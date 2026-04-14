uniform float uTime;
uniform float uSpeed;
uniform float uDensity;
uniform vec3 uColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;

  // Two rotated grids
  float angle1 = uTime * uSpeed * 0.3;
  float angle2 = -uTime * uSpeed * 0.3 + PI * 0.15;

  mat2 rot1 = mat2(cos(angle1), -sin(angle1), sin(angle1), cos(angle1));
  mat2 rot2 = mat2(cos(angle2), -sin(angle2), sin(angle2), cos(angle2));

  vec2 uv1 = rot1 * uv;
  vec2 uv2 = rot2 * uv;

  float grid1 = step(0.5, fract(uv1.x * uDensity * 10.0)) + step(0.5, fract(uv1.y * uDensity * 10.0));
  float grid2 = step(0.5, fract(uv2.x * uDensity * 10.0)) + step(0.5, fract(uv2.y * uDensity * 10.0));

  grid1 = clamp(grid1, 0.0, 1.0);
  grid2 = clamp(grid2, 0.0, 1.0);

  float moire = abs(grid1 - grid2);

  float fade = smoothstep(0.5, 0.4, length(uv));
  vec3 color = mix(vec3(0.0), uColor, moire);

  gl_FragColor = vec4(color, fade);
}
