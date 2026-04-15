uniform vec3 uBaseColor;
uniform vec3 uStripeColor1;
uniform vec3 uStripeColor2;
uniform float uStripeWidth;
uniform float uStripeCount;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  float stripes = uStripeCount;
  float sw = uStripeWidth * 0.005;

  // Two halves showing different stripe colors over same base
  float halfSelect = step(0.5, uv.x);

  // Horizontal stripes
  float yMod = mod(uv.y * stripes, 1.0);
  float stripe = smoothstep(0.5 - sw, 0.5 - sw + 0.01, yMod) *
                 smoothstep(0.5 + sw, 0.5 + sw - 0.01, yMod);

  // Left half has stripe color 1, right half has stripe color 2
  vec3 stripeColor = mix(uStripeColor1, uStripeColor2, halfSelect);
  vec3 color = mix(uBaseColor, stripeColor, stripe);

  // Divider line
  float divider = 1.0 - smoothstep(0.0, 0.003, abs(uv.x - 0.5));
  color = mix(color, vec3(0.3), divider * 0.5);

  gl_FragColor = vec4(color, 1.0);
}
