uniform float uBarWidth;
uniform float uContrast;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec3 col = vec3(0.0);

  // Two halves: left dark bg, right light bg
  float bgLeft = 0.2;
  float bgRight = 0.8;

  float isRight = step(0.5, uv.x);
  float bg = mix(bgLeft, bgRight, isRight);

  // Central gray bar
  float barGray = 0.5;
  float barH = uBarWidth * 0.15;
  float barOn = step(0.5 - barH, uv.y) * (1.0 - step(0.5 + barH, uv.y));

  col = vec3(mix(bg, barGray, barOn));

  // Optional: gradient transition at the center line for smoothness
  float edgeBlend = smoothstep(0.498, 0.502, uv.x);
  float bgSmooth = mix(bgLeft, bgRight, edgeBlend);
  col = vec3(mix(bgSmooth, barGray, barOn));

  gl_FragColor = vec4(col, 1.0);
}
