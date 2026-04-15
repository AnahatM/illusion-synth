uniform float uTime;
uniform float uSpeed;
uniform float uFrequency;
uniform float uContrast;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv;

  // Counter-phase flickering grating
  // Two gratings of same frequency flicker in counterphase
  // The perceived frequency appears doubled

  float spatial = sin(uv.y * uFrequency * PI * 2.0);
  float temporal = sin(uTime * uSpeed * PI * 2.0);

  // Counter-phase: multiply spatial by temporal modulation
  float grating = spatial * temporal * uContrast;
  float lum = 0.5 + grating * 0.5;

  vec3 color = mix(uColor1, uColor2, lum);

  gl_FragColor = vec4(color, 1.0);
}
