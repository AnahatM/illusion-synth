uniform float uTime;
uniform float uSpeed;
uniform float uBarWidth;
uniform float uStripeFreq;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);

  // Background: vertical black and white stripes (stationary)
  float stripe = step(0.5, fract(uv.x * uStripeFreq));
  col = vec3(stripe);

  // Two horizontal bars moving at the SAME speed
  float barW = uBarWidth * 0.03;
  float speed = uSpeed * 0.1;
  float x = fract(uTime * speed);

  float barY1 = 0.35;
  float barY2 = 0.65;

  // Bar 1: yellow
  float inBar1 = step(barY1 - barW, uv.y) * (1.0 - step(barY1 + barW, uv.y));
  float barMask1 = step(x - 0.08, uv.x) * (1.0 - step(x + 0.08, uv.x));

  // Bar 2: blue
  float inBar2 = step(barY2 - barW, uv.y) * (1.0 - step(barY2 + barW, uv.y));
  float barMask2 = step(x - 0.08, uv.x) * (1.0 - step(x + 0.08, uv.x));

  // On stripe regions, bars are invisible; off stripe, they show
  // This creates the stepping illusion
  vec3 bar1Color = vec3(0.9, 0.8, 0.0);
  vec3 bar2Color = vec3(0.0, 0.3, 0.9);

  col = mix(col, bar1Color, inBar1 * barMask1);
  col = mix(col, bar2Color, inBar2 * barMask2);

  gl_FragColor = vec4(col, 1.0);
}
