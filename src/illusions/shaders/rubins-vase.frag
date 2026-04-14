uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

// Attempt smooth hermite interpolation between control points
float profileCurve(float t) {
  // t goes from 0 (bottom) to 1 (top)
  // Define profile as half-width at each height
  // This matches the reference: wide base, narrow neck with face features, wide rim

  // Control points: (height, half-width)
  // Bottom base flare
  if (t < 0.05) {
    float s = t / 0.05;
    return mix(0.38, 0.36, smoothstep(0.0, 1.0, s));
  }
  // Base narrows to pedestal
  if (t < 0.10) {
    float s = (t - 0.05) / 0.05;
    return mix(0.36, 0.22, smoothstep(0.0, 1.0, s));
  }
  // Pedestal to chin
  if (t < 0.18) {
    float s = (t - 0.10) / 0.08;
    return mix(0.22, 0.17, smoothstep(0.0, 1.0, s));
  }
  // Chin bump (small outward curve)
  if (t < 0.24) {
    float s = (t - 0.18) / 0.06;
    return 0.17 + 0.025 * sin(s * PI);
  }
  // Chin to below lower lip (inward)
  if (t < 0.29) {
    float s = (t - 0.24) / 0.05;
    return mix(0.17, 0.14, smoothstep(0.0, 1.0, s));
  }
  // Lower lip bump
  if (t < 0.33) {
    float s = (t - 0.29) / 0.04;
    return 0.14 + 0.025 * sin(s * PI);
  }
  // Upper lip / philtrum indent
  if (t < 0.37) {
    float s = (t - 0.33) / 0.04;
    return mix(0.14, 0.12, smoothstep(0.0, 1.0, s));
  }
  // Below nose to nose tip
  if (t < 0.42) {
    float s = (t - 0.37) / 0.05;
    return mix(0.12, 0.19, smoothstep(0.0, 1.0, s));
  }
  // Nose tip plateau
  if (t < 0.47) {
    float s = (t - 0.42) / 0.05;
    return mix(0.19, 0.20, smoothstep(0.0, 1.0, s));
  }
  // Nose bridge (inward from nose to eye area)
  if (t < 0.54) {
    float s = (t - 0.47) / 0.07;
    return mix(0.20, 0.13, smoothstep(0.0, 1.0, s));
  }
  // Eye socket indent
  if (t < 0.60) {
    float s = (t - 0.54) / 0.06;
    return 0.13 - 0.015 * sin(s * PI);
  }
  // Brow ridge bump
  if (t < 0.66) {
    float s = (t - 0.60) / 0.06;
    return mix(0.13, 0.17, smoothstep(0.0, 1.0, s));
  }
  // Forehead (gentle outward curve)
  if (t < 0.78) {
    float s = (t - 0.66) / 0.12;
    return mix(0.17, 0.21, smoothstep(0.0, 1.0, s));
  }
  // Forehead to hairline / top of head → rim start
  if (t < 0.85) {
    float s = (t - 0.78) / 0.07;
    return mix(0.21, 0.22, smoothstep(0.0, 1.0, s));
  }
  // Rim flare outward
  if (t < 0.92) {
    float s = (t - 0.85) / 0.07;
    return mix(0.22, 0.36, smoothstep(0.0, 1.0, s));
  }
  // Rim top
  if (t < 0.97) {
    float s = (t - 0.92) / 0.05;
    return mix(0.36, 0.38, smoothstep(0.0, 1.0, s));
  }
  return 0.38;
}

void main() {
  vec2 uv = vUv - 0.5;

  // Subtle breathing animation
  float breathe = 1.0 + sin(uTime * uSpeed) * 0.012;
  uv *= breathe;

  // Mirror horizontally for symmetry
  float ax = abs(uv.x);

  // Map y from [-0.45, 0.45] to [0, 1]
  float t = (uv.y + 0.45) / 0.9;

  // Clip outside vase vertical range
  if (t < 0.0 || t > 1.0) {
    gl_FragColor = vec4(uColor2, 1.0);
    return;
  }

  float profile = profileCurve(t);

  // Determine if point is inside the vase
  float isVase = 1.0 - smoothstep(profile - 0.003, profile + 0.003, ax);

  // Subtle brightness shift to help perception flip
  float phase = sin(uTime * uSpeed * 0.5) * 0.5 + 0.5;
  vec3 vaseCol = uColor1 * (0.9 + 0.1 * phase);
  vec3 faceCol = uColor2 * (0.9 + 0.1 * (1.0 - phase));

  vec3 col = mix(faceCol, vaseCol, isVase);

  gl_FragColor = vec4(col, 1.0);
}
