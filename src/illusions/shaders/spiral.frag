uniform float uTime;
uniform float uSpeed;
uniform float uDirection;
uniform float uArmCount;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uScale;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float angle = atan(uv.y, uv.x);
  float dist = length(uv) * uScale;

  float spiral = angle / PI * uArmCount + dist * 8.0 - uTime * uSpeed * uDirection;
  float pattern = sin(spiral * PI) * 0.5 + 0.5;

  // Smooth the pattern for cleaner edges
  pattern = smoothstep(0.3, 0.7, pattern);

  // Fade at center and edges
  float fade = smoothstep(0.0, 0.05, dist) * smoothstep(0.55, 0.45, dist);

  vec3 color = mix(uColor1, uColor2, pattern);
  gl_FragColor = vec4(color, fade);
}
