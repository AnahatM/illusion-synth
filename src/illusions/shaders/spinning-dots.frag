uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uDotCount;
uniform float uDotSize;
uniform float uManual;
uniform float uManualRotX;
uniform float uManualRotY;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float aspect = 1.0;

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  float t = mix(uTime * uSpeed, uManualRotY, uManual);
  int count = int(uDotCount);
  float radius = 0.3;

  for (int i = 0; i < 40; i++) {
    if (i >= count) break;

    float fi = float(i);
    float total = uDotCount;

    // Distribute dots on a sphere using golden angle
    float phi = acos(1.0 - 2.0 * (fi + 0.5) / total);
    float theta = PI * (1.0 + sqrt(5.0)) * fi + t;

    // 3D sphere coordinates
    float x = radius * sin(phi) * cos(theta);
    float y = radius * sin(phi) * sin(theta);
    float z = radius * cos(phi);

    // Orthographic projection (no depth cues — the ambiguity source)
    vec2 projected = vec2(x, z);

    float dist = length(uv - projected);
    float dotR = uDotSize * 0.012;

    // Soft dot
    float dot = smoothstep(dotR, dotR * 0.5, dist);

    if (dot > 0.0) {
      col = mix(col, uColor, dot);
      alpha = max(alpha, dot);
    }
  }

  gl_FragColor = vec4(col, alpha);
}
