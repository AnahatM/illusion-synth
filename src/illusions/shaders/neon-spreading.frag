uniform float uGridSize;
uniform float uLineWidth;
uniform float uArcRadius;
uniform vec3 uLineColor;
uniform vec3 uNeonColor;
varying vec2 vUv;

void main() {
  vec2 uv = vUv - 0.5;

  float lineW = uLineWidth * 0.003;
  float ringCount = uGridSize;
  float maxR = 0.16;
  float spacing = maxR / ringCount;

  // Imaginary center circle radius
  float centerR = uArcRadius * 0.06;
  float centerD = length(uv);

  // 4 non-overlapping circle sets at cardinal positions
  float spread = 0.22;
  vec2 positions[4];
  positions[0] = vec2(0.0, spread);
  positions[1] = vec2(0.0, -spread);
  positions[2] = vec2(-spread, 0.0);
  positions[3] = vec2(spread, 0.0);

  vec3 bg = vec3(1.0);
  vec3 color = bg;

  float blackRing = 0.0;
  float colorRing = 0.0;

  for (int p = 0; p < 4; p++) {
    float d = length(uv - positions[p]);

    for (float i = 1.0; i <= 8.0; i += 1.0) {
      if (i > ringCount) break;
      float r = i * spacing;
      float ring = smoothstep(lineW, 0.0, abs(d - r));

      if (ring > 0.01) {
        // Check if this point on the ring is inside the imaginary center circle
        if (centerD < centerR) {
          colorRing = max(colorRing, ring);
        } else {
          blackRing = max(blackRing, ring);
        }
      }
    }
  }

  // Draw black rings first
  color = mix(color, uLineColor, blackRing);
  // Draw colored arcs (where rings intersect imaginary center circle) on top
  color = mix(color, uNeonColor, colorRing);

  gl_FragColor = vec4(color, 1.0);
}
