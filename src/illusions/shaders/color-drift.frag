uniform float uTime;
uniform float uHueSpeed;
uniform float uSaturation;
varying vec2 vUv;

#define PI 3.14159265359

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec2 uv = vUv;

  float hue = fract(uv.x * 2.0 + uv.y * 1.5 + uTime * uHueSpeed * 0.1);
  float hue2 = fract(uv.x * 3.0 - uv.y * 2.0 - uTime * uHueSpeed * 0.07);

  // Slow drifting waves
  float wave = sin(uv.x * 8.0 + uTime * uHueSpeed * 0.5) *
               cos(uv.y * 6.0 - uTime * uHueSpeed * 0.3) * 0.5 + 0.5;

  float finalHue = mix(hue, hue2, wave);

  vec3 color = hsv2rgb(vec3(finalHue, uSaturation, 0.85));

  gl_FragColor = vec4(color, 1.0);
}
