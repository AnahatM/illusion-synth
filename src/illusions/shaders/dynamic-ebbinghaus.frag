uniform float uTime;
uniform float uSpeed;
uniform float uSurroundSize;
uniform float uSurroundCount;
uniform vec3 uCenterColor;
uniform vec3 uSurroundColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;

  float t = uTime * uSpeed;

  // Two groups of circles
  for (float g = 0.0; g < 2.0; g++) {
    float gx = 0.3 + g * 0.4;
    vec2 groupCenter = vec2(gx, 0.5);

    // Center circle (same size both sides)
    float centerR = 0.04;
    float centerDist = length(uv - groupCenter);
    float center = 1.0 - smoothstep(centerR - 0.003, centerR, centerDist);
    color = mix(color, uCenterColor, center);

    // Surrounding circles - animate size
    float surroundR;
    if (g < 0.5) {
      surroundR = uSurroundSize * 0.035 * (0.7 + 0.3 * sin(t));
    } else {
      surroundR = uSurroundSize * 0.035 * (1.3 - 0.3 * sin(t));
    }

    float orbitR = 0.11;
    float count = uSurroundCount;
    for (float i = 0.0; i < 12.0; i++) {
      if (i >= count) break;
      float a = i / count * 2.0 * PI;
      vec2 sPos = groupCenter + orbitR * vec2(cos(a), sin(a));
      float sDist = length(uv - sPos);
      float s = 1.0 - smoothstep(surroundR - 0.003, surroundR, sDist);
      color = mix(color, uSurroundColor, s);
    }
  }

  gl_FragColor = vec4(color, 1.0);
}
