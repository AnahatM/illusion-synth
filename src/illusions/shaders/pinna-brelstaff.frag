uniform float uTime;
uniform float uSpeed;
uniform float uRingCount;
uniform float uTilt;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float r = length(uv);
  float angle = atan(uv.y, uv.x);

  vec3 color = uBgColor;

  // Create concentric rings of tilted microelements
  for (float ring = 1.0; ring <= 8.0; ring++) {
    if (ring > uRingCount) break;
    float ringR = ring * 0.1;
    float ringW = 0.035;
    float inRing = smoothstep(ringR - ringW, ringR - ringW + 0.005, r) *
                   smoothstep(ringR + ringW, ringR + ringW - 0.005, r);

    if (inRing < 0.01) continue;

    // Microelements: small rectangles tilted alternately
    float nElements = ring * 12.0;
    float elemAngle = mod(angle + uTime * uSpeed * 0.3, 2.0 * PI);
    float elemIdx = floor(elemAngle * nElements / (2.0 * PI));
    float elemPhase = fract(elemAngle * nElements / (2.0 * PI));

    // Alternating tilt direction
    float tiltDir = mod(elemIdx, 2.0) * 2.0 - 1.0;
    float tiltAmount = uTilt * 0.3;

    // Color based on tilt direction
    float localAngle = (elemPhase - 0.5) * 2.0;
    float tiltedCoord = localAngle + tiltDir * tiltAmount * (r - ringR) / ringW;
    float stripe = step(0.0, sin(tiltedCoord * PI * 3.0));

    vec3 elemColor = mix(uColor1, uColor2, stripe);
    color = mix(color, elemColor, inRing);
  }

  // Fixation dot
  float fix = 1.0 - smoothstep(0.008, 0.014, r);
  color = mix(color, vec3(1.0, 0.0, 0.0), fix);

  gl_FragColor = vec4(color, 1.0);
}
