uniform float uRings;
uniform float uSegments;
uniform float uContrast;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  // Squash vertically to make rings into ellipses (wider than tall)
  vec2 euv = uv * vec2(1.0, 1.4);
  float r = length(euv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.0);

  // Kitaoka-style peripheral drift: concentric rings of asymmetric luminance
  // Pattern: dark → medium-dark → light → medium-light (sawtooth) creates drift
  float rings = uRings;
  float segments = uSegments;

  float ringW = 0.4 / rings;

  for (float i = 0.0; i < 20.0; i++) {
    if (i >= rings) break;
    float ringR = (i + 1.0) / (rings + 1.0) * 0.45;

    float dist = abs(r - ringR);
    if (dist < ringW * 0.5) {
      // Divide ring into segments
      float segA = a + i * PI / segments; // offset each ring
      float seg = floor(mod(segA / (2.0 * PI) * segments + segments, segments));

      // Four-phase luminance ramp: creates asymmetric profile
      // This is the key to peripheral drift
      float phase = mod(seg, 4.0);
      float lum;
      if (phase < 1.0) lum = 0.05;       // black
      else if (phase < 2.0) lum = 0.35;   // dark gray
      else if (phase < 3.0) lum = 0.95;   // white
      else lum = 0.6;                      // light gray

      // Direction alternates per ring
      float dir = mod(i, 2.0);
      if (dir > 0.5) {
        // Reverse the ramp
        if (phase < 1.0) lum = 0.95;
        else if (phase < 2.0) lum = 0.6;
        else if (phase < 3.0) lum = 0.05;
        else lum = 0.35;
      }

      float edge = smoothstep(ringW * 0.5, ringW * 0.35, dist);
      col = mix(col, vec3(lum) * uContrast, edge);
    }
  }

  // Center dot (fixation)
  float dot = smoothstep(0.012, 0.008, length(euv));
  col = mix(col, vec3(0.9, 0.2, 0.2), dot);

  gl_FragColor = vec4(col, 1.0);
}
