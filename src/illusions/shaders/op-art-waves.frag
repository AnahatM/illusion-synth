uniform float uTime;
uniform float uFrequency;
uniform float uAmplitude;
uniform float uSpeed;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  float freq = uFrequency;
  float amp = uAmplitude * 0.02;

  // Wavy distortion
  float wave = sin(uv.y * freq * PI + uTime * uSpeed) * amp;
  float x = uv.x + wave;

  // Black and white stripes
  float stripe = step(0.5, fract(x * freq * 0.5));

  gl_FragColor = vec4(vec3(stripe), 1.0);
}
