uniform vec3 uDotColor;
uniform vec3 uCrossColor;
uniform float uSpacing;
uniform float uDotSize;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float aspect = 1.0;

  // Left cross
  vec2 crossPos = vec2(0.5 - uSpacing * 0.15, 0.5);
  float crossArm = 0.015;
  float crossLen = 0.035;
  float onCrossH = step(crossPos.x - crossLen, uv.x) * step(uv.x, crossPos.x + crossLen) *
                   step(crossPos.y - crossArm, uv.y) * step(uv.y, crossPos.y + crossArm);
  float onCrossV = step(crossPos.x - crossArm, uv.x) * step(uv.x, crossPos.x + crossArm) *
                   step(crossPos.y - crossLen, uv.y) * step(uv.y, crossPos.y + crossLen);
  float cross = clamp(onCrossH + onCrossV, 0.0, 1.0);

  // Right dot
  vec2 dotPos = vec2(0.5 + uSpacing * 0.15, 0.5);
  float d = length(uv - dotPos);
  float dot = 1.0 - smoothstep(uDotSize * 0.015 - 0.002, uDotSize * 0.015, d);

  vec3 color = vec3(0.0);
  color = mix(color, uCrossColor, cross);
  color = mix(color, uDotColor, dot);

  gl_FragColor = vec4(color, 1.0);
}
