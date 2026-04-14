uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

// Classic Rubin's Vase face profile.
// Gentle curves — the silhouette should read as BOTH a vase and two faces.
// 12 control points: (height, halfWidth) from bottom to top.

const int N = 12;
float h[12];
float w[12];

void initProfile() {
  // Bottom base (wide foot of vase)
  h[0]  = 0.00; w[0]  = 0.35;
  // Stem narrows
  h[1]  = 0.08; w[1]  = 0.13;
  // Chin (gentle outward)
  h[2]  = 0.18; w[2]  = 0.20;
  // Mouth area (slight inward)
  h[3]  = 0.28; w[3]  = 0.15;
  // Upper lip / below nose
  h[4]  = 0.35; w[4]  = 0.13;
  // Nose (most prominent feature, but moderate)
  h[5]  = 0.44; w[5]  = 0.22;
  // Nose bridge (inward)
  h[6]  = 0.53; w[6]  = 0.14;
  // Eye / brow area (gentle indent then rise)
  h[7]  = 0.62; w[7]  = 0.16;
  // Forehead (broad, smooth)
  h[8]  = 0.74; w[8]  = 0.22;
  // Crown
  h[9]  = 0.85; w[9]  = 0.20;
  // Rim flare
  h[10] = 0.94; w[10] = 0.30;
  // Top (wide rim)
  h[11] = 1.00; w[11] = 0.35;
}

float profileCurve(float t) {
  initProfile();
  if (t <= h[0]) return w[0];
  if (t >= h[N-1]) return w[N-1];
  for (int i = 0; i < N-1; i++) {
    if (i >= 11) break;
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
