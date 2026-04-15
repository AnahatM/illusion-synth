uniform float uTime;
uniform float uSpeed;
uniform float uDotCount;
uniform float uAmplitude;
uniform vec3 uDotColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;
  vec3 color = uBgColor;
  float dotR = 0.014;

  float cols = uDotCount;
  for (float i = 0.0; i < 24.0; i++) {
    if (i >= cols) break;
    float x = (i + 0.5) / cols;
    float phase = i / cols * 2.0 * PI;
    float y = 0.5 + uAmplitude * 0.35 * sin(uTime * uSpeed + phase);

    float d = length(uv - vec2(x, y));
    float dot = 1.0 - smoothstep(dotR - 0.004, dotR, d);
    color = mix(color, uDotColor, dot);
  }

  gl_FragColor = vec4(color, 1.0);
}
