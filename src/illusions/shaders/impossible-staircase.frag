uniform float uTime;
uniform float uSpeed;
uniform vec3 uColor;
uniform float uStepCount;
varying vec2 vUv;

#define PI 3.14159265359

// SDF for an axis-aligned box
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = (vUv - 0.5) * 2.2;

  // Gentle oscillation
  float osc = sin(uTime * uSpeed * 0.5) * 0.02;

  int steps = int(uStepCount);
  float totalH = 0.8;
  float totalW = 0.8;

  // Draw a Penrose staircase as a 2D isometric view
  // Four walls of steps arranged in a square, each side ascending
  // but the total height loops impossibly

  vec3 col = vec3(0.0);
  float alpha = 0.0;

  float stepH = totalH / float(steps);
  float stepW = totalW / float(steps);
  float depth = 0.06;

  // Animate: cycle which step is highlighted
  float highlight = mod(uTime * uSpeed * 2.0, float(steps) * 4.0);

  // Side 0: bottom, going right and up
  for (int i = 0; i < 20; i++) {
    if (i >= steps) break;
    float fi = float(i);
    float x = -0.4 + fi * stepW;
    float y = -0.4 + fi * stepH + osc;

    // Step top surface (lighter)
    vec2 topCenter = vec2(x + stepW * 0.5, y + stepH);
    float dTop = sdBox(uv - topCenter, vec2(stepW * 0.52, depth * 0.5));
    float mTop = 1.0 - smoothstep(0.0, 0.003, dTop);

    // Step front surface (darker)
    vec2 frontCenter = vec2(x + stepW * 0.5, y + stepH * 0.5);
    float dFront = sdBox(uv - frontCenter, vec2(stepW * 0.52, stepH * 0.5));
    float mFront = 1.0 - smoothstep(0.0, 0.003, dFront);

    float isHighlighted = smoothstep(0.5, 0.0, abs(fi - highlight));
    vec3 topCol = uColor * (0.8 + isHighlighted * 0.3);
    vec3 frontCol = uColor * (0.4 + isHighlighted * 0.2);

    if (mFront > 0.01) { col = mix(col, frontCol, mFront); alpha = max(alpha, mFront); }
    if (mTop > 0.01) { col = mix(col, topCol, mTop); alpha = max(alpha, mTop); }
  }

  // Side 1: right, going up and left
  for (int i = 0; i < 20; i++) {
    if (i >= steps) break;
    float fi = float(i);
    float x = 0.4 - fi * stepW;
    float y = -0.4 + totalH + fi * stepH + osc;

    vec2 topCenter = vec2(x - stepW * 0.5, y + stepH);
    float dTop = sdBox(uv - topCenter, vec2(stepW * 0.52, depth * 0.5));
    float mTop = 1.0 - smoothstep(0.0, 0.003, dTop);

    vec2 frontCenter = vec2(x - stepW * 0.5, y + stepH * 0.5);
    float dFront = sdBox(uv - frontCenter, vec2(stepW * 0.52, stepH * 0.5));
    float mFront = 1.0 - smoothstep(0.0, 0.003, dFront);

    float isHighlighted = smoothstep(0.5, 0.0, abs(fi - (highlight - float(steps))));
    vec3 topCol = uColor * (0.9 + isHighlighted * 0.3);
    vec3 frontCol = uColor * (0.5 + isHighlighted * 0.2);

    if (mFront > 0.01) { col = mix(col, frontCol, mFront); alpha = max(alpha, mFront); }
    if (mTop > 0.01) { col = mix(col, topCol, mTop); alpha = max(alpha, mTop); }
  }

  // Side 2: top, going left and down (back to start height — impossible!)
  for (int i = 0; i < 20; i++) {
    if (i >= steps) break;
    float fi = float(i);
    float x = -0.4 + (float(steps) - 1.0 - fi) * stepW;
    float y = -0.4 + totalH * 2.0 - fi * stepH + osc;

    vec2 topCenter = vec2(x + stepW * 0.5, y + stepH);
    float dTop = sdBox(uv - topCenter, vec2(stepW * 0.52, depth * 0.5));
    float mTop = 1.0 - smoothstep(0.0, 0.003, dTop);

    vec2 frontCenter = vec2(x + stepW * 0.5, y + stepH * 0.5);
    float dFront = sdBox(uv - frontCenter, vec2(stepW * 0.52, stepH * 0.5));
    float mFront = 1.0 - smoothstep(0.0, 0.003, dFront);

    float isHighlighted = smoothstep(0.5, 0.0, abs(fi - (highlight - float(steps) * 2.0)));
    vec3 topCol = uColor * (0.7 + isHighlighted * 0.3);
    vec3 frontCol = uColor * (0.3 + isHighlighted * 0.2);

    if (mFront > 0.01) { col = mix(col, frontCol, mFront); alpha = max(alpha, mFront); }
    if (mTop > 0.01) { col = mix(col, topCol, mTop); alpha = max(alpha, mTop); }
  }

  // Side 3: left, going down — connects back to bottom impossibly
  for (int i = 0; i < 20; i++) {
    if (i >= steps) break;
    float fi = float(i);
    float x = -0.4 + fi * stepW;
    float y = -0.4 + totalH - fi * stepH + osc;

    vec2 topCenter = vec2(x + stepW * 0.5, y + stepH);
    float dTop = sdBox(uv - topCenter, vec2(stepW * 0.52, depth * 0.5));
    float mTop = 1.0 - smoothstep(0.0, 0.003, dTop);

    vec2 frontCenter = vec2(x + stepW * 0.5, y + stepH * 0.5);
    float dFront = sdBox(uv - frontCenter, vec2(stepW * 0.52, stepH * 0.5));
    float mFront = 1.0 - smoothstep(0.0, 0.003, dFront);

    float isHighlighted = smoothstep(0.5, 0.0, abs(fi - (highlight - float(steps) * 3.0)));
    vec3 topCol = uColor * (0.6 + isHighlighted * 0.3);
    vec3 frontCol = uColor * (0.25 + isHighlighted * 0.2);

    if (mFront > 0.01) { col = mix(col, frontCol, mFront); alpha = max(alpha, mFront); }
    if (mTop > 0.01) { col = mix(col, topCol, mTop); alpha = max(alpha, mTop); }
  }

  gl_FragColor = vec4(col, alpha);
}
