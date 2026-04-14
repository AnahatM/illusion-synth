uniform float uTime;
uniform float uRings;
uniform float uTiltDensity;
uniform float uSpeed;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  float r = length(uv);
  float a = atan(uv.y, uv.x);

  vec3 col = vec3(0.15);

  float rings = uRings;
  float cordTwist = uTiltDensity;

  // Fraser spiral: concentric rings drawn with a "twisted cord" pattern
  // The cord has alternating dark/light segments tilted relative to the ring
  // This tilt makes concentric circles appear to be a spiral

  for (float i = 1.0; i <= 20.0; i++) {
    if (i > rings) break;
    float ringR = i / (rings + 1.0) * 0.45;
    float ringW = 0.018;

    // Distance from this ring
    float dist = abs(r - ringR);

    if (dist < ringW) {
      // Position along the ring (angle)
      // Twisted cord: alternate black/white based on angle + radius offset
      // The twist comes from mixing angle with radial position
      float cordAngle = a * cordTwist + (r - ringR) / ringW * PI * 1.5;
      // Alternate direction per ring to enhance spiral appearance
      float dir = mod(i, 2.0) < 1.0 ? 1.0 : -1.0;
      cordAngle *= dir;

      float cord = step(0.0, sin(cordAngle + uTime * uSpeed * 0.3));

      // Smooth ring edge
      float edge = smoothstep(ringW, ringW * 0.5, dist);

      vec3 cordCol = mix(vec3(0.85), vec3(0.15), cord);
      col = mix(col, cordCol, edge);
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
