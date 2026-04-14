uniform float uRings;
uniform float uSegments;
uniform float uContrast;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.0);

  // Kitaoka-style peripheral drift: concentric rings of asymmetric luminance
  // Segments are elliptical blobs (rounded) instead of hard angular wedges
  float rings = uRings;
  float segments = uSegments;

  float ringW = 0.4 / rings;

  for (float i = 0.0; i < 20.0; i++) {
    if (i >= rings) break;
    float ringR = (i + 1.0) / (rings + 1.0) * 0.45;

    float radialDist = abs(r - ringR);
    if (radialDist > ringW * 0.6) continue;

    // Offset each ring's segments
    float segA = a + i * PI / segments;
    float segIndex = floor(mod(segA / (2.0 * PI) * segments + segments, segments));

    // Angular position within segment (0 to 1, centered at 0.5)
    float segWidth = 2.0 * PI / segments;
    float segCenter = (segIndex + 0.5) * segWidth;
    float angOffset = segA - segCenter;
    // Wrap to [-pi, pi]
    angOffset = mod(angOffset + PI, 2.0 * PI) - PI;
    float angNorm = angOffset / (segWidth * 0.5); // -1 to 1 within segment

    // Elliptical distance: radial vs angular axes
    float radNorm = radialDist / (ringW * 0.5);
    float ellipseDist = sqrt(radNorm * radNorm + angNorm * angNorm);

    float blob = smoothstep(1.0, 0.75, ellipseDist);
    if (blob < 0.01) continue;

    // Four-phase luminance ramp: creates asymmetric profile
    float phase = mod(segIndex, 4.0);
    float lum;
    if (phase < 1.0) lum = 0.05;       // black
    else if (phase < 2.0) lum = 0.35;   // dark gray
    else if (phase < 3.0) lum = 0.95;   // white
    else lum = 0.6;                      // light gray

    // Direction alternates per ring
    float dir = mod(i, 2.0);
    if (dir > 0.5) {
      if (phase < 1.0) lum = 0.95;
      else if (phase < 2.0) lum = 0.6;
      else if (phase < 3.0) lum = 0.05;
      else lum = 0.35;
    }

    col = mix(col, vec3(lum) * uContrast, blob);
  }

  // Center dot (fixation)
  float dot = smoothstep(0.012, 0.008, r);
  col = mix(col, vec3(0.9, 0.2, 0.2), dot);

  gl_FragColor = vec4(col, 1.0);
}
