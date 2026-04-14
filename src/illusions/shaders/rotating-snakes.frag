uniform float uTime;
uniform float uRingCount;
uniform float uDensity;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

// Kitaoka-style rotating snakes disc with elliptical segments.
// The 4-color asymmetric luminance cycle (black→dark→white→bright)
// with spiral ring offsets creates illusory peripheral motion.
vec3 drawDisc(vec2 center, float radius, vec2 uv, float dir) {
  vec2 d = uv - center;
  float dist = length(d);

  if (dist > radius) return vec3(-1.0);

  float angle = atan(d.y, d.x);
  float normDist = dist / radius;

  // Rings fill from edge all the way to center — no gap
  float ringCount = uRingCount;
  float ringWidth = 1.0 / ringCount;
  float ring = floor(normDist / ringWidth);
  float ringFract = fract(normDist / ringWidth);

  // Clamp ring to valid count (center pixel)
  ring = min(ring, ringCount - 1.0);

  // Number of segments around each ring
  float segCount = floor(8.0 * uDensity);

  // Spiral offset: each ring shifts by a quarter segment in the spiral direction.
  // This is the critical asymmetry that makes adjacent rings' luminance gradients
  // appear to flow, creating the rotation illusion.
  float spiralShift = ring * (TAU / segCount) * 0.25 * dir;
  float a = mod(angle + spiralShift, TAU);

  // Segment index and position within segment
  float segAngle = a / TAU * segCount;
  float seg = floor(segAngle);
  float segFract = fract(segAngle);

  // 4-phase asymmetric luminance cycle
  float phase = mod(seg, 4.0);

  // Base color for each phase
  vec3 colBlack = vec3(0.0);
  vec3 colDark  = uColor2;
  vec3 colWhite = vec3(1.0);
  vec3 colBright = uColor1;

  // Elliptical blob shape: bright and dark colors are rendered as
  // rounded ellipses centered in their segment, while black and white
  // fill the remaining space. This matches Kitaoka's characteristic look.
  //
  // segFract: 0..1 across the segment angularly
  // ringFract: 0..1 across the ring radially
  // We compute an elliptical falloff for the colored phases.

  // Ellipse: centered at (0.5, 0.5) in (segFract, ringFract) space
  float ex = (segFract - 0.5) * 2.0; // -1..1
  float ey = (ringFract - 0.5) * 2.0; // -1..1
  // Wider than tall ellipse
  float ellipse = ex * ex * 1.0 + ey * ey * 2.5;
  float blob = 1.0 - smoothstep(0.3, 1.0, ellipse);

  vec3 color;
  if (phase < 1.0) {
    // Black phase — fill
    color = colBlack;
  } else if (phase < 2.0) {
    // Dark color as elliptical blob on black
    color = mix(colBlack, colDark, blob);
  } else if (phase < 3.0) {
    // White phase — fill
    color = colWhite;
  } else {
    // Bright color as elliptical blob on white
    color = mix(colWhite, colBright, blob);
  }

  // Soft disc edge only
  float edgeFade = smoothstep(1.0, 0.94, normDist);
  color *= edgeFade;

  return color;
}

void main() {
  vec2 uv = vUv;

  // Dense 5x5 hex-packed grid for maximum peripheral coverage
  float cols = 5.0;
  float rows = 5.0;
  float discRadius = 0.5 / cols * 1.2;

  // Light background — critical for contrast
  vec3 finalColor = uColor3;

  for (float row = -1.0; row <= rows + 1.0; row += 1.0) {
    for (float col = -1.0; col <= cols + 1.0; col += 1.0) {
      float xOff = mod(row, 2.0) * 0.5 / cols;
      vec2 center = vec2(
        (col + 0.5) / cols + xOff,
        (row + 0.5) / rows
      );

      // Alternate spiral direction — adjacent discs spin "opposite"
      float dir = mod(row + col, 2.0) < 1.0 ? 1.0 : -1.0;

      vec3 disc = drawDisc(center, discRadius, uv, dir);
      if (disc.r >= 0.0) {
        finalColor = disc;
      }
    }
  }

  gl_FragColor = vec4(finalColor, 1.0);
}
