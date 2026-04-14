uniform float uStripeFreq;
uniform float uBarWidth;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  // Horizontal stripes: black and white, alternating
  float stripe = step(0.5, fract(uv.y * uStripeFreq));

  // Two bars: left and right
  float barW = uBarWidth * 0.06;
  float leftBar = step(0.25 - barW, uv.x) * (1.0 - step(0.25 + barW, uv.x));
  float rightBar = step(0.75 - barW, uv.x) * (1.0 - step(0.75 + barW, uv.x));

  // Both bars are the same gray (0.5)
  float barGray = 0.5;

  // Left bar on white stripes, right bar on black stripes (or vice versa)
  // Left side: bar overlaps white stripes
  // Right side: bar overlaps black stripes
  vec3 col = vec3(stripe);

  // Draw bars
  float bar = max(leftBar, rightBar);
  col = mix(col, vec3(barGray), bar);

  gl_FragColor = vec4(col, 1.0);
}
