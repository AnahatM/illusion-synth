uniform float uSurroundSize;
uniform float uSurroundCount;
uniform vec3 uCenterColor;
uniform vec3 uSurroundColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 bg = vec3(0.95);
  vec3 col = bg;

  float centerR = 0.04;

  // Left group: small surrounding circles
  vec2 leftCenter = vec2(-0.18, 0.0);
  float distL = length(uv - leftCenter);
  if (distL < centerR) {
    col = uCenterColor;
  }
  float smallR = uSurroundSize * 0.015;
  float ringR = 0.09;
  for (int i = 0; i < 12; i++) {
    if (float(i) >= uSurroundCount) break;
    float a = float(i) * 2.0 * PI / uSurroundCount;
    vec2 pos = leftCenter + ringR * vec2(cos(a), sin(a));
    if (length(uv - pos) < smallR) {
      col = uSurroundColor;
    }
  }

  // Right group: large surrounding circles
  vec2 rightCenter = vec2(0.18, 0.0);
  float distR = length(uv - rightCenter);
  if (distR < centerR) {
    col = uCenterColor;
  }
  float bigR = uSurroundSize * 0.055;
  float ringR2 = 0.1 + bigR * 0.6;
  float count2 = min(uSurroundCount, 6.0);
  for (int i = 0; i < 6; i++) {
    if (float(i) >= count2) break;
    float a = float(i) * 2.0 * PI / count2;
    vec2 pos = rightCenter + ringR2 * vec2(cos(a), sin(a));
    if (length(uv - pos) < bigR) {
      col = uSurroundColor;
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
