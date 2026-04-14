uniform float uRings;
uniform float uSegments;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.0);

  float rings = uRings;
  float segments = uSegments;
  float ringW = 0.42 / rings;

  for (float i = 0.0; i < 20.0; i++) {
    if (i >= rings) break;
    float ringR = (i + 1.0) / (rings + 1.0) * 0.45;

    float radialDist = abs(r - ringR);
    if (radialDist > ringW * 0.7) continue;

    // Offset each ring's segments for spiral flow
    float segWidth = 2.0 * PI / segments;
    float segA = a + i * segWidth * 1.0;
    float segIndex = floor(mod(segA / segWidth + segments, segments));

    // Angular position within segment for elliptical shape
    float segCenter = (segIndex + 0.5) * segWidth;
    float angOffset = mod(segA - segCenter + PI, 2.0 * PI) - PI;
    float angNorm = angOffset / (segWidth * 0.5);

    // Elliptical blob (wider angularly, narrower radially)
    float radNorm = radialDist / (ringW * 0.45);
    float ellipseDist = sqrt(radNorm * radNorm * 1.5 + angNorm * angNorm);

    float blob = smoothstep(1.0, 0.6, ellipseDist);
    if (blob < 0.01) continue;

    // 4-phase color cycle: black → color2 → white → color1
    // This asymmetric sequence is key to the Kitaoka peripheral drift effect
    float phase = mod(segIndex, 4.0);

    // Direction alternates per ring
    float dir = mod(i, 2.0);
    if (dir > 0.5) {
      phase = mod(3.0 - phase, 4.0);
    }

    vec3 segCol;
    if (phase < 1.0)      segCol = vec3(0.0);     // black
    else if (phase < 2.0) segCol = uColor2;        // dark color (blue)
    else if (phase < 3.0) segCol = vec3(1.0);      // white
    else                   segCol = uColor1;        // bright color (yellow)

    col = mix(col, segCol, blob);
  }

  // Center dot (fixation)
  float dot = smoothstep(0.012, 0.008, r);
  col = mix(col, vec3(0.9, 0.2, 0.2), dot);

  gl_FragColor = vec4(col, 1.0);
}
