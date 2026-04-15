uniform float uTime;
uniform float uSpeed;
uniform float uStripeCount;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  // Vertical stripes moving right
  float stripes = uStripeCount;
  float x = uv.x * stripes - uTime * uSpeed;
  float pattern = step(0.5, fract(x));

  // On even frames (based on time), invert the contrast
  float phase = floor(mod(uTime * uSpeed * stripes * 0.5, 2.0));

  // Standard phi: pattern moves in direction of motion
  // Reverse phi: when contrast inverts each frame, perceived motion reverses
  float reversePattern = step(0.5, fract(x + 0.5));

  // Blend: show reverse-phi (contrast inverts each half-step)
  float finalPattern = mix(pattern, reversePattern, phase);

  vec3 color = mix(uColor1, uColor2, finalPattern);

  gl_FragColor = vec4(color, 1.0);
}
