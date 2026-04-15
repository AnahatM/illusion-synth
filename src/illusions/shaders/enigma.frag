uniform float uTime;
uniform float uSpeed;
uniform float uRingCount;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  vec3 color = uBgColor;

  // Concentric alternating rings
  float ringPattern = sin(r * uRingCount * PI * 2.0) * 0.5 + 0.5;
  float ringMask = smoothstep(0.08, 0.12, r) * smoothstep(0.92, 0.88, r);
  vec3 rings = mix(uColor1, uColor2, step(0.5, ringPattern));

  // Radial lines
  float sectors = 24.0;
  float radial = mod(angle * sectors / (2.0 * PI), 1.0);
  float radialLine = step(0.45, radial) * step(radial, 0.55);

  // Animated scintillation in the ring gaps
  float ringEdge = abs(fract(r * uRingCount) - 0.5);
  float scintZone = smoothstep(0.05, 0.0, ringEdge) * ringMask;
  float scintillation = sin(angle * 8.0 + uTime * uSpeed * 3.0) * 0.5 + 0.5;

  color = mix(color, rings, ringMask);

  // Apply radial spokes (dark lines)
  float spokeMask = smoothstep(0.1, 0.15, r) * smoothstep(0.85, 0.80, r);
  color = mix(color, uBgColor * 0.1, radialLine * spokeMask * 0.9);

  // Scintillating motion effect in the gaps
  vec3 scintColor = mix(uColor1, uColor2, scintillation);
  color = mix(color, scintColor, scintZone * 0.4);

  // Central fixation dot
  float fixDot = 1.0 - smoothstep(0.01, 0.015, r);
  color = mix(color, vec3(1.0, 0.0, 0.0), fixDot);

  gl_FragColor = vec4(color, 1.0);
}
