uniform float uTime;
uniform float uSpeed;
uniform float uTwist;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float dist = length(uv);
  float angle = atan(uv.y, uv.x);

  // Twist: rotate based on distance from center
  float twistedAngle = angle + dist * uTwist * 10.0 + uTime * uSpeed;

  // Spiral arms
  float arms = sin(twistedAngle * 4.0) * 0.5 + 0.5;

  // Radial zoom
  float zoom = fract(dist * 6.0 - uTime * uSpeed * 0.5);

  float pattern = arms * zoom;

  // Depth dimming
  float depth = 1.0 - dist * 1.8;
  depth = max(depth, 0.1);

  vec3 color = mix(uColor1, uColor2, pattern) * depth;

  float fade = smoothstep(0.5, 0.35, dist);
  gl_FragColor = vec4(color, fade);
}
