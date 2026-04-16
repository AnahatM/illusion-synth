uniform float uTime;
uniform float uSpeed;
uniform float uDotSize;
uniform float uDotCount;
uniform float uGridMode;  // 0 = lines, 1 = crosses
uniform float uDotMode;   // 0 = triangle, 1 = ring, 2 = array
uniform float uCrossSize;
uniform float uLineWidth;
uniform vec3 uGridColor;
uniform vec3 uDotColor;
uniform vec3 uBgColor;
uniform float uAlternatingFixation;
varying vec2 vUv;

#define PI 3.14159265359

void main() {
  vec2 uv = vUv - 0.5;
  vec3 bg = uBgColor;
  vec3 col = bg;

  // Rotating pattern
  float angle = uTime * uSpeed * 0.5;
  float ca = cos(angle), sa = sin(angle);
  vec2 ruv = vec2(ca * uv.x - sa * uv.y, sa * uv.x + ca * uv.y);

  float gridScale = 14.0;
  vec2 g = ruv * gridScale;

  if (uGridMode < 0.5) {
    // Mode 0: diagonal grid lines
    float lw = uLineWidth * 0.05;
    float d1 = abs(fract(g.x + g.y) - 0.5);
    float d2 = abs(fract(g.x - g.y) - 0.5);
    float pattern = smoothstep(lw, 0.0, min(d1, d2));
    col = mix(col, uGridColor, pattern * 0.8);
  } else {
    // Mode 1: + crosses at grid intersections (no diagonals)
    vec2 f = fract(g) - 0.5;
    float cSize = uCrossSize * 0.35;
    float cw = uLineWidth * 0.06;
    float crossH = step(abs(f.y), cw) * step(abs(f.x), cSize);
    float crossV = step(abs(f.x), cw) * step(abs(f.y), cSize);
    float cross = max(crossH, crossV);
    col = mix(col, uGridColor, cross * 0.85);
  }

  // Yellow dots
  float dotR = uDotSize * 0.008;
  float dotCount = floor(uDotCount);

  if (uDotMode < 0.5) {
    // Triangle arrangement (3 dots)
    float triR = 0.12;
    for (int i = 0; i < 3; i++) {
      float a = float(i) * 2.0 * PI / 3.0 - PI / 2.0;
      vec2 dpos = triR * vec2(cos(a), sin(a));
      float d = length(uv - dpos);
      float dot = 1.0 - smoothstep(dotR - 0.002, dotR, d);
      col = mix(col, uDotColor, dot);
    }
  } else if (uDotMode < 1.5) {
    // Ring arrangement
    float ringR = 0.15;
    for (int i = 0; i < 16; i++) {
      if (float(i) >= dotCount) break;
      float a = float(i) * 2.0 * PI / dotCount - PI / 2.0;
      vec2 dpos = ringR * vec2(cos(a), sin(a));
      float d = length(uv - dpos);
      float dot = 1.0 - smoothstep(dotR - 0.002, dotR, d);
      col = mix(col, uDotColor, dot);
    }
  } else {
    // Array: static dots on a fixed grid
    float invScale = 1.0 / gridScale;
    for (int ix = -7; ix <= 7; ix++) {
      for (int iy = -7; iy <= 7; iy++) {
        vec2 cellCenter = (vec2(float(ix), float(iy)) + 0.5) * invScale;
        if (abs(cellCenter.x) > 0.42 || abs(cellCenter.y) > 0.42) continue;
        float d = length(uv - cellCenter);
        float dot = 1.0 - smoothstep(dotR - 0.002, dotR, d);
        col = mix(col, uDotColor, dot);
      }
    }
  }

  // Central fixation point
  vec3 fixCol;
  if (uAlternatingFixation > 0.5) {
    float flash = step(0.0, sin(uTime * 3.0));
    fixCol = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), flash);
  } else {
    fixCol = vec3(1.0);
  }
  float fix = 1.0 - smoothstep(0.003, 0.006, length(uv));
  col = mix(col, fixCol, fix);

  gl_FragColor = vec4(col, 1.0);
}
