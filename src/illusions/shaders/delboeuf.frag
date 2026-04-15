uniform float uRingSize;
uniform float uCircleSize;
uniform vec3 uCircleColor;
uniform vec3 uRingColor;
uniform vec3 uBgColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;
  vec3 bg = uBgColor;
  vec3 circleCol = uCircleColor;
  vec3 ringCol = uRingColor;
  vec3 col = bg;

  float circR = uCircleSize * 0.035;
  float ringW = 0.005;

  // Left: small ring around circle (circle appears larger)
  vec2 leftC = vec2(-0.15, 0.0);
  float dL = length(uv - leftC);
  float smallRingR = uRingSize * 0.05;
  float ring1 = smoothstep(ringW, 0.0, abs(dL - smallRingR));
  col = mix(col, ringCol, ring1);
  float circ1 = 1.0 - smoothstep(circR - 0.003, circR, dL);
  col = mix(col, circleCol, circ1);

  // Right: large ring around circle (circle appears smaller)
  vec2 rightC = vec2(0.15, 0.0);
  float dR = length(uv - rightC);
  float bigRingR = uRingSize * 0.12;
  float ring2 = smoothstep(ringW, 0.0, abs(dR - bigRingR));
  col = mix(col, ringCol, ring2);
  float circ2 = 1.0 - smoothstep(circR - 0.003, circR, dR);
  col = mix(col, circleCol, circ2);

  gl_FragColor = vec4(col, 1.0);
}
