uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

// Simple face profile using key control points with smooth interpolation.
// 16 control points: (height, halfWidth) from bottom to top.
// Height 0.0 = bottom, 1.0 = top.

const int N = 16;

// Heights (bottom to top)
float h[16];
// Half-widths at each height
float w[16];

void initProfile() {
  // Bottom base flare
  h[0]  = 0.00; w[0]  = 0.42;
  h[1]  = 0.04; w[1]  = 0.38;
  // Pedestal (narrow stem)
  h[2]  = 0.10; w[2]  = 0.14;
  // Chin
  h[3]  = 0.20; w[3]  = 0.28;
  // Below lower lip
  h[4]  = 0.26; w[4]  = 0.18;
  // Lower lip
  h[5]  = 0.30; w[5]  = 0.22;
  // Between lips (mouth gap)
  h[6]  = 0.34; w[6]  = 0.14;
  // Upper lip
  h[7]  = 0.37; w[7]  = 0.20;
  // Below nose
  h[8]  = 0.41; w[8]  = 0.11;
  // Nose tip
  h[9]  = 0.48; w[9]  = 0.28;
  // Nose bridge
  h[10] = 0.55; w[10] = 0.22;
  // Eye socket (deepest indent)
  h[11] = 0.62; w[11] = 0.08;
  // Brow ridge
  h[12] = 0.68; w[12] = 0.20;
  // Forehead
  h[13] = 0.80; w[13] = 0.30;
  // Top rim start
  h[14] = 0.92; w[14] = 0.30;
  // Top rim flare
  h[15] = 1.00; w[15] = 0.42;
}

float profileCurve(float t) {
  initProfile();
  if (t <= h[0]) return w[0];
  if (t >= h[N-1]) return w[N-1];
  for (int i = 0; i < N-1; i++) {
    if (t >= h[i] && t <= h[i+1]) {
      float s = (t - h[i]) / (h[i+1] - h[i]);
      s = s * s * (3.0 - 2.0 * s); // smoothstep
      return mix(w[i], w[i+1], s);
    }
  }
  return w[N-1];
}

void main() {
  vec2 uv = vUv - 0.5;

  float ax = abs(uv.x);

  // Map y: bottom of canvas = 0, top = 1
  float t = uv.y + 0.5;

  // Outside vertical range
  if (t < 0.0 || t > 1.0) {
    gl_FragColor = vec4(uColor2, 1.0);
    return;
  }

  float profile = profileCurve(t);
  float isVase = 1.0 - smoothstep(profile - 0.004, profile + 0.004, ax);

  vec3 col = mix(uColor2, uColor1, isVase);
  gl_FragColor = vec4(col, 1.0);
}
