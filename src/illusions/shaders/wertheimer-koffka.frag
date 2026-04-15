uniform vec3 uLeftBg;
uniform vec3 uRightBg;
uniform vec3 uRingColor;
uniform float uRingRadius;
uniform float uRingWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 center = vec2(0.5);
  float dist = length(uv - center);

  // Split background
  float side = smoothstep(0.498, 0.502, uv.x);
  vec3 bg = mix(uLeftBg, uRightBg, side);

  // Ring
  float rOuter = uRingRadius * 0.4;
  float rWidth = uRingWidth * 0.02;
  float ringDist = abs(dist - rOuter);
  float ring = 1.0 - smoothstep(0.0, 0.003, ringDist - rWidth * 0.5);

  vec3 color = mix(bg, uRingColor, ring);

  gl_FragColor = vec4(color, 1.0);
}
