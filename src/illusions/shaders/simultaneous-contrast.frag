uniform float uBarWidth;
uniform float uGap;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;

  float bgLeft = 0.2;
  float bgRight = 0.8;
  float barGray = 0.5;
  float barH = uBarWidth * 0.15;

  float gapHalf = uGap * 0.025;

  // Gap region in the center
  float inGap = step(0.5 - gapHalf, uv.x) * (1.0 - step(0.5 + gapHalf, uv.x));

  // Left half
  float inLeft = step(uv.x, 0.5 - gapHalf);
  // Right half
  float inRight = step(0.5 + gapHalf, uv.x);

  float bgL = bgLeft;
  float bgR = bgRight;

  // Gray bar on each half
  float barOn = step(0.5 - barH, uv.y) * (1.0 - step(0.5 + barH, uv.y));

  vec3 col = vec3(0.0);
  col = mix(col, vec3(mix(bgL, barGray, barOn)), inLeft);
  col = mix(col, vec3(mix(bgR, barGray, barOn)), inRight);
  // Gap is black
  col = mix(col, vec3(0.0), inGap);

  gl_FragColor = vec4(col, 1.0);
}
