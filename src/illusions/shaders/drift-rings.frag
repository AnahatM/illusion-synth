uniform float uRings;
uniform float uSegments;
uniform vec3 uColor1;
uniform vec3 uColor2;
varying vec2 vUv;

#define PI 3.14159265359
#define TAU 6.28318530718

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  float ringCount = uRings;
  float segCount = uSegments;
  float maxR = 0.48;

  // Background
  vec3 col = vec3(0.5);

  if (r < maxR) {
    float normDist = r / maxR;
    float ringWidth = 1.0 / ringCount;
    float ring = floor(normDist / ringWidth);
    float ringFract = fract(normDist / ringWidth);

    ring = min(ring, ringCount - 1.0);

    float segWidth = TAU / segCount;

    // Direction alternates per ring
    float dir = mod(ring, 2.0) < 1.0 ? 1.0 : -1.0;

    // Spiral offset: each ring shifts by 1 segment
    float spiralShift = ring * segWidth * dir;

    // Curved segment boundaries — petal/crescent shapes
    float curvature = 0.35;
    float curveOffset = sin(ringFract * PI) * curvature * segWidth;
    float a = mod(angle + spiralShift + curveOffset, TAU);

    float segAngle = a / TAU * segCount;
    float seg = floor(segAngle);

    // 4-phase asymmetric luminance cycle
    float phase = mod(seg, 4.0);

    vec3 color;
    if (phase < 1.0)      color = vec3(0.0);   // black
    else if (phase < 2.0) color = uColor2;     // dark color
    else if (phase < 3.0) color = vec3(1.0);   // white
    else                   color = uColor1;     // bright color

    // Ring separation lines
    float ringEdge = smoothstep(0.0, 0.06, ringFract) * smoothstep(1.0, 0.94, ringFract);
    color = mix(vec3(0.5), color, ringEdge);

    // Soft outer edge
    float edgeFade = smoothstep(maxR, maxR - 0.01, r);
    col = mix(col, color, edgeFade);
  }

  // Center fixation dot
  float dot = smoothstep(0.012, 0.008, r);
  col = mix(col, vec3(0.9, 0.2, 0.2), dot);

  gl_FragColor = vec4(col, 1.0);
}
