uniform float uTime;
uniform float uSpeed;
uniform float uOffset;
uniform float uThickness;
uniform vec3 uColor;
uniform float uScale;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv1 = vUv - 0.5;
  vec2 uv2 = uv1 + vec2(uOffset * 0.1 * sin(uTime * uSpeed), uOffset * 0.1 * cos(uTime * uSpeed));

  float dist1 = length(uv1) * uScale;
  float dist2 = length(uv2) * uScale;

  float rings1 = sin(dist1 * 60.0 * uThickness) * 0.5 + 0.5;
  float rings2 = sin(dist2 * 60.0 * uThickness) * 0.5 + 0.5;

  rings1 = step(0.5, rings1);
  rings2 = step(0.5, rings2);

  // XOR the two ring patterns to create moiré
  float moire = abs(rings1 - rings2);

  vec3 color = mix(vec3(0.0), uColor, moire);

  // Circular fade
  float fade = smoothstep(0.5, 0.45, length(uv1));

  gl_FragColor = vec4(color, fade);
}
