uniform float uTime;
uniform float uSpeed;
uniform float uRingCount;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uShape;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);

  // Zoom effect: rings move toward viewer
  float zoom = fract(dist * uRingCount - uTime * uSpeed);

  // Alternating ring colors
  float ring = step(0.5, zoom);

  // Depth shading: closer rings are brighter
  float depth = 1.0 - dist * 1.5;
  depth = max(depth, 0.2);

  vec3 color = mix(uColor1, uColor2, ring) * depth;

  // Circular fade
  float fade = smoothstep(0.5, 0.4, dist);

  gl_FragColor = vec4(color, fade);
}
