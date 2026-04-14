uniform float uTime;
uniform float uRingCount;
uniform float uDensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

// Kitaoka-style rotating snakes disc.
// Key features:
// 1. Curved segment boundaries make petal/crescent shapes within each ring
// 2. 4-color asymmetric luminance cycle (black→dark→white→bright)
// 3. Each ring is offset by 1 segment to create spiral flow
vec3 drawDisc(vec2 center, float radius, vec2 uv, float dir) {
  vec2 d = uv - center;
  float dist = length(d);

  if (dist > radius) return vec3(-1.0);

  float angle = atan(d.y, d.x);
  float normDist = dist / radius;

  float ringCount = uRingCount;
  float ringWidth = 1.0 / ringCount;
  float ring = floor(normDist / ringWidth);
  float ringFract = fract(normDist / ringWidth);

  ring = min(ring, ringCount - 1.0);

  // Segments per ring
  float segCount = floor(8.0 * uDensity);
  float segWidth = TAU / segCount;

  // Spiral offset: each ring shifts by 1 segment position.
  // This staggering across rings is what makes the luminance gradient
  // appear to flow, producing the rotation illusion.
  float spiralShift = ring * segWidth * dir;

  // Curved segment boundaries: the dividing line between segments
  // wobbles sinusoidally across the ring's radial extent.
  // This turns straight-edged wedges into petal/crescent shapes,
  // matching the Kitaoka reference.
  float curvature = 0.35; // how much the boundary curves
  float curveOffset = sin(ringFract * PI) * curvature * segWidth;
  float a = mod(angle + spiralShift + curveOffset, TAU);

  float segAngle = a / TAU * segCount;
  float seg = floor(segAngle);

  // 4-phase asymmetric luminance cycle
  float phase = mod(seg, 4.0);

  vec3 color;
  if (phase < 1.0)      color = vec3(0.0);   // black
  else if (phase < 2.0) color = uColor2;     // dark (blue)
  else if (phase < 3.0) color = vec3(1.0);   // white
  else                   color = uColor1;     // bright (yellow)

  // Ring separation line — thin gap between rings for structure
  float ringEdge = smoothstep(0.0, 0.06, ringFract) * smoothstep(1.0, 0.94, ringFract);
  color = mix(uColor3, color, ringEdge);

  // Soft disc edge
  float edgeFade = smoothstep(1.0, 0.94, normDist);
  color = mix(uColor3, color, edgeFade);

  return color;
}

void main() {
  vec2 uv = vUv;

  float cols = 5.0;
  float rows = 5.0;
  float discRadius = 0.5 / cols * 1.2;

  vec3 finalColor = uColor3;

  for (float row = -1.0; row <= rows + 1.0; row += 1.0) {
    for (float col = -1.0; col <= cols + 1.0; col += 1.0) {
      float xOff = mod(row, 2.0) * 0.5 / cols;
      vec2 center = vec2(
        (col + 0.5) / cols + xOff,
        (row + 0.5) / rows
      );

      float dir = mod(row + col, 2.0) < 1.0 ? 1.0 : -1.0;

      vec3 disc = drawDisc(center, discRadius, uv, dir);
      if (disc.r >= 0.0) {
        finalColor = disc;
      }
    }
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
