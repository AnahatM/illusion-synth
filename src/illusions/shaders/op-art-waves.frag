uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  float freq = uFrequency;
  float amp = uAmplitude * 0.02;

  float wave = sin(uv.y * freq * PI + uTime * uSpeed) * amp;
  float x = uv.x + wave;

  float stripe = step(0.5, fract(x * freq * 0.5));

  vec3 col = mix(uColor1, uColor2, stripe);
  gl_FragColor = vec4(col, 1.0);
}
