uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

// Face profile curve - dramatically pronounced features
// t: 0 = bottom, 1 = top. Returns half-width of the vase.
float profileCurve(float t) {
  // --- BOTTOM BASE / PEDESTAL ---
  // Wide foot
  if (t < 0.04) {
    float s = t / 0.04;
    return mix(0.42, 0.40, smoothstep(0.0, 1.0, s));
  }
  // Foot narrows sharply to neck/pedestal
  if (t < 0.10) {
    float s = (t - 0.04) / 0.06;
    return mix(0.40, 0.18, smoothstep(0.0, 1.0, s));
  }

  // --- CHIN ---
  // Neck to chin point (the most protruding bottom of face)
  if (t < 0.16) {
    float s = (t - 0.10) / 0.06;
    return mix(0.18, 0.28, smoothstep(0.0, 1.0, s));
  }
  // Chin rounds back inward toward jawline
  if (t < 0.22) {
    float s = (t - 0.16) / 0.06;
    return mix(0.28, 0.20, smoothstep(0.0, 1.0, s));
  }

  // --- LIPS ---
  // Jaw to lower lip (slight outward)
  if (t < 0.27) {
    float s = (t - 0.22) / 0.05;
    return mix(0.20, 0.24, smoothstep(0.0, 1.0, s));
  }
  // Lower lip peak
  if (t < 0.30) {
    float s = (t - 0.27) / 0.03;
    return mix(0.24, 0.25, smoothstep(0.0, 1.0, s));
  }
  // Gap between lips (deep indent)
  if (t < 0.33) {
    float s = (t - 0.30) / 0.03;
    return mix(0.25, 0.16, smoothstep(0.0, 1.0, s));
  }
  // Upper lip peak
  if (t < 0.36) {
    float s = (t - 0.33) / 0.03;
    return mix(0.16, 0.23, smoothstep(0.0, 1.0, s));
  }

  // --- PHILTRUM (below nose) ---
  // Upper lip back inward to below nose
  if (t < 0.40) {
    float s = (t - 0.36) / 0.04;
    return mix(0.23, 0.13, smoothstep(0.0, 1.0, s));
  }

  // --- NOSE ---
  // Nose shoots outward dramatically
  if (t < 0.46) {
    float s = (t - 0.40) / 0.06;
    return mix(0.13, 0.30, smoothstep(0.0, 1.0, s));
  }
  // Nose tip / bridge plateau
  if (t < 0.52) {
    float s = (t - 0.46) / 0.06;
    return mix(0.30, 0.28, smoothstep(0.0, 1.0, s));
  }
  // Nose bridge recedes sharply inward
  if (t < 0.58) {
    float s = (t - 0.52) / 0.06;
    return mix(0.28, 0.10, smoothstep(0.0, 1.0, s));
  }

  // --- EYE SOCKET ---
  // Deep eye indent (the narrowest part of the face)
  if (t < 0.64) {
    float s = (t - 0.58) / 0.06;
    return mix(0.10, 0.08, smoothstep(0.0, 1.0, s));
  }

  // --- BROW RIDGE ---
  // Brow pushes outward
  if (t < 0.70) {
    float s = (t - 0.64) / 0.06;
    return mix(0.08, 0.22, smoothstep(0.0, 1.0, s));
  }

  // --- FOREHEAD ---
  // Forehead: broad gentle curve outward
  if (t < 0.82) {
    float s = (t - 0.70) / 0.12;
    return mix(0.22, 0.30, smoothstep(0.0, 1.0, s));
  }
  // Top of forehead / crown
  if (t < 0.88) {
    float s = (t - 0.82) / 0.06;
    return mix(0.30, 0.28, smoothstep(0.0, 1.0, s));
  }

  // --- RIM (top of vase) ---
  // Rim flares outward
  if (t < 0.94) {
    float s = (t - 0.88) / 0.06;
    return mix(0.28, 0.40, smoothstep(0.0, 1.0, s));
  }
  // Rim top
  if (t < 0.98) {
    float s = (t - 0.94) / 0.04;
    return mix(0.40, 0.42, smoothstep(0.0, 1.0, s));
  }
  return 0.42;
}

void main() {
  vec2 uv = vUv - 0.5;

  // Subtle breathing animation
  float breathe = 1.0 + sin(uTime * uSpeed) * 0.012;
  uv *= breathe;

  // Mirror horizontally for symmetry
  float ax = abs(uv.x);

  // Map y from [-0.48, 0.48] to [0, 1] — use more vertical space
  float t = (uv.y + 0.48) / 0.96;

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
