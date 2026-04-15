uniform float uLineCount;
uniform float uGapSize;
uniform float uLineWidth;
uniform float uGridSize;
uniform vec3 uLineColor;
uniform vec3 uBgColor;
varying vec2 vUv;

#define PI 3.14159265359

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

void main() {
  vec2 uv = vUv;
  vec3 bg = uBgColor;
  vec3 lineCol = uLineColor;
  vec3 col = bg;

  float grid = floor(uGridSize);
  float cellSize = 1.0 / grid;
  float lineCount = floor(uLineCount);
  float gap = uGapSize * cellSize * 0.28;
  float w = uLineWidth * 0.0025;
  float armLen = cellSize * 0.48;

  // For each grid cell, draw a radial star with central gap
  for (int gx = 0; gx < 8; gx++) {
    if (float(gx) >= grid) break;
    for (int gy = 0; gy < 8; gy++) {
      if (float(gy) >= grid) break;
      vec2 center = vec2((float(gx) + 0.5) * cellSize, (float(gy) + 0.5) * cellSize);
      vec2 local = uv - center;

      // Skip if too far from this cell
      if (abs(local.x) > cellSize * 0.6 || abs(local.y) > cellSize * 0.6) continue;

      for (int i = 0; i < 12; i++) {
        if (float(i) >= lineCount) break;
        float a = float(i) * PI / lineCount;
        vec2 dir = vec2(cos(a), sin(a));

        // Two arms radiating from gap to edge
        float d1 = sdSegment(local, dir * gap, dir * armLen);
        float d2 = sdSegment(local, -dir * gap, -dir * armLen);

        float line = 1.0 - smoothstep(w - 0.001, w + 0.001, min(d1, d2));
        col = mix(col, lineCol, line);
      }
    }
  }

  gl_FragColor = vec4(col, 1.0);
}
